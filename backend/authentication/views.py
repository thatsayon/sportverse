from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

from django.db import transaction
from django.contrib.auth import authenticate, get_user_model
from django.template.loader import render_to_string
from django.utils.timezone import now
from django.core.mail import EmailMultiAlternatives
from django.shortcuts import redirect, get_object_or_404

from urllib.parse import urlencode
from .models import (
    OTP
)
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
)
from .tasks import (
    send_confirmation_email_task,
    send_password_reset_email_task,
)
from .utils import (
    generate_otp, 
    create_otp_token,
    decode_otp_token
)

import os 

User = get_user_model()

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"success": False, "error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                user = serializer.save()
                otp = generate_otp()

                OTP.objects.create(
                    user=user,
                    otp=otp,
                    created_at=now()
                )
                
                send_confirmation_email_task.delay(
                    user.email,
                    user.full_name,
                    otp
                )
                
                verificationToken = create_otp_token(user.id)

                response = Response(
                    {
                        "success": True,
                        "message": "User registration successful. OTP will be sent to email.",
                        "user": {
                            "id": str(user.id), 
                            "email": user.email
                        },
                        "verificationToken": verificationToken,
                    },
                    status=status.HTTP_201_CREATED
                )

                response.set_cookie(
                    key="verificationToken",
                    value=verificationToken,
                    httponly=False,
                    secure=False,
                    samesite="None",
                    max_age=60*5
                )
                return response
        except Exception as e:
            return Response(
                {"success": False, "message": "Registration failed. Please try again later."},
                status=status.HTTP_400_BAD_REQUEST
            )


class UserLoginView(APIView):
    permission_classes = [AllowAny]


    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(
            username=serializer.validated_data.get("email"),
            password=serializer.validated_data.get("password")
        )

        if not user:
            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED
            ) 

        refresh = CustomTokenObtainPairSerializer.get_token(user) 
        access = refresh.access_token

        response = Response(
            {"access_token": str(access)},
            status=status.HTTP_200_OK,
        )

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=True,       # Set to True in production
            samesite="None",   # Adjust based on your requirements
            max_age=60*60*24,
        )

        return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if not refresh_token:
                pass
        except TokenError:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class VerifyToken(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        otp_token = request.data.get('verificationToken')
        if not otp_token:
            return Response({"error": "No token found"})
        
        decode = decode_otp_token(otp_token)
        if not decode:
            return Response(
                {"error": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {"message": "Valid token"},
            status=status.HTTP_200_OK
        )

class VerifyOTP(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        otp = request.data.get('otp')

        # Retrieve the OTP token from cookies
        otp_token = request.data.get('verificationToken')
        if not otp_token or not otp:
            return Response({"error": "OTP token and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Decode the token
        decoded = decode_otp_token(otp_token)
        if not decoded:
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        # Get the user ID from the token
        user_id = decoded.get("user_id")
        try:
            user = User._default_manager.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        otp_instance = user.otps.filter(otp=otp).first()
        if not otp_instance or not otp_instance.is_valid():
            return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

        # Activate the user and clear OTPs
        user.is_active = True
        user.otps.all().delete()
        user.save()

        # Generate tokens
        refresh = CustomTokenObtainPairSerializer.get_token(user)
        access_token = str(refresh.access_token)

        # Set refresh token as an HttpOnly cookie
        response = Response({"access_token": access_token}, status=status.HTTP_200_OK)
        response.delete_cookie(
            key='verificationToken',
            path='/',  # Match the original path
            domain=None,  # Match the original domain, if any
            samesite='None'  # Match the original SameSite policy
        )
        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=True,  # Use Secure flag if using HTTPS
            samesite='None',
            max_age=60*60*24,
        )

        return response 
        
class ForgetPassView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response(
                {"message": "email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = get_object_or_404(User, email=email)

        otp = generate_otp()

        OTP.objects.create(
            user=user,
            otp=otp,
            created_at=now()
        )

        send_password_reset_email_task.delay(
            user.email,
            user.full_name,
            otp
        )

        passResetToken = create_otp_token(user.id)

        response = Response(
            {
                "success": True,
                "message": "OTP send successfully",
                "user": {
                    "id": str(user.id),
                    "email": user.email
                },
                "passResetToken": passResetToken
            }
        )
        
        response.set_cookie(
            key="passResetToken",
            value=passResetToken,
            httponly=True,
            secure=True,
            samesite="Strict",
            max_age=60*5,
            path='/',
        )

        return response

class ForgetPassOTPVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request): 
        otp = request.data.get("otp")
        reset_token = request.data.get("passResetToken")
        
        if not otp or not reset_token:
            return Response({"error": "OTP and reset token are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        decoded = decode_otp_token(reset_token)
        if not decoded:
            return Response({"error": "Invalid or expired reset token."}, status=status.HTTP_400_BAD_REQUEST)
        
        user_id = decoded.get("user_id")

        user = get_object_or_404(User, id=user_id)

        otp_instance = user.otps.filter(otp=otp).first()
        if not otp_instance or not otp_instance.is_valid():
            return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
        
        # If OTP is valid, generate a verified token indicating that the OTP step is complete.
        verified_payload = {"user_id": str(user.id), "verified": True}
        verified_token = create_otp_token(verified_payload)
        
        # Optionally, delete the used OTP instance to prevent reuse.
        otp_instance.delete()
        
        response = Response(
            {
                "message": "OTP verified. You can now reset your password.",
                "passwordResetVerified": verified_token
            }, 
            status=status.HTTP_200_OK
        )
        response.set_cookie(
            key="passwordResetVerified",
            value=verified_token,
            httponly=True,
            secure=True,
            samesite="None",
            max_age=60*5  # verified token valid for 5 minutes
        )
        return response
        return Response({"msg": "working"})

class ForgettedPasswordSetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        new_password = request.data.get("new_password")
        verified_token = request.data.get("passwordResetVerified")
        
        if not new_password or not verified_token:
            return Response({"error": "New password and verified token are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        decoded = decode_otp_token(verified_token)
        if not decoded or not decoded.get("verified"):
            return Response({"error": "Invalid or expired verified token."}, status=status.HTTP_400_BAD_REQUEST)
        
        user_id = decoded.get("user_id")
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Set the new password
        user.set_password(new_password)
        user.save()
        
        response = Response({"message": "Password reset successfully."}, status=status.HTTP_200_OK)
        # Remove the verified token (and optionally the original reset token)
        response.delete_cookie("passResetToken", path='/', samesite="None")
        response.delete_cookie("passwordResetToken", path='/', samesite="None")
        return response

class ResendRegistrationOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        verification_token = request.data.get("verificationToken")
        if not verification_token:
            return Response({"error": "No verification token found."}, status=status.HTTP_400_BAD_REQUEST)

        decoded = decode_otp_token(verification_token)
        if not decoded:
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        user_id = decoded.get("user_id")
        user = get_object_or_404(User, id=user_id)

        if user.is_active:
            return Response({"message": "User already verified."}, status=status.HTTP_400_BAD_REQUEST)

        otp = generate_otp()
        OTP.objects.create(user=user, otp=otp, created_at=now())

        send_confirmation_email_task.delay(user.email, user.full_name, otp)

        return Response(
            {"message": "OTP resent successfully to your email."},
            status=status.HTTP_200_OK
        )

class ResendForgetPassOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        reset_token = request.data.get("passResetToken")
        if not reset_token:
            return Response({"error": "No reset token found."}, status=status.HTTP_400_BAD_REQUEST)

        decoded = decode_otp_token(reset_token)
        if not decoded:
            return Response({"error": "Invalid or expired reset token."}, status=status.HTTP_400_BAD_REQUEST)

        user_id = decoded.get("user_id")
        user = get_object_or_404(User, id=user_id)

        otp = generate_otp()
        OTP.objects.create(user=user, otp=otp, created_at=now())

        send_password_reset_email_task.delay(user.email, user.full_name, otp)

        return Response(
            {"message": "Password reset OTP resent successfully to your email."},
            status=status.HTTP_200_OK
        )

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
    REDIRECT_URI = 'https://v1.mindcryptic.com'

    def get(self, request):
        code = request.GET.get('code')
        if not code:
            # No code provided, so build the authorization URL and redirect to Google.
            params = {
                'client_id': self.GOOGLE_CLIENT_ID,
                'redirect_uri': self.REDIRECT_URI,
                'response_type': 'code',
                'scope': 'openid email profile',
                'access_type': 'offline',
                'prompt': 'consent',  # Forces account selection and consent screen.
            }
            auth_url = "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)
            return redirect(auth_url)

        # Exchange code for tokens
        token_data = {
            'code': code,
            'client_id': self.GOOGLE_CLIENT_ID,
            'client_secret': self.GOOGLE_CLIENT_SECRET,
            'redirect_uri': self.REDIRECT_URI,
            'grant_type': 'authorization_code'
        }

        token_response = req.post('https://oauth2.googleapis.com/token', data=token_data)
        token_json = token_response.json()

        if 'error' in token_json:
            return Response({"error": token_json['error']}, status=status.HTTP_400_BAD_REQUEST)

        id_token_jwt = token_json.get('id_token')

        try:
            # Verify the ID token
            # idinfo = id_token.verify_oauth2_token(id_token_jwt, requests.Request(), self.GOOGLE_CLIENT_ID)
            idinfo = id_token.verify_oauth2_token(
                id_token_jwt,
                google_requests.Request(),  # Use Google's Request class
                self.GOOGLE_CLIENT_ID
            )
            email = idinfo.get('email')
            name = idinfo.get('name')

            # Get or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={"username": generate_username(name), "is_active": True}
            )

            if created:
                user.is_google_auth = True
                user.did_google_auth = True
                user.save()

            if not user.is_active:
                if user.deletion_scheduled_at and user.deletion_scheduled_at > timezone.now():
                    user.deletion_scheduled_at = None
                    user.is_active = True
                    user.save()

            refresh = CustomTokenObtainPairSerializer.get_token(user)

            response = HttpResponse(status=302)  # 302 means temporary redirect
            response["Location"] = "https://mindcryptic.com/challenge-hub"

            # Set the cookie before redirecting
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=True,
                samesite="None",
                max_age=60 * 60 * 24
            )
            
            return response
        except ValueError as e:
            return Response({"error": f"Invalid token: {e}"}, status=status.HTTP_400_BAD_REQUEST)


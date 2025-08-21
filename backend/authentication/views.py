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

from .models import (
    OTP
)
from .serializers import (
    UserRegistrationSerializer,
)
from .tasks import (
    send_confirmation_email_task
)
from .utils import (
    generate_otp, 
    create_otp_token
)

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
                        "user": {"id": str(user.id), "email": user.email},
                    },
                    status=status.HTTP_201_CREATED
                )

                response.set_cookie(
                    key="verificationToken",
                    value=verificationToken,
                    httponly=True,
                    secure=True,
                    samesite="Strict",
                    max_age=60*5,
                    path='/',
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
        pass


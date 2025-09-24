from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework import status, generics

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import check_password
from django.utils.timezone import now
from django.db.models import Sum
from django.utils import timezone
from django.conf import settings

from agora_token_builder import RtcTokenBuilder
from datetime import timedelta, date

from core.permissions import IsTeacher
from controlpanel.models import Withdraw

from account.models import Document

from teacher.session.models import (
    BookedSession
)
from controlpanel.models import Sport
from authentication.models import UserAccount
from .models import (
    Dashboard,
    IncomeHistory,
    Bank,
    PayPal,
    AccountVideo
)
from .serializers import (
    DashboardSerializer,
    BankSerializer,
    PayPalSerializer,
    WithdrawSerializer,
    BookedSessionSerializer,
    UpdatePasswordSerializer,
    DocumentSerializer,
    AccountDetailSerializer
)

import cloudinary.uploader
import cloudinary
import calendar
import os 
import uuid
import time

APP_ID = os.getenv("AGORA_APP_ID")
APP_CERTIFICATE = os.getenv("AGORA_APP_CERTIFICATE")

def get_last_7_days_visits(dashboard):
    today = now().date()
    start_date = today - timedelta(days=6)

    visits = (
        dashboard.visit_counts.filter(date__range=[start_date, today])
        .values("date")
        .annotate(total=Sum("visit_count"))
        .order_by("date")
    )

    # Ensure missing days are filled with 0
    results = {str(v["date"]): v["total"] for v in visits}
    return {str(start_date + timedelta(days=i)): results.get(str(start_date + timedelta(days=i)), 0) for i in range(7)}


def get_last_30_days_visits(dashboard):
    today = now().date()
    start_date = today - timedelta(days=29)

    visits = (
        dashboard.visit_counts.filter(date__range=[start_date, today])
        .values("date")
        .annotate(total=Sum("visit_count"))
        .order_by("date")
    )

    results = {str(v["date"]): v["total"] for v in visits}
    return {str(start_date + timedelta(days=i)): results.get(str(start_date + timedelta(days=i)), 0) for i in range(30)}


def get_last_7_days_income(teacher):
    today = now().date()
    start_date = today - timedelta(days=6)

    incomes = (
        IncomeHistory.objects.filter(teacher=teacher, date__range=[start_date, today])
        .values("date")
        .annotate(total=Sum("after_deduction"))
        .order_by("date")
    )

    results = {str(v["date"]): float(v["total"]) for v in incomes}
    return {
        str(start_date + timedelta(days=i)): results.get(str(start_date + timedelta(days=i)), 0.0)
        for i in range(7)
    }


def get_last_30_days_income(teacher):
    today = now().date()
    start_date = today - timedelta(days=29)

    incomes = (
        IncomeHistory.objects.filter(teacher=teacher, date__range=[start_date, today])
        .values("date")
        .annotate(total=Sum("after_deduction"))
        .order_by("date")
    )

    results = {str(v["date"]): float(v["total"]) for v in incomes}
    return {
        str(start_date + timedelta(days=i)): results.get(str(start_date + timedelta(days=i)), 0.0)
        for i in range(30)
    }


class TeacherDashboard(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request):
        try:
            dashboard = request.user.teacher.dashboard
        except Dashboard.DoesNotExist:
            return Response(
                {"error": "Dashboard not found for this teacher."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = DashboardSerializer(dashboard)

        sessions = BookedSession.objects.filter(
            teacher=request.user.teacher
        ).select_related("student", "session")


        now = timezone.now()

        ongoing = []
        upcoming = []
        completed = []

        for s in sessions:
            start = s.session_time
            end = start + timedelta(hours=1)

            if start - timedelta(seconds=15) <= now <= end:
                ongoing.append(s)
            elif now < start - timedelta(seconds=15):
                upcoming.append(s)
            else:
                completed.append(s)

        prioritized_sessions = ongoing + upcoming + completed

        prioritized_sessions = prioritized_sessions[:5]

        booked_sessions_data = BookedSessionSerializer(prioritized_sessions, many=True).data

        return Response({
            **serializer.data,
            "visit_count": {
                "last_7_days": get_last_7_days_visits(dashboard),
                "last_30_days": get_last_30_days_visits(dashboard),
            },
            "income_history": {
                "last_7_days": get_last_7_days_income(request.user.teacher),
                "last_30_days": get_last_30_days_income(request.user.teacher),
            },
            "booked_sessions": booked_sessions_data,   
        }, status=status.HTTP_200_OK)

class RevenueReportAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        teacher = request.user.teacher
        month_name = request.query_params.get("month")  # e.g. ?month=September

        today = now().date()

        # 1. All time total
        all_time_total = (
            IncomeHistory.objects.filter(teacher=teacher)
            .aggregate(total=Sum("after_deduction"))["total"] or 0
        )

        # 2. Last month total
        last_month = today.month - 1 if today.month > 1 else 12
        last_month_year = today.year if today.month > 1 else today.year - 1
        last_month_total = (
            IncomeHistory.objects.filter(
                teacher=teacher,
                date__year=last_month_year,
                date__month=last_month,
            ).aggregate(total=Sum("after_deduction"))["total"] or 0
        )

        # 3. Current month total
        current_month_total = (
            IncomeHistory.objects.filter(
                teacher=teacher,
                date__year=today.year,
                date__month=today.month,
            ).aggregate(total=Sum("after_deduction"))["total"] or 0
        )

        if month_name:
            # Strip unwanted chars, title case to match "January", "February", etc.
            month_name_clean = month_name.strip().capitalize()
            if month_name_clean not in calendar.month_name:
                return Response({"error": "Invalid month name."}, status=400)
            month_number = list(calendar.month_name).index(month_name_clean)
            year = today.year
        else:
            month_number = today.month
            year = today.year
        

        start_date = date(year, month_number, 1)
        _, last_day = calendar.monthrange(year, month_number)
        end_date = date(year, month_number, last_day)

        incomes = (
            IncomeHistory.objects.filter(
                teacher=teacher,
                date__range=[start_date, end_date]
            )
            .values("date")
            .annotate(total=Sum("after_deduction"))
            .order_by("date")
        )

        # Group by 5-day ranges (1-5, 6-10, etc.)
        grouped = {}
        for income in incomes:
            d = income["date"].day
            bucket_start = ((d - 1) // 5) * 5 + 1
            bucket_end = min(bucket_start + 4, last_day)
            label = f"{bucket_start}-{bucket_end} {month_name or today.strftime('%b')}"
            grouped[label] = grouped.get(label, 0) + float(income["total"])

        return Response({
            "all_time": float(all_time_total),
            "last_month": float(last_month_total),
            "current_month": float(current_month_total),
            "monthly_overview": grouped
        })


class BankView(generics.GenericAPIView):
    serializer_class = BankSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Bank.objects.filter(teacher=self.request.user.teacher).first()

    def get(self, request):
        bank = self.get_object()
        if not bank:
            return Response({"detail": "Bank info not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(bank)
        return Response(serializer.data)

    def post(self, request):
        if self.get_object():
            return Response({"detail": "Bank info already exists. Use PUT to update."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(teacher=request.user.teacher)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request):
        bank = self.get_object()
        if not bank:
            return Response({"detail": "Bank info not found. Use POST to create."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(bank, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request):
        bank = self.get_object()
        if not bank:
            return Response({"detail": "Bank info not found."}, status=status.HTTP_404_NOT_FOUND)
        bank.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PayPalView(generics.GenericAPIView):
    serializer_class = PayPalSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return PayPal.objects.filter(teacher=self.request.user.teacher).first()

    def get(self, request):
        paypal = self.get_object()
        if not paypal:
            return Response({"detail": "PayPal info not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(paypal)
        return Response(serializer.data)

    def post(self, request):
        if self.get_object():
            return Response({"detail": "PayPal info already exists. Use PUT to update."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(teacher=request.user.teacher)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request):
        paypal = self.get_object()
        if not paypal:
            return Response({"detail": "PayPal info not found. Use POST to create."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(paypal, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request):
        paypal = self.get_object()
        if not paypal:
            return Response({"detail": "PayPal info not found."}, status=status.HTTP_404_NOT_FOUND)
        paypal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WithdrawView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request):
        withdraws = Withdraw.objects.filter(
            teacher=request.user.teacher
        ).order_by('-date')

        paginator = PageNumberPagination()
        result_page = paginator.paginate_queryset(withdraws, request, view=self)
        serializer = WithdrawSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = WithdrawSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        withdraw = serializer.save()
        return Response(WithdrawSerializer(withdraw).data, status=status.HTTP_201_CREATED)

class BookedSessionListView(generics.ListAPIView):
    serializer_class = BookedSessionSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return (
            BookedSession.objects.filter(teacher=self.request.user.teacher)
            .select_related("student", "session")
            .order_by("-session_time")
        )

class TeacherGenerateVideoToken(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request, id):
        try:
            booked_session = BookedSession.objects.get(teacher=request.user.teacher, id=id)
        except BookedSession.DoesNotExist:
            return Response(
                {"msg": "No booked session found with this id for this teacher."},
                status=status.HTTP_404_NOT_FOUND
            )

        now = timezone.now()
        start_time = booked_session.session_time
        end_time = start_time + timedelta(minutes=booked_session.duration)

        # Token only available in time window
        if now < start_time - timedelta(seconds=15):
            return Response(
                {"msg": "Token not available yet. Try 15 seconds before session start."},
                status=status.HTTP_403_FORBIDDEN
            )
        if now > end_time:
            return Response(
                {"msg": "Session already completed. Token can’t be generated."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Channel name check
        if not booked_session.channel_name:
            return Response(
                {"msg": "Channel name not set for this session."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        channel_name = booked_session.channel_name
        # uid = str(request.user.id)
        uid = "0"
        role = 1  # teacher will act as host
        expire_time_in_seconds = booked_session.duration * 60

        current_timestamp = int(time.time())
        privilege_expired_ts = current_timestamp + expire_time_in_seconds

        token = RtcTokenBuilder.buildTokenWithUid(
            APP_ID,
            APP_CERTIFICATE,
            channel_name,
            # int(request.user.id),
            int(uid),
            role,
            privilege_expired_ts
        )

        return Response(
            {
                "token": token,
                "appId": APP_ID,
                "channelName": channel_name,
                "expireIn": expire_time_in_seconds
            },
            status=status.HTTP_200_OK
        )


class PasswordUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def post(self, request):
        serializer = UpdatePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        current_password = serializer.validated_data['current_password']
        new_password = serializer.validated_data['new_password']

        user = request.user

        if not user.check_password(current_password):
            return Response(
                {"detail": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"detail": "Password updated successfully."},
            status=status.HTTP_200_OK
        )

class DocumentView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request):
        try:
            document = Document.objects.get(teacher=request.user.teacher)
        except Document.DoesNotExist:
            return Response({"detail": "No document found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = DocumentSerializer(document)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        try:
            document = Document.objects.get(teacher=request.user.teacher)
        except Document.DoesNotExist:
            return Response({"detail": "No document found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = DocumentSerializer(document, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AccountUploadView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def post(self, request):
        upload, created = AccountVideo.objects.get_or_create(
            teacher=request.user.teacher,
            defaults={"public_id": ""}  
        )

        if not created:
            upload.public_id = ""
            upload.save()

        timestamp = int(time.time())

        params_to_sign = {
            "timestamp": timestamp,
            "folder": "teacher_accounts",
            "public_id": str(upload.id),
        }

        signature = cloudinary.utils.api_sign_request(
            params_to_sign,
            settings.CLOUDINARY_STORAGE["API_SECRET"]
        )

        return Response({
            "api_key": settings.CLOUDINARY_STORAGE["API_KEY"],
            "cloud_name": settings.CLOUDINARY_STORAGE["CLOUD_NAME"],
            "timestamp": timestamp,
            "signature": signature,
            "upload_id": str(upload.id),
            "folder": "teacher_accounts",
            "public_id": str(upload.id),
        }, status=200)



@method_decorator(csrf_exempt, name='dispatch')
class AccountUploadWebhookView(APIView):
    """
    Receives Cloudinary upload callbacks and updates the single AccountVideo record per teacher.
    """
    def post(self, request):
        try:
            payload = json.loads(request.body)
            public_id = payload.get("public_id")
            secure_url = payload.get("secure_url")
            event = payload.get("event")  # e.g., 'upload'

            if event != "upload" or not public_id or not secure_url:
                return Response({"error": "Invalid payload"}, status=400)

            # Update the existing AccountVideo entry
            try:
                upload = AccountVideo.objects.get(id=public_id)
                upload.file_url = secure_url
                upload.public_id = public_id  # store public_id if needed
                upload.save()
            except AccountVideo.DoesNotExist:
                return Response({"error": "Upload record not found"}, status=404)

            return Response({"status": "success"}, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

class AccountDetailView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request):
        teacher = request.user.teacher  # each user has one teacher profile
        serializer = AccountDetailSerializer(teacher)

        # Include available sports
        sports_qs = Sport.objects.all()
        sports_data = [{"id": str(s.id), "name": s.name} for s in sports_qs]

        response_data = serializer.data
        response_data["available_sports"] = sports_data

        return Response(response_data, status=status.HTTP_200_OK)

    def patch(self, request):
        teacher = request.user.teacher
        document = getattr(teacher, "document", None)
        user = teacher.user

        # Allowed Teacher fields (excluding coach_type)
        teacher_fields = ['institute_name', 'description', 'status', 'is_profile_complete']
        teacher_data = {field: request.data.get(field) for field in teacher_fields if field in request.data}

        # Allowed Document fields
        document_fields = ['city', 'zip_code']
        document_data = {field: request.data.get(field) for field in document_fields if field in request.data}

        # Allowed User fields
        user_fields = ['full_name', 'username']
        user_data = {field: request.data.get(field) for field in user_fields if field in request.data}

        # Update Teacher fields
        for field, value in teacher_data.items():
            setattr(teacher, field, value)
        teacher.save()

        # Update ManyToManyField coach_type using sport IDs
        if 'coach_type' in request.data:
            sport_ids = request.data.get('coach_type', [])
            # Convert strings to UUID objects if needed
            from uuid import UUID
            sport_ids = [UUID(s) if isinstance(s, str) else s for s in sport_ids]
            sports = Sport.objects.filter(id__in=sport_ids)
            teacher.coach_type.set(sports)

        # Update Document (create if it doesn’t exist)
        if document_data:
            if document:
                for field, value in document_data.items():
                    setattr(document, field, value)
                document.save()
            else:
                document = Document.objects.create(teacher=teacher, **document_data)

        for field, value in user_data.items():
            if field == "username":
                # Check if the new username already exists for another user
                if UserAccount.objects.filter(username=value).exclude(id=user.id).exists():
                    return Response({"error": "Username already taken"}, status=400)
            setattr(user, field, value)
        user.save() 

        serializer = AccountDetailSerializer(teacher)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AddedWalletListView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request):
        teacher = request.user.teacher  
        wallets = []

        if hasattr(teacher, "bank_account"):
            wallets.append("bank")

        if hasattr(teacher, "paypal_accounts"):
            wallets.append("paypal")

        return Response(wallets)

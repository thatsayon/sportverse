from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework import filters

from django.db.models import Count, Sum
from django.utils.timezone import now
from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

from datetime import timedelta
from cloudinary.utils import cloudinary_url

from .serializers import (
    SportSerializer,
    TrainersSerializer,
    StudentListSerializer,
    BookingSerializer,
    WithdrawRequestSerializer,
    ProfileSettingSerializer,
    PasswordUpdateSerializer,
    ChatLogSerializer,
    ChatlogDetailSerializer,
    WithdrawDetailSerializer,
    AdminVideoSerializer,
    VideoListSerializer
)

from account.models import Teacher, Student
from teacher.session.models import BookedSession, TRAINING_TYPE
from teacher.dashboard.models import IncomeHistory
from communication.messaging.models import Conversation, Message
from .models import Sport, Withdraw, AdminIncome, AdminVideo

import calendar
import time
import cloudinary

User = get_user_model()

class GetorAddSportView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SportSerializer
    queryset = Sport.objects.all()

class EditSportView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SportSerializer
    queryset = Sport.objects.all()
    lookup_field = 'id'

class AdminDashboard(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        total_user = User.objects.count()
        today = now().date()
        current_month = today.month
        current_year = today.year

        # Teacher Info
        teacher_count = Teacher.objects.count()
        latest_teacher = Teacher.objects.select_related("user").order_by("-user__date_joined")[:5]
        latest_teacher_data = TrainersSerializer(latest_teacher, many=True).data

        # Student Info
        student_count = Student.objects.count()
        latest_student = Student.objects.select_related("user").order_by("-user__date_joined")[:5]
        latest_student_data = StudentListSerializer(latest_student, many=True).data

        # Session Breakdown (This Month)
        start_of_month = today.replace(day=1)
        session_qs = BookedSession.objects.filter(session_time__gte=start_of_month)
        session_counts = session_qs.values("session__training_type").annotate(total=Count("id"))
        total_sessions = session_qs.count()

        breakdown = []
        for training_key, training_label in TRAINING_TYPE:
            count = next((item["total"] for item in session_counts if item["session__training_type"] == training_key), 0)
            increase_rate = (count / total_sessions * 100) if total_sessions > 0 else 0
            breakdown.append({
                "session_name": training_label,
                "total_sessions": count,
                "increase_rate": round(increase_rate, 2)
            })

        # Income Last 6 Months
        six_months_ago = (today.replace(day=1) - timedelta(days=180))
        income_qs = (
            AdminIncome.objects.filter(date__gte=six_months_ago)
            .values("date__year", "date__month")
            .annotate(total=Sum("after_deduction"))
            .order_by("date__year", "date__month")
        )

        income_data = []
        prev_total = None
        for entry in income_qs:
            year, month = entry["date__year"], entry["date__month"]
            total = float(entry["total"] or 0)

            if prev_total is not None and prev_total > 0:
                rate = ((total - prev_total) / prev_total) * 100
            else:
                rate = 0

            income_data.append({
                "month": f"{calendar.month_name[month]} {year}",
                "total_income": total,
                "change_rate": round(rate, 2)
            })
            prev_total = total

        # Current Month Financials
        # -------------------
        # Admin income
        current_admin_income = (
            AdminIncome.objects.filter(date__year=current_year, date__month=current_month)
            .aggregate(total=Sum("after_deduction"))["total"] or 0
        )
        last_admin_income = (
            AdminIncome.objects.filter(
                date__year=(today - timedelta(days=30)).year,
                date__month=(today - timedelta(days=30)).month
            ).aggregate(total=Sum("after_deduction"))["total"] or 0
        )

        # Teacher income (Expense)
        current_teacher_income = (
            IncomeHistory.objects.filter(date__year=current_year, date__month=current_month)
            .aggregate(total=Sum("after_deduction"))["total"] or 0
        )
        last_teacher_income = (
            IncomeHistory.objects.filter(
                date__year=(today - timedelta(days=30)).year,
                date__month=(today - timedelta(days=30)).month
            ).aggregate(total=Sum("after_deduction"))["total"] or 0
        )

        current_total_income = current_admin_income + current_teacher_income
        last_total_income = last_admin_income + last_teacher_income

        current_expense = current_teacher_income
        last_expense = last_teacher_income

        current_profit = current_admin_income
        last_profit = last_admin_income

        def calc_rate(current, last):
            if last and last > 0:
                return round(((current - last) / last) * 100, 2)
            return 0

        financials = {
            "month": calendar.month_name[current_month],
            "income": {"total": float(current_total_income), "rate": calc_rate(current_total_income, last_total_income)},
            "expense": {"total": float(current_expense), "rate": calc_rate(current_expense, last_expense)},
            "profit": {"total": float(current_profit), "rate": calc_rate(current_profit, last_profit)}
        }

        return Response(
            {
                "teachers": {
                    "teacher_count": teacher_count,
                    "latest": latest_teacher_data
                },
                "students": {
                    "student_count": student_count,
                    "latest": latest_student_data
                },
                "sessions": {
                    "total_sessions": total_sessions,
                    "breakdown": breakdown
                },
                "income": {
                    "last_6_months": income_data
                },
                "user_count": total_user,
                "financials": financials
            },
            status=status.HTTP_200_OK
        )

class TrinersListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = TrainersSerializer
    queryset = Teacher.objects.all()

class StudentListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = StudentListSerializer
    queryset = Student.objects.all()

class BookingView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = BookingSerializer
    queryset = BookedSession.objects.all()

class WithdrawRequest(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        status_filter = request.query_params.get("status")

        withdrawals = Withdraw.objects.all().select_related(
            "teacher__user", "teacher__document"
        )

        if status_filter:
            withdrawals = withdrawals.filter(status=status_filter)

        paginator = PageNumberPagination()
        paginator.page_size = 10
        result_page = paginator.paginate_queryset(withdrawals, request)

        serializer = WithdrawRequestSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request, id):
        new_status = request.data.get("status")

        if not new_status:
            return Response(
                {"error": "status field is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            withdraw = Withdraw.objects.get(id=id)
        except Withdraw.DoesNotExist:
            return Response(
                {"error": "No withdraw found"},
                status=status.HTTP_404_NOT_FOUND
            )

        withdraw.status = new_status
        withdraw.save()

        return Response(
            {"msg": "Status updated successfully"},
            status=status.HTTP_200_OK
        )


class ChatLogView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = ChatLogSerializer
    queryset = Conversation.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "teacher__full_name",
        "teacher__username",
        "teacher__email",
        "student__full_name",
        "student__username",
        "student__email",
    ]

class ChatLogDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = ChatlogDetailSerializer
    lookup_field = "id"
    queryset = Conversation.objects.all()


class WithdrawPaymentDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = WithdrawDetailSerializer
    queryset = Withdraw.objects.all()
    lookup_field = "id"
    

class ProfileSettingView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = ProfileSettingSerializer

    def get_object(self):
        return self.request.user

class PasswordUpdateView(generics.UpdateAPIView):
    serializer_class = PasswordUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"msg": "Password updated successfully"}, status=status.HTTP_200_OK)


class AnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        today = now().date()

        # -------------------
        # All-time financials
        # -------------------
        all_time_admin_income = AdminIncome.objects.aggregate(total=Sum("after_deduction"))["total"] or 0
        all_time_teacher_income = IncomeHistory.objects.aggregate(total=Sum("after_deduction"))["total"] or 0
        all_time_income = all_time_admin_income + all_time_teacher_income

        all_time_expense = all_time_teacher_income
        all_time_profit = all_time_admin_income
        all_time_profit_rate = (all_time_profit / all_time_income * 100) if all_time_income > 0 else 0

        # You can calculate the % change vs last period if needed
        def calc_change(current, previous):
            if previous and previous > 0:
                return round(((current - previous) / previous) * 100, 2)
            return 0

        # Example: compare last 30 days
        last_30_admin = AdminIncome.objects.filter(date__gte=today - timedelta(days=30), date__lt=today - timedelta(days=0)).aggregate(total=Sum("after_deduction"))["total"] or 0
        last_30_teacher = IncomeHistory.objects.filter(date__gte=today - timedelta(days=30), date__lt=today - timedelta(days=0)).aggregate(total=Sum("after_deduction"))["total"] or 0
        last_30_income = last_30_admin + last_30_teacher

        all_time_income_change = calc_change(all_time_income, last_30_income)
        all_time_profit_change = calc_change(all_time_profit, last_30_admin)
        all_time_expense_change = calc_change(all_time_expense, last_30_teacher)

        # -------------------
        # Subscription & Consultancy Revenue
        # -------------------
        subscription_revenue = AdminIncome.objects.aggregate(total=Sum("after_deduction"))["total"] or 0
        consultancy_revenue = IncomeHistory.objects.aggregate(total=Sum("after_deduction"))["total"] or 0

        # -------------------
        # Total Coaches & Students
        # -------------------
        total_coach = Teacher.objects.count()
        total_student = Student.objects.count()

        # -------------------
        # Daily Income/Expense/Profit chart (current month)
        # -------------------
        start_of_month = today.replace(day=1)
        days_in_month = today.day  # or calendar.monthrange(today.year, today.month)[1] for full month
        chart_data = []

        for day_offset in range(days_in_month):
            day = start_of_month + timedelta(days=day_offset)
            daily_admin = AdminIncome.objects.filter(date=day).aggregate(total=Sum("after_deduction"))["total"] or 0
            daily_teacher = IncomeHistory.objects.filter(date=day).aggregate(total=Sum("after_deduction"))["total"] or 0
            chart_data.append({
                "date": day.strftime("%b %d"),
                "income": float(daily_admin + daily_teacher),
                "expense": float(daily_teacher),
                "profit": float(daily_admin)
            })

        # -------------------
        # Final Response
        # -------------------
        return Response({
            "all_time": {
                "income": float(all_time_income),
                "income_change": all_time_income_change,
                "profit": float(all_time_profit),
                "profit_change": all_time_profit_change,
                "expense": float(all_time_expense),
                "expense_change": all_time_expense_change,
                "profit_rate": round(all_time_profit_rate, 2)
            },
            "revenue": {
                "subscription": float(subscription_revenue),
                "consultancy": float(consultancy_revenue)
            },
            "totals": {
                "coaches": total_coach,
                "students": total_student
            },
            "daily_chart": chart_data
        }, status=status.HTTP_200_OK)

class VideoUploadSignatureView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def post(self, request):
        serializer = AdminVideoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Extract validated data
        thumbnail_file = serializer.validated_data.pop("thumbnail")
        sport = serializer.validated_data.pop("sport")
        consumer = serializer.validated_data.pop("consumer")

        # Create AdminVideo instance
        video = AdminVideo.objects.create(
            **serializer.validated_data,
            sport=sport,
            consumer=consumer,
            public_id=""
        )

        # Upload thumbnail to Cloudinary
        upload_result = cloudinary.uploader.upload(
            thumbnail_file,
            folder="video_thumbnails",
        )
        video.thumbnail = upload_result["secure_url"]
        video.save(update_fields=["thumbnail"])

        # Generate Cloudinary signature for video upload
        timestamp = int(time.time())
        params_to_sign = {
            "timestamp": timestamp,
            "folder": "secure_videos",
            "public_id": str(video.id),
        }
        signature = cloudinary.utils.api_sign_request(
            params_to_sign,
            settings.CLOUDINARY_STORAGE["API_SECRET"]
        )

        return Response(
            {
                "api_key": settings.CLOUDINARY_STORAGE["API_KEY"],
                "cloud_name": settings.CLOUDINARY_STORAGE["CLOUD_NAME"],
                "timestamp": timestamp,
                "signature": signature,
                "video_id": str(video.id),
                "folder": "secure_videos",
                "public_id": str(video.id),
                "thumbnail": video.thumbnail,
                "sport_name": video.sport.name,
                "consumer_name": video.get_consumer_display(),
            },
            status=status.HTTP_200_OK,
        )


from uuid import UUID
class CloudinaryWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    
    
    def post(self, request, *args, **kwargs):
        data = request.data
        public_id = data.get("public_id")  # e.g., "secure_videos/657e7c92-08e4-4f51-9937-5d8c38c8343a"
        format_ = data.get("format")
        duration = data.get("duration")
        status_ = "ready" if data.get("resource_type") == "video" else "failed"

        # Extract UUID from public_id
        if "/" in public_id:
            uuid_str = public_id.split("/")[-1]
        else:
            uuid_str = public_id

        try:
            video_id = UUID(uuid_str)  # validate UUID format
            video = AdminVideo.objects.get(id=video_id)
            video.public_id = public_id
            video.format = format_
            video.duration = duration
            video.status = status_
            video.save()
        except ValueError:
            return Response(
                {"error": "Invalid UUID in public_id"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except AdminVideo.DoesNotExist:
            return Response(
                {"error": "Video not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({"success": True}, status=status.HTTP_200_OK)

class VideoListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = VideoListSerializer
    queryset = AdminVideo.objects.all()
   

class GenerateVideoLinkView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, video_id):
        try:
            video = AdminVideo.objects.get(id=video_id)
        except AdminVideo.DoesNotExist:
            return Response({"error": "Video not found"}, status=status.HTTP_404_NOT_FOUND)

        if not video.public_id:
            return Response({"error": "Video not uploaded yet"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate HLS (.m3u8) URL using Cloudinary
        hls_url, options = cloudinary_url(
            video.public_id,
            resource_type="video",
            format="mp4"
        )

        return Response({
            "video_id": str(video.id),
            "title": video.title,
            "description": video.description,
            "consumer": video.consumer,
            "status": video.status,
            "hls_url": hls_url,
        }, status=status.HTTP_200_OK)

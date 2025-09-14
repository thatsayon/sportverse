from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics

from django.utils.timezone import now
from django.db.models import Sum
from datetime import timedelta, date

from core.permissions import IsTeacher

from .models import (
    Dashboard,
    IncomeHistory,
    Bank,
    PayPal
)
from .serializers import (
    DashboardSerializer,
    BankSerializer,
    PayPalSerializer
)

import calendar

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

        return Response({
            **serializer.data,
            "visit_count": {
                "last_7_days": get_last_7_days_visits(dashboard),
                "last_30_days": get_last_30_days_visits(dashboard),
            },
            "income_history": {
                "last_7_days": get_last_7_days_income(request.user.teacher),
                "last_30_days": get_last_30_days_income(request.user.teacher),
            }
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

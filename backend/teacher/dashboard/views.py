from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from django.utils.timezone import now
from django.db.models import Sum
from datetime import timedelta

from core.permissions import IsTeacher

from .models import (
    Dashboard
)
from .serializers import (
    DashboardSerializer
)


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
            "last_7_days": get_last_7_days_visits(dashboard),
            "last_30_days": get_last_30_days_visits(dashboard),
        }, status=status.HTTP_200_OK)

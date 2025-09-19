from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView

from .serializers import (
    SportSerializer,
    TrainersSerializer,
    StudentListSerializer,
    BookingSerializer,
    WithdrawRequestSerializer
)

from account.models import Teacher, Student
from teacher.session.models import BookedSession
from .models import Sport, Withdraw

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
        pass

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
        withdrawals = Withdraw.objects.all().select_related("teacher__user", "teacher__document")

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


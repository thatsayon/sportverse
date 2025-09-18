from rest_framework import generics, status, permissions
from rest_framework.views import APIView

from .serializers import (
    SportSerializer,
    TrainersSerializer,
    StudentListSerializer,
    BookingSerializer
)

from account.models import Teacher, Student
from teacher.session.models import BookedSession
from .models import Sport

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
        pass

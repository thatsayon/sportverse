from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status

from .models import (
    Teacher,
    Document
)
from .serializers import (
    TeacherVerificationSerializer
)

class TecherVerficationView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TeacherVerificationSerializer

    def perform_create(self, serializer):
        teacher = Teacher.objects.get(user=self.request.user)
        serializer.save(teacher=teacher)

    def create(self, request, *args, **kwargs):
        try:
            teacher = Teacher.objects.get(user=request.user)
        except Teacher.DoesNotExist:
            return Response(
                {"error": "You are not registered as a teacher yet."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Document.objects.filter(teacher=teacher).exists():
            return Response(
                {"error": "You've already submitted verification"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)


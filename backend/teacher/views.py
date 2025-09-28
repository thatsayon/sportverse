from rest_framework.response import Response
from rest_framework import generics, status, permissions

from controlpanel.serializers import VideoListSerializer
from controlpanel.models import AdminVideo

from .serializers import (
    RatingReviewSerializer
)

class RatingReviewView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RatingReviewSerializer

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

class VideoLibraryView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VideoListSerializer
    queryset = AdminVideo.objects.all()

    def get_queryset(self):
        return AdminVideo.objects.filter(consumer="teacher")


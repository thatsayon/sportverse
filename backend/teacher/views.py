from rest_framework.response import Response
from rest_framework import generics, status, permissions

from controlpanel.serializers import VideoListSerializer
from controlpanel.models import AdminVideo

from account.models import Student
from .serializers import (
    RatingReviewSerializer
)

class RatingReviewView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RatingReviewSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                "message": "Review submitted successfully",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )


class VideoLibraryView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VideoListSerializer
    queryset = AdminVideo.objects.all()

    def get_queryset(self):
        return AdminVideo.objects.filter(consumer="teacher")


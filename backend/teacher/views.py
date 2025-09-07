from rest_framework.response import Response
from rest_framework import generics, status, permissions

from .serializers import (
    RatingReviewSerializer
)

class RatingReviewView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RatingReviewSerializer

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)





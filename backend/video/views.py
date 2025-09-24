import cloudinary.uploader
import cloudinary
import time, hashlib
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.conf import settings
from .models import Video
from .serializers import VideoSerializer, VideoListSerializer

class VideoUploadSignatureView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        title = request.data.get("title")
        description = request.data.get("description")

        if not title or not description:
            return Response(
                {"error": "Title and description are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create video entry first (so we have an ID for public_id)
        video = Video.objects.create(
            title=title,
            description=description,
            uploader=request.user,
            public_id="",  # will be updated after upload success
        )

        # Generate timestamp (must be close to client upload time)
        timestamp = int(time.time())

        # Params to sign (must match exactly what client will send)
        params_to_sign = {
            "timestamp": timestamp,
            "folder": "secure_videos",
            "public_id": str(video.id),  # unique identifier per video
        }

        # Generate secure signature
        signature = cloudinary.utils.api_sign_request(
            params_to_sign,
            settings.CLOUDINARY_STORAGE["API_SECRET"]
        )

        # Response to client (send only safe values)
        return Response({
            "api_key": settings.CLOUDINARY_STORAGE["API_KEY"],
            "cloud_name": settings.CLOUDINARY_STORAGE["CLOUD_NAME"],
            "timestamp": timestamp,
            "signature": signature,
            "video_id": str(video.id),
            "folder": "secure_videos",
            "public_id": str(video.id),
        }, status=status.HTTP_200_OK)

class VideoListView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        videos = Video.objects.all()
        serializer = VideoListSerializer(videos, many=True)  # many=True for queryset
        return Response(serializer.data)

from rest_framework.response import Response
from rest_framework import generics, status, permissions

from .serializers import NotificationSerializer
from .models import Notification

class NotificationList(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()

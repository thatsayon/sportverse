from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id",
            "header",
            "detail",
            "onclick_location",
            "created_at",
            "is_read"
        ]

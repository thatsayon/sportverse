from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class Video(models.Model):
    STATUS = [
        ("processing", "processing"),
        ("ready", "ready"),
        ("failed", "failed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    public_id = models.CharField(max_length=255, unique=True)
    format = models.CharField(max_length=50, blank=True, null=True)
    duration = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default="processing")
    uploader = models.ForeignKey(User, on_delete=models.CASCADE, related_name="videos")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

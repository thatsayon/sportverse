import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Notification(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    header = models.CharField(
        max_length=255
    )

    detail = models.TextField(
        blank=True,
        null=True
    )

    onclick_location = models.CharField(
        max_length=500,
        help_text="URL or path to open when clicked"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    is_read = models.BooleanField(
        default=False
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.header} -> {self.recipient.username}"


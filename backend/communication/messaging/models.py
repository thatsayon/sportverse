from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Message(models.Model):
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False
    )
    sender = models.ForeignKey(
        User, 
        related_name='sent', 
        on_delete=models.CASCADE
    )
    recipient = models.ForeignKey(
        User, 
        related_name='received', 
        on_delete=models.CASCADE
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    delivered = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['sender', 'recipient']),
            models.Index(fields=['recipient', 'delivered']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f'Message from {self.sender} to {self.recipient} at {self.created_at}'


from django.db import models
from django.contrib.auth import get_user_model

from account.models import Teacher
import uuid

User = get_user_model()

class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey(User, related_name='teacher_conversations', on_delete=models.CASCADE)
    student = models.ForeignKey(User, related_name='student_conversations', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("teacher", "student")  # one conversation per pair

class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        Conversation, on_delete=models.SET_NULL, related_name="messages", blank=True, null=True
    )
    sender = models.ForeignKey(User, related_name="sent_messages", on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name="received_messages", on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    delivered = models.BooleanField(default=False)
    read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
    
    def __str__(self):
        return f"{self.sender} - {self.content}"

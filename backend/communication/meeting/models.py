from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class ConsultationMeeting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="consultations_as_teacher"
    )
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="consultations_as_student"
    )
    meeting_number = models.CharField(max_length=50, unique=True)
    topic = models.CharField(max_length=255, default="Consultation")
    start_url = models.URLField()  # teacher start link
    join_url = models.URLField()   # student join link
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.topic} ({self.teacher.username} ↔ {self.student.username})"



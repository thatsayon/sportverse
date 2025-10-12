from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
from account.models import Teacher
import uuid

User = get_user_model()

TRAINING_TYPE = [
    ('virtual', 'Virtual Training'),
    ('mindset', 'Mindset Training'),
    ('in_person', 'In Person Training')
]

DAYS_OF_WEEK = [
    ('saturday', 'Saturday'),
    ('sunday', 'Sunday'),
    ('monday', 'Monday'),
    ('tuesday', 'Tuesday'),
    ('wednesday', 'Wednesday'),
    ('thursday', 'Thursday'),
    ('friday', 'Friday'),
]

class SessionOption(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name='session'
    )
    training_type = models.CharField(
        max_length=20,
        choices=TRAINING_TYPE
    )
    price = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )
    close_before = models.DurationField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.teacher} - {self.training_type} ({self.price})"

class AvailableDay(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(
        SessionOption,
        on_delete=models.CASCADE,
        related_name='available_days'
    )
    day = models.CharField(max_length=12, choices=DAYS_OF_WEEK)

    def __str__(self):
        return f"{self.session} - {self.day}"


class AvailableTimeSlot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    available_day = models.ForeignKey(
        AvailableDay,
        on_delete=models.CASCADE,
        related_name='time_slots'
    )
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.available_day.day}: {self.start_time} - {self.end_time}"

class BookedSession(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="booked_sessions_as_teacher"
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # safer than direct import
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="booked_sessions_as_student"
    )
    session = models.ForeignKey(
        SessionOption,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="booked_sessions"
    )
    channel_name = models.CharField(max_length=120, blank=True, null=True)
    session_time = models.DateTimeField()
    duration = models.PositiveIntegerField(default=60)
    reminder_sent = models.BooleanField(default=False)
    notification_reminder_sent = models.BooleanField(default=False)
    is_paid = models.BooleanField(default=False)

    def __str__(self):
        teacher_name = self.teacher.user.username if self.teacher and self.teacher.user else "Unknown Teacher"
        student_name = self.student.username if self.student else "Unknown Student"
        return f"Booked Session: {teacher_name} - {student_name}"

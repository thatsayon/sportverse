from django.db import models
from account.models import Teacher
import uuid

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
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    session = models.ForeignKey(
        SessionOption,
        on_delete=models.CASCADE,
        related_name='availabledays'
    )
    day = models.CharField(
        max_length=12,
        choices=DAYS_OF_WEEK
    )

    def __str__(self):
        return f"{self.session} - {self.day}"

class AvailableTimeSlot(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    availabledays = models.ForeignKey(
        AvailableDay,
        on_delete=models.CASCADE,
        related_name='availabledays'
    )
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.availabledays.day}: {self.start_time} - {self.end_time}"



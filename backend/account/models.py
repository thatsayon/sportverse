from django.db import models
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField

from controlpanel.models import Sport

import uuid

User = get_user_model()

STATUS = [
    ('not_submitted', 'Not Submitted'),
    ('verified', 'Verified'),
    ('in_progress', 'In Progress'),
    ('unverfied', 'Unverfied'),
    ('reject', 'Reject')
]

ACC_TYPE = [
    ('basic', 'Basic Plan'),
    ('pro', 'Pro Plan')
]

class Teacher(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True
    )
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="teacher"
    )
    institute_name = models.CharField(
        max_length=120,
        blank=True,
        null=True
    )
    coach_type = models.ManyToManyField(
        Sport,
        related_name='teacher',
        blank=True
    )
    account_type = models.CharField(
        choices=ACC_TYPE,
        max_length=12,
        default='basic'
    )
    can_access_schedule = models.BooleanField(default=False)
    description = models.CharField(
        max_length=240,
        blank=True,
        null=True
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS,
        default='not_submitted'
    )
    is_profile_complete = models.BooleanField(
        default=False
    )

    def __str__(self):
        return f"{self.user.username}"

class Document(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True
    )
    teacher = models.OneToOneField(
        Teacher,
        on_delete=models.CASCADE,
        related_name='document'
    )
    picture = CloudinaryField('mentor_images/')
    id_front = CloudinaryField('mentor_id')
    id_back = CloudinaryField('mentor_id')
    city = models.CharField(max_length=20)
    zip_code = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.teacher}"

class Student(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True
    )
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="student"
    )
    favorite_sports = models.ManyToManyField(
        Sport,
        related_name='students',
        blank=True
    )
    account_type = models.CharField(
        choices=ACC_TYPE,
        max_length=12,
        default='basic'
    )
    about = models.TextField(blank=True, null=True)

    def __str__(self):
        sports = ", ".join([sport.name for sport in self.favorite_sports.all()])
        return f"{self.user.username} - {sports}"



class Subscription(models.Model):
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False
    )
    stripe_id = models.CharField(
        max_length=255, 
        blank=True, 
        null=True
    )
    user = models.ForeignKey(
        Student, 
        on_delete=models.CASCADE, 
        related_name='subscriptions'
    )
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def __str__(self):
        return f"{self.user}: {self.end_date}"


class SubscriptionTeacher(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4, 
        editable=False
    )
    stripe_id = models.CharField(
        max_length=255, 
        blank=True, 
        null=True
    )
    user = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE, 
        related_name='subscriptions'
    )
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def __str__(self):
        return f"{self.user}: {self.end_date}"


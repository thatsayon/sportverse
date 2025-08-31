from django.db import models
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField

from controlpanel.models import Sport

import uuid

User = get_user_model()

STATUS = [
    ('verfied', 'Verified'),
    ('in_progress', 'In Progress'),
    ('unverfied', 'Unverfied')
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
    status = models.CharField(
        max_length=20,
        choices=STATUS,
        default='unverfied'
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
    teacher = models.ForeignKey(
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

    def __str__(self):
        return f"{self.user.username} - {self.favorite_sports}"


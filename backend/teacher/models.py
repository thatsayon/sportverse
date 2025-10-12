from django.db import models
from teacher.session.models import *
from teacher.dashboard.models import *
from account.models import Teacher, Student
import uuid

class RatingReview(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.SET_NULL,
        related_name='ratings',
        null=True
    )
    student = models.ForeignKey(
        Student,
        on_delete=models.SET_NULL,
        related_name='given_ratings',
        null=True
    )
    rating = models.DecimalField(
        max_digits=3,   
        decimal_places=1  
    )
    review = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("teacher", "student")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.student} -> {self.teacher} ({self.rating})"

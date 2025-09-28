from django.db import models

from account.models import Student

import uuid

class StudentSubscription(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4(),
        editable=False
    )
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='subscribe'
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student} subscription ({self.start_date} - {self.end_date})"

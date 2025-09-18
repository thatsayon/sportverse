from django.db import models 
from account.models import Teacher
import uuid

class Dashboard(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    teacher = models.OneToOneField(
        Teacher,
        on_delete=models.CASCADE,
        related_name='dashboard'
    )
    total_revenue = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=0.0
    )
    total_paid_fees = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=0.0
    )
    total_reservation = models.PositiveIntegerField(
        default=0
    )
    occupied_sits = models.DecimalField(
        max_digits=2,
        decimal_places=2,
        default=0.0
    )

    def __str__(self):
        return f"{self.teacher.user.username}"

class VisitCount(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    dashboard = models.ForeignKey(
        Dashboard,
        on_delete=models.CASCADE,
        related_name='visit_counts'
    )
    visit_count = models.IntegerField(default=0)
    date = models.DateField()

    def __str__(self):
        return f"{self.dashboard.teacher.user.username} - {self.date} : {self.visit_count}"

class IncomeHistory(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name='income_history'
    )
    student_paid = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.0
    )
    after_deduction = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.0
    )
    deduction_percent = models.DecimalField(
        max_digits=5,   
        decimal_places=2, 
        default=0.0
    )

    date = models.DateField()

    def __str__(self):
        return f"{self.teacher.user.username}: {self.after_deduction}"


class Bank(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    teacher = models.OneToOneField(
        Teacher,
        on_delete=models.CASCADE,
        related_name="bank_account"
    )
    full_name = models.CharField(max_length=255)
    bank_name = models.CharField(max_length=255)
    bank_acc_num = models.CharField(max_length=50)
    bank_routing_num = models.CharField(max_length=50)

    from django.contrib.postgres.fields import ArrayField
    account_type = ArrayField(
        models.CharField(max_length=50),
        default=list,
        blank=False,
        null=False
    )

    def __str__(self):
        return f"{self.full_name} - {self.bank_name}"

class PayPal(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    teacher = models.OneToOneField(
        Teacher,
        on_delete=models.CASCADE,
        related_name="paypal_accounts"
    )
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)   
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.full_name} ({self.email})"

class AccountVideo(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    teacher = models.OneToOneField(
        Teacher,
        on_delete=models.CASCADE,
        related_name="account_video"
    )
    file_url = models.URLField(blank=True, null=True)  # will be set after upload
    public_id = models.CharField(max_length=255, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file_url} uploaded by {self.teacher.username}"

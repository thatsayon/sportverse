from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from cloudinary.models import CloudinaryField
import uuid

class Sport(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    name = models.CharField(
        max_length=50,
        unique=True
    )
    slug = models.SlugField(
        max_length=60, 
        unique=True, 
        blank=True
    )
    image = CloudinaryField('admin/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class TeacherDeduction(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    first_time = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=1.00,
        validators=[MinValueValidator(1.00), MaxValueValidator(100.00)]
    )
    second_time = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=1.00,
        validators=[MinValueValidator(1.00), MaxValueValidator(100.00)]
    )

    def clean(self):
        if self.first_time <= self.second_time:
            raise ValidationError("first_time must be greater than second_time.")

    def __str__(self):
        return f"{self.first_time} : {self.second_time}"

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(first_time__gt=models.F("second_time")),
                name="first_time_gt_second_time"
            )
        ]

class Statistic(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    all_time_income = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0
    )
    all_time_expense = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0
    )
    all_time_profit = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0
    )
    subscription_revenue = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0
    )
    consultancy_revenue = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0
    )

    total_coach = models.PositiveIntegerField(
        default=0
    )
    total_student = models.PositiveIntegerField(
        default=0
    )

    current_month_income = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0
    )
    current_month_expense = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0
    )
    current_month_profit = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0
    )
    current_month_newuser = models.PositiveIntegerField(default=0)

    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Income Summary"

class MonthlyStatistic(models.Model):
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False
    )
    statistic = models.ForeignKey(
        Statistic, 
        on_delete=models.CASCADE, 
        related_name="monthly_stats"
    )
    year = models.PositiveIntegerField()
    month = models.PositiveIntegerField()

    income = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0
    )
    expense = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0
    )
    profit = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        default=0
    )
    new_users = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("statistic", "year", "month")

    def __str__(self):
        return f"{self.year}-{self.month} Stats"
    
class SessionBreakdown(models.Model):
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False
    )

    statistic = models.ForeignKey(
        Statistic,
        on_delete=models.CASCADE,
        related_name="session_breakdowns"
    )

    virtual_count = models.IntegerField(default=0)
    virtual_increment_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0.00
    )

    mindset_count = models.IntegerField(default=0)
    mindset_increment_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0.00
    )

    inperson_count = models.IntegerField(default=0)
    inperson_increment_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0.00
    )

    def __str__(self):
        return f"Session Breakdown for {self.statistic.id}"

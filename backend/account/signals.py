from django.db.models.signals import post_save
from django.dispatch import receiver
from authentication.models import UserAccount
from teacher.dashboard.models import Dashboard
from .models import Teacher, Student

@receiver(post_save, sender=UserAccount)
def create_teacher_profile(sender, instance, created, **kwargs):
    if created and instance.role == "teacher":
        Teacher.objects.create(user=instance)

    if created and instance.role == "student":
        Student.objects.create(user=instance)

@receiver(post_save, sender=Teacher)
def create_teacher_dashboard(sender, instance, created, **kwargs):
    if created:
        Dashboard.objects.create(teacher=instance)


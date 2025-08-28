from django.db.models.signals import post_save
from django.dispatch import receiver
from authentication.models import UserAccount
from .models import Teacher

@receiver(post_save, sender=UserAccount)
def create_teacher_profile(sender, instance, created, **kwargs):
    if created and instance.role == "teacher":
        Teacher.objects.create(user=instance)


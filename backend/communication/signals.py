from django.db.models.signals import post_save
from django.dispatch import receiver
from communication.messaging.models import Conversation
from teacher.session.models import BookedSession

@receiver(post_save, sender=BookedSession)
def ensure_conversation(sender, instance, created, **kwargs):
    if created:
        Conversation.objects.get_or_create(
            teacher=instance.teacher.user,
            student=instance.student
        )


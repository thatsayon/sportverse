from celery import shared_task
from .sio import sio
from asgiref.sync import async_to_sync
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def send_notification_task(self, data, user_id):
    try:
        # Call async emit synchronously
        async_to_sync(sio.emit)("new_notification", data, room=f"user_{user_id}")
        logger.info(f"✅ Notification sent to user {user_id}")
    except Exception as exc:
        logger.error(f"❌ Failed to send notification to user {user_id}: {exc}")
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


from celery import shared_task
from django.utils import timezone
import requests


@shared_task(bind=True, max_retries=3)
def send_reminder_notification():
    """
    Celery Beat task that runs every minute to check for session
    starting in 30 minutes and sends reminders.
    """
    
    from teacher.session.models import BookedSession

    now = timezone.now()

    reminder_time_start = now + timedelta(minutes=29)
    reminder_time_end = now + timedelta(minutes=31)

    sessions_to_remind = BookedSession.objects.filter(
        is_paid=True,
        session_time__gte=reminder_time_start,
        session_time__lte=reminder_time_end,
        notification_reminder_sent=False
    )

    notification_url = 'http://localhost:8004/notifications/'


    payload = {
        "user_id": user_id,
        "msg_title": msg_title,
        "msg_body": msg_body
    }

    header = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(
            notification_url,
            json=payload,
            header=header
        )
        response.raise_for_status()
        return response.json()

    except requests.exception.RequestException as exc:
        raise self.retry(exc=exc, countdown=5)


            

import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

app = Celery("core")

# Load config from Django settings
app.config_from_object("django.conf:settings", namespace="CELERY")

# Auto-discover tasks.py in all apps
app.autodiscover_tasks()

# Celery Beat schedule
app.conf.beat_schedule = {
    'check-session-reminders-every-minute': {
        'task': 'authentication.tasks.check_and_send_session_reminders',
        'schedule': 60.0,  # Run every 60 seconds (1 minute)
    },
}

app.conf.timezone = 'UTC'

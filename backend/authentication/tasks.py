from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def send_confirmation_email_task(self, user_email, full_name, otp):
    try:
        subject = "Confirm your email"
        body = render_to_string("confirm_email.html", {"email_otp": otp, "full_name": full_name})

        email = EmailMultiAlternatives(subject, "", to=[user_email])
        email.attach_alternative(body, "text/html")
        email.send()

        logger.info(f"OTP email sent successfully to {user_email}")

    except Exception as exc:
        logger.error(f"Failed to send OTP email to {user_email}: {exc}")
        raise self.retry(exc=exc, countdown=10)  # retry after 10s


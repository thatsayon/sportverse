from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone 
from datetime import timedelta
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

@shared_task(bind=True, max_retries=3)
def send_password_reset_email_task(self, user_email, full_name, otp):
    try:
        subject = "Password Reset Request"
        body = render_to_string(
            "password_reset_email.html",
            {"otp": otp, "full_name": full_name}
        )

        email = EmailMultiAlternatives(subject, "", to=[user_email])
        email.attach_alternative(body, "text/html")
        email.send()

        logger.info(f"Password reset OTP email sent successfully to {user_email}")

    except Exception as exc:
        logger.error(f"Failed to send password reset OTP email to {user_email}: {exc}")
        raise self.retry(exc=exc, countdown=10)  # retry after 10s

@shared_task(bind=True, max_retries=3)
def send_session_booking_email_task(
    self,
    teacher_email,
    teacher_name,
    student_name,
    session_date,
    session_time
):
    try:
        subject = "New Session Booking"
        body = render_to_string(
            "session_booking_email.html",
            {
                "teacher_name": teacher_name,
                "student_name": student_name,
                "session_date": session_date,
                "session_time": session_time
            }
        )
        email = EmailMultiAlternatives(subject, "", to=[teacher_email])
        email.attach_alternative(body, "text/html")
        email.send()
        logger.info(f"Session booking email sent successfully to {teacher_email}")
    except Exception as exc:
        logger.error(f"Failed to send session booking email to {teacher_email}: {exc}")
        raise self.retry(exc=exc, countdown=10)

@shared_task(bind=True, max_retries=3)
def send_session_reminder_to_teacher(
    self,
    teacher_email,
    teacher_name,
    student_name,
    session_date,
    session_time,
    session_link
):
    try:
        subject = "Session Reminder - Starting in 30 Minutes"
        body = render_to_string(
            "session_reminder_teacher.html",
            {
                "teacher_name": teacher_name,
                "student_name": student_name,
                "session_date": session_date,
                "session_time": session_time,
                "session_link": session_link
            }
        )
        email = EmailMultiAlternatives(subject, "", to=[teacher_email])
        email.attach_alternative(body, "text/html")
        email.send()
        logger.info(f"Session reminder sent to teacher: {teacher_email}")
    except Exception as exc:
        logger.error(f"Failed to send reminder to teacher {teacher_email}: {exc}")
        raise self.retry(exc=exc, countdown=10)


@shared_task(bind=True, max_retries=3)
def send_session_reminder_to_student(
    self,
    student_email,
    student_name,
    teacher_name,
    session_date,
    session_time,
    session_link
):
    try:
        subject = "Session Reminder - Starting in 30 Minutes"
        body = render_to_string(
            "session_reminder_student.html",
            {
                "student_name": student_name,
                "teacher_name": teacher_name,
                "session_date": session_date,
                "session_time": session_time,
                "session_link": session_link
            }
        )
        email = EmailMultiAlternatives(subject, "", to=[student_email])
        email.attach_alternative(body, "text/html")
        email.send()
        logger.info(f"Session reminder sent to student: {student_email}")
    except Exception as exc:
        logger.error(f"Failed to send reminder to student {student_email}: {exc}")
        raise self.retry(exc=exc, countdown=10)


@shared_task
def check_and_send_session_reminders():
    """
    Celery Beat task that runs every minute to check for sessions
    starting in 30 minutes and sends reminders.
    """
    from teacher.session.models import BookedSession  # Import here to avoid circular imports
    
    now = timezone.now()
    # Get sessions starting in 29-31 minutes (1-minute window to catch it)
    reminder_time_start = now + timedelta(minutes=29)
    reminder_time_end = now + timedelta(minutes=31)
    
    # Get all paid sessions that haven't been reminded yet and are starting soon
    sessions_to_remind = BookedSession.objects.filter(
        is_paid=True,
        session_time__gte=reminder_time_start,
        session_time__lte=reminder_time_end,
        reminder_sent=False  # Add this field to your model
    )
    
    logger.info(f"Found {sessions_to_remind.count()} sessions to remind")
    
    for session in sessions_to_remind:
        teacher = session.teacher
        student = session.student
        
        if not teacher or not student:
            continue
        
        # Format session details
        session_date = session.session_time.strftime("%B %d, %Y")
        session_time = session.session_time.strftime("%I:%M %p")
        
        # Create session link (adjust based on your URL structure)
        session_link = f"https://ballmastery.com/session/{session.channel_name}"
        
        # Send reminder to teacher
        send_session_reminder_to_teacher.delay(
            teacher_email=teacher.user.email,
            teacher_name=teacher.user.get_full_name() or teacher.user.username,
            student_name=student.get_full_name() or student.username,
            session_date=session_date,
            session_time=session_time,
            session_link=session_link
        )
        
        # Send reminder to student
        send_session_reminder_to_student.delay(
            student_email=student.email,
            student_name=student.get_full_name() or student.username,
            teacher_name=teacher.user.get_full_name() or teacher.user.username,
            session_date=session_date,
            session_time=session_time,
            session_link=session_link
        )
        
        # Mark as reminded
        session.reminder_sent = True
        session.save()
        
        logger.info(f"Reminders queued for session {session.id}")
    
    return f"Processed {sessions_to_remind.count()} session reminders"

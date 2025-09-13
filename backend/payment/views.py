import stripe
from django.conf import settings
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from decimal import Decimal
from rest_framework.views import APIView

from account.models import Subscription, Student
from teacher.session.models import BookedSession
from teacher.dashboard.models import IncomeHistory
from controlpanel.models import TeacherDeduction, AdminIncome



@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookView(APIView):
    authentication_classes = []  # no auth for webhooks
    permission_classes = []      # no permission check

    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except (ValueError, stripe.error.SignatureVerificationError):
            return HttpResponse(status=400)

        print(event)
        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            metadata = session.get("metadata", {})

            if metadata.get("type") == "subscription":
                self.handle_subscription(metadata, session)

            elif metadata.get("type") == "booked_session":
                self.handle_booked_session(metadata, session)

        return HttpResponse(status=200)

    def handle_subscription(self, metadata, session):

        # Mark or create subscription
        subscription = Subscription.objects.filter(stripe_id=session.id).first()
        subscription.stripe_id = session.get("id")
        subscription.amount_paid = session.amount_total / 100 
        subscription.start_date = timezone.now()
        # example: 30-day subscription
        subscription.end_date = timezone.now() + timezone.timedelta(days=30)
        subscription.save()

    def handle_booked_session(self, metadata, session):
        booked_session_id = metadata.get("booked_session_id")
        if not booked_session_id:
            return

        try:
            booked_session = BookedSession.objects.get(id=booked_session_id)
        except BookedSession.DoesNotExist:
            return

        teacher = booked_session.teacher
        student = booked_session.student
        if not teacher or not student:
            return

        # Mark session as paid
        booked_session.is_paid = True
        booked_session.save()

        # Total amount from Stripe (in USD cents, so divide by 100)
        total_paid = Decimal(session.get("amount_total", 0)) / 100

        # Get deduction config (just grab first, or enforce one exists)
        deduction = TeacherDeduction.objects.first()
        if not deduction:
            return  # or raise error

        # Count how many times this student booked this teacher before
        previous_bookings = BookedSession.objects.filter(
            teacher=teacher, student=student, is_paid=True
        ).exclude(id=booked_session.id).count()

        if previous_bookings == 0:
            deduction_percent = deduction.first_time
        else:
            deduction_percent = deduction.second_time

        # Calculate amounts
        admin_cut = (total_paid * deduction_percent) / Decimal(100)
        teacher_income = total_paid - admin_cut

        # Save AdminIncome
        AdminIncome.objects.create(
            student_paid=total_paid,
            after_deduction=admin_cut,
            deduction_percent=deduction_percent,
            date=timezone.now().date()
        )

        # Save Teacher IncomeHistory
        IncomeHistory.objects.create(
            teacher=teacher,
            student_paid=total_paid,
            after_deduction=teacher_income,
            deduction_percent=deduction_percent,
            date=timezone.now().date()
        ) 

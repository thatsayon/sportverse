import stripe
from django.conf import settings
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView

from account.models import Subscription, Student
from teacher.session.models import BookedSession



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

        booked_session.is_paid = True
        booked_session.save()


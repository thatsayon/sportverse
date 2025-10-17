from rest_framework.response import Response
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from payment.utils import create_stripe_checkout_session


from controlpanel.serializers import VideoListSerializer
from controlpanel.models import AdminVideo
from account.serializers import CheckoutSessionSerializer

from account.models import Student, SubscriptionTeacher
from .serializers import (
    RatingReviewSerializer
)

class RatingReviewView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RatingReviewSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                "message": "Review submitted successfully",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )


class VideoLibraryView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VideoListSerializer
    queryset = AdminVideo.objects.all()

    def get_queryset(self):
        return AdminVideo.objects.filter(consumer="teacher")

class ProTeacher(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)


        subscription = SubscriptionTeacher.objects.filter(user=request.user.teacher).first()
        if subscription:
            return Response({"detail": "Already subscribed"}, status=status.HTTP_400_BAD_REQUEST)

        session = create_stripe_checkout_session(
            **serializer.validated_data,
            name="pro",
            metadata={
                "type": "teacher-subscription",
                "teacher_id": str(request.user.teacher.id)  # ✅ Use Student.id
            }
        )

        if session:
            subscription = SubscriptionTeacher.objects.filter(user=request.user.teacher).first()
            if subscription:
                subscription.stripe_id = session.id
                subscription.save()
            else:
                SubscriptionTeacher.objects.create(
                    user=request.user.teacher,
                    stripe_id=session.id
                )

        return Response({"checkout_url": session.url}, status=status.HTTP_200_OK)
        


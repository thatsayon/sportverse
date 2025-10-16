from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework import permissions, status, generics

from agora_token_builder import RtcTokenBuilder
from django.shortcuts import get_object_or_404
from django.conf import settings
from datetime import timedelta
from django.utils import timezone

from teacher.session.models import SessionOption, BookedSession, AvailableTimeSlot
from payment.utils import create_stripe_checkout_session
from teacher.dashboard.utils import increment_dashboard_visit

from teacher.models import RatingReview
from controlpanel.serializers import VideoListSerializer
from controlpanel.models import AdminVideo
from account.models import Student, Subscription
from authentication.tasks import send_session_booking_email_task

from .serializers import (
    SessionOptionSerializer,
    TrainerDetailsSerializer,
    SessionDetailsSerializer,
    BookedSessionSerializer,
    StudentProfileSerializer,
    StudentProfileUpdateSerializer,
    RatingReviewSerializer
)
from communication.notification.models import Notification
from communication.messaging.socket import sio

from core.permissions import IsProStudent

import uuid
import time
import os

APP_ID = os.getenv("AGORA_APP_ID")
APP_CERTIFICATE = os.getenv("AGORA_APP_CERTIFICATE")

class TrainerListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Get distinct trainers who provide virtual/mindset
        sessions = SessionOption.objects.filter(
            training_type__in=['virtual', 'mindset']
        ).select_related('teacher', 'teacher__user').distinct('teacher')

        # Pagination
        paginator = PageNumberPagination()
        paginator.page_size = 10
        paginated_sessions = paginator.paginate_queryset(sessions, request, view=self)

        serializer = SessionOptionSerializer(paginated_sessions, many=True)
        return paginator.get_paginated_response(serializer.data)


class TrainerDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TrainerDetailsSerializer
    queryset = SessionOption.objects.all()
    lookup_field = 'id'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        if hasattr(instance.teacher, 'dashboard'):
            increment_dashboard_visit(instance.teacher.dashboard)
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class SessionDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id):
        session = get_object_or_404(SessionOption, id=id)

        if hasattr(session.teacher, 'dashboard'):
            increment_dashboard_visit(session.teacher.dashboard)

        serializer = SessionDetailsSerializer(session)
        return Response(serializer.data, status=status.HTTP_200_OK)

from asgiref.sync import async_to_sync
class BookedSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id):
        """
        Book a session for a given SessionOption (id).
        Request body must include:
        - available_time_slot_id
        """
        # 1. Get the session option
        try:
            session_option = SessionOption.objects.get(id=id)
        except SessionOption.DoesNotExist:
            return Response({"error": "Session not found"}, status=status.HTTP_404_NOT_FOUND)

        # 2. Get the chosen available time slot
        available_time_slot_id = request.data.get("available_time_slot_id")
        if not available_time_slot_id:
            return Response({"error": "available_time_slot_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            time_slot = AvailableTimeSlot.objects.get(
                id=available_time_slot_id, 
                available_day__session=session_option
            )
        except AvailableTimeSlot.DoesNotExist:
            return Response({"error": "Invalid or unavailable time slot"}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Check if already booked
        from datetime import datetime, date

        session_date = request.data.get("session_date")  # user must choose a date that matches day of week
        if not session_date:
            return Response({"error": "session_date is required (YYYY-MM-DD)"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            session_date_obj = datetime.strptime(session_date, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format, use YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate weekday matches AvailableDay
        weekday = session_date_obj.strftime("%A").lower()  # monday, tuesday, etc.
        if weekday != time_slot.available_day.day:
            return Response({"error": f"This slot is only available on {time_slot.available_day.day}"}, status=status.HTTP_400_BAD_REQUEST)

        # Combine date + start_time into DateTime
        session_datetime = datetime.combine(session_date_obj, time_slot.start_time)

        if BookedSession.objects.filter(session=session_option, session_time=session_datetime).exists():
            return Response({"error": "This slot is already booked"}, status=status.HTTP_400_BAD_REQUEST)

        random_suffix = uuid.uuid4().hex[:6]
        channel_name = f"{session_option.teacher.user.username}_{request.user.username}_{random_suffix}"

        # 4. Create booked session
        booked_session = BookedSession.objects.create(
            teacher=session_option.teacher,
            student=request.user,
            session=session_option,
            channel_name=channel_name,
            session_time=session_datetime,
            duration=(datetime.combine(date.today(), time_slot.end_time) - datetime.combine(date.today(), time_slot.start_time)).seconds // 60,
            is_paid=False
        )

        checkout_url =  create_stripe_checkout_session(
            name=f"{session_option.training_type} with {session_option.teacher.user.username}",
            amount=float(session_option.price),
            success_url=f"{settings.DOMAIN_URL}/confirmation?session_id={booked_session.id}",
            cancel_url=f"{settings.DOMAIN_URL}/payment-cancel?session_id={booked_session.id}",
            metadata={
                "type": "booked_session",
                "booked_session_id": str(booked_session.id),
                "user_id": str(request.user.id)
            }
        )       
        # Format session date and time
        session_date = session_datetime.strftime("%B %d, %Y")
        end_time = session_datetime + timedelta(minutes=booked_session.duration)
        session_time = f"{session_datetime.strftime('%I:%M %p')} - {end_time.strftime('%I:%M %p')}"

        # Send email notification to teacher
        send_session_booking_email_task.delay(
            teacher_email=session_option.teacher.user.email,
            teacher_name=session_option.teacher.user.get_full_name() or session_option.teacher.user.username,
            student_name=request.user.get_full_name() or request.user.username,
            session_date=session_date,
            session_time=session_time
        )

        # 6. Send notification to the teacher
        header = "New Session Booked"
        detail = f"{request.user.full_name} booked a session for {session_datetime.strftime('%Y-%m-%d %H:%M')}."
        onclick_location = f"/teacher/booked-sessions/{booked_session.id}"

        notification = Notification.objects.create(
            recipient=session_option.teacher.user,
            header=header,
            detail=detail,
            onclick_location=onclick_location
        )

        try:
            async def send_notification():
                await sio.emit("send_notification", {
                    "user_id": str(session_option.teacher.user.id),
                    "header": header,
                    "detail": detail,
                    "onclick_location": onclick_location
                })
            
            # Convert async to sync properly
            sync_send = async_to_sync(send_notification)
            sync_send()
            print(f"Real-time notification sent to teacher {session_option.teacher.user.id}")
            
        except Exception as e:
            print(f"Failed to send real-time notification: {e}")
            # Notification is still saved in database even if Socket.IO fails 
        return Response({"checkout_url": checkout_url.url, "booked_session_id": str(booked_session.id)}, status=201)

class BookedSessionList(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookedSessionSerializer
    queryset = BookedSession.objects.all()
    
    def get_queryset(self):
        return BookedSession.objects.filter(student=self.request.user)


class GenerateVideoToken(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id):
        try:
            booked_session = BookedSession.objects.get(student=request.user, id=id)
        except BookedSession.DoesNotExist:
            return Response(
                {"msg": "No booked session found with this id"},
                status=status.HTTP_404_NOT_FOUND
            )

        now = timezone.now()
        start_time = booked_session.session_time
        end_time = start_time + timedelta(minutes=booked_session.duration)

        # Check time window (15s before start -> until session ends)
        if now < start_time - timedelta(seconds=15):
            return Response(
                {"msg": "Token not available yet. Try 15 seconds before session start."},
                status=status.HTTP_403_FORBIDDEN
            )
        if now > end_time:
            return Response(
                {"msg": "Session already completed. Token can’t be generated."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Reuse channel_name from DB
        if not booked_session.channel_name:
            return Response(
                {"msg": "Channel name not set for this session."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        channel_name = booked_session.channel_name
        uid = "0"
        role = 1  # host (you can later change to host/audience based on role)
        expire_time_in_seconds = booked_session.duration * 60

        current_timestamp = int(time.time())
        privilege_expired_ts = current_timestamp + expire_time_in_seconds

        token = RtcTokenBuilder.buildTokenWithUid(
            APP_ID,
            APP_CERTIFICATE,
            booked_session.channel_name,  # must match for all users
            int(uid),
            role,                         # 1=host, 2=audience
            privilege_expired_ts          # expiry timestamp
        )


        return Response(
            {
                "token": token,
                "appId": APP_ID,
                "channelName": channel_name,
                "expireIn": expire_time_in_seconds
            },
            status=status.HTTP_200_OK
        )

class VideoLibraryView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsProStudent]
    serializer_class = VideoListSerializer
    queryset = AdminVideo.objects.all()

    def get_queryset(self):
        return AdminVideo.objects.filter(consumer="student")

class ProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentProfileSerializer

    def get_object(self):
        return self.request.user.student

class ProfileGetOrUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentProfileUpdateSerializer

    def get_object(self):
        user = self.request.user

        student, _ = Student.objects.get_or_create(user=user)
        return student

class RatingReviewView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RatingReviewSerializer
    queryset = RatingReview.objects.all()

    def get_queryset(self):
        student = Student.objects.get(user=self.request.user)
        return RatingReview.objects.filter(student=student)

class SubscriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        pass

class VideoLibraryAccessView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        student = getattr(request.user, 'student', None)
        if not student:
            return Response({"detail": "Student profile not found."}, status=404)

        # Check for active subscription
        now = timezone.now()
        active_subscription = Subscription.objects.filter(
            user=student,
            start_date__lte=now,
            end_date__gte=now
        ).first()

        can_access = bool(active_subscription)
        return Response({"can_access": can_access})

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework import permissions, status, generics

from django.shortcuts import get_object_or_404
from django.conf import settings

from teacher.session.models import SessionOption, BookedSession, AvailableTimeSlot
from payment.utils import create_stripe_checkout_session

from .serializers import (
    SessionOptionSerializer,
    TrainerDetailsSerializer,
    SessionDetailsSerializer
)

class TrainerListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Filter sessions
        sessions = SessionOption.objects.filter(
            training_type__in=['virtual', 'mindset']
        )

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

class SessionDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id):
        session = get_object_or_404(SessionOption, id=id)
        serializer = SessionDetailsSerializer(session)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
            time_slot = AvailableTimeSlot.objects.get(id=available_time_slot_id, availabledays__session=session_option)
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
        if weekday != time_slot.availabledays.day:
            return Response({"error": f"This slot is only available on {time_slot.availabledays.day}"}, status=status.HTTP_400_BAD_REQUEST)

        # Combine date + start_time into DateTime
        session_datetime = datetime.combine(session_date_obj, time_slot.start_time)

        if BookedSession.objects.filter(session=session_option, session_time=session_datetime).exists():
            return Response({"error": "This slot is already booked"}, status=status.HTTP_400_BAD_REQUEST)

        # 4. Create booked session
        booked_session = BookedSession.objects.create(
            teacher=session_option.teacher,
            student=request.user,
            session=session_option,
            session_time=session_datetime,
            duration=(datetime.combine(date.today(), time_slot.end_time) - datetime.combine(date.today(), time_slot.start_time)).seconds // 60,
            is_paid=False
        )

        checkout_url =  create_stripe_checkout_session(
            name=f"{session_option.training_type} with {session_option.teacher.user.username}",
            amount=float(session_option.price),
            success_url=f"{settings.DOMAIN_URL}/payment-success?session_id={booked_session.id}",
            cancel_url=f"{settings.DOMAIN_URL}/payment-cancel?session_id={booked_session.id}",
            metadata={
                "type": "booked_session",
                "booked_session_id": str(booked_session.id),
                "user_id": str(request.user.id)
            }
        )       
        return Response({"checkout_url": checkout_url.url, "booked_session_id": str(booked_session.id)}, status=201)

        # return Response(
        #     {
        #         "msg": "Session booked successfully",
        #         "id": str(booked_session.id),
        #         "session_time": booked_session.session_time,
        #         "duration": booked_session.duration
        #     },
        #     status=status.HTTP_201_CREATED
        # )

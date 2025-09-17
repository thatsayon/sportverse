from rest_framework import serializers

from django.utils import timezone
from datetime import timedelta

from teacher.session.models import SessionOption, AvailableDay, AvailableTimeSlot, BookedSession
from teacher.serializers import TeacherInfoSerializer
from account.models import Teacher

class TrainingInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionOption
        fields = ['id', 'training_type', 'price']

class SessionOptionSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='teacher.user.full_name')
    username = serializers.CharField(source='teacher.user.username')
    institute_name = serializers.CharField(source='teacher.institute_name')
    coach_type = serializers.CharField(source='teacher.coach_type')
    training_info = serializers.SerializerMethodField()

    class Meta:
        model = SessionOption
        fields = [
            'full_name',
            'username',
            'institute_name',
            'coach_type',
            'training_info',
        ]

    def get_training_info(self, obj):
        # Get all session options for this trainer (only virtual/mindset)
        sessions = SessionOption.objects.filter(
            teacher=obj.teacher,
            training_type__in=['virtual', 'mindset']
        )
        return TrainingInfoSerializer(sessions, many=True).data

class TrainerDetailsSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='teacher.user.full_name')
    username = serializers.CharField(source='teacher.user.username')
    institute_name = serializers.CharField(source='teacher.institute_name')
    coach_type = serializers.CharField(source='teacher.coach_type')

    class Meta:
        model = SessionOption
        fields = [
            'id', 
            'training_type', 
            'price', 
            'full_name',
            'username',
            'institute_name',
            'coach_type'
        ]

class AvailableTimeSlotSerializer(serializers.ModelSerializer):
    day = serializers.CharField(source="available_day.day", read_only=True)

    class Meta:
        model = AvailableTimeSlot
        fields = ['id', 'start_time', 'end_time', 'day']


class AvailableDaySerializer(serializers.ModelSerializer):
    timeslots = AvailableTimeSlotSerializer(
        source='time_slots',  # ✅ fixed
        many=True,
        read_only=True
    )

    class Meta:
        model = AvailableDay
        fields = ['id', 'day', 'timeslots']


class SessionDetailsSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='teacher.user.full_name')
    username = serializers.CharField(source='teacher.user.username')
    institute_name = serializers.CharField(source='teacher.institute_name')
    coach_type = serializers.CharField(source='teacher.coach_type')
    available_days = AvailableDaySerializer(  
        many=True,
        read_only=True
    )
    teacher_info = TeacherInfoSerializer(source='teacher', read_only=True)

    class Meta:
        model = SessionOption
        fields = [
            'id',
            'training_type',
            'price',
            'full_name',
            'username',
            'institute_name',
            'coach_type',
            'available_days',
            'teacher_info'
        ]



class BookedSessionSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.user.full_name')
    session_type = serializers.CharField(source='session.training_type')
    status = serializers.SerializerMethodField()

    class Meta:
        model = BookedSession
        fields = ['id', 'teacher_name', 'session_time', 'session_type', 'status']

    def get_status(self, obj):
        now = timezone.now()
        start_time = obj.session_time
        end_time = start_time + timedelta(hours=1)

        if start_time - timedelta(seconds=15) <= now <= end_time:
            return "Ongoing"
        elif now < start_time - timedelta(seconds=15):
            return "Upcoming"
        else:
            return "Completed"

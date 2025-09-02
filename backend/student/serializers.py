from rest_framework import serializers
from teacher.session.models import SessionOption, AvailableDay, AvailableTimeSlot
from account.models import Teacher

class SessionOptionSerializer(serializers.ModelSerializer):
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
    class Meta:
        model = AvailableTimeSlot
        fields = ['id', 'start_time', 'end_time']


class AvailableDaySerializer(serializers.ModelSerializer):
    timeslots = AvailableTimeSlotSerializer(
        source='availabledays',  # related_name in AvailableTimeSlot
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
        source='availabledays',  # related_name in AvailableDay
        many=True,
        read_only=True
    )

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
        ]

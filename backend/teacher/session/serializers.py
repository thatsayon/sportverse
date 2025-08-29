from rest_framework import serializers
from datetime import timedelta, datetime, date

from .models import (
    SessionOption,
    AvailableDay, 
    AvailableTimeSlot
)

class AvailableTimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailableTimeSlot
        fields = ['id', 'start_time', 'end_time']

class AvailableDaySerializer(serializers.ModelSerializer):
    time_slots = AvailableTimeSlotSerializer(many=True, write_only=True)
    slots = AvailableTimeSlotSerializer(source='availabledays', many=True, read_only=True)

    class Meta:
        model = AvailableDay
        fields = ['id', 'day', 'time_slots', 'slots']

    def create(self, validated_data):
        time_slots_data = validated_data.pop('time_slots')
        day = AvailableDay.objects.create(**validated_data)
        for ts_data in time_slots_data:
            AvailableTimeSlot.objects.create(availabledays=day, **ts_data)
        return day

class SessionOptionSerializer(serializers.ModelSerializer):
    available_days = AvailableDaySerializer(many=True, write_only=True)
    days = AvailableDaySerializer(source='availabledays', many=True, read_only=True)

    class Meta:
        model = SessionOption
        fields = [
            'id', 'training_type', 'price', 'close_before',
            'available_days', 'days', 'created_at'
        ]
        read_only_fields = ['created_at']

    def create(self, validated_data):
        days_data = validated_data.pop('available_days')
        session = SessionOption.objects.create(**validated_data)
        for day_data in days_data:
            time_slots_data = day_data.pop('time_slots')
            day = AvailableDay.objects.create(session=session, **day_data)
            for ts_data in time_slots_data:
                AvailableTimeSlot.objects.create(availabledays=day, **ts_data)
        return session


class TimeslotAvailabilitySerializer(serializers.Serializer):
    day = serializers.ChoiceField(choices=[d[0] for d in AvailableDay._meta.get_field('day').choices])
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()

    def validate(self, data):
        teacher = self.context['request'].user.teacher
        day = data['day']
        start_time = data['start_time']
        end_time = data['end_time']

        gap = timedelta(hours=1, minutes=30)

        # Convert to datetime for comparison
        start_dt = datetime.combine(date.today(), start_time)
        end_dt = datetime.combine(date.today(), end_time)

        sessions = SessionOption.objects.filter(teacher=teacher)

        for session in sessions:
            try:
                available_day = session.availabledays.get(day=day)
            except AvailableDay.DoesNotExist:
                continue

            for slot in available_day.availabledays.all():
                slot_start_dt = datetime.combine(date.today(), slot.start_time)
                slot_end_dt = datetime.combine(date.today(), slot.end_time)

                # Check overlap or less than 1.5h gap
                if not (end_dt + gap <= slot_start_dt or start_dt >= slot_end_dt + gap):
                    raise serializers.ValidationError(
                        "Timeslot overlaps with an existing session or is too close (minimum 1h30 gap required)."
                    )

        return data

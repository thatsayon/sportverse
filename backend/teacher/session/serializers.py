from rest_framework import serializers
from datetime import timedelta, datetime, date

from .models import (
    SessionOption,
    AvailableDay, 
    AvailableTimeSlot
)

class AvailableTimeSlotSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False)  # allow updating existing slots

    class Meta:
        model = AvailableTimeSlot
        fields = ['id', 'start_time', 'end_time']


class AvailableDaySerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False)  # allow updating existing days
    time_slots = AvailableTimeSlotSerializer(many=True)

    class Meta:
        model = AvailableDay
        fields = ['id', 'day', 'time_slots']

    def create(self, validated_data):
        time_slots_data = validated_data.pop('time_slots', [])
        day = AvailableDay.objects.create(**validated_data)
        for ts_data in time_slots_data:
            AvailableTimeSlot.objects.create(available_day=day, **ts_data)
        return day

    def update(self, instance, validated_data):
        time_slots_data = validated_data.pop('time_slots', [])
        instance.day = validated_data.get('day', instance.day)
        instance.save()

        # update or create time slots
        existing_slots = {str(slot.id): slot for slot in instance.time_slots.all()}
        sent_slot_ids = []

        for ts_data in time_slots_data:
            ts_id = ts_data.get('id', None)
            if ts_id and str(ts_id) in existing_slots:
                slot = existing_slots[str(ts_id)]
                slot.start_time = ts_data.get('start_time', slot.start_time)
                slot.end_time = ts_data.get('end_time', slot.end_time)
                slot.save()
            else:
                slot = AvailableTimeSlot.objects.create(available_day=instance, **ts_data)
            sent_slot_ids.append(slot.id)

        # delete removed slots
        for slot_id, slot in existing_slots.items():
            if slot.id not in sent_slot_ids:
                slot.delete()

        return instance


class SessionOptionSerializer(serializers.ModelSerializer):
    available_days = AvailableDaySerializer(many=True)

    class Meta:
        model = SessionOption
        fields = ['id', 'training_type', 'price', 'close_before', 'available_days', 'created_at']
        read_only_fields = ['created_at']

    def create(self, validated_data):
        days_data = validated_data.pop('available_days', [])
        session = SessionOption.objects.create(**validated_data)

        for day_data in days_data:
            time_slots_data = day_data.pop('time_slots', [])
            day = AvailableDay.objects.create(session=session, **day_data)
            for ts_data in time_slots_data:
                AvailableTimeSlot.objects.create(available_day=day, **ts_data)

        return session

    def update(self, instance, validated_data):
        days_data = validated_data.pop('available_days', None)

        # update session fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if days_data is not None:
            existing_days = {str(day.id): day for day in instance.available_days.all()}
            sent_day_ids = []

            for day_data in days_data:
                day_id = day_data.get('id', None)
                time_slots_data = day_data.pop('time_slots', [])

                if day_id and str(day_id) in existing_days:
                    day = existing_days[str(day_id)]
                    for attr, value in day_data.items():
                        setattr(day, attr, value)
                    day.save()
                else:
                    day = AvailableDay.objects.create(session=instance, **day_data)
                sent_day_ids.append(day.id)

                # update or create time slots
                existing_slots = {str(slot.id): slot for slot in day.time_slots.all()}
                sent_slot_ids = []
                for ts_data in time_slots_data:
                    ts_id = ts_data.get('id', None)
                    if ts_id and str(ts_id) in existing_slots:
                        slot = existing_slots[str(ts_id)]
                        slot.start_time = ts_data.get('start_time', slot.start_time)
                        slot.end_time = ts_data.get('end_time', slot.end_time)
                        slot.save()
                    else:
                        slot = AvailableTimeSlot.objects.create(available_day=day, **ts_data)
                    sent_slot_ids.append(slot.id)

                # delete removed slots
                for slot_id, slot in existing_slots.items():
                    if slot.id not in sent_slot_ids:
                        slot.delete()

            # delete removed days
            for day_id, day in existing_days.items():
                if day.id not in sent_day_ids:
                    day.delete()

        return instance

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

from rest_framework import serializers
from teacher.session.models import SessionOption, AvailableDay, AvailableTimeSlot
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

# class AvailableTimeSlotSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AvailableTimeSlot
#         fields = ['id', 'start_time', 'end_time']
#
#
# class AvailableDaySerializer(serializers.ModelSerializer):
#     timeslots = AvailableTimeSlotSerializer(
#         source='time_slots',  # related_name in AvailableTimeSlot
#         many=True,
#         read_only=True
#     )
#
#     class Meta:
#         model = AvailableDay
#         fields = ['id', 'day', 'timeslots']
#
# class SessionDetailsSerializer(serializers.ModelSerializer):
#     full_name = serializers.CharField(source='teacher.user.full_name')
#     username = serializers.CharField(source='teacher.user.username')
#     institute_name = serializers.CharField(source='teacher.institute_name')
#     coach_type = serializers.CharField(source='teacher.coach_type')
#     available_days = AvailableDaySerializer(
#         source='available_days',  # related_name in AvailableDay
#         many=True,
#         read_only=True
#     )
#     teacher_info = TeacherInfoSerializer(source='teacher', read_only=True)
#
#     class Meta:
#         model = SessionOption
#         fields = [
#             'id',
#             'training_type',
#             'price',
#             'full_name',
#             'username',
#             'institute_name',
#             'coach_type',
#             'available_days',
#             'teacher_info'
#         ]

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


# class SessionDetailsSerializer(serializers.ModelSerializer):
#     full_name = serializers.CharField(source='teacher.user.full_name')
#     username = serializers.CharField(source='teacher.user.username')
#     institute_name = serializers.CharField(source='teacher.institute_name')
#     coach_type = serializers.CharField(source='teacher.coach_type')
#     available_days = AvailableDaySerializer(
#         source='available_days',  # ✅ fixed
#         many=True,
#         read_only=True
#     )
#     teacher_info = TeacherInfoSerializer(source='teacher', read_only=True)
#
#     class Meta:
#         model = SessionOption
#         fields = [
#             'id',
#             'training_type',
#             'price',
#             'full_name',
#             'username',
#             'institute_name',
#             'coach_type',
#             'available_days',
#             'teacher_info'
#         ]
#

class SessionDetailsSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='teacher.user.full_name')
    username = serializers.CharField(source='teacher.user.username')
    institute_name = serializers.CharField(source='teacher.institute_name')
    coach_type = serializers.CharField(source='teacher.coach_type')
    available_days = AvailableDaySerializer(  # ✅ no source needed
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


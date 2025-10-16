from rest_framework import serializers

from django.utils import timezone
from datetime import timedelta
from django.db.models import Avg, Count

from teacher.session.models import SessionOption, AvailableDay, AvailableTimeSlot, BookedSession
from teacher.models import RatingReview
from teacher.serializers import TeacherInfoSerializer
from account.models import Teacher, Student
from teacher.models import RatingReview
from controlpanel.models import Sport

class TrainingInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionOption
        fields = ['id', 'training_type', 'price']

class SessionOptionSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='teacher.user.full_name')
    username = serializers.CharField(source='teacher.user.username')
    profile_pic_url = serializers.SerializerMethodField(read_only=True)
    institute_name = serializers.CharField(source='teacher.institute_name')
    coach_type = serializers.CharField(source='teacher.coach_type')
    training_info = serializers.SerializerMethodField()

    class Meta:
        model = SessionOption
        fields = [
            'full_name',
            'username',
            'profile_pic_url',
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

    def get_profile_pic_url(self, obj):
        user = obj.teacher.user
        if user.profile_pic.url:
            return user.profile_pic.url
        return None


class RatingReviewSerializerHI(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_username = serializers.SerializerMethodField()
    
    class Meta:
        model = RatingReview
        fields = [
            'id',
            'rating',
            'review',
            'student_name',
            'student_username',
            'created_at'
        ]
    
    def get_student_name(self, obj):
        # Added check for obj.student.user being not None
        if obj.student and hasattr(obj.student, "user") and obj.student.user:
            return obj.student.user.full_name
        return None
    
    def get_student_username(self, obj):
        # Added check for obj.student.user being not None
        if obj.student and hasattr(obj.student, "user") and obj.student.user:
            return obj.student.user.username
        return None


class TrainerDetailsSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='teacher.user.full_name')
    username = serializers.CharField(source='teacher.user.username')
    profile_pic_url = serializers.SerializerMethodField(read_only=True)
    institute_name = serializers.CharField(source='teacher.institute_name')
    coach_type = serializers.SerializerMethodField()

    ratings = serializers.SerializerMethodField()

    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()
    student_count = serializers.SerializerMethodField()

    virtual = serializers.SerializerMethodField()
    mindset = serializers.SerializerMethodField()
    in_person = serializers.SerializerMethodField()

    class Meta:
        model = SessionOption
        fields = [
            'id',
            'training_type',
            'price',
            'full_name',
            'username',
            'profile_pic_url',
            'institute_name',
            'coach_type',
            'virtual',
            'mindset',
            'in_person',
            'ratings',
            'average_rating',
            'total_reviews',
            'student_count'
        ]

    def _get_session_type_data(self, obj, training_type):
        session = obj.teacher.session.filter(training_type=training_type).first()
        if session:
            return {
                "exists": True,
                "id": session.id,
                "price": session.price
            }
        return {
            "exists": False,
            "id": None,
            "price": None
        }

    def get_virtual(self, obj):
        return self._get_session_type_data(obj, 'virtual')

    def get_mindset(self, obj):
        return self._get_session_type_data(obj, 'mindset')

    def get_in_person(self, obj):
        return self._get_session_type_data(obj, 'in_person')

    def get_average_rating(self, obj):
        teacher = obj.teacher
        if not hasattr(teacher, 'ratings'):
            return 0
        avg = teacher.ratings.aggregate(avg_rating=Avg('rating'))['avg_rating']
        return round(avg, 1) if avg else 0

    def get_total_reviews(self, obj):
        teacher = obj.teacher
        if not hasattr(teacher, 'ratings'):
            return 0
        return teacher.ratings.count()

    def get_student_count(self, obj):
        teacher = obj.teacher
        if not hasattr(teacher, 'booked_sessions_as_teacher'):
            return 0
        return teacher.booked_sessions_as_teacher.values('student').distinct().count()

    def get_coach_type(self, obj):
        return [sport.name for sport in obj.teacher.coach_type.all()]

    def get_profile_pic_url(self, obj):
        user = obj.teacher.user
        if user.profile_pic and hasattr(user.profile_pic, 'url'):
            return user.profile_pic.url
        return None

    def get_ratings(self, obj):
        teacher = obj.teacher
        if not hasattr(teacher, 'ratings'):
            return []
        reviews = teacher.ratings.all()
        return RatingReviewSerializerHI(reviews, many=True).data

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



# class BookedSessionSerializer(serializers.ModelSerializer):
#     teacher_name = serializers.CharField(source='teacher.user.full_name')
#     session_type = serializers.CharField(source='session.training_type')
#     status = serializers.SerializerMethodField()
#
#     class Meta:
#         model = BookedSession
#         fields = ['id', 'teacher_name', 'session_time', 'session_type', 'status']
#
#     def get_status(self, obj):
#         now = timezone.now()
#         start_time = obj.session_time
#         end_time = start_time + timedelta(hours=1)
#
#         if start_time - timedelta(seconds=15) <= now <= end_time:
#             return "Ongoing"
#         elif now < start_time - timedelta(seconds=15):
#             return "Upcoming"
#         else:
#             return "Completed"



class BookedSessionSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.user.full_name')
    teacher_id = serializers.CharField(source='teacher.user.id')
    session_type = serializers.CharField(source='session.training_type')
    status = serializers.SerializerMethodField()

    class Meta:
        model = BookedSession
        fields = ['id', 'teacher_name', 'teacher_id', 'session_time', 'session_type', 'status']

    def get_status(self, obj):
        now = timezone.localtime(timezone.now())        # Current time in BD
        start_time = timezone.localtime(obj.session_time)  # Session start in BD
        end_time = start_time + timedelta(minutes=obj.duration)  # End based on duration

        # Debugging
        print("Now:", now)
        print("Start:", start_time)
        print("End:", end_time)

        if start_time - timedelta(seconds=15) <= now <= end_time:
            return "Ongoing"
        elif now < start_time - timedelta(seconds=15):
            return "Upcoming"
        else:
            return "Completed"

class StudentProfileSerializer(serializers.ModelSerializer):
    profile_pic = serializers.SerializerMethodField()
    full_name = serializers.CharField(source='user.full_name')
    username = serializers.CharField(source="user.username")
    email = serializers.CharField(source="user.email")
    training_sessions = serializers.SerializerMethodField()
    coaches_booked = serializers.SerializerMethodField()
    hours_trained = serializers.SerializerMethodField()
    current_plan = serializers.SerializerMethodField()
    renewal_date = serializers.SerializerMethodField()
    favorite_sports = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            "id",
            "profile_pic",
            "full_name",
            "username",
            "email",
            "about",
            "training_sessions",
            "coaches_booked",
            "hours_trained",
            "account_type",
            "current_plan",
            "renewal_date",
            "favorite_sports",
        ]

    def get_training_sessions(self, obj):
        return BookedSession.objects.filter(student=obj).count()

    def get_coaches_booked(self, obj):
        return BookedSession.objects.filter(student=obj).values('teacher').distinct().count()

    def get_hours_trained(self, obj):
        return BookedSession.objects.filter(student=obj).count() * 60

    def get_profile_pic(self, obj):
        # If obj is a Student, use obj.user
        if hasattr(obj, 'user') and hasattr(obj.user, 'profile_pic') and obj.user.profile_pic:
            return obj.user.profile_pic.url
        # If obj is a UserAccount itself
        if hasattr(obj, 'profile_pic') and obj.profile_pic:
            return obj.profile_pic.url
        return None


    def get_current_plan(self, obj):
        now = timezone.now()
        subscription = obj.subscriptions.filter(start_date__lte=now, end_date__gte=now).first()
        if subscription:
            return 'Pro Plan'
        return 'Basic Plan'

    def get_renewal_date(self, obj):
        now = timezone.now()
        subscription = obj.subscriptions.filter(start_date__lte=now, end_date__gte=now).first()
        if subscription and subscription.end_date:
            return subscription.end_date
        return None

    def get_favorite_sports(self, obj):
        return [
            {"id": sport.id, "name": sport.name} 
            for sport in obj.favorite_sports.all()
        ]


class StudentProfileUpdateSerializer(serializers.ModelSerializer):
    profile_pic = serializers.ImageField(source="user.profile_pic", required=False)
    profile_pic_url = serializers.SerializerMethodField()
    full_name = serializers.CharField(source="user.full_name", required=False)
    username = serializers.CharField(source="user.username", required=False)
    email = serializers.EmailField(source="user.email", required=False)
    favorite_sports = serializers.PrimaryKeyRelatedField(
        queryset=Sport.objects.all(),
        many=True,
        required=False
    )

    class Meta:
        model = Student
        fields = [
            "id",
            "profile_pic",
            "profile_pic_url",
            "full_name",
            "username",
            "email",
            "about",
            "favorite_sports",
        ]

    def get_profile_pic_url(self, obj):
        if obj.user.profile_pic:
            return obj.user.profile_pic.url
        return None

    def update(self, instance, validated_data):
        # Extract nested user data if present
        user_data = validated_data.pop("user", {})

        # Update UserAccount fields
        user = instance.user
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        # Update favorite_sports if present
        if "favorite_sports" in validated_data:
            sports = validated_data.pop("favorite_sports")
            instance.favorite_sports.set(sports)

        # Update Student fields
        return super().update(instance, validated_data)

class RatingReviewSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.user.full_name")
    class Meta:
        model = RatingReview
        fields = [
            "id",
            "teacher_name",
            "rating",
            "review",
            "created_at"
        ]

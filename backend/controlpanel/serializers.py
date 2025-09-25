from rest_framework import serializers
from django.db import models
from django.db.models import Sum
from account.models import (
    Teacher,
    Student,
    Document
)
from django.utils import timezone
from django.contrib.auth import get_user_model, password_validation
from django.core.paginator import Paginator

from datetime import timedelta
from teacher.session.models import BookedSession
from teacher.dashboard.models import Bank, PayPal
from communication.messaging.models import Conversation, Message
from .models import Sport, Withdraw, AdminVideo
    
User = get_user_model()

class SportSerializer(serializers.ModelSerializer):
    total_trainer = serializers.SerializerMethodField()
    total_trainee = serializers.SerializerMethodField()

    class Meta:
        model = Sport
        fields = [
            "id", 
            "name", 
            "image",
            "total_trainer",
            "total_trainee"
        ]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.image:
            rep["image"] = instance.image.url  
        return rep

    def get_total_trainer(self, obj):
        return obj.teacher.count()

    def get_total_trainee(self, obj):
        return obj.students.count()


class TrainersSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name')
    username = serializers.CharField(source='user.username')
    location = serializers.CharField(source='document.city')
    net_income = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = ["id", "full_name", "username", "location", "net_income", "coach_type"]

    def get_net_income(self, obj: Teacher):
        total_income = obj.income_history.aggregate(
            total=models.Sum("after_deduction")
        )["total"] or 0
        return total_income


class StudentListSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name')
    username = serializers.CharField(source='user.username')
    total_session = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            "id", 
            "full_name", 
            "username", 
            "favorite_sports", 
            "account_type",
            "total_session",
            "total_spent"
        ]

    def get_total_session(self, obj):
        return BookedSession.objects.filter(
            student=obj.user,  
            is_paid=True
        ).count()

    def get_total_spent(self, obj):
        return (
            BookedSession.objects.filter(student=obj.user, is_paid=True)
            .aggregate(total=Sum("session__price"))
            .get("total") or 0
        )

class BookingSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.user.full_name')
    student_name = serializers.CharField(source='student.full_name')
    session_price = serializers.CharField(source="session.price")
    training_type = serializers.CharField(source="session.training_type")
    state_name = serializers.CharField(source="teacher.document.city")
    status = serializers.SerializerMethodField()

    class Meta:
        model = BookedSession
        fields = [
            "id",
            "teacher_name",
            "student_name",
            "session_time",
            "session_price",
            "training_type",
            "state_name",
            "status"
        ]

    def get_status(self, obj):
        now = timezone.now()
        start_time = obj.session_time
        end_time = start_time + timedelta(minutes=obj.duration)

        if start_time <= now <= end_time:
            return "ongoing"
        elif now < start_time:
            return "upcoming"
        else:
            return "complete"

class WithdrawRequestSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.user.full_name")
    location = serializers.CharField(source="teacher.document.city")
    class Meta:
        model = Withdraw
        fields = [
            "id",
            "teacher_name",
            "transaction_id",
            "location",
            "date",
            "amount",
            "status"
        ]

class ProfileSettingSerializer(serializers.ModelSerializer):
    profile_pic = serializers.ImageField(required=False, allow_null=True)

    profile_pic_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "full_name", "profile_pic", "profile_pic_url"]

    def get_profile_pic_url(self, obj):
        if obj.profile_pic:
            return obj.profile_pic.url
        return None


class PasswordUpdateSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = self.context['request'].user

        # Check old password
        if not user.check_password(data['old_password']):
            raise serializers.ValidationError({"old_password": "Old password is incorrect"})

        # Check new passwords match
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})

        # Run Django’s built-in password validators
        password_validation.validate_password(data['new_password'], user)

        return data

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user

class ChatLogSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.full_name", read_only=True)
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    subject = serializers.SerializerMethodField()
    message_count = serializers.SerializerMethodField()
    last_activity = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            "id",
            "teacher_name",
            "student_name",
            "subject",
            "message_count",
            "last_activity",
            "created_at",
        ]

    def get_subject(self, obj):
        teacher_acc = Teacher.objects.filter(user=obj.teacher).first()

        booked_session = (
            BookedSession.objects
            .filter(teacher=teacher_acc, student=obj.student)
            .select_related("session")
            .order_by("-session_time")
            .first()
        )

        if booked_session and booked_session.session:
            return booked_session.session.training_type  
        return None

    def get_message_count(self, obj):
        return obj.messages.count()

    def get_last_activity(self, obj):
        last_message = obj.messages.first()  
        return last_message.created_at if last_message else None

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.full_name", read_only=True)
    sender_username = serializers.CharField(source="sender.username", read_only=True)
    recipient_name = serializers.CharField(source="recipient.full_name", read_only=True)
    recipient_username = serializers.CharField(source="recipient.username", read_only=True)

    class Meta:
        model = Message
        fields = [
            "id",
            "sender_name",
            "sender_username",
            "recipient_name",
            "recipient_username",
            "content",
            "created_at",
            "delivered",
            "read",
        ]


class ChatlogDetailSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.full_name", read_only=True)
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    subject = serializers.SerializerMethodField()
    messages = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ["id", "teacher_name", "student_name", "subject", "created_at", "messages"]

    def get_subject(self, obj):
        teacher_acc = Teacher.objects.filter(user=obj.teacher).first()

        booked_session = (
            BookedSession.objects
            .filter(teacher=teacher_acc, student=obj.student)
            .select_related("session")
            .order_by("-session_time")
            .first()
        )

        if booked_session and booked_session.session:
            return booked_session.session.training_type  
        return None

    def get_messages(self, obj):
        request = self.context.get("request")
        page_number = int(request.query_params.get("page", 1))
        page_size = int(request.query_params.get("page_size", 30))  # default = 30

        queryset = obj.messages.all()
        paginator = Paginator(queryset, page_size)
        page = paginator.get_page(page_number)

        serializer = MessageSerializer(page, many=True, context=self.context)

        # Build next/previous URLs
        base_url = request.build_absolute_uri(request.path)
        next_url = None
        prev_url = None

        if page.has_next():
            next_url = f"{base_url}?page={page.next_page_number()}&page_size={page_size}"
        if page.has_previous():
            prev_url = f"{base_url}?page={page.previous_page_number()}&page_size={page_size}"

        return {
            "count": paginator.count,
            "total_pages": paginator.num_pages,
            "current_page": page.number,
            "page_size": page_size,
            "next": next_url,
            "previous": prev_url,
            "results": serializer.data,
        }

class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = ["full_name", "bank_name", "bank_acc_num", "bank_routing_num", "account_type"]


class PayPalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayPal
        fields = ["full_name", "email", "country"]

class WithdrawDetailSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.user.full_name", read_only=True)
    wallet_info = serializers.SerializerMethodField()

    class Meta:
        model = Withdraw
        fields = [
            "id",
            "teacher_name",
            "wallet_type",
            "transaction_id",
            "amount",
            "left_amount",
            "status",
            "date",
            "wallet_info",
        ]

    def get_wallet_info(self, obj):
        """Return related Bank or PayPal info based on wallet_type"""
        if obj.wallet_type == "bank":
            bank = getattr(obj.teacher, "bank_account", None)
            if bank:
                return BankSerializer(bank).data
        elif obj.wallet_type == "paypal":
            paypal = getattr(obj.teacher, "paypal_accounts", None)
            if paypal:
                return PayPalSerializer(paypal).data
        return None

class AdminVideoSerializer(serializers.ModelSerializer):
    thumbnail = serializers.ImageField(required=True, write_only=True)  # upload file
    
    sport = serializers.PrimaryKeyRelatedField(
        queryset=Sport.objects.all(), write_only=True
    )
    sport_name = serializers.CharField(source="sport.name", read_only=True)

    consumer = serializers.ChoiceField(choices=AdminVideo.CONSUMER, write_only=True)
    consumer_name = serializers.CharField(source="get_consumer_display", read_only=True)

    class Meta:
        model = AdminVideo
        fields = [
            "id",
            "title",
            "description",
            "public_id",
            "format",
            "duration",
            "status",
            "consumer",
            "consumer_name",
            "thumbnail",
            "sport",        
            "sport_name",  
            "created_at",
        ]
        read_only_fields = ["id", "public_id", "format", "duration", "status", "created_at"]

class VideoListSerializer(serializers.ModelSerializer):
    sport_name = serializers.CharField(source="sport.name", read_only=True)
    class Meta:
        model = AdminVideo
        fields = [
            "id",
            "title",
            "description",
            "thumbnail",
            "consumer",
            "created_at",
            "sport_name"
        ]

class VerifyDocumentSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.user.full_name")
    status = serializers.CharField(source="teacher.status")
    picture = serializers.SerializerMethodField()
    id_front = serializers.SerializerMethodField()
    id_back = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            "id",
            "teacher_name",
            "status",
            "picture",
            "id_front",
            "id_back",
            "city",
            "zip_code"
        ]

    def get_picture(self, obj):
        if obj.picture:
            return obj.picture.url
        return None

    def get_id_front(self, obj):
        if obj.id_front:
            return obj.id_front.url
        return None

    def get_id_back(self, obj):
        if obj.id_back:
            return obj.id_back.url
        return None

class UpdateTeacherStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['status']

    def validate_status(self, value):
        allowed_status = ['verified', 'rejected']
        if value not in allowed_status:
            raise serializers.ValidationError(
                f"Status must be one of {allowed_status}"
            )
        return value

from rest_framework import serializers
from django.db import models
from django.db.models import Sum
from account.models import (
    Teacher,
    Student
)
from django.utils import timezone
from datetime import timedelta
from teacher.session.models import BookedSession
from .models import Sport, Withdraw
    

class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = ["id", "name", "image"]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.image:
            rep["image"] = instance.image.url  # Always full URL in response
        return rep

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

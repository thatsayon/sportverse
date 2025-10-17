from rest_framework import serializers
from django.db import models
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from controlpanel.models import (
    Withdraw
)

from teacher.session.models import (
    BookedSession
)
from account.models import Document, Teacher

from .models import (
    Dashboard,
    VisitCount,
    Bank,
    PayPal,
)

import random, uuid, string

class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = [
            'id', 
            'total_revenue', 
            'total_paid_fees',
            'total_reservation',
            'occupied_sits'
        ]

class BookedSessionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name')
    session_type = serializers.CharField(source='session.training_type')
    price = serializers.CharField(source='session.price')
    status = serializers.SerializerMethodField()

    class Meta:
        model = BookedSession
        fields = ['id', 'student_name', 'session_time', 'session_type', 'price', 'status']

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

class BankSerializer(serializers.ModelSerializer):
    account_type = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=True,
        min_length=1  
    )

    class Meta:
        model = Bank
        fields = '__all__'
        read_only_fields = ['id', 'teacher']

class PayPalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayPal
        fields = '__all__'
        read_only_fields = ['id', 'teacher'] 


class WithdrawSerializer(serializers.ModelSerializer):
    class Meta:
        model = Withdraw
        fields = ['id', 'wallet_type', 'amount', 'transaction_id', 'left_amount', 'date']
        read_only_fields = ['id', 'transaction_id', 'left_amount', 'date']

    def create(self, validated_data):
        teacher = self.context['request'].user.teacher
        amount = validated_data['amount']
        wallet_type = validated_data['wallet_type']

        # total earned by teacher
        total_income = teacher.income_history.aggregate(
            total=models.Sum('after_deduction')
        )['total'] or Decimal('0.00')

        # total already withdrawn
        total_withdrawn = teacher.withdraws.aggregate(
            total=models.Sum('amount')
        )['total'] or Decimal('0.00')

        left_amount = total_income - (total_withdrawn + amount)

        if left_amount < 0:
            raise serializers.ValidationError("Insufficient balance for this withdrawal.")

        transaction_id = "WDR-" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

        return Withdraw.objects.create(
            teacher=teacher,
            wallet_type=wallet_type,
            amount=amount,
            left_amount=left_amount,
            transaction_id=transaction_id
        )

class UpdatePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)


class DocumentSerializer(serializers.ModelSerializer):
    # Read-only URL fields for GET requests
    picture_url = serializers.SerializerMethodField()
    id_front_url = serializers.SerializerMethodField()
    id_back_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        # Include both writable fields and read-only URL fields
        fields = [
            'id', 'picture', 'id_front', 'id_back',
            'picture_url', 'id_front_url', 'id_back_url',
            'city', 'zip_code'
        ]

    # Methods to return URLs for GET
    def get_picture_url(self, obj):
        return obj.picture.url if obj.picture else None

    def get_id_front_url(self, obj):
        return obj.id_front.url if obj.id_front else None

    def get_id_back_url(self, obj):
        return obj.id_back.url if obj.id_back else None

class AccountDetailSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name')
    profile_pic = serializers.ImageField(source='user.profile_pic')
    profile_pic_url = serializers.SerializerMethodField()
    username = serializers.CharField(source='user.username')
    city = serializers.CharField(source='user.teacher.document.city')
    zip_code = serializers.CharField(source='user.teacher.document.zip_code')

    class Meta:
        model = Teacher
        fields = ['id', 'full_name', 'username', 'profile_pic', 'profile_pic_url', 'city', 'zip_code', 'institute_name', 'coach_type', 'description', 'status', 'is_profile_complete']

    def get_profile_pic_url(self, obj):
        if obj.user.profile_pic:
            return obj.user.profile_pic.url
        return None

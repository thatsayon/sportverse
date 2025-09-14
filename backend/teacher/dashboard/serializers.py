from rest_framework import serializers
from .models import (
    Dashboard,
    VisitCount,
    Bank,
    PayPal
)

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

from rest_framework import serializers
from .models import (
    Dashboard,
    VisitCount
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

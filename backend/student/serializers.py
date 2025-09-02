from rest_framework import serializers
from teacher.session.models import SessionOption
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

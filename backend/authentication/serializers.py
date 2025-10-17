from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.contrib.auth.password_validation import validate_password
from django.utils.translation import gettext_lazy as _

from account.models import Teacher, Student
from .models import ROLE_CHOICES
import uuid

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=ROLE_CHOICES, required=True)

    class Meta:
        model = User
        fields = ("email", "password", "full_name", "role")

    def validate_password(self, value):
        validate_password(value)
        return value

    def generate_username(self, full_name: str) -> str:
        first_name = (full_name.split()[0] if full_name else "user").lower()
        base_username = slugify(first_name) or "user"
        return f"{base_username}{uuid.uuid4().hex[:8]}"

    def create(self, validated_data):
        email = validated_data.get("email")
        full_name = validated_data.get("full_name", "").strip()
        password = validated_data.get("password")
        role = validated_data.get("role")

        username = self.generate_username(full_name)

        user = User.objects.create_user(
            email=email,
            username=username,
            full_name=full_name,
            password=password,
            role=role,
            is_active=False,  
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username  # Add username to the token payload
        token['full_name'] = user.full_name
        token['email'] = user.email
        token['profile_pic'] = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
        token['role'] = user.role
        if user.role == "teacher":
            try:
                teacher_profile = Teacher.objects.get(user=user)
                token['verification_status'] = teacher_profile.status
                token['can_access_schedule'] = teacher_profile.can_access_schedule
            except Teacher.DoesNotExist:
                token['verification_status'] = "unverified"  

        if user.role == "student":
            try:
                student_profile = Student.objects.get(user=user)
                token['subscription_type'] = student_profile.account_type
            except Student.DoesNotExist:
                token['subscription_type'] = "unverified"

        return token

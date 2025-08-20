from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.contrib.auth.password_validation import validate_password
from django.utils.translation import gettext_lazy as _
import uuid

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("email", "password", "full_name")

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

        username = self.generate_username(full_name)

        user = User.objects.create_user(
            email=email,
            username=username,
            full_name=full_name,
            password=password,
            is_active=False,  
        )
        return user


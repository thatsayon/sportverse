from rest_framework import serializers
from .models import RatingReview

class RatingReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingReview
        fields = ['teacher', 'student', 'rating', 'review']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 or 5")
        return value


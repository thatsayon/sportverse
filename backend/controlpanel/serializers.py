from rest_framework import serializers
from .models import Sport
    

class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = ["id", "name", "image"]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.image:
            rep["image"] = instance.image.url  # Always full URL in response
        return rep

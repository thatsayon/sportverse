from rest_framework import serializers
from .models import (
    Teacher,
    Document
)

class TeacherVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ('picture', 'id_front', 'id_back', 'city', 'zip_code')

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['picture'] = instance.picture.url if instance.picture else None
        rep['id_front'] = instance.id_front.url if instance.id_front else None
        rep['id_back'] = instance.id_back.url if instance.id_back else None
        return rep


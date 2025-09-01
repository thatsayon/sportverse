from rest_framework import generics, status, permissions
from .serializers import SportSerializer
from .models import Sport

class GetorAddSportView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SportSerializer
    queryset = Sport.objects.all()

class EditSportView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SportSerializer
    queryset = Sport.objects.all()
    lookup_field = 'id'

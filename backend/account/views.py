from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import generics, status

from django.db import transaction
from django.contrib.auth import get_user_model
from uuid import UUID

from controlpanel.serializers import SportSerializer
from controlpanel.models import Sport
from .models import (
    Teacher,
    Document
)
from .serializers import (
    TeacherVerificationSerializer
)

User = get_user_model()

class TecherVerficationView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TeacherVerificationSerializer

    def perform_create(self, serializer):
        teacher = Teacher.objects.get(user=self.request.user)
        serializer.save(teacher=teacher)

    def create(self, request, *args, **kwargs):
        try:
            teacher = Teacher.objects.get(user=request.user)
        except Teacher.DoesNotExist:
            return Response(
                {"error": "You are not registered as a teacher yet."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Document.objects.filter(teacher=teacher).exists():
            return Response(
                {"error": "You've already submitted verification"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)

class GetSportsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SportSerializer 
    queryset = Sport.objects.all()


class AddFavoriteSportView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        sport_ids = request.data.get("sport_ids", [])
        if not isinstance(sport_ids, list) or not sport_ids:
            return Response({"error": "sport_ids must be a non-empty list"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate UUIDs
        valid_uuids = []
        for item in sport_ids:
            try:
                valid_uuids.append(UUID(str(item)))
            except ValueError:
                continue  # skip invalid

        if not valid_uuids:
            return Response({"error": "No valid UUIDs provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch valid sports
        valid_sports = Sport.objects.filter(id__in=valid_uuids)
        if not valid_sports.exists():
            return Response({"error": "No valid sports found"}, status=status.HTTP_400_BAD_REQUEST)

        # Update favorites atomically
        user = request.user
        with transaction.atomic():
            user.favourite_sports.add(*valid_sports)

        # Return updated favorites
        favorites = [{"id": str(s.id), "name": s.name} for s in user.favourite_sports.all()]
        return Response({
            "msg": "Favorites updated successfully",
            "favorites": favorites
        }, status=status.HTTP_200_OK)

class AddFavoriteSportView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        sport_ids = request.data.get("sport_ids", [])
        if not isinstance(sport_ids, list) or not sport_ids:
            return Response({"error": "sport_ids must be a non-empty list"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate UUIDs
        valid_uuids = []
        for item in sport_ids:
            try:
                valid_uuids.append(UUID(str(item)))
            except ValueError:
                continue  # skip invalid

        if not valid_uuids:
            return Response({"error": "No valid UUIDs provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch valid sports
        valid_sports = Sport.objects.filter(id__in=valid_uuids)
        if not valid_sports.exists():
            return Response({"error": "No valid sports found"}, status=status.HTTP_400_BAD_REQUEST)

        student = request.user.student
        with transaction.atomic():
            student.favorite_sports.add(*valid_sports)

        # Return updated favorites
        favorites = [{"id": str(s.id), "name": s.name} for s in student.favorite_sports.all()]
        return Response({
            "msg": "Favorites updated successfully",
            "favorites": favorites
        }, status=status.HTTP_200_OK)

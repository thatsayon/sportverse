from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework import permissions, status, generics

from teacher.session.models import SessionOption

from .serializers import (
    SessionOptionSerializer,
    TrainerDetailsSerializer
)

class TrainerListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Filter sessions
        sessions = SessionOption.objects.filter(
            training_type__in=['virtual', 'mindset']
        )

        # Pagination
        paginator = PageNumberPagination()
        paginator.page_size = 10
        paginated_sessions = paginator.paginate_queryset(sessions, request, view=self)

        serializer = SessionOptionSerializer(paginated_sessions, many=True)
        return paginator.get_paginated_response(serializer.data)

class TrainerDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TrainerDetailsSerializer
    queryset = SessionOption.objects.all()
    lookup_field = 'id'


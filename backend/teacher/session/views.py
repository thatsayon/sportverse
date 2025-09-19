from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from .models import (
    SessionOption,
    AvailableTimeSlot
)
from .serializers import (
    SessionOptionSerializer,
    TimeslotAvailabilitySerializer
)

class SessionListView(generics.ListAPIView):
    serializer_class = SessionOptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        teacher = self.request.user.teacher  
        return SessionOption.objects.filter(teacher=teacher).order_by('-created_at')

class SessionOptionCreateView(generics.CreateAPIView):
    queryset = SessionOption.objects.all()
    serializer_class = SessionOptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        teacher = self.request.user.teacher  # assumes OneToOneField

        training_type = serializer.validated_data.get('training_type')

        if SessionOption.objects.filter(teacher=teacher, training_type=training_type).exists():
            raise ValidationError(f"You have already created a {training_type} session.")

        serializer.save(teacher=teacher)

class SessionOptionUpdateView(generics.UpdateAPIView):
    queryset = SessionOption.objects.all()
    serializer_class = SessionOptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def perform_update(self, serializer):
        serializer.save(teacher=self.request.user.teacher, training_type=serializer.instance.training_type)

class DeleteTimeSlotView(generics.DestroyAPIView):
    queryset = AvailableTimeSlot.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_object(self):
        obj = super().get_object()
        if obj.available_day.session.teacher.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You do not have permission to delete this timeslot")
        return obj

    def destroy(self, request, *args, **kwargs):
        timeslot = self.get_object()
        available_day = timeslot.available_day  

        self.perform_destroy(timeslot)

        if not available_day.time_slots.exists():  
            available_day.delete()

        return Response({"success": "Time slot deleted"}, status=status.HTTP_200_OK)

class IsTimeslotAvailable(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = TimeslotAvailabilitySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            return Response({"available": True, "message": "Timeslot is available"}, status=status.HTTP_200_OK)
        
        message = serializer.errors.get('non_field_errors')
        if message:
            message = message[0]
        else:
            message = "Invalid data"

        return Response({"available": False, "message": message}, status=status.HTTP_200_OK)

from rest_framework import serializers
from account.models import Teacher, Student
from teacher.session.models import BookedSession
from controlpanel.serializers import SportSerializer
from .models import RatingReview


class RatingReviewSerializer(serializers.ModelSerializer):
    booked_session = serializers.UUIDField(write_only=True)
    teacher_name = serializers.CharField(source='teacher.user.get_full_name', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    
    class Meta:
        model = RatingReview
        fields = ['id', 'booked_session', 'rating', 'review', 'teacher_name', 'student_name', 'created_at']
        read_only_fields = ['id', 'teacher_name', 'student_name', 'created_at']
    
    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
    
    def validate_booked_session(self, value):
        """Validate that the session exists and belongs to the user"""
        request = self.context.get("request")
        if not request or not request.user:
            raise serializers.ValidationError("Authentication required")
        
        try:
            booked_session = BookedSession.objects.get(
                id=value,
                student=request.user
            )
        except BookedSession.DoesNotExist:
            raise serializers.ValidationError(
                "Invalid session or you did not attend this session"
            )
        
        # Optional: Check if session is completed
        # Uncomment if you have a status field
        # if booked_session.status != 'completed':
        #     raise serializers.ValidationError("You can only review completed sessions")
        
        return value
    
    def create(self, validated_data):
        request = self.context.get("request")
        student_user = request.user
        
        # Get booked_session
        booked_session_id = validated_data.pop('booked_session')
        
        try:
            booked_session = BookedSession.objects.select_related('teacher').get(
                id=booked_session_id,
                student=student_user
            )
        except BookedSession.DoesNotExist:
            raise serializers.ValidationError(
                {"booked_session": "Invalid session or you did not attend this session"}
            )
        
        teacher = booked_session.teacher
        if not teacher:
            raise serializers.ValidationError(
                {"teacher": "This session has no assigned teacher"}
            )
        
        try:
            student = Student.objects.get(user=student_user)
        except Student.DoesNotExist:
            raise serializers.ValidationError(
                {"student": "You are not registered as a student"}
            )
        
        # Check if review already exists
        if RatingReview.objects.filter(teacher=teacher, student=student).exists():
            raise serializers.ValidationError(
                {"detail": "You have already reviewed this teacher. You can only review a teacher once."}
            )
        
        # Create review
        try:
            rating_review = RatingReview.objects.create(
                teacher=teacher,
                student=student,
                rating=validated_data.get('rating'),
                review=validated_data.get('review', '')
            )
        except IntegrityError:
            raise serializers.ValidationError(
                {"detail": "You have already reviewed this teacher"}
            )
        
        return rating_review


class TeacherInfoSerializer(serializers.ModelSerializer):
    coach_type = SportSerializer(many=True, read_only=True)
    class Meta:
        model = Teacher
        fields = ['institute_name', 'coach_type']


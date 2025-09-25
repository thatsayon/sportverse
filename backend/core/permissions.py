from rest_framework.permissions import BasePermission

class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, "teacher")

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, "student")

class IsProStudent(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if hasattr(request.user, "student"):
            return request.user.student.account_type == "pro"

        return False

from django.contrib import admin
from .models import (
    Teacher,
    Document,
    Student
)

admin.site.register(Teacher)
admin.site.register(Document)
admin.site.register(Student)

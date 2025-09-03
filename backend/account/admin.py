from django.contrib import admin
from .models import (
    Teacher,
    Document,
    Student,
    Subscription
)

admin.site.register(Teacher)
admin.site.register(Document)
admin.site.register(Student)
admin.site.register(Subscription)

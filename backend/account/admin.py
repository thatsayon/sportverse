from django.contrib import admin
from .models import (
    Teacher,
    Document
)

admin.site.register(Teacher)
admin.site.register(Document)

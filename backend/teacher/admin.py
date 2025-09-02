from django.contrib import admin
from .session.models import (
    SessionOption,
    AvailableDay,
    AvailableTimeSlot,
    BookedSession
)

admin.site.register(SessionOption)
admin.site.register(AvailableDay)
admin.site.register(AvailableTimeSlot)
admin.site.register(BookedSession)

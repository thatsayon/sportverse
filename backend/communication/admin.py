from django.contrib import admin
from .meeting.models import (
    ConsultationMeeting,
)
from .messaging.models import (
    Message
)

admin.site.register(ConsultationMeeting)
admin.site.register(Message)

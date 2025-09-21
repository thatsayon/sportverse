from django.contrib import admin
from .meeting.models import (
    ConsultationMeeting,
)
from .messaging.models import (
    Conversation,
    Message
)

admin.site.register(ConsultationMeeting)

admin.site.register(Conversation)
admin.site.register(Message)

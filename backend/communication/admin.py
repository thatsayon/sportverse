from django.contrib import admin
from .meeting.models import (
    ConsultationMeeting,
)
from .messaging.models import (
    Conversation,
    Message
)
from .notification.models import (
    Notification
)

admin.site.register(ConsultationMeeting)

admin.site.register(Conversation)
admin.site.register(Message)

admin.site.register(Notification)

from django.urls import path
from .views import (
    ConversationList,
    ConversationMessages
)

urlpatterns = [
    path("list/", ConversationList.as_view()),
    path(
        "conversations/<uuid:conversation_id>/messages/",
        ConversationMessages.as_view(),
        name="conversation-messages",
    ),
]

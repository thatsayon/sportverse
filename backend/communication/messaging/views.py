from django.shortcuts import get_object_or_404
from django.db.models import Q, Max
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from .models import Conversation, Message
from django.contrib.auth import get_user_model

User = get_user_model()


class ConversationList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Annotate by last message time and order by it (latest conversations first)
        conversations = (
            Conversation.objects.filter(Q(teacher=user) | Q(student=user))
            .annotate(last_message_time=Max("messages__created_at"))
            .order_by("-last_message_time")
            .distinct()
        )

        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(conversations, request, view=self)

        result = []
        for conv in page:
            # conv.messages ordering uses Message.Meta ordering (latest first)
            last_msg = conv.messages.first()
            unread_count = conv.messages.filter(recipient=user, read=False).count()
            other_user = conv.student if conv.teacher == user else conv.teacher

            result.append(
                {
                    "conversation_id": str(conv.id),
                    "other_user": getattr(other_user, "username", str(other_user)),
                    "other_user_id": str(other_user.id),
                    "last_message": last_msg.content if last_msg else "",
                    "last_message_at": last_msg.created_at.isoformat() if last_msg else None,
                    "unread_count": unread_count,
                }
            )

        return paginator.get_paginated_response(result)


class ConversationMessages(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        user = request.user

        # Ensure the conversation exists and the user is a participant
        qs = Conversation.objects.filter(id=conversation_id).filter(Q(teacher=user) | Q(student=user))
        conversation = get_object_or_404(qs)

        # Select related for sender/recipient to reduce queries
        messages = (
            Message.objects.filter(conversation=conversation)
            .select_related("sender", "recipient")
            .order_by("created_at")  # ascending so oldest messages first (useful for chat UI)
        )

        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(messages, request, view=self)

        result = []
        for msg in page:
            result.append(
                {
                    "id": str(msg.id),
                    "sender_id": str(msg.sender.id),
                    "sender_name": getattr(msg.sender, "username", str(msg.sender)),
                    "recipient_id": str(msg.recipient.id),
                    "recipient_name": getattr(msg.recipient, "username", str(msg.recipient)),
                    "content": msg.content,
                    "created_at": msg.created_at.isoformat(),
                    "delivered": msg.delivered,
                    "read": msg.read,
                }
            )

        return paginator.get_paginated_response(result)


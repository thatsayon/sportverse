# # chat/socket.py
# import socketio
# import logging
# from asgiref.sync import sync_to_async
# from django.db import transaction
# from .models import Message
#
# # Set up logging
# logger = logging.getLogger(__name__)
#
# sio = socketio.AsyncServer(
#     async_mode="asgi",
#     cors_allowed_origins="*"
# )
#
# @sio.event
# async def connect(sid, environ, auth):
#     print(f"✅ Client connected: {sid}")
#     logger.info(f"Client connected: {sid}")
#
# @sio.event
# async def disconnect(sid):
#     print(f"❌ Client disconnected: {sid}")
#     logger.info(f"Client disconnected: {sid}")
#
# @sio.event
# async def join_room(sid, data):
#     await sio.enter_room(sid, data["room"])
#     print(f"{sid} joined room {data['room']}")
#     logger.info(f"{sid} joined room {data['room']}")
#
# @sio.event
# async def send_message(sid, data):
#     try:
#         sender_id = data.get("sender_id")
#         recipient_id = data.get("recipient_id")
#         text = data.get("text")
#         room = data.get("room")
#
#         print(f"📨 Received message data: {data}")
#         logger.info(f"Received message data: {data}")
#
#         # Validate required fields
#         if not sender_id:
#             print("❌ Missing sender_id")
#             logger.error("Missing sender_id")
#             return
#
#         if not recipient_id:
#             print("❌ Missing recipient_id") 
#             logger.error("Missing recipient_id")
#             return
#
#         if not text or not text.strip():
#             print("❌ Missing or empty text")
#             logger.error("Missing or empty text")
#             return
#
#         print(f"✅ All validation passed. Creating message...")
#
#         # Create message with transaction and better error handling
#         @sync_to_async
#         def create_message():
#             with transaction.atomic():
#                 message = Message.objects.create(
#                     sender_id=sender_id,
#                     recipient_id=recipient_id,
#                     content=text.strip(),
#                     delivered=True
#                 )
#                 print(f"💾 Message created with ID: {message.id}")
#                 logger.info(f"Message created with ID: {message.id}")
#                 return message
#
#         message = await create_message()
#
#         # Prepare response data
#         msg_data = {
#             "id": str(message.id),
#             "sender": sender_id,
#             "recipient": recipient_id,
#             "text": message.content,
#             "created_at": message.created_at.isoformat(),
#         }
#
#         print(f"📤 Emitting message to room {room}: {msg_data}")
#         logger.info(f"Emitting message to room {room}")
#
#         # Emit to room
#         await sio.emit("receive_message", msg_data, room=room)
#
#         print("✅ Message sent successfully")
#
#     except Exception as e:
#         print(f"❌ Error in send_message: {str(e)}")
#         logger.error(f"Error in send_message: {str(e)}", exc_info=True)
#
#         # Optionally emit error back to client
#         await sio.emit("message_error", {
#             "error": "Failed to send message",
#             "details": str(e)
#         }, to=sid)

# chat/socket.py
import socketio
import logging
from asgiref.sync import sync_to_async
from django.db import transaction
from django.contrib.auth import get_user_model

from .models import Message, Conversation

logger = logging.getLogger(__name__)
User = get_user_model()

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)

# ---------------------------
# Connection Events
# ---------------------------
@sio.event
async def connect(sid, environ, auth):
    print(f"✅ Client connected: {sid}")
    logger.info(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"❌ Client disconnected: {sid}")
    logger.info(f"Client disconnected: {sid}")

# ---------------------------
# Room Join
# ---------------------------
@sio.event
async def join_conversations(sid, data):
    """
    Frontend calls this after login:
    socket.emit("join_conversations", { conversations: [conversationId1, ...] })
    """
    conversations = data.get("conversations", [])
    for conv_id in conversations:
        await sio.enter_room(sid, f"conversation_{conv_id}")
        logger.info(f"{sid} joined conversation_{conv_id}")
    print(f"✅ {sid} joined {len(conversations)} conversations")

# ---------------------------
# Send Message
# ---------------------------
@sio.event
async def send_message(sid, data):
    """
    data = {
      "conversation_id": "...",
      "sender_id": "...",
      "recipient_id": "...",
      "text": "Hello!"
    }
    """
    try:
        conversation_id = data.get("conversation_id")
        sender_id = data.get("sender_id")
        recipient_id = data.get("recipient_id")
        text = data.get("text")

        if not (conversation_id and sender_id and recipient_id and text):
            logger.error("❌ Missing fields in send_message")
            return

        @sync_to_async
        def create_message():
            with transaction.atomic():
                message = Message.objects.create(
                    conversation_id=conversation_id,
                    sender_id=sender_id,
                    recipient_id=recipient_id,
                    content=text.strip(),
                    delivered=True
                )
                return message

        message = await create_message()

        msg_data = {
            "id": str(message.id),
            "conversation_id": str(conversation_id),
            "sender": str(sender_id),
            "recipient": str(recipient_id),
            "text": message.content,
            "created_at": message.created_at.isoformat(),
            "delivered": message.delivered,
            "read": message.read,
        }

        room = f"conversation_{conversation_id}"
        await sio.emit("receive_message", msg_data, room=room)

        # Update inbox preview for both sender and recipient
        await sio.emit("update_inbox", msg_data, room=room)

        print(f"📤 Message sent in {room}: {msg_data}")

    except Exception as e:
        logger.error(f"Error in send_message: {str(e)}", exc_info=True)
        await sio.emit("message_error", {"error": str(e)}, to=sid)

# ---------------------------
# Mark as Read
# ---------------------------
@sio.event
async def mark_as_read(sid, data):
    """
    data = { "conversation_id": "...", "user_id": "..." }
    """
    try:
        conversation_id = data.get("conversation_id")
        user_id = data.get("user_id")

        if not (conversation_id and user_id):
            return

        @sync_to_async
        def update_read():
            return Message.objects.filter(
                conversation_id=conversation_id,
                recipient_id=user_id,
                read=False
            ).update(read=True)

        updated = await update_read()

        if updated:
            await sio.emit(
                "messages_read",
                {"conversation_id": conversation_id, "user_id": user_id},
                room=f"conversation_{conversation_id}"
            )
            print(f"✅ {updated} messages marked as read in {conversation_id}")

    except Exception as e:
        logger.error(f"Error in mark_as_read: {str(e)}", exc_info=True)


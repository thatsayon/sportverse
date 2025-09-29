# chat/socket.py
import socketio
import logging
from asgiref.sync import sync_to_async
from django.db import transaction
from django.contrib.auth import get_user_model

from communication.notification.models import Notification
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
            "sender_id": str(sender_id),       
            "recipient_id": str(recipient_id), 
            "content": message.content,       
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


# # send notification
# @sio.event
# async def send_notification(sid, data):
#     """
#     data = {
#         "user_id": "...",
#         "header": "New Course Available",
#         "detail": "A new Django course has been uploaded",
#         "onclick_location": "/courses/django/"
#     }
#     """
#     try:
#         user_id = data.get("user_id")
#         header = data.get("header")
#         detail = data.get("detail", "")
#         onclick_location = data.get("onclick_location", "")
#
#         if not (user_id and header and onclick_location):
#             await sio.emit(
#                 "notification_error",
#                 {"error": "Missing required fields"},
#                 to=sid
#             )
#             return
#
#         # ✅ 1. Save to Database
#         @sync_to_async
#         def create_notification():
#             return Notification.objects.create(
#                 recipient_id=user_id,
#                 header=header,
#                 detail=detail,
#                 onclick_location=onclick_location
#             )
#
#         notification = await create_notification()
#
#         # ✅ 2. Real-time Emit
#         room = f"user_{user_id}"
#         await sio.emit(
#             "receive_notification",
#             {
#                 "id": str(notification.id),
#                 "header": notification.header,
#                 "detail": notification.detail,
#                 "onclick_location": notification.onclick_location,
#                 "created_at": notification.created_at.isoformat(),
#                 "is_read": notification.is_read,
#             },
#             room=room
#         )
#
#         print(f"🔔 Notification sent and saved → {room}")
#
#     except Exception as e:
#         logger.error(f"Error in send_notification: {e}", exc_info=True)
#         await sio.emit("notification_error", {"error": str(e)}, to=sid)
#
# # join noticiation channel
# @sio.event
# async def join_notification_room(sid, data):
#     user_id = data.get("user_id")
#     if user_id:
#         await sio.enter_room(sid, f"user_{user_id}")
#         print(f"Notification Connected: {sid} joined user_{user_id}")
#

# send notification
@sio.event
async def send_notification(sid, data):
    """
    data = {
        "user_id": "...",
        "header": "New Course Available",
        "detail": "A new Django course has been uploaded",
        "onclick_location": "/courses/django/"
    }
    """
    print(f"📨 send_notification called with data: {data}")
    print(f"📨 Session ID: {sid}")
    
    try:
        user_id = data.get("user_id")
        header = data.get("header")
        detail = data.get("detail", "")
        onclick_location = data.get("onclick_location", "")
        
        print(f"📋 Extracted data - user_id: {user_id}, header: {header}, onclick_location: {onclick_location}")
        
        if not (user_id and header and onclick_location):
            print("❌ Missing required fields")
            await sio.emit(
                "notification_error",
                {"error": "Missing required fields"},
                to=sid
            )
            return
        
        print("✅ All required fields present")
        
        # ✅ 1. Save to Database
        @sync_to_async
        def create_notification():
            print(f"💾 Creating notification in database for user_id: {user_id}")
            notification = Notification.objects.create(
                recipient_id=user_id,
                header=header,
                detail=detail,
                onclick_location=onclick_location
            )
            print(f"💾 Notification created with ID: {notification.id}")
            return notification
            
        notification = await create_notification()
        print(f"✅ Notification saved to database: ID={notification.id}")
        
        # ✅ 2. Real-time Emit
        room = f"user_{user_id}"
        print(f"📡 Attempting to emit to room: {room}")
        
        # Check if there are any clients in the room
        room_clients = sio.manager.get_participants(sio.namespace, room)
        print(f"👥 Clients in room '{room}': {len(room_clients) if room_clients else 0}")
        
        if not room_clients:
            print(f"⚠️ No clients found in room '{room}' - user might not be connected")
        
        notification_data = {
            "id": str(notification.id),
            "header": notification.header,
            "detail": notification.detail,
            "onclick_location": notification.onclick_location,
            "created_at": notification.created_at.isoformat(),
            "is_read": notification.is_read,
        }
        
        print(f"📤 Emitting notification data: {notification_data}")
        
        await sio.emit(
            "receive_notification",
            notification_data,
            room=room
        )
        
        print(f"✅ Notification successfully emitted to room: {room}")
        
        # Also emit success confirmation to the sender
        await sio.emit(
            "notification_sent",
            {"success": True, "notification_id": str(notification.id)},
            to=sid
        )
        
        print(f"🔔 Notification process completed successfully → {room}")
        
    except Exception as e:
        print(f"❌ Error in send_notification: {e}")
        logger.error(f"Error in send_notification: {e}", exc_info=True)
        await sio.emit("notification_error", {"error": str(e)}, to=sid)


# join notification channel
@sio.event
async def join_notification_room(sid, data):
    print(f"🔗 join_notification_room called with data: {data}")
    print(f"🔗 Session ID: {sid}")
    
    try:
        user_id = data.get("user_id")
        print(f"👤 Extracted user_id: {user_id}")
        
        if user_id:
            room = f"user_{user_id}"
            await sio.enter_room(sid, room)
            print(f"✅ Notification Connected: {sid} joined {room}")
            
            # Verify the client actually joined the room
            room_clients = sio.manager.get_participants(sio.namespace, room)
            print(f"👥 Total clients now in room '{room}': {len(room_clients) if room_clients else 0}")
            
            # Send confirmation to client
            await sio.emit(
                "notification_room_joined",
                {"success": True, "room": room, "user_id": user_id},
                to=sid
            )
            
            print(f"✅ Client {sid} successfully joined notification room for user {user_id}")
            
        else:
            print("❌ No user_id provided in join_notification_room")
            await sio.emit(
                "notification_error",
                {"error": "user_id is required to join notification room"},
                to=sid
            )
            
    except Exception as e:
        print(f"❌ Error in join_notification_room: {e}")
        logger.error(f"Error in join_notification_room: {e}", exc_info=True)
        await sio.emit("notification_error", {"error": str(e)}, to=sid)


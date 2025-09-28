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


try:
    print(f"📨 Attempting to send real-time notification to teacher {session_option.teacher.user.id}")
    
    # Method 1: Try async_to_sync approach
    try:
        from asgiref.sync import async_to_sync
        
        async def send_notification():
            print(f"🔔 Emitting send_notification event for user {session_option.teacher.user.id}")
            await sio.emit("send_notification", {
                "user_id": str(session_option.teacher.user.id),
                "header": header,
                "detail": detail,
                "onclick_location": onclick_location
            })
            print(f"✅ send_notification event emitted successfully")
        
        sync_send = async_to_sync(send_notification)
        sync_send()
        print(f"✅ Real-time notification sent to teacher {session_option.teacher.user.id}")
        
    except Exception as async_error:
        print(f"❌ Method 1 (async_to_sync) failed: {async_error}")
        
        # Method 2: Try direct room emission as fallback
        try:
            async def direct_emit():
                room = f"user_{session_option.teacher.user.id}"
                print(f"📡 Attempting direct emit to room: {room}")
                
                notification_data = {
                    "id": str(notification.id),
                    "header": header,
                    "detail": detail,
                    "onclick_location": onclick_location,
                    "created_at": notification.created_at.isoformat(),
                    "is_read": False,
                }
                
                await sio.emit("receive_notification", notification_data, room=room)
                print(f"✅ Direct notification emitted to room: {room}")
            
            sync_direct = async_to_sync(direct_emit)
            sync_direct()
            print(f"✅ Fallback direct emission successful")
            
        except Exception as direct_error:
            print(f"❌ Method 2 (direct emit) failed: {direct_error}")
            
            # Method 3: Try threading approach as last resort
            try:
                import threading
                import asyncio
                
                def run_in_thread():
                    try:
                        print(f"🧵 Running notification in separate thread")
                        
                        # Create new event loop for this thread
                        loop = asyncio.new_event_loop()
                        asyncio.set_event_loop(loop)
                        
                        async def thread_emit():
                            room = f"user_{session_option.teacher.user.id}"
                            await sio.emit("receive_notification", {
                                "id": str(notification.id),
                                "header": header,
                                "detail": detail,
                                "onclick_location": onclick_location,
                                "created_at": notification.created_at.isoformat(),
                                "is_read": False,
                            }, room=room)
                            print(f"✅ Thread emission successful to room: {room}")
                        
                        loop.run_until_complete(thread_emit())
                        loop.close()
                        
                    except Exception as thread_error:
                        print(f"❌ Thread execution failed: {thread_error}")
                
                # Start thread with daemon=True so it doesn't block app shutdown
                notification_thread = threading.Thread(target=run_in_thread, daemon=True)
                notification_thread.start()
                print(f"🧵 Thread started for notification")
                
            except Exception as thread_error:
                print(f"❌ Method 3 (threading) failed: {thread_error}")
                print(f"❌ All notification methods failed - notification saved in DB only")

        except Exception as e:
            print(f"❌ Failed to send real-time notification: {e}")
            import traceback
            traceback.print_exc()
            print(f"📝 Notification is still saved in database even if Socket.IO fails")

        # Add this debug information
        print(f"🔍 DEBUG INFO:")
        print(f"   - Teacher ID: {session_option.teacher.user.id}")
        print(f"   - Expected room: user_{session_option.teacher.user.id}")
        print(f"   - Notification ID: {notification.id}")
        print(f"   - Socket.IO instance available: {sio is not None}")

        # Optional: Add a simple verification check
        try:
            if hasattr(sio, 'manager'):
                room_name = f"user_{session_option.teacher.user.id}"
                try:
                    participants = sio.manager.get_participants('/', room_name)
                    print(f"🔍 Current participants in {room_name}: {len(participants) if participants else 0}")
                except Exception as check_error:
                    print(f"⚠️ Could not check room participants: {check_error}")
            else:
                print(f"⚠️ Socket.IO manager not available")
        except Exception as verify_error:
            print(f"⚠️ Verification check failed: {verify_error}")

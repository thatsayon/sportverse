# chat/socket.py
import socketio
import logging
from asgiref.sync import sync_to_async
from django.db import transaction
from .models import Message

# Set up logging
logger = logging.getLogger(__name__)

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)

@sio.event
async def connect(sid, environ, auth):
    print(f"✅ Client connected: {sid}")
    logger.info(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"❌ Client disconnected: {sid}")
    logger.info(f"Client disconnected: {sid}")

@sio.event
async def join_room(sid, data):
    await sio.enter_room(sid, data["room"])
    print(f"{sid} joined room {data['room']}")
    logger.info(f"{sid} joined room {data['room']}")

@sio.event
async def send_message(sid, data):
    try:
        sender_id = data.get("sender_id")
        recipient_id = data.get("recipient_id")
        text = data.get("text")
        room = data.get("room")
        
        print(f"📨 Received message data: {data}")
        logger.info(f"Received message data: {data}")
        
        # Validate required fields
        if not sender_id:
            print("❌ Missing sender_id")
            logger.error("Missing sender_id")
            return
            
        if not recipient_id:
            print("❌ Missing recipient_id") 
            logger.error("Missing recipient_id")
            return
            
        if not text or not text.strip():
            print("❌ Missing or empty text")
            logger.error("Missing or empty text")
            return
        
        print(f"✅ All validation passed. Creating message...")
        
        # Create message with transaction and better error handling
        @sync_to_async
        def create_message():
            with transaction.atomic():
                message = Message.objects.create(
                    sender_id=sender_id,
                    recipient_id=recipient_id,
                    content=text.strip(),
                    delivered=True
                )
                print(f"💾 Message created with ID: {message.id}")
                logger.info(f"Message created with ID: {message.id}")
                return message
        
        message = await create_message()
        
        # Prepare response data
        msg_data = {
            "id": str(message.id),
            "sender": sender_id,
            "recipient": recipient_id,
            "text": message.content,
            "created_at": message.created_at.isoformat(),
        }
        
        print(f"📤 Emitting message to room {room}: {msg_data}")
        logger.info(f"Emitting message to room {room}")
        
        # Emit to room
        await sio.emit("receive_message", msg_data, room=room)
        
        print("✅ Message sent successfully")
        
    except Exception as e:
        print(f"❌ Error in send_message: {str(e)}")
        logger.error(f"Error in send_message: {str(e)}", exc_info=True)
        
        # Optionally emit error back to client
        await sio.emit("message_error", {
            "error": "Failed to send message",
            "details": str(e)
        }, to=sid)

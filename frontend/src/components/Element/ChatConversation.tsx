"use client"
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  senderName: string;
}

interface ChatDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  otherUserName?: string;
  currentUserName?: string;
}

// Dummy chat data
const dummyMessages: Message[] = [
  {
    id: '1',
    text: 'Hey! Are you available for a training session this week?',
    sender: 'other',
    timestamp: new Date(Date.now() - 300000),
    senderName: 'John Trainer'
  },
  {
    id: '2',
    text: 'Hi John! Yes, I\'m looking to schedule something. What times work best for you?',
    sender: 'user',
    timestamp: new Date(Date.now() - 280000),
    senderName: 'You'
  },
  {
    id: '3',
    text: 'I have availability on Tuesday at 3 PM or Wednesday at 10 AM. Both sessions would be 1 hour long.',
    sender: 'other',
    timestamp: new Date(Date.now() - 260000),
    senderName: 'John Trainer'
  },
  {
    id: '4',
    text: 'Wednesday at 10 AM sounds perfect! Should I book it through the app?',
    sender: 'user',
    timestamp: new Date(Date.now() - 240000),
    senderName: 'You'
  },
  {
    id: '5',
    text: 'Yes, please go ahead and book it. I\'ll send you the gym location details once it\'s confirmed.',
    sender: 'other',
    timestamp: new Date(Date.now() - 220000),
    senderName: 'John Trainer'
  },
  {
    id: '6',
    text: 'Great! Just booked it. Looking forward to the session 💪',
    sender: 'user',
    timestamp: new Date(Date.now() - 200000),
    senderName: 'You'
  },
  {
    id: '7',
    text: 'Awesome! Make sure to bring a water bottle and wear comfortable workout clothes. See you Wednesday!',
    sender: 'other',
    timestamp: new Date(Date.now() - 180000),
    senderName: 'John Trainer'
  },
  {
    id: '8',
    text: 'Will do! Quick question - should I arrive 10 minutes early?',
    sender: 'user',
    timestamp: new Date(Date.now() - 120000),
    senderName: 'You'
  },
  {
    id: '9',
    text: 'Yes, that would be perfect. It gives us time for a quick warm-up assessment.',
    sender: 'other',
    timestamp: new Date(Date.now() - 60000),
    senderName: 'John Trainer'
  }
];

const ChatConversation: React.FC<ChatDialogProps> = ({
  open,
  setOpen,
  otherUserName = "John Trainer",
  currentUserName = "You"
}) => {
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Improved scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  // Auto scroll to bottom when messages change or dialog opens
  useEffect(() => {
    if (open) {
      // Use multiple timeouts to ensure scroll happens after all animations
      const timeouts = [100, 300, 500];
      timeouts.forEach(delay => {
        setTimeout(scrollToBottom, delay);
      });
    }
  }, [messages, open]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [open]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      senderName: currentUserName
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate other user typing and responding (for demo purposes)
    setTimeout(() => {
      const responses = [
        "Got it! Thanks for letting me know.",
        "Sounds good to me!",
        "Perfect! I'll make a note of that.",
        "Understood. Looking forward to it!",
        "Great! Let me know if you have any other questions.",
        "That works perfectly for me!",
        "I'll prepare everything accordingly.",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'other',
        timestamp: new Date(),
        senderName: otherUserName
      };

      setMessages(prev => [...prev, responseMessage]);
    }, 1500 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full h-[600px] max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Custom Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#8a3618] text-white p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="w-5 h-5" />
            </motion.div>
            <div>
              <h2 className="font-semibold text-white">{otherUserName}</h2>
              <p className="text-xs text-white/80">Online</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Messages Area */}
        <motion.div 
          className="flex-1 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="h-full overflow-y-auto">
            <div className="p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.8 }}
                    transition={{ 
                      duration: 0.3,
                      delay: open ? index * 0.05 : 0,
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      {/* Message Bubble */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`px-4 py-3 rounded-2xl shadow-sm ${
                          message.sender === 'user'
                            ? 'bg-[#F15A24] text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md border border-gray-200'
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words">{message.text}</p>
                      </motion.div>
                      
                      {/* Timestamp */}
                      <div className={`mt-1 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </motion.div>

        {/* Input Area */}
        <motion.div 
          className="border-t border-gray-200 p-4 bg-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex gap-3">
            <input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 focus:border-[#F15A24] focus:ring-1 focus:ring-[#F15A24] focus:outline-none rounded-full px-4 py-2"
              maxLength={500}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-[#F15A24] hover:bg-[#F15A24]/90 text-white rounded-full w-10 h-10 p-0 disabled:opacity-50 flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
          
          {/* Character Counter */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">
              Press Enter to send
            </span>
            <span className="text-xs text-gray-400">
              {newMessage.length}/500
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChatConversation;
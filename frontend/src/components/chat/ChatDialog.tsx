"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageCircle, User, Loader2, Paperclip, Smile } from "lucide-react";
import { chatService, Message, Conversation } from "@/services/chatService";
import { useAppSelector } from "@/store/hooks";
import { formatTime } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

interface ChatDialogProps {
  participantId: string;
  participantName: string;
  isOpen: boolean;
  onClose: () => void;
}

const ChatDialog: React.FC<ChatDialogProps> = ({
  participantId,
  participantName,
  isOpen,
  onClose,
}) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Socket Connection
  useEffect(() => {
    if (isAuthenticated) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        chatService.init(token);
      }
    }
  }, [isAuthenticated]);

  // Handle Conversation Setup
  useEffect(() => {
    if (isOpen && participantId) {
      setIsLoading(true);
      chatService.createOrGetConversation(participantId);
    }
  }, [isOpen, participantId]);

  // Listen for Chat Events
  useEffect(() => {
    const unsubConversation = chatService.onConversationCreated((data) => {
      setConversation(data.conversation);
      chatService.joinConversation(data.conversation.id);
      chatService.fetchMessages(data.conversation.id);
    });

    const unsubMessages = chatService.onMessagesLoaded((data) => {
      setMessages(data.messages);
      setIsLoading(false);
    });

    const unsubNewMessage = chatService.onNewMessage((data) => {
      if (conversation && data.conversationId === conversation.id) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    const unsubTyping = chatService.onTypingStatus((data) => {
      if (data.userId !== user?.id) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      unsubConversation();
      unsubMessages();
      unsubNewMessage();
      unsubTyping();
    };
  }, [conversation, user?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !conversation) return;
    chatService.sendMessage(conversation.id, inputValue.trim());
    setInputValue("");
    chatService.sendTypingStatus(conversation.id, false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (conversation) {
      chatService.sendTypingStatus(conversation.id, e.target.value.length > 0);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed bottom-6 right-6 z-[60] w-[400px] max-w-[90vw] h-[600px] flex flex-col bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white ring-2 ring-white/10">
            <User size={20} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm leading-none">{participantName}</h3>
            <span className="text-[10px] text-white/50 flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4"
      >
        {isLoading ? (
          <div className="h-full flex items-center justify-center flex-col gap-2">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-white/40 text-xs font-medium">Initializing secure chat...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="p-4 rounded-full bg-white/5 text-white/20">
              <MessageCircle size={40} />
            </div>
            <div>
              <p className="text-white/60 font-medium">Start the conversation</p>
              <p className="text-white/40 text-sm mt-1">Ask questions or discuss your trip plans with {participantName}.</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender.id === user?.id;
            return (
              <motion.div
                initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-[85%]",
                  isMe ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <div
                  className={cn(
                    "px-4 py-2.5 rounded-2xl text-sm break-words",
                    isMe
                      ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20"
                      : "bg-white/10 text-white rounded-tl-none border border-white/10"
                  )}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-white/40 mt-1 px-1">
                  {formatTime(msg.createdAt)}
                </span>
              </motion.div>
            );
          })
        )}
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 px-1 py-1"
          >
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center gap-2"
        >
          <div className="absolute left-3 flex items-center gap-1.5 text-white/40">
            <button type="button" className="hover:text-white transition-colors">
              <Paperclip size={18} />
            </button>
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="w-full bg-white/10 border border-white/10 rounded-2xl py-3 pl-12 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <div className="absolute right-3 flex items-center gap-1.5">
            <button type="button" className="text-white/40 hover:text-white transition-colors hidden sm:block">
              <Smile size={18} />
            </button>
            <button
              disabled={!inputValue.trim()}
              className="p-1.5 bg-primary rounded-xl text-white disabled:opacity-50 disabled:grayscale transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ChatDialog;

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Search, 
  MessageCircle, 
  User, 
  Clock,
  CheckCheck,
  Send,
  Plus,
  X,
  Loader2,
  Calendar,
  MapPin,
  ChevronLeft
} from "lucide-react";
import { chatService, Message, Conversation } from "@/services/chatService";
import { bookingService } from "@/services/bookingService";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils/cn";
import { useRouter, useSearchParams } from "next/navigation";
import { formatTime, formatChatTime } from "@/lib/utils/formatters";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  // Tick every 60s so formatDistanceToNow stays fresh
  const [, setMinuteTick] = useState(0);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const selectedConversationIdRef = useRef<string | null>(null);

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversation?.id || null;
  }, [selectedConversation]);

  // Re-render timestamps every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => setMinuteTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  // New Chat Modal State
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [isBookingsLoading, setIsBookingsLoading] = useState(false);

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorId = searchParams.get('vendorId');
  const customerId = searchParams.get('customerId');

  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isAtBottomRef.current = distFromBottom < 80;
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    const container = messagesContainerRef.current;
    if (!container) return;
    if (force || isAtBottomRef.current) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!isAuthenticated || typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push("/login?from=/messages");
      return;
    }

    chatService.init(token);
    chatService.fetchConversations();

    const unsubConvs = chatService.onConversationsLoaded((data) => {
      setConversations(data.conversations);
      setIsLoading(false);

      if (vendorId && data.conversations) {
        const existingConv = data.conversations.find((c: Conversation) =>
          c.participants.some(p => p.id === vendorId)
        );
        if (existingConv) {
          handleSelectConversation(existingConv);
        } else {
          chatService.createOrGetConversation(vendorId);
        }
      }

      if (customerId && data.conversations) {
        const existingConv = data.conversations.find((c: Conversation) =>
          c.participants.some(p => p.id === customerId)
        );
        if (existingConv) {
          handleSelectConversation(existingConv);
        } else {
          chatService.createOrGetConversationForCustomer(customerId);
        }
      }
    });

    const unsubConvCreated = chatService.onConversationCreated((data) => {
      setConversations((prev) => [data.conversation, ...prev.filter(c => c.id !== data.conversation.id)]);
      handleSelectConversation(data.conversation);
    });

    const unsubMessages = chatService.onMessagesLoaded((data) => {
      setMessages(data.messages);
      setTimeout(() => {
        const container = messagesContainerRef.current;
        if (container) container.scrollTop = container.scrollHeight;
      }, 50);
    });

    const unsubNewMessage = chatService.onNewMessage((data) => {
      const currentConvId = selectedConversationIdRef.current;
      if (currentConvId && data.conversationId === currentConvId) {
        setMessages((prev) => [...prev, data.message]);
        chatService.markAsRead(data.conversationId, [data.message.id]);
      }
      
      setConversations((prev) => {
        const next = prev.map((c) => {
          if (c.id === data.conversationId) {
            const isCurrentActive = currentConvId === data.conversationId;
            const updatedMessage = { ...data.message, isRead: isCurrentActive };
            return { ...c, lastMessage: updatedMessage, lastMessageAt: data.message.createdAt };
          }
          return c;
        });
        return next.sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime());
      });

      chatService.fetchConversations();
    });

    const timeout = setTimeout(() => setIsLoading(false), 3000);

    return () => {
      unsubConvs();
      unsubConvCreated();
      unsubMessages();
      unsubNewMessage();
      clearTimeout(timeout);
      chatService.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id, router, vendorId, customerId]);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setMessages([]);
    chatService.joinConversation(conv.id);
    chatService.fetchMessages(conv.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedConversation || isSending) return;

    const content = inputValue.trim();
    setInputValue("");
    setIsSending(true);

    const optimisticMessage: Message = {
      id: `optimistic-${Date.now()}`,
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
      sender: { id: user?.id || "", name: user?.name },
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    
    setConversations((prev) => {
      const next = prev.map((c) => {
        if (c.id === selectedConversation.id) {
          return { ...c, lastMessage: optimisticMessage, lastMessageAt: optimisticMessage.createdAt };
        }
        return c;
      });
      return next.sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime());
    });

    isAtBottomRef.current = true;
    scrollToBottom(true);

    try {
      const sent = await chatService.sendMessage(selectedConversation.id, content);
      if (sent) {
        setMessages((prev) =>
          prev.map((m) => m.id === optimisticMessage.id ? sent : m)
        );
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
    } finally {
      setIsSending(false);
      chatService.fetchConversations();
    }
  };

  const openNewChatModal = async () => {
    setIsNewChatModalOpen(true);
    setIsBookingsLoading(true);
    try {
      const res = await bookingService.getMyBookings();
      setMyBookings(res.data?.bookings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsBookingsLoading(false);
    }
  };

  const startChatWithVendor = (vendorId: string) => {
    setIsNewChatModalOpen(false);
    chatService.createOrGetConversation(vendorId);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p =>
      p.id !== user?.id && p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      {/* 
        On mobile with a conversation open: full-screen fixed layout — header hidden, input always visible.
        On mobile without conversation open: normal scrollable page.
        On desktop: always normal layout with internal scroll.
      */}

      {/* MOBILE: Chat view — full screen fixed */}
      {selectedConversation && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col bg-white" style={{ top: '64px' }}>
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white shrink-0">
            <button
              onClick={() => setSelectedConversation(null)}
              className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 text-base font-black shrink-0">
              {selectedConversation.participants.find(p => p.id !== user?.id)?.name?.charAt(0) || "?"}
            </div>
            <div className="min-w-0">
              <h2 className="text-gray-900 font-black text-sm leading-tight truncate">
                {selectedConversation.participants.find(p => p.id !== user?.id)?.name || "Vendor"}
              </h2>
              <p className="text-gray-400 text-[10px] mt-0.5 font-medium">TripDekho Partner</p>
            </div>
          </div>

          {/* Messages — scrollable middle */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 bg-amber-50/20"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
                <MessageCircle size={36} className="text-amber-300" />
                <p className="text-sm font-bold text-gray-400">No messages yet. Say hi!</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.sender.id === user?.id;
                const isOptimistic = msg.id.startsWith("optimistic-");
                const showDate = i === 0 ||
                  new Date(messages[i - 1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString();

                return (
                  <React.Fragment key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-black bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">
                          {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                    <div className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[75%] flex gap-2", isMe && "flex-row-reverse")}>
                        {!isMe && (
                          <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-200 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-amber-700 mt-auto">
                            {msg.sender?.name?.charAt(0) || '?'}
                          </div>
                        )}
                        <div className="space-y-1">
                          <div className={cn(
                            "px-4 py-2.5 text-sm leading-relaxed font-medium",
                            isMe
                              ? `bg-amber-400 text-black rounded-[18px] rounded-br-[4px] shadow-md shadow-amber-200/40 ${isOptimistic ? "opacity-70" : ""}`
                              : "bg-white text-gray-800 border border-gray-100 rounded-[18px] rounded-bl-[4px] shadow-sm"
                          )}>
                            {msg.content}
                          </div>
                          <div className={cn("flex items-center gap-1 text-[10px] text-gray-400 font-bold", isMe && "justify-end")}>
                            {isOptimistic ? (
                              <span className="text-gray-300">Sending...</span>
                            ) : (
                              <>
                                {formatTime(msg.createdAt)}
                                {isMe && <CheckCheck size={12} className="text-amber-500" />}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input — always stuck to bottom */}
          <div className="shrink-0 border-t border-gray-100 bg-white px-3 py-3" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Message..."
                className="flex-1 min-w-0 bg-gray-50 border border-gray-100 rounded-full py-3 px-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300 transition-all font-medium placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isSending}
                className="w-12 h-12 shrink-0 bg-amber-400 hover:bg-black text-black hover:text-white rounded-full font-black transition-all active:scale-95 disabled:opacity-40 disabled:grayscale flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT — desktop + mobile conversation list */}
      <div className={cn(
        "bg-gradient-to-br from-amber-50/10 via-stone-50/50 to-zinc-100/30",
        // On mobile when chat is open, hide this layout (replaced by fixed overlay above)
        selectedConversation ? "hidden md:block" : "block"
      )}>
        <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
          {/* Page Header */}
          <div className="mb-4 md:mb-8">
            <p className="text-amber-600 font-black uppercase tracking-[0.3em] text-[10px] mb-1 md:mb-2 font-mono">Inbox</p>
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase relative select-none">
              <span className="font-caveat font-normal capitalize text-amber-500 tracking-normal block text-3xl md:text-5xl -mb-2 md:-mb-5 pl-1 rotate-[-2deg]">My</span>
              <span className="font-marker font-normal tracking-wide text-gray-900 text-4xl md:text-7xl">INBOX</span>
            </h1>
          </div>

          {/* Desktop Chat Container — side by side */}
          <div className="hidden md:flex gap-6 h-[calc(100vh-260px)] min-h-[520px]">
            {/* Sidebar */}
            <div className="w-[340px] flex flex-col bg-white border border-amber-100/60 rounded-[28px] overflow-hidden shadow-xl shadow-gray-100/40 flex-shrink-0">
              <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-9 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300 transition-all font-medium placeholder:text-gray-400"
                  />
                </div>
                <button
                  onClick={openNewChatModal}
                  className="w-11 h-11 bg-amber-400 text-black flex items-center justify-center rounded-2xl hover:bg-black hover:text-white transition-colors shrink-0 shadow-lg shadow-amber-200/50"
                  title="Start a new chat from your bookings"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3 p-4 rounded-2xl bg-gray-50">
                      <div className="w-11 h-11 rounded-full bg-gray-200 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-gray-200 rounded w-1/2" />
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                      </div>
                    </div>
                  ))
                ) : filteredConversations.length === 0 ? (
                  <div className="p-10 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto border border-amber-100">
                      <MessageCircle size={24} className="text-amber-400" />
                    </div>
                    <p className="text-sm font-bold text-gray-400">No conversations yet.</p>
                    <p className="text-xs text-gray-300 font-medium">Start a conversation from a trip page or click + above.</p>
                  </div>
                ) : (
                  <LayoutGroup>
                  {filteredConversations.map((conv) => {
                    const otherParticipant = conv.participants.find(p => p.id !== user?.id);
                    const isActive = selectedConversation?.id === conv.id;
                    const hasUnread = (conv as any).unreadCount > 0 || (conv.lastMessage && !conv.lastMessage.isRead && conv.lastMessage.sender.id !== user?.id);

                    return (
                      <motion.button
                        key={conv.id}
                        layout
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => handleSelectConversation(conv)}
                        className={cn(
                          "w-full flex items-center gap-3 p-4 rounded-2xl transition-colors duration-200 text-left",
                          isActive ? "bg-amber-400 shadow-lg shadow-amber-200/40" : "hover:bg-amber-50 text-gray-700"
                        )}
                      >
                        <div className={cn("w-11 h-11 rounded-full flex items-center justify-center text-base font-black border flex-shrink-0", isActive ? "bg-black/10 border-black/10 text-black" : "bg-amber-50 border-amber-100 text-amber-600")}>
                          {otherParticipant?.profilePicture
                            ? <img src={otherParticipant.profilePicture} alt={otherParticipant.name} className="w-full h-full rounded-full object-cover" />
                            : otherParticipant?.name?.charAt(0) || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className={cn("font-black text-sm", isActive ? "text-black" : hasUnread ? "text-black" : "text-gray-800")}>
                              {otherParticipant?.name || "Unknown"}
                            </span>
                            <span className={cn("text-[10px] font-bold flex-shrink-0 ml-1", isActive ? "text-black/60" : hasUnread ? "text-amber-600" : "text-gray-400")}>
                              {conv.lastMessageAt ? formatChatTime(new Date(conv.lastMessageAt)) : ""}
                            </span>
                          </div>
                          <p className={cn("text-xs mt-0.5 line-clamp-1", isActive ? "text-black/70 font-medium" : hasUnread ? "text-gray-900 font-bold" : "text-gray-400 font-medium")}>
                            {conv.lastMessage?.content || "Start a conversation..."}
                          </p>
                        </div>
                        {hasUnread && !isActive && (
                          <div className="w-2.5 h-2.5 bg-amber-500 rounded-full border border-white shrink-0 shadow-sm" />
                        )}
                      </motion.button>
                    );
                  })}
                </LayoutGroup>
                )}
              </div>
            </div>

            {/* Desktop Chat Window */}
            <div className="flex-1 flex flex-col bg-white border border-amber-100/60 rounded-[28px] overflow-hidden shadow-xl shadow-gray-100/40">
              {selectedConversation ? (
                <>
                  <div className="p-5 border-b border-gray-100 flex items-center bg-white shrink-0">
                    <div className="w-11 h-11 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 text-base font-black shrink-0 mr-4">
                      {selectedConversation.participants.find(p => p.id !== user?.id)?.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <h2 className="text-gray-900 font-black text-base leading-tight">
                        {selectedConversation.participants.find(p => p.id !== user?.id)?.name || "Vendor"}
                      </h2>
                      <p className="text-gray-400 text-xs mt-0.5 font-medium">TripDekho Partner</p>
                    </div>
                  </div>

                  <div
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-5 bg-amber-50/20"
                  >
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
                        <MessageCircle size={36} className="text-amber-300" />
                        <p className="text-sm font-bold text-gray-400">No messages yet. Say hi!</p>
                      </div>
                    ) : (
                      <AnimatePresence initial={false}>
                        {messages.map((msg, i) => {
                          const isMe = msg.sender.id === user?.id;
                          const isOptimistic = msg.id.startsWith("optimistic-");
                          const showDate = i === 0 ||
                            new Date(messages[i - 1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString();

                          return (
                            <React.Fragment key={msg.id}>
                              {showDate && (
                                <div className="flex justify-center">
                                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-black bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">
                                    {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                </div>
                              )}
                              <motion.div
                                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className={cn("flex", isMe ? "justify-end" : "justify-start")}
                              >
                                <div className={cn("max-w-[68%] flex gap-2.5", isMe && "flex-row-reverse")}>
                                  {!isMe && (
                                    <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-amber-700 mt-auto">
                                      {msg.sender?.name?.charAt(0) || '?'}
                                    </div>
                                  )}
                                  <div className="space-y-1">
                                    <div className={cn(
                                      "px-4 py-3 text-sm leading-relaxed font-medium",
                                      isMe
                                        ? `bg-amber-400 text-black rounded-[20px] rounded-br-[4px] shadow-md shadow-amber-200/40 ${isOptimistic ? "opacity-70" : ""}`
                                        : "bg-white text-gray-800 border border-gray-100 rounded-[20px] rounded-bl-[4px] shadow-sm"
                                    )}>
                                      {msg.content}
                                    </div>
                                    <div className={cn("flex items-center gap-1.5 text-[10px] text-gray-400 font-bold", isMe && "justify-end")}>
                                      {isOptimistic ? (
                                        <span className="text-gray-300">Sending...</span>
                                      ) : (
                                        <>
                                          {formatTime(msg.createdAt)}
                                          {isMe && <CheckCheck size={12} className="text-amber-500" />}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </React.Fragment>
                          );
                        })}
                      </AnimatePresence>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-5 border-t border-gray-100 bg-white shrink-0">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Message..."
                        className="flex-1 min-w-0 bg-gray-50 border border-gray-100 rounded-2xl py-3 px-5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300 transition-all font-medium placeholder:text-gray-400"
                      />
                      <button
                        type="submit"
                        disabled={!inputValue.trim() || isSending}
                        className="px-6 shrink-0 bg-amber-400 hover:bg-black text-black hover:text-white rounded-2xl font-black transition-all active:scale-95 disabled:opacity-40 disabled:grayscale flex items-center justify-center gap-2 text-sm"
                      >
                        <Send size={16} />
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-6 bg-amber-50/10">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-[32px] bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-400">
                      <MessageCircle size={44} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-black border-4 border-white shadow-md">
                      <Clock size={14} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Your Inbox</h2>
                    <p className="text-sm text-gray-400 font-medium mt-2">Select a conversation or start a new one</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Conversation List (only shown when no chat selected) */}
          <div className="md:hidden">
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-100/40 border border-amber-100/60">
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-9 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300 transition-all font-medium placeholder:text-gray-400"
                  />
                </div>
                <button
                  onClick={openNewChatModal}
                  className="w-11 h-11 bg-amber-400 text-black flex items-center justify-center rounded-2xl hover:bg-black hover:text-white transition-colors shrink-0"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="p-3 space-y-1.5">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3 p-4 rounded-2xl bg-gray-50">
                      <div className="w-11 h-11 rounded-full bg-gray-200 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-gray-200 rounded w-1/2" />
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                      </div>
                    </div>
                  ))
                ) : filteredConversations.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto border border-amber-100">
                      <MessageCircle size={24} className="text-amber-400" />
                    </div>
                    <p className="text-sm font-bold text-gray-400">No conversations yet.</p>
                    <p className="text-xs text-gray-300 font-medium">Start a conversation from a trip page or tap + above.</p>
                  </div>
                ) : (
                  <LayoutGroup>
                    {filteredConversations.map((conv) => {
                      const otherParticipant = conv.participants.find(p => p.id !== user?.id);
                      const hasUnread = (conv as any).unreadCount > 0 || (conv.lastMessage && !conv.lastMessage.isRead && conv.lastMessage.sender.id !== user?.id);

                      return (
                        <motion.button
                          key={conv.id}
                          layout
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          onClick={() => handleSelectConversation(conv)}
                          className="w-full flex items-center gap-3 p-4 rounded-2xl transition-colors duration-200 text-left hover:bg-amber-50 active:bg-amber-100"
                        >
                          <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center text-base font-black flex-shrink-0">
                            {otherParticipant?.profilePicture
                              ? <img src={otherParticipant.profilePicture} alt={otherParticipant.name} className="w-full h-full rounded-full object-cover" />
                              : otherParticipant?.name?.charAt(0) || "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className={cn("font-black text-sm", hasUnread ? "text-black" : "text-gray-800")}>
                                {otherParticipant?.name || "Unknown"}
                              </span>
                              <span className={cn("text-[10px] font-bold flex-shrink-0 ml-1", hasUnread ? "text-amber-600" : "text-gray-400")}>
                                {conv.lastMessageAt ? formatChatTime(new Date(conv.lastMessageAt)) : ""}
                              </span>
                            </div>
                            <p className={cn("text-xs mt-0.5 line-clamp-1", hasUnread ? "text-gray-900 font-bold" : "text-gray-400 font-medium")}>
                              {conv.lastMessage?.content || "Start a conversation..."}
                            </p>
                          </div>
                          {hasUnread && (
                            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full border border-white shrink-0 shadow-sm" />
                          )}
                        </motion.button>
                      );
                    })}
                  </LayoutGroup>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Start New Chat</h3>
                <p className="text-sm font-bold text-gray-400">Select a booking to chat with its vendor</p>
              </div>
              <button
                onClick={() => setIsNewChatModalOpen(false)}
                className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isBookingsLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                  <p className="text-sm font-bold text-gray-400">Loading your bookings...</p>
                </div>
              ) : myBookings.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                    <Calendar className="w-8 h-8 text-gray-300" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-gray-800">No Bookings Found</h4>
                    <p className="text-sm font-medium text-gray-400 mt-1 max-w-[250px] mx-auto">You need an active booking to start a chat with a vendor.</p>
                  </div>
                </div>
              ) : (
                myBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 bg-white border border-gray-100 rounded-2xl hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 transition-all cursor-pointer group"
                    onClick={() => {
                      const vendorObj = booking?.vendor || booking?.trip?.vendor;
                      const targetId = vendorObj?.user?.id || vendorObj?.id || 'unknown';
                      startChatWithVendor(targetId);
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-gray-900 text-sm group-hover:text-amber-600 transition-colors">
                        {booking?.trip?.title || 'Unknown Trip'}
                      </h4>
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-gray-100 text-gray-500 rounded-md">
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <MapPin size={12} className="text-amber-400" />
                        {booking?.trip?.location?.city || booking?.trip?.startLocation || 'Multiple locations'}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <User size={12} className="text-amber-400" />
                        Vendor: <span className="text-gray-800">{(booking?.vendor?.businessName || booking?.trip?.vendor?.businessName) || (booking?.vendor?.user?.name || booking?.trip?.vendor?.user?.name) || 'Partner'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

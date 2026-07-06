"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  MessageCircle,
  CheckCheck,
  Send,
  LayoutDashboard,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { chatService, Message, Conversation } from "@/services/chatService";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils/cn";
import { useRouter, useSearchParams } from "next/navigation";
import { formatTime, formatChatTime } from "@/lib/utils/formatters";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "next/link";

export default function VendorMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  // Mobile: track which panel is visible ("list" | "chat")
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('customerId');

  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isAtBottomRef.current = distFromBottom < 80;
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    if (force || isAtBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (user?.role !== "vendor") {
      router.push("/dashboard");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login?from=/vendor/messages");
      return;
    }

    chatService.init(token);
    chatService.fetchConversations();

    const unsubConvs = chatService.onConversationsLoaded((data) => {
      setConversations(data.conversations);
      setIsLoading(false);

      if (customerId && data.conversations) {
        const existing = data.conversations.find((c: Conversation) =>
          c.participants.some((p) => p.id === customerId)
        );
        if (existing) {
          handleSelectConversation(existing);
        } else {
          chatService.createOrGetConversationForCustomer(customerId);
        }
      }
    });

    const unsubConvCreated = chatService.onConversationCreated((data) => {
      setConversations((prev) => [
        data.conversation,
        ...prev.filter((c) => c.id !== data.conversation.id),
      ]);
      handleSelectConversation(data.conversation);
    });

    const unsubMessages = chatService.onMessagesLoaded((data) => {
      setMessages(data.messages);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "auto" }), 50);
    });

    const unsubNewMessage = chatService.onNewMessage((data) => {
      if (selectedConversation && data.conversationId === selectedConversation.id) {
        setMessages((prev) => [...prev, data.message]);
        chatService.markAsRead(data.conversationId, [data.message.id]);
      }
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
  }, [isAuthenticated, user, router, customerId]);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setMessages([]);
    chatService.joinConversation(conv.id);
    chatService.fetchMessages(conv.id);
    // On mobile: slide to chat panel
    setMobileView("chat");
  };

  const handleBackToList = () => {
    setMobileView("list");
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
    isAtBottomRef.current = true;
    scrollToBottom(true);

    try {
      const sent = await chatService.sendMessage(selectedConversation.id, content);
      if (sent) {
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMessage.id ? sent : m))
        );
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
    } finally {
      setIsSending(false);
      chatService.fetchConversations();
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participants.some(
      (p) =>
        p.id !== user?.id &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── DESKTOP HEADER (hidden on mobile) ── */}
      <div className="hidden md:flex h-16 border-b border-gray-100 items-center justify-between px-8 bg-white shrink-0">
        <div className="flex items-center gap-6">
          <Link
            href="/vendor/dashboard"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-all text-xs font-bold uppercase tracking-widest"
          >
            <LayoutDashboard size={14} />
            Dashboard
          </Link>
          <div className="h-4 w-[1px] bg-gray-200" />
          <h1 className="text-gray-900 font-bold flex items-center gap-2">
            <MessageCircle size={18} className="text-amber-500" />
            Messages
          </h1>
        </div>
        <div className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded-full tracking-wider">
          Vendor Portal
        </div>
      </div>

      {/* ── MOBILE HEADER — changes based on view ── */}
      <div className="md:hidden h-14 border-b border-gray-100 flex items-center px-4 bg-white shrink-0 gap-3">
        {mobileView === "chat" && selectedConversation ? (
          <>
            <button
              onClick={handleBackToList}
              className="p-2 -ml-1 rounded-xl text-gray-600 hover:bg-gray-100 tap-scale transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 text-sm font-black shrink-0">
              {selectedConversation.participants.find((p) => p.id !== user?.id)?.name?.charAt(0) || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900 leading-none truncate">
                {selectedConversation.participants.find((p) => p.id !== user?.id)?.name || "Customer"}
              </p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">TripDekho Customer</p>
            </div>
            {selectedConversation.trip && (
              <Link
                href={`/vendor/trips/${selectedConversation.trip.id}/edit`}
                className="shrink-0 bg-amber-50 border border-amber-100 rounded-xl px-2 py-1 max-w-[110px]"
              >
                <span className="text-[8px] font-black uppercase text-amber-500 block leading-none">Trip</span>
                <span className="text-[10px] font-bold text-gray-700 block truncate leading-tight">
                  {selectedConversation.trip.title}
                </span>
              </Link>
            )}
          </>
        ) : (
          <>
            <Link href="/vendor/dashboard" className="p-2 -ml-1 text-gray-500 tap-scale">
              <LayoutDashboard size={18} />
            </Link>
            <h1 className="font-black text-gray-900 flex items-center gap-1.5 flex-1">
              <MessageCircle size={16} className="text-amber-500" />
              Messages
            </h1>
            <div className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded-full tracking-wider">
              Vendor
            </div>
          </>
        )}
      </div>

      {/* ── BODY ── */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 3.5rem)' }}>

        {/* ── CONVERSATION LIST ── */}
        {/* On desktop: always visible. On mobile: visible only when mobileView === "list" */}
        <div className={cn(
          "bg-white flex flex-col flex-shrink-0 border-r border-gray-100",
          // Desktop: fixed width sidebar
          "md:w-[360px]",
          // Mobile: full width, conditionally hidden
          mobileView === "list" ? "flex w-full" : "hidden md:flex"
        )}>
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-9 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300 transition-all font-medium placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1 momentum-scroll">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-3 p-4 rounded-2xl bg-gray-50">
                  <div className="w-11 h-11 rounded-full bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-2.5 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              ))
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center p-6 gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
                  <MessageCircle size={22} className="text-amber-400" />
                </div>
                <p className="text-sm font-bold text-gray-400">No customer inquiries yet</p>
              </div>
            ) : (
              <LayoutGroup>
                {filteredConversations.map((conv) => {
                  const other = conv.participants.find((p) => p.id !== user?.id);
                  const isActive = selectedConversation?.id === conv.id;
                  const hasUnread = conv.lastMessage && !conv.lastMessage.isRead && conv.lastMessage.sender.id !== user?.id;
                  return (
                    <motion.button
                      key={conv.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => handleSelectConversation(conv)}
                      className={cn(
                        "w-full flex items-center gap-3 p-4 rounded-2xl transition-colors duration-200 text-left tap-scale",
                        isActive
                          ? "bg-amber-400 shadow-lg shadow-amber-200/40"
                          : "hover:bg-amber-50 text-gray-700 active:bg-amber-50"
                      )}
                    >
                      <div className={cn(
                        "w-11 h-11 rounded-full flex items-center justify-center text-base font-black border flex-shrink-0",
                        isActive ? "bg-black/10 border-black/10 text-black" : "bg-amber-50 border-amber-100 text-amber-600"
                      )}>
                        {other?.name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className={cn("font-black text-sm", isActive ? "text-black" : "text-gray-800")}>
                            {other?.name || "Customer"}
                          </span>
                          <span className={cn("text-[10px] font-bold flex-shrink-0 ml-1", isActive ? "text-black/60" : "text-gray-400")}>
                            {conv.lastMessageAt ? formatChatTime(new Date(conv.lastMessageAt)) : ""}
                          </span>
                        </div>
                        {conv.trip && (
                          <p className={cn("text-[10px] font-bold line-clamp-1 mt-0.5", isActive ? "text-amber-900" : "text-amber-600")}>
                            Trip: {conv.trip.title}
                          </p>
                        )}
                        <p className={cn("text-xs mt-0.5 line-clamp-1 font-medium", isActive ? "text-black/70" : "text-gray-400")}>
                          {conv.lastMessage?.content || "Tap to chat"}
                        </p>
                      </div>
                      {hasUnread && !isActive && (
                        <div className="w-2.5 h-2.5 bg-amber-500 rounded-full shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </LayoutGroup>
            )}
          </div>
        </div>

        {/* ── CHAT WINDOW ── */}
        {/* On desktop: always visible right panel. On mobile: full-screen when mobileView === "chat" */}
        <div className={cn(
          "flex-1 flex flex-col bg-white",
          mobileView === "chat" ? "flex w-full" : "hidden md:flex"
        )}>
          {selectedConversation ? (
            <>
              {/* Desktop Chat Header */}
              <div className="hidden md:flex p-4 md:p-5 border-b border-gray-100 flex-wrap gap-4 items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 text-base font-black">
                    {selectedConversation.participants.find((p) => p.id !== user?.id)?.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <h2 className="text-gray-900 font-black text-base leading-none">
                      {selectedConversation.participants.find((p) => p.id !== user?.id)?.name || "Customer"}
                    </h2>
                    <p className="text-gray-400 text-xs mt-1 font-medium">TripDekho Customer</p>
                  </div>
                </div>
                {selectedConversation.trip && (
                  <Link
                    href={`/vendor/trips/${selectedConversation.trip.id}/edit`}
                    className="flex flex-col items-start md:items-end gap-1 hover:opacity-80 transition-opacity bg-amber-50/50 px-4 py-2.5 rounded-2xl border border-amber-100/50 max-w-full md:max-w-[250px]"
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">Inquiring About Trip</span>
                    <span className="text-xs font-bold text-gray-800 line-clamp-1 md:text-right">
                      {selectedConversation.trip.title}
                    </span>
                  </Link>
                )}
              </div>

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto overscroll-contain p-4 md:p-6 space-y-4 md:space-y-5 bg-gray-50/30 momentum-scroll"
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-3 opacity-60">
                    <MessageCircle size={36} className="text-amber-300" />
                    <p className="text-sm font-bold text-gray-400">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {messages.map((msg, i) => {
                      const isMe = msg.sender.id === user?.id;
                      const isOptimistic = msg.id.startsWith("optimistic-");
                      const showDate =
                        i === 0 ||
                        new Date(messages[i - 1].createdAt).toDateString() !==
                          new Date(msg.createdAt).toDateString();

                      return (
                        <React.Fragment key={msg.id}>
                          {showDate && (
                            <div className="flex justify-center">
                              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-black bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">
                                {new Date(msg.createdAt).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          )}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className={cn("flex", isMe ? "justify-end" : "justify-start")}
                          >
                            <div className={cn("max-w-[75%] md:max-w-[65%] flex gap-2.5", isMe && "flex-row-reverse")}>
                              {!isMe && (
                                <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-amber-700 mt-auto">
                                  {msg.sender?.name?.charAt(0) || "?"}
                                </div>
                              )}
                              <div className="space-y-1">
                                <div
                                  className={cn(
                                    "px-4 py-3 text-sm leading-relaxed font-medium",
                                    isMe
                                      ? `bg-amber-400 text-black rounded-[20px] rounded-br-[4px] shadow-md shadow-amber-200/40 ${isOptimistic ? "opacity-70" : ""}`
                                      : "bg-white text-gray-800 border border-gray-100 rounded-[20px] rounded-bl-[4px] shadow-sm"
                                  )}
                                >
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

              {/* Input */}
              <div className="p-4 md:p-5 border-t border-gray-100 bg-white shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Reply to customer..."
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl py-3 md:py-3.5 px-4 md:px-5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300 transition-all font-medium placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isSending}
                    className="px-4 md:px-6 bg-amber-400 hover:bg-black text-black hover:text-white rounded-2xl font-black transition-all active:scale-95 disabled:opacity-40 disabled:grayscale flex items-center gap-2 text-sm tap-scale"
                  >
                    {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-[28px] md:rounded-[32px] bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-300">
                <MessageCircle size={40} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">Customer Messages</h2>
                <p className="text-sm text-gray-400 font-medium mt-2">Select a conversation from the left to respond</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

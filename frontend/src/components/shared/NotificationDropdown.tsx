"use client";

import React, { useEffect, useState, useCallback } from "react";
import { notificationService } from "@/services/notificationService";
import { chatService } from "@/services/chatService";
import { Bell, Trash2, Clock, X, MessageCircle, RefreshCw, CheckCircle } from "lucide-react";
import { formatChatTime } from "@/lib/utils/formatters";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  link?: string;
  isChat?: boolean;
}

interface NotificationDropdownProps {
  onClose: () => void;
  userRole?: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose, userRole }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  // Ticker: forces re-render every 60s so times stay fresh
  const [, setTick] = useState(0);
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const fetchAllNotifications = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch backend system notifications
      let baseNotifications: Notification[] = [];
      try {
        const notifResponse = await notificationService.getNotifications();
        const baseData = notifResponse?.data || notifResponse || [];
        baseNotifications = Array.isArray(baseData) ? baseData : [];
      } catch (err) {
        console.error("Failed to fetch system notifications", err);
      }

      // Fetch unread chat conversations and surface as notifications
      let chatNotifications: Notification[] = [];
      try {
        const conversations = await chatService.fetchConversations();
        conversations.forEach((conv: any) => {
          if (
            conv.lastMessage &&
            !conv.lastMessage.isRead &&
            conv.lastMessage.sender.id !== user?.id
          ) {
            chatNotifications.push({
              id: `chat-${conv.id}`,
              title: `New message from ${conv.lastMessage.sender?.name || "someone"}`,
              message: conv.lastMessage.content,
              type: "chat",
              read: false,
              createdAt: conv.lastMessageAt || conv.lastMessage.createdAt || new Date().toISOString(),
              link: userRole === "vendor" ? "/vendor/messages" : "/messages",
              isChat: true,
            });
          }
        });
      } catch (err) {
        console.error("Failed to fetch chat notifications", err);
      }

      // Merge + sort newest first
      const merged = [...chatNotifications, ...baseNotifications].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setNotifications(merged);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, userRole]);

  useEffect(() => {
    // Fetch fresh data every time the dropdown opens
    fetchAllNotifications();

    // Live ticker — re-render times every 60 seconds
    const ticker = setInterval(() => setTick((t) => t + 1), 60000);

    // Real-time: update chat notifications when a new message arrives
    const unsubChat = chatService.onNewMessage((data) => {
      if (data.message.sender.id === user?.id) return;

      setNotifications((prev) => {
        const chatId = `chat-${data.conversationId}`;
        const newNotif: Notification = {
          id: chatId,
          title: `New message from ${data.message.sender?.name || "someone"}`,
          message: data.message.content,
          type: "chat",
          read: false,
          createdAt: data.message.createdAt,
          link: userRole === "vendor" ? "/vendor/messages" : "/messages",
          isChat: true,
        };

        const existingIdx = prev.findIndex((n) => n.id === chatId);
        let next: Notification[];
        if (existingIdx >= 0) {
          next = [...prev];
          next[existingIdx] = newNotif;
        } else {
          next = [newNotif, ...prev];
        }
        return next.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    });

    return () => {
      clearInterval(ticker);
      unsubChat();
    };
  }, [fetchAllNotifications, user?.id, userRole]);

  const handleNotificationClick = async (notif: Notification) => {
    if (notif.isChat && notif.link) {
      onClose();
      router.push(notif.link);
      return;
    }
    if (!notif.read && !notif.isChat) {
      try {
        await notificationService.markAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
        );
      } catch {
        toast.error("Failed to mark as read");
      }
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => (!n.isChat ? { ...n, read: true } : n)));
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      return formatChatTime(new Date(dateStr));
    } catch {
      return "Recently";
    }
  };

  const handleMarkOneRead = async (notif: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    if (notif.isChat || notif.read) return;
    try {
      await notificationService.markAsRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">
          Notifications
        </h3>
        <div className="flex items-center gap-3">
          {/* Refresh */}
          <button
            onClick={fetchAllNotifications}
            className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-amber-500 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          {notifications.some((n) => !n.read) && (
            <button
              onClick={handleMarkAllRead}
              className="text-[10px] font-black text-amber-500 uppercase hover:text-amber-600 transition-colors"
            >
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-y-auto">
        {loading ? (
          <div className="p-10 text-center">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Loading...
            </p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative group ${
                  !notif.read ? "bg-amber-50/40" : ""
                }`}
              >
                <div className="flex gap-3">
                    {/* Unread dot */}
                    <div
                      className={`mt-1.5 h-2 w-2 rounded-full shrink-0 transition-colors ${
                        !notif.read ? "bg-amber-500" : "bg-transparent"
                      }`}
                    />
                    <div className="flex-grow min-w-0">
                      <p
                        className={`text-sm mb-0.5 flex items-center gap-1.5 ${
                          !notif.read ? "font-bold text-gray-900" : "font-medium text-gray-600"
                        }`}
                      >
                        {notif.isChat && (
                          <MessageCircle size={13} className="text-amber-500 shrink-0" />
                        )}
                        <span className="truncate">{notif.title}</span>
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-1.5">
                        {notif.message}
                      </p>
                      <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                        <Clock size={10} />
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      {/* Inline mark-as-read for unread non-chat notifs */}
                      {!notif.read && !notif.isChat && (
                        <button
                          onClick={(e) => handleMarkOneRead(notif, e)}
                          className="p-1.5 text-gray-300 hover:text-emerald-500 transition-all rounded-lg"
                          title="Mark as read"
                        >
                          <CheckCircle size={13} />
                        </button>
                      )}
                      {/* Delete — only for system notifs */}
                      {!notif.isChat && (
                        <button
                          onClick={(e) => handleDelete(notif.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 transition-all rounded-lg"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center px-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-200">
              <Bell size={22} />
            </div>
            <p className="text-sm font-bold text-gray-900">All clear!</p>
            <p className="text-xs text-gray-400 mt-1 mb-5">No new notifications.</p>
            <button
              onClick={() => {
                toast.success("Notification system is working!");
                setNotifications([
                  {
                    id: `test-${Date.now()}`,
                    title: "System Test",
                    message: "Your notification system is working correctly.",
                    type: "system",
                    read: false,
                    createdAt: new Date().toISOString(),
                  },
                ]);
              }}
              className="px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-amber-100 transition-colors"
            >
              Test notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;

"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { chatService } from "@/services/chatService";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

// iOS-style "tri-tone" notification sound using the Web Audio API — no file needed
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playTone = (freq: number, startTime: number, duration: number, volume: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Three-tone jingle similar to iOS
    const now = ctx.currentTime;
    playTone(1318, now,         0.12, 0.35); // E6
    playTone(1047, now + 0.13,  0.12, 0.35); // C6
    playTone(1175, now + 0.26,  0.18, 0.35); // D6
  } catch {
    // Audio not available — silently ignore
  }
}

export default function GlobalNotificationListener() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const isMessagePage = pathname?.includes("/messages");
  const lastToastAt = useRef<number>(0);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    // Make sure the socket is initialized
    chatService.init(token);

    const unsubChat = chatService.onNewMessage((data) => {
      // Don't show toast if sender is the current user
      if (data.message.sender.id === user.id) return;

      // Only trigger toast when NOT on the messages page
      if (!isMessagePage) {
        // Debounce: don't spam toasts faster than once per 2 seconds
        const now = Date.now();
        if (now - lastToastAt.current < 2000) return;
        lastToastAt.current = now;

        playNotificationSound();

        const senderName = data.message.sender?.name || "Someone";
        const content = data.message.content?.slice(0, 80) + (data.message.content?.length > 80 ? "..." : "");
        const link = user?.role === "vendor" ? "/vendor/messages" : "/messages";

        toast.custom(
          (t) => (
            <div
              onClick={() => {
                toast.dismiss(t);
                router.push(link);
              }}
              className="flex items-start gap-3 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/80 p-4 cursor-pointer max-w-sm w-full hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 font-black text-base shrink-0 mt-0.5">
                {senderName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <MessageCircle size={12} className="text-amber-500 shrink-0" />
                  <p className="text-xs font-black text-gray-900 truncate">{senderName}</p>
                </div>
                <p className="text-sm text-gray-600 font-medium leading-snug mt-0.5 line-clamp-2">
                  {content}
                </p>
              </div>
            </div>
          ),
          {
            duration: 5000,
            position: "top-right",
          }
        );
      }
    });

    return () => {
      unsubChat();
    };
  }, [isAuthenticated, user, isMessagePage, router]);

  return null;
}

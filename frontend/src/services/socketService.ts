import { io, Socket } from "socket.io-client";

// Connect through Nginx which proxies /socket.io/ to the backend.
// This avoids direct port 5001 connections which may be blocked.
const getSocketUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Use the same origin (host + port 8080) — Nginx handles /socket.io/ proxy
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
};

class SocketService {
  private socket: Socket | null = null;
  private _connected = false;

  connect(token: string) {
    // Prevent double-connect
    if (this.socket?.connected || this._connected) return;

    try {
      this.socket = io(getSocketUrl(), {
        path: '/socket.io/',
        auth: { token },
        transports: ["polling", "websocket"],
        reconnectionAttempts: 3,
        reconnectionDelay: 5000,
        timeout: 8000,
      });

      this.socket.on("connect", () => {
        this._connected = true;
      });

      this.socket.on("disconnect", () => {
        this._connected = false;
      });

      // Silently ignore connection errors — chat falls back to REST polling
      this.socket.on("connect_error", () => {});
    } catch {}
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this._connected = false;
    }
  }

  get isConnected(): boolean {
    return this._connected;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }

  emit(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }
}

export const socketService = new SocketService();

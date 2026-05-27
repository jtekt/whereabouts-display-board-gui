import { io, Socket } from "socket.io-client";
import { ref, readonly } from "vue";

// Module-level singleton — shared across all useSocket() call sites
let socket: Socket | null = null;
const isConnected = ref(false);

// Holds the last known access token so we can re-authenticate after reconnects
let pendingToken: string | null = null;

export function useSocket() {
  /**
   * Create the socket singleton and wire up all lifecycle events.
   * Safe to call multiple times — only the first call creates the socket.
   */
  function connect(url: string): Socket {
    if (socket) return socket;
    socket = io(url, {
      // Do not auto-connect with credentials; we authenticate manually after
      // the server "connect" event fires so the token is always fresh.
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("[socket.io] Connected");
      // Re-authenticate immediately on every (re)connect if we have a token.
      if (pendingToken) {
        socket!.emit("authentication", { jwt: pendingToken });
      }
    });

    socket.on("disconnect", (reason) => {
      isConnected.value = false;
      console.log("[socket.io] Disconnected:", reason);
    });

    socket.on("authenticated", () => {
      isConnected.value = true;
      console.log("[socket.io] Authenticated");
    });

    socket.on("unauthorized", (msg) => {
      isConnected.value = false;
      console.warn("[socket.io] Unauthorized:", msg);
    });

    socket.on("connect_error", (err) => {
      console.error("[socket.io] connect_error:", err);
    });

    socket.io.on("error", (err) => {
      console.error("[socket.io] manager.error:", err);
    });

    socket.io.engine.on("error", (err) => {
      console.error("[socket.io] engine.error:", err);
    });
    return socket;
  }

  function getSocket(): Socket {
    if (!socket)
      throw new Error("Socket not initialized. Call connect() first.");
    return socket;
  }

  /**
   * Store the token and emit authentication to the server.
   * If the socket is not yet connected the token is stored and will be sent
   * automatically when the "connect" event fires.
   */
  function authenticate(accessToken: string) {
    pendingToken = accessToken;
    // Only emit if the transport is already up; otherwise the "connect"
    // handler above will pick up pendingToken and emit then.
    if (socket?.connected) {
      socket.emit("authentication", { jwt: accessToken });
    }
  }

  return {
    connect,
    getSocket,
    authenticate,
    // Expose as readonly so callers cannot accidentally mutate it
    isConnected: readonly(isConnected),
  };
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { token } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!token) {
      window.socket?.disconnect?.();
      setSocket(null);
      setOnlineUsers([]);
      return undefined;
    }

    const nextSocket = io("http://localhost:5000", {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    window.socket = nextSocket;
    setSocket(nextSocket);

    nextSocket.on("connect", () => {
      nextSocket.emit("join");
    });

    nextSocket.on("online-users", setOnlineUsers);

    return () => {
      nextSocket.off("online-users", setOnlineUsers);
      nextSocket.disconnect();
      if (window.socket === nextSocket) {
        window.socket = null;
      }
    };
  }, [token]);

  const value = useMemo(
    () => ({
      socket,
      onlineUsers,
      isConnected: Boolean(socket?.connected),
    }),
    [socket, onlineUsers]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
}

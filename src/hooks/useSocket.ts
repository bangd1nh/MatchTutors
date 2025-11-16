import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

export const useSocket = () => {
   const socketRef = useRef<Socket | null>(null);

   useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) return;

      socketRef.current = io(
         import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
         {
            auth: { token },
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
         }
      );

      socketRef.current.on("connect", () => {
         console.log("✅ Socket connected:", socketRef.current?.id);
      });

      socketRef.current.on("disconnect", (reason) => {
         console.log("❌ Socket disconnected:", reason);
      });

      socketRef.current.on("connect_error", (error) => {
         console.error("❌ Socket connection error:", error);
      });

      return () => {
         if (socketRef.current) {
            socketRef.current.disconnect();
         }
      };
   }, []);

   return socketRef.current;
};

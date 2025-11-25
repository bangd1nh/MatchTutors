import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

export const useSocket = (type: "chat" | "notifications") => {
   const socketRef = useRef<Socket | null>(null);

   useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const baseUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
      
      const socketUrl = `${baseUrl}/${type}`;

      socketRef.current = io(socketUrl, {
         auth: { token },
         transports: ["websocket", "polling"],
         reconnection: true,
         reconnectionDelay: 1000,
         reconnectionDelayMax: 5000,
         reconnectionAttempts: 5,
      });

      socketRef.current.on("connect", () => {
         console.log(`${type} socket connected:`, socketRef.current?.id);
      });

      socketRef.current.on("disconnect", (reason) => {
         console.log(`${type} socket disconnected:`, reason);
      });

      socketRef.current.on("connect_error", (error) => {
         console.error(`${type} socket connection error:`, error);
      });

      return () => {
         if (socketRef.current) {
            socketRef.current.disconnect();
         }
      };
   }, [type]);

   return socketRef.current;
};

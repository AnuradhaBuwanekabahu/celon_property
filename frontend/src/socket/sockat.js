import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

export default socket;
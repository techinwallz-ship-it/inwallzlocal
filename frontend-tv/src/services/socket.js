import { io } from "socket.io-client";

const socket = io("https://api.inwallz.in", {
  transports: ["websocket"],
});

export default socket;

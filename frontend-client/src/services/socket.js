import { io } from "socket.io-client";

const socket = io("http://203.101.40.119:5000");

export default socket;

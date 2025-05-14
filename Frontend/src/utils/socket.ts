import { io } from 'socket.io-client'

console.log("Connecting socket to:", import.meta.env.VITE_API_URL);

export const socket = io(import.meta.env.VITE_API_URL, {
    withCredentials: true,
    transports: ['websocket'],
});
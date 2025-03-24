import React from 'react';
import io from 'socket.io-client';

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: true,
  withCredentials: true,
  auth: {
    token: localStorage.getItem('token'),
  },
});

export const SocketContext = React.createContext(socket);

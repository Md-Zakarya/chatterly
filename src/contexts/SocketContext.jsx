import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?._id) return;

    // Connect to backend socket server
    const newSocket = io('http://localhost:3001', {
      auth: { userId: user._id },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
      newSocket.emit('user:join', { userId: user._id });
    });

    newSocket.on('user:online', ({ userId }) => {
      console.log('User came online:', userId);
      setOnlineUsers((prev) => new Set([...prev, userId]));
    });

    newSocket.on('user:offline', ({ userId }) => {
      console.log('User went offline:', userId);
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('user:leave', { userId: user._id });
      newSocket.close();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
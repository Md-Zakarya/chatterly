import { useEffect, useCallback, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';

export const useSocketMessaging = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});

  // Join user room on mount
  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit('user:join', { userId: user._id });

    return () => {
      socket.emit('user:leave', { userId: user._id });
    };
  }, [socket, user?._id]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      setMessages((prev) => {
        const threadKey = message.senderId;
        const existingMessages = prev[threadKey] || [];
        return {
          ...prev,
          [threadKey]: [...existingMessages, message],
        };
      });
    };

    const handleMessageSent = ({ tempId, messageId, status }) => {
      setMessages((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          updated[key] = updated[key].map((msg) =>
            msg.id === tempId ? { ...msg, id: messageId, status } : msg  // ✅ Match tempId, update to real ID
          );
        });
        return updated;
      });
    };

    const handleMessageRead = ({ messageId }) => {
      setMessages((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          updated[key] = updated[key].map((msg) =>
            msg.id === messageId ? { ...msg, status: 'read' } : msg
          );
        });
        return updated;
      });
    };

    const handleUserTyping = ({ userId, isTyping }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [userId]: isTyping,
      }));
    };

    socket.on('message:receive', handleReceiveMessage);
    socket.on('message:sent', handleMessageSent);
    socket.on('message:read', handleMessageRead);
    socket.on('user:typing', handleUserTyping);

    return () => {
      socket.off('message:receive', handleReceiveMessage);
      socket.off('message:sent', handleMessageSent);
      socket.off('message:read', handleMessageRead);
      socket.off('user:typing', handleUserTyping);
    };
  }, [socket]);

  const sendMessage = useCallback(
    (content, recipientId) => {
      if (!socket || !user?._id || !content.trim()) return;

      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const tempMessage = {
        id: tempId,
        content,
        senderId: user._id,
        recipientId,
        timestamp: new Date().toISOString(),
        status: 'sending',
      };

      // Optimistically add message to UI
      setMessages((prev) => ({
        ...prev,
        [recipientId]: [...(prev[recipientId] || []), tempMessage],
      }));

      // Emit to server with temp ID
      socket.emit('message:send', {
        content,
        recipientId,
        senderId: user._id,
        tempId,  // ✅ Send tempId to backend
      });

      return tempId;
    },
    [socket, user?._id]
  );

  const startTyping = useCallback(
    (recipientId) => {
      if (!socket || !user?._id || !recipientId) return;
      socket.emit('typing:start', {
        roomId: `user:${recipientId}`,
        userId: user._id,
      });
    },
    [socket, user?._id]
  );

  const stopTyping = useCallback(
    (recipientId) => {
      if (!socket || !user?._id || !recipientId) return;
      socket.emit('typing:stop', {
        roomId: `user:${recipientId}`,
        userId: user._id,
      });
    },
    [socket, user?._id]
  );

  const markAsRead = useCallback(
    (messageId, senderId) => {
      if (!socket) return;
      socket.emit('message:read', { messageId, senderId });
    },
    [socket]
  );

  return {
    messages,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
  };
};

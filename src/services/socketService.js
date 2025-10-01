import { io } from 'socket.io-client';
import { BASE_URL } from '../api/endpoints';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.eventListeners = new Map();
    }
    
    connect(userId = null, token = null) {
        if (this.socket?.connected) {
            return this.socket;
        }
        
        this.socket = io(BASE_URL, {
            auth: {
                token: token
            },
            autoConnect: true
        });
        
        this.socket.on('connect', () => {
            console.log('Connected to server:', this.socket.id);
            this.isConnected = true;
            
            if (userId) {
                this.joinUser(userId);
            }
        });
        
        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.isConnected = false;
        });
        
        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
        
        return this.socket;
    }
    
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }
    
    joinUser(userId) {
        if (this.socket) {
            this.socket.emit('user:join', { userId });
        }
    }
    
    leaveUser() {
        if (this.socket) {
            this.socket.emit('user:leave');
        }
    }
    
    sendMessage(content, recipientId, senderId) {
        if (this.socket) {
            this.socket.emit('message:send', {
                content,
                recipientId,
                senderId
            });
        }
    }
    
    markMessageAsRead(messageId, senderId) {
        if (this.socket) {
            this.socket.emit('message:read', {
                messageId,
                senderId
            });
        }
    }
    
    startTyping(roomId, userId) {
        if (this.socket) {
            this.socket.emit('user:typing', { roomId, userId });
        }
    }
    
    stopTyping(roomId, userId) {
        if (this.socket) {
            this.socket.emit('user:stop_typing', { roomId, userId });
        }
    }
    
    joinRoom(roomId) {
        if (this.socket) {
            this.socket.emit('room:join', { roomId });
        }
    }
    
    leaveRoom(roomId) {
        if (this.socket) {
            this.socket.emit('room:leave', { roomId });
        }
    }
    
    // Event listener management
    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
            
            // Store for cleanup
            if (!this.eventListeners.has(event)) {
                this.eventListeners.set(event, []);
            }
            this.eventListeners.get(event).push(callback);
        }
    }
    
    off(event, callback = null) {
        if (this.socket) {
            if (callback) {
                this.socket.off(event, callback);
            } else {
                this.socket.off(event);
            }
            
            // Clean up stored listeners
            if (this.eventListeners.has(event)) {
                if (callback) {
                    const callbacks = this.eventListeners.get(event);
                    const index = callbacks.indexOf(callback);
                    if (index > -1) {
                        callbacks.splice(index, 1);
                    }
                } else {
                    this.eventListeners.delete(event);
                }
            }
        }
    }
    
    // Utility methods
    isSocketConnected() {
        return this.socket?.connected || false;
    }
    
    getSocketId() {
        return this.socket?.id || null;
    }
}

// Create singleton instance
const socketService = new SocketService();
export default socketService;
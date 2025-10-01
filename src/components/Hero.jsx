import { useMemo, useState, useEffect } from 'react';
import ChatSidebar from './chat/ChatSidebar';
import ChatWindow from './chat/ChatWindow';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { useSocketMessaging } from '../hooks/useSocketMessaging';
import { getFriends } from '../services/friendService';

const Hero = () => {
  const { user } = useAuth();
  const { onlineUsers } = useSocket();
  const { messages: socketMessages, sendMessage, startTyping, stopTyping, markAsRead } = useSocketMessaging();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Load friends list from API
  useEffect(() => {
    const loadFriends = async () => {
      if (!user?._id) return;
      
      setLoading(true);
      try {
        const data = await getFriends(user._id);
        // Transform friends data to match the expected format
        const transformedFriends = (data || []).map(friend => ({
          id: friend._id,
          displayName: friend.displayName,
          username: friend.username,
          isOnline: onlineUsers.has(friend._id),
          lastSeen: friend.lastSeen,
          avatar: friend.avatar,
        }));
        setFriends(transformedFriends);
      } catch (error) {
        console.error('Error loading friends:', error);
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };

    loadFriends();
  }, [user?._id, onlineUsers]);

  // Update friend online status when onlineUsers changes
  useEffect(() => {
    setFriends((prev) =>
      prev.map((friend) => ({
        ...friend,
        isOnline: onlineUsers.has(friend.id),
      }))
    );
  }, [onlineUsers]);

  // Set the first friend as selected when friends load
  useEffect(() => {
    if (friends.length > 0 && !selectedUserId) {
      setSelectedUserId(friends[0].id);
    }
  }, [friends, selectedUserId]);

  const currentViewer = useMemo(
    () => ({
      id: user?._id || 'self',
      displayName: user?.displayName || 'You',
      username: user?.username || 'you',
      isOnline: true,
    }),
    [user]
  );

  const selectedUser = useMemo(
    () => friends.find((friend) => friend.id === selectedUserId) || null,
    [friends, selectedUserId]
  );

  const messages = selectedUser ? socketMessages[selectedUser.id] ?? [] : [];

  const handleSelectUser = (user) => {
    setSelectedUserId(user.id);
  };

  const handleSendMessage = (content, targetUser) => {
    if (!targetUser || !content.trim()) return;
    sendMessage(content, targetUser.id);
  };

  // Show loading state
  if (loading) {
    return (
      <section className="relative flex h-full items-center justify-center overflow-hidden bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-white"></div>
          <p className="text-sm text-[var(--muted)]">Loading conversations...</p>
        </div>
      </section>
    );
  }

  // Show empty state if no friends
  if (friends.length === 0) {
    return (
      <section className="relative flex h-full items-center justify-center overflow-hidden bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-[var(--border)]">
            <svg
              className="h-8 w-8 text-[var(--muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <p className="text-sm text-[var(--muted)]">No friends to chat with yet</p>
          <p className="text-xs text-[var(--muted)]">Add friends to start conversations</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex h-full overflow-hidden bg-[var(--bg)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="flex h-full min-h-0 w-full gap-4 p-4">
        <div className="w-80 flex-shrink-0">
          <ChatSidebar
            users={friends}
            query={query}
            onQueryChange={setQuery}
            selectedUserId={selectedUserId}
            onSelectUser={handleSelectUser}
          />
        </div>
        <div className="flex-1 min-h-0">
          <ChatWindow
            activeUser={selectedUser}
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUser={currentViewer}
            onStartTyping={() => startTyping(selectedUser?.id)}
            onStopTyping={() => stopTyping(selectedUser?.id)}
            onMarkAsRead={markAsRead}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

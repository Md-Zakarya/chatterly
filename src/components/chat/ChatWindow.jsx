import { useEffect, useMemo, useRef, useState } from 'react';
import Avatar from '../ui/Avatar';
import MessageBubble from './MessageBubble';
import Button from '../ui/Button';

const relativeTime = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

function getLastSeenLabel(user) {
  if (!user) return '';
  if (user.isOnline) return 'Online';
  if (!user.lastSeen) return 'Offline';

  const lastSeenDate = new Date(user.lastSeen);
  const diffMs = Date.now() - lastSeenDate.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${relativeTime.format(-diffMinutes, 'minute')}`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${relativeTime.format(-diffHours, 'hour')}`;
  const diffDays = Math.round(diffHours / 24);
  return `${relativeTime.format(-diffDays, 'day')}`;
}

const ChatWindow = ({ 
  activeUser, 
  messages = [], 
  onSendMessage = () => {}, 
  currentUser,
  onStartTyping = () => {},
  onStopTyping = () => {},
  onMarkAsRead = () => {},
}) => {
  const [draft, setDraft] = useState('');
  const viewportRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const lastSeenLabel = useMemo(() => getLastSeenLabel(activeUser), [activeUser]);

  useEffect(() => {
    setDraft('');
  }, [activeUser?.id]);

  useEffect(() => {
    if (!viewportRef.current) return;
    viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, activeUser?.id]);

  // Mark messages as read when they come into view
  useEffect(() => {
    if (!messages.length || !activeUser) return;
    
    const unreadMessages = messages.filter(
      (msg) => msg.senderId === activeUser.id && msg.status !== 'read'
    );
    
    unreadMessages.forEach((msg) => {
      onMarkAsRead(msg.id, msg.senderId);
    });
  }, [messages, activeUser, onMarkAsRead]);

  if (!activeUser) {
    return (
      <section className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)]/80 bg-[var(--card)]/40">
        <div className="text-center">
          <p className="text-sm font-semibold text-white">Select a conversation to get started</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Choose someone from the left to preview a demo conversation.
          </p>
        </div>
      </section>
    );
  }

  const handleSend = (event) => {
    event.preventDefault();
    const value = draft.trim();
    if (!value) return;
    onSendMessage(value, activeUser);
    setDraft('');
    onStopTyping();
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setDraft(value);

    // Typing indicator logic
    if (value.trim() && !typingTimeoutRef.current) {
      onStartTyping();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping();
      typingTimeoutRef.current = null;
    }, 1000);
  };

  return (
    <section className="flex h-full w-full flex-col rounded-xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur">
      <header className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={activeUser.displayName} status={activeUser.isOnline ? 'online' : 'offline'} size="lg" />
          <div>
            <h2 className="text-base font-semibold text-white">{activeUser.displayName}</h2>
            <p className="text-sm text-[var(--muted)]">@{activeUser.username} · {lastSeenLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">View profile</Button>
          <Button variant="ghost">More</Button>
        </div>
      </header>

      <div ref={viewportRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="mt-12 text-center text-sm text-[var(--muted)]">
            No messages yet — send the first hello!
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUser?.id}
            />
          ))
        )}
      </div>

      <form onSubmit={handleSend} className="border-t border-[var(--border)] px-4 py-3">
        <div className="flex items-end gap-3">
          <textarea
            value={draft}
            onChange={handleInputChange}
            placeholder={`Message ${activeUser.displayName}`}
            className="mono-input min-h-[3rem] flex-1 resize-none bg-transparent"
            rows={1}
            aria-label={`Send a message to ${activeUser.displayName}`}
          />
          <Button type="submit" disabled={!draft.trim()} aria-label="Send message">
            Send
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ChatWindow;

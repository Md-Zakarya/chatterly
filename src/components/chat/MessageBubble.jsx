const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
});

const statusLabels = {
  sent: 'Sent',
  delivered: 'Delivered',
  read: 'Read',
};

const MessageBubble = ({ message, isOwn }) => {
  const timestamp = message.timestamp ? timeFormatter.format(new Date(message.timestamp)) : '';
  const statusLabel = isOwn && message.status ? statusLabels[message.status] || message.status : null;

  return (
    <div
      className={`flex w-full ${
        isOwn ? 'justify-end pl-12' : 'justify-start pr-12'
      }`}
    >
      <div className="max-w-md">
        <div
          className={`rounded-2xl border px-4 py-2 text-sm shadow-sm transition ${
            isOwn
              ? // Ensure strong contrast in both light and dark modes
                'border-white/20 bg-white text-black dark:bg-gray-700 dark:text-white'
              : 'border-white/10 bg-white/5 text-[var(--fg)]'
          }`}
        >
          {/* use a valid whitespace utility so long messages wrap correctly */}
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-[var(--muted)]">
          <span>{timestamp}</span>
          {statusLabel && <span>• {statusLabel}</span>}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
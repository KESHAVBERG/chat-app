import React from 'react';

const AVATAR_COLORS = [
  '#4F46E5', // Indigo
  '#059669', // Emerald
  '#DC2626', // Red
  '#D97706', // Amber
  '#7C3AED', // Violet
  '#DB2777', // Pink
  '#2563EB', // Blue
  '#0D9488', // Teal
];

function getAvatarColor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function formatTimestamp(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MessageItem({ message, currentUser }) {
  const isOwn = message.user === currentUser;
  const initial = (message.user || '?').charAt(0).toUpperCase();
  const avatarBg = getAvatarColor(message.user);
  const timeString = formatTimestamp(message.createdAt);

  return (
    <div className={`message-item-wrapper ${isOwn ? 'message-own' : 'message-other'}`}>
      {!isOwn && (
        <div
          className="message-avatar"
          style={{ backgroundColor: avatarBg }}
          title={message.user}
        >
          {initial}
        </div>
      )}

      <div className="message-content-container">
        {!isOwn && (
          <div className="message-sender-name">
            {message.user}
          </div>
        )}

        <div className="message-bubble">
          <p className="message-text">{message.text}</p>
          {timeString && (
            <span className="message-timestamp" title={new Date(message.createdAt).toLocaleString()}>
              {timeString}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

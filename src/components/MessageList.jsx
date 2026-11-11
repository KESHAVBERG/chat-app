import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { MessageCircle } from 'lucide-react';

export default function MessageList({ messages, currentUser, roomName }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    // Smooth scroll to bottom whenever messages array updates
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="message-list-empty">
        <div className="empty-icon-wrap">
          <MessageCircle size={40} />
        </div>
        <h3>Welcome to #{roomName}!</h3>
        <p>No messages here yet. Be the first one to say hello!</p>
      </div>
    );
  }

  return (
    <div className="message-list">
      <div className="message-list-intro">
        <span className="intro-badge">Start of #{roomName}</span>
      </div>

      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          currentUser={currentUser}
        />
      ))}
      <div ref={bottomRef} className="scroll-anchor" />
    </div>
  );
}

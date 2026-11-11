import React, { useState, useRef } from 'react';
import { SendHorizontal } from 'lucide-react';

export default function MessageInput({ onSendMessage, roomName }) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    try {
      setIsSending(true);
      setText('');
      await onSendMessage(trimmed);
    } catch (err) {
      console.error('Failed to send message:', err);
      // Restore text if sending failed
      setText(trimmed);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="message-input-field"
        placeholder={`Message #${roomName}... (Press Enter)`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={500}
        autoFocus
      />
      <button
        type="submit"
        className="message-send-btn"
        disabled={!text.trim() || isSending}
        aria-label="Send message"
        title="Send message"
      >
        <SendHorizontal size={18} />
      </button>
    </form>
  );
}

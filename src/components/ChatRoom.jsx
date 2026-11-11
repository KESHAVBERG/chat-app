import React, { useState, useEffect } from 'react';
import { subscribeToMessages, sendMessage } from '../services/chatService';
import { isFirebaseConfigured } from '../firebase';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Hash, LogOut, Radio, AlertCircle } from 'lucide-react';

export default function ChatRoom({ user, room, onLeave }) {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    // Subscribe to room messages
    const unsubscribe = subscribeToMessages(
      room,
      (newMessages) => {
        setMessages(newMessages);
      },
      (err) => {
        setError(err.message || 'Error syncing messages');
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [room]);

  const handleSend = async (text) => {
    try {
      await sendMessage(room, { text, user });
    } catch (err) {
      console.error('Failed to send:', err);
      setError('Could not send message. Please check connection.');
      throw err;
    }
  };

  return (
    <div className="chatroom-wrapper">
      {/* Room Header */}
      <header className="chatroom-header">
        <div className="chatroom-title-area">
          <div className="chatroom-hash-badge">
            <Hash size={20} />
          </div>
          <div>
            <h2 className="chatroom-name">{room}</h2>
            <div className="chatroom-meta">
              <span className="live-pulse"></span>
              <span className="chatroom-status-text">
                {isFirebaseConfigured ? 'Firebase Live' : 'Multi-tab Demo'}
              </span>
            </div>
          </div>
        </div>

        <div className="chatroom-actions">
          <div className="user-badge" title={`Signed in as ${user}`}>
            <span className="user-badge-avatar">{user.charAt(0).toUpperCase()}</span>
            <span className="user-badge-name">{user}</span>
          </div>

          <button
            onClick={onLeave}
            className="leave-room-button"
            title="Leave room and return to lobby"
          >
            <LogOut size={16} />
            <span className="leave-text">Leave</span>
          </button>
        </div>
      </header>

      {/* Error alert banner if any */}
      {error && (
        <div className="chatroom-error-banner">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="error-close-btn">&times;</button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <main className="chatroom-body">
        <MessageList
          messages={messages}
          currentUser={user}
          roomName={room}
        />
      </main>

      {/* Message Input Footer */}
      <footer className="chatroom-footer">
        <MessageInput
          onSendMessage={handleSend}
          roomName={room}
        />
      </footer>
    </div>
  );
}

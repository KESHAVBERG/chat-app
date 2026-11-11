import React, { useState } from 'react';
import { isFirebaseConfigured } from '../firebase';
import { MessageSquare, Users, Hash, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

const SUGGESTED_ROOMS = ['general', 'developers', 'design', 'random'];

export default function RoomSelection({ initialUser = '', onJoin }) {
  const [username, setUsername] = useState(initialUser || '');
  const [room, setRoom] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanUser = username.trim();
    const cleanRoom = room.trim().toLowerCase().replace(/\s+/g, '-');

    if (!cleanUser) {
      setError('Please enter your display name.');
      return;
    }
    if (!cleanRoom) {
      setError('Please choose or enter a room name.');
      return;
    }

    setError('');
    onJoin({ username: cleanUser, room: cleanRoom });
  };

  return (
    <div className="join-container">
      <div className="join-card">
        {/* Header */}
        <div className="join-header">
          <div className="join-icon-wrapper">
            <MessageSquare className="join-icon" size={32} />
          </div>
          <h1>Multiplayer Chat</h1>
          <p className="join-subtitle">
            Real-time chat rooms powered by React &amp; Firebase
          </p>
          
          <div className={`status-pill ${isFirebaseConfigured ? 'status-online' : 'status-demo'}`}>
            {isFirebaseConfigured ? (
              <>
                <CheckCircle2 size={14} />
                <span>Connected to Firebase Firestore</span>
              </>
            ) : (
              <>
                <Zap size={14} />
                <span>Multi-tab Demo Mode (No Firebase keys set)</span>
              </>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="join-form">
          {error && <div className="error-alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">
              <Users size={16} />
              <span>Your Name</span>
            </label>
            <input
              id="username"
              type="text"
              placeholder="e.g. Alex, Sarah, DevNinja"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={24}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="room">
              <Hash size={16} />
              <span>Room Name</span>
            </label>
            <input
              id="room"
              type="text"
              placeholder="e.g. general, watercooler"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              maxLength={30}
            />
          </div>

          {/* Quick select rooms */}
          <div className="suggested-rooms">
            <span className="suggested-label">Popular rooms:</span>
            <div className="room-chips">
              {SUGGESTED_ROOMS.map((suggested) => (
                <button
                  key={suggested}
                  type="button"
                  className={`chip ${room.toLowerCase() === suggested ? 'chip-active' : ''}`}
                  onClick={() => setRoom(suggested)}
                >
                  #{suggested}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="join-button">
            <span>Enter Room</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="join-footer">
          <p>Open multiple browser tabs to test live multiplayer chat!</p>
        </div>
      </div>
    </div>
  );
}

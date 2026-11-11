import React, { useState, useEffect } from 'react';
import RoomSelection from './components/RoomSelection';
import ChatRoom from './components/ChatRoom';
import './App.css';

export default function App() {
  const [user, setUser] = useState(() => {
    return localStorage.getItem('chatapp_last_user') || '';
  });
  const [room, setRoom] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  // Read URL query params on load (e.g. ?room=general)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setRoom(roomParam);
    }
  }, []);

  const handleJoin = ({ username, room: chosenRoom }) => {
    setUser(username);
    setRoom(chosenRoom);
    setIsJoined(true);
    localStorage.setItem('chatapp_last_user', username);

    // Update URL query string without reloading page
    const url = new URL(window.location.href);
    url.searchParams.set('room', chosenRoom);
    window.history.pushState({}, '', url);
  };

  const handleLeave = () => {
    setIsJoined(false);
    setRoom('');

    // Remove room param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('room');
    window.history.pushState({}, '', url);
  };

  return (
    <div className="app-container">
      {isJoined && room ? (
        <ChatRoom
          user={user}
          room={room}
          onLeave={handleLeave}
        />
      ) : (
        <RoomSelection
          initialUser={user}
          onJoin={handleJoin}
        />
      )}
    </div>
  );
}

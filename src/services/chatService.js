import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';

// Key for local storage fallback
const getStorageKey = (roomId) => `chatapp_room_${roomId}`;

/**
 * Subscribe to messages for a specific room.
 * Uses Firebase Firestore when configured, or BroadcastChannel fallback for multi-tab testing.
 * @param {string} roomId
 * @param {Function} onMessages (messages: Array) => void
 * @param {Function} onError (error: Error) => void
 * @returns {Function} unsubscribe cleanup function
 */
export function subscribeToMessages(roomId, onMessages, onError) {
  if (!roomId) return () => {};

  if (isFirebaseConfigured && db) {
    try {
      const messagesRef = collection(db, 'rooms', roomId, 'messages');
      const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));

      const unsubscribe = onSnapshot(
        messagesQuery,
        (snapshot) => {
          const messages = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              text: data.text || '',
              user: data.user || 'Anonymous',
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date()),
            };
          });
          onMessages(messages);
        },
        (error) => {
          console.error(`Error subscribing to room ${roomId}:`, error);
          if (onError) onError(error);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error('Firestore listener setup failed:', err);
      if (onError) onError(err);
    }
  }

  // --- Fallback: Multi-tab BroadcastChannel + LocalStorage ---
  console.info(`[Demo Mode] Using local BroadcastChannel for room: ${roomId}`);
  const channelName = `chatapp_room_channel_${roomId}`;
  const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(channelName) : null;

  // Load existing messages from localStorage
  const loadLocalMessages = () => {
    try {
      const saved = localStorage.getItem(getStorageKey(roomId));
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.map((m) => ({
        ...m,
        createdAt: new Date(m.createdAt),
      }));
    } catch {
      return [];
    }
  };

  // Initial load
  onMessages(loadLocalMessages());

  const handleMessage = () => {
    onMessages(loadLocalMessages());
  };

  if (channel) {
    channel.onmessage = handleMessage;
  }

  const handleStorage = (e) => {
    if (e.key === getStorageKey(roomId)) {
      onMessages(loadLocalMessages());
    }
  };
  window.addEventListener('storage', handleStorage);

  return () => {
    if (channel) channel.close();
    window.removeEventListener('storage', handleStorage);
  };
}

/**
 * Send a message to a room.
 * @param {string} roomId
 * @param {{ text: string, user: string }} messageData
 */
export async function sendMessage(roomId, { text, user }) {
  const trimmed = text.trim();
  if (!trimmed || !roomId) return;

  if (isFirebaseConfigured && db) {
    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    await addDoc(messagesRef, {
      text: trimmed,
      user: user || 'Anonymous',
      createdAt: serverTimestamp(),
    });
    return;
  }

  // --- Fallback: Save to LocalStorage and broadcast ---
  const storageKey = getStorageKey(roomId);
  const current = (() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch {
      return [];
    }
  })();

  const newMessage = {
    id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    text: trimmed,
    user: user || 'Anonymous',
    createdAt: new Date().toISOString(),
  };

  const updated = [...current, newMessage];
  localStorage.setItem(storageKey, JSON.stringify(updated));

  const channelName = `chatapp_room_channel_${roomId}`;
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel(channelName);
    channel.postMessage({ type: 'NEW_MESSAGE', payload: newMessage });
    channel.close();
  }

  // Dispatch storage event for the current window if needed
  window.dispatchEvent(new Event('storage'));
}

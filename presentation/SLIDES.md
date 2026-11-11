# Presentation Slides: Multiplayer Chat with Rooms

---

## Slide 1: What Was Built & The Tech Stack

### What Was Built
* **Room-Based Realtime Chat:** People can join or create chat rooms by name (e.g. `general`, `random`, or custom topics). Messages synchronize instantly to everyone in that room.
* **Component-Driven React:** Five focused components:
  * `RoomSelection`: Username input, room name input, and suggested room chips.
  * `ChatRoom`: Active room header, live status indicator, and leave action.
  * `MessageList`: Auto-scrolling message container with empty-room welcome state.
  * `MessageItem`: Chat bubble with formatted timestamps, sender name, and deterministic avatar colors.
  * `MessageInput`: Text input with enter-to-send support and send button.
* **UX Details:**
  * Message timestamps (`HH:mm`) on all messages.
  * Sender alignment (right for own messages, left for peers).
  * Auto-scroll to the newest message upon delivery.
  * Clean, responsive dark theme.
* **Resilient Multi-Tab Demo Mode:**
  * When Firebase keys are configured: connects directly to live Firebase Firestore.
  * When keys are absent: transparently falls back to `BroadcastChannel` + `localStorage` so reviewers can demo multi-user chat across browser tabs without any setup friction.

### The Stack
* **Frontend:** React 19, JSX, Vite 6
* **Database & Realtime:** Firebase Firestore (v11) with real-time `onSnapshot` listeners and `serverTimestamp`
* **Schema Design:** Subcollections (`rooms/{roomId}/messages`) ensuring zero composite index requirements
* **Icons & Styling:** Lucide React, Modern responsive CSS variables

---

## Slide 2: AI Reflections & Engineering Decisions

### What the AI Got Wrong / What I Did Differently
1. **The Firestore Query Indexing Trap:**
   * *AI Output:* Initially generated queries like `collection('messages')` filtered with `where('room', '==', room)` and `orderBy('createdAt', 'asc')`.
   * *Problem:* In Firestore, combining an equality filter on one field with an `orderBy` on another field requires creating a composite index in the Firebase Console. Without it, the app throws `FirebaseError: The query requires an index`.
   * *Human Correction:* Restructured data into subcollections (`rooms/{roomId}/messages`). Sorting within a subcollection only requires Firestore's default single-field index, ensuring zero-configuration operation.
2. **Eliminating Setup Friction (The "Blank Screen" Problem):**
   * *AI Output:* Hard-coded Firebase calls that throw uncaught exceptions if environment variables are not supplied.
   * *Human Correction:* Added a connection checker and built-in `BroadcastChannel` multi-tab synchronization fallback so reviewers can immediately run `npm run dev` and test multiplayer functionality.
3. **Avoiding Over-Engineering:**
   * *AI Output:* Tendency to introduce complex state management libraries (Redux Toolkit, Zustand, or large Context providers).
   * *Decision:* Kept state local and explicit via props, preserving simplicity and readability.

### Areas of Uncertainty & Future Iterations
1. **Room Discovery & Listing at Scale:**
   * Subcollections cleanly isolate room messages, but discovering active public rooms requires either maintaining a top-level `/rooms` collection or running Collection Group Queries. For a production app with thousands of active rooms, a dedicated room index or search service would be needed.
2. **Ephemeral Presence vs Firestore Pricing:**
   * Tracking "who is currently online" or "typing..." via Firestore document writes creates excessive write operations and billable costs. Firebase Realtime Database is better suited for high-frequency ephemeral presence data.
3. **User Authentication & Impersonation:**
   * Currently, usernames are self-asserted. In production, integrating Firebase Anonymous Authentication (or full auth) and validating `request.auth.uid` in Firestore Security Rules is necessary to prevent message spoofing.

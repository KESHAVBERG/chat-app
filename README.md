# Multiplayer Real-Time Chat with Rooms

A lightweight, real-time multiplayer chat application built with **React.js** and **Firebase Firestore**. Users can enter their display name, join or create rooms by name, and chat live with everyone in the same room.

Built as part of the candidate interview technical challenge.

---

## 🚀 Quick Start (Runs Immediately)

You can run and test this app in under 30 seconds:

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser. Open a second tab or an incognito window, join the same room name (e.g. `general`), and send messages to verify real-time multiplayer functionality!

> 💡 **Resilient Zero-Config Demo Mode:**
> If you start the app without configuring Firebase credentials, it automatically falls back to an in-browser multi-tab synchronization mode using the `BroadcastChannel` API and `localStorage`. This allows you to immediately test multiplayer room behavior across browser windows without needing to configure Firebase upfront!

---

## 🛠️ Stack & Architecture

- **React 19 / JSX**: Functional components with hooks (`useState`, `useEffect`, `useRef`).
- **Firebase Firestore (v11)**: Real-time database listeners (`onSnapshot`) and server timestamps (`serverTimestamp`).
- **Vite 6**: Fast bundler and development server.
- **Lucide React**: Clean, lightweight icons.
- **Custom CSS**: Responsive, dark modern theme with room chips, avatar generators, and auto-scroll.

### Component Structure

```
src/
├── components/
│   ├── RoomSelection.jsx   # Join lobby: username, room input, and suggested room chips
│   ├── ChatRoom.jsx        # Active room container: header, live status, and layout
│   ├── MessageList.jsx     # Messages container with auto-scroll to latest message
│   ├── MessageItem.jsx     # Individual message bubble, avatar color hash & timestamp
│   └── MessageInput.jsx    # Form input with Enter-to-send and send button
├── services/
│   └── chatService.js      # Decoupled data layer for Firestore subscriptions & sending
├── firebase.js             # Firebase initialization & credential validator
├── App.jsx                 # Top-level state (user, room, URL param sync)
├── App.css                 # Application styling & animations
└── main.jsx                # React DOM entry point
```

---

## ☁️ Setting Up Cloud Firebase (Optional)

To connect the application to your own Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. In your project, go to **Firestore Database** and click **Create database** (start in test mode).
3. Go to **Project Settings > General > Your apps** and add a **Web app**.
4. Copy the config values into a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-app
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:...
```

5. Restart the dev server (`npm run dev`). The status badge will show **"Connected to Firebase Firestore"**.

### Firestore Data Model
Messages are organized in room subcollections:
```
rooms/
  └── {roomId}/
        └── messages/
              └── {messageId}
                    ├── text: "Hello world!"
                    ├── user: "Alex"
                    └── createdAt: timestamp
```
*Why subcollections?* This structure ensures queries (`query(collection(db, "rooms", roomId, "messages"), orderBy("createdAt", "asc"))`) only use Firestore's default single-field index, completely avoiding manual composite index requirements.

---

## 📦 How to Send the Work (for Interview Submission)

To export the entire repository including the full commit history into a single bundle file:

```bash
git bundle create multiplayer-chat.bundle --all
```

You can email `multiplayer-chat.bundle` alongside `slides.pdf`.

To inspect the bundle later:
```bash
git clone multiplayer-chat.bundle restored-chatapp
```

---

## 📄 Deliverables Included

- **`README.md`**: Project overview, instructions, and architecture.
- **`PROMPTS.md`**: Step-by-step record of prompts and AI collaboration.
- **`slides.pdf`** & **`presentation/slides.html`**: The requested 2-slide presentation covering what was built, the stack, reflection on AI outputs, and areas for improvement.

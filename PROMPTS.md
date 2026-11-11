# AI Interaction Log & Prompts (`PROMPTS.md`)

This document records the prompts, architectural decisions, and iterative refinement used while building the Multiplayer Chat App.

---

## 1. Initial Candidate Brief Prompt

```text
Build prompt:
> Build a real-time chat app with rooms. People join a room by name, and messages go out live to everyone in that room. If you get time: message timestamps and a bit of styling.

Requirements:
- Stack: React.js and Firebase
- Component-driven architecture
- Keep it simple: don't overcomplicate
- Normal, iterative git commit history
```

---

## 2. Iterative Development Steps & Prompts

### Step 1: Project Scaffolding & Git Tracking
* **Objective:** Initialize a clean Vite + React app and establish an early Git repository for traceable commit history.
* **Prompt / Plan:**
  > "Set up a clean React + Vite application with React 19, Firebase v11, and Lucide React. Set up `.gitignore` properly and record the initial commit."
* **Result:** Initialized repo, added dependencies, and ensured fast local build with zero bloat.

### Step 2: Data Architecture & Firebase Service Design
* **Prompt / Plan:**
  > "Design a Firestore data structure that doesn't trigger 'FirebaseError: The query requires an index'. Create a decoupled service layer `chatService.js` that supports live subscriptions with `onSnapshot` and message submission with `serverTimestamp`. Provide a zero-config fallback (BroadcastChannel + LocalStorage) so anyone reviewing the code can test multi-tab multiplayer without having to create a Firebase account first."
* **Key Architectural Decisions:**
  1. **Subcollection hierarchy (`rooms/{roomId}/messages`):** By scoping messages under room documents, sorting by `createdAt` only uses Firestore's built-in single-field index. Combining top-level collections with `where('room', '==', roomId)` and `orderBy('createdAt')` would have demanded a composite index, causing runtime query crashes.
  2. **Multi-Tab Resilience:** The service layer detects whether valid Firebase credentials are provided. If missing, it transparently synchronizes across tabs using `BroadcastChannel`.

### Step 3: Modular React Component Implementation
* **Prompt / Plan:**
  > "Break down the chat UI into modular, single-responsibility React components without over-engineering:
  > - `RoomSelection`: Username input, room input, and suggested room chips.
  > - `ChatRoom`: Room container with live status indicator and leave room action.
  > - `MessageList`: Auto-scrolling list of messages with empty state.
  > - `MessageItem`: Individual chat bubble with avatar color hashing and timestamp formatting.
  > - `MessageInput`: Text input with enter-to-send support."
* **Result:** Clean component tree with clear separation of concerns, readable state management, and no unnecessary external state libraries (Redux/Zustand) needed for this scope.

### Step 4: Styling & Polish
* **Prompt / Plan:**
  > "Add modern, clean styling using custom CSS. Include:
  > - Subtle dark mode theme with clean borders and contrast.
  > - Message bubbles distinguishing sender (own message on right, other on left).
  > - Deterministic avatar color generation from usernames.
  > - Live connection pulse indicator and responsive layout for mobile screens."

### Step 5: Deliverables & Presentation Preparation
* **Prompt / Plan:**
  > "Generate the required deliverables:
  > 1. Two slides covering: (Slide 1) What was built & stack used; (Slide 2) What the AI got wrong or what to do differently, and parts least sure about.
  > 2. Export instructions with `git bundle` and a comprehensive `README.md`."

---

## 3. Reflections on AI Assistance

- **What worked really well:**
  - Rapid scaffolding and boilerplate elimination.
  - Designing clean, componentized React code with built-in accessibility and keyboard shortcuts (Enter to send).
  - Proactively identifying the Firestore composite indexing pitfall before writing code.
- **Where human guidance was crucial:**
  - Deciding against over-complicating state management (avoiding Redux / Context when local state + props was cleaner).
  - Adding the `BroadcastChannel` zero-config fallback so the reviewers aren't blocked by missing Firebase keys.
  - Ensuring small, logical git commits rather than one massive commit at the end.

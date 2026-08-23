# Obsidian Architect | Academic Command Terminal
<img width="1854" height="1010" alt="image" src="https://github.com/user-attachments/assets/b7d3b10f-f9ec-448b-bcb4-db1c3d022ed2" />

Obsidian Architect is a high-performance, dark-themed academic organization dashboard and schedule terminal built for students and developers. Engineered with a deep-focus terminal aesthetic, it provides a persistent, client-side command center to manage university lecture schedules, monitor academic deadlines, track assignment completion metrics, and beam direct contact transmissions via webhooks.

---

## 🖥️ Page-by-Page Breakdown

### 1. Primary Dashboard (`index.html`)

The central operations terminal provides a live, filtered snapshot of your active academic day:

* **Live System Clock & Date Bar:** Real-time date snapshot engine updating every second.
* **Dynamic Metric Nodes:** Real-time counters calculating remaining classes today, immediate tasks due today, and pending tasks due later in the active week.
* **Timeline Lecture Tracker:** Parses current time against 24-hour schedules, dynamically highlighting the next upcoming lecture with animated pulse-glow indicators while filtering out completed sessions.
* **Priority Objective Queue:** Surfaces the highest-priority pending assignments with direct links to the management terminal.

---

### 2. Node & Objective Registration (`add class.html`)

The input interface designed for indexing new courses and assignment deadlines into device memory:

* **Terminal Boot Header:** Typing animation with a blinking accent cursor.
* **Structured Class Node Generator:** Dedicated inputs for class title, course code, instructor name, day dropdown, and start/end 24-hour time pickers.
* **Task Objective Form:** Add assignments with custom titles, assigned due dates, and extended descriptions.
* **Client-Side Validation & Feedback:** Input validation paired with animated floating toast notifications for indexing confirmations or parameter warnings.

---

### 3. Management & In-Place Editing Hub (`classes.html`)

A unified control center for auditing, modifying, and tracking indexed curriculum data:

* **Live Analytics & Progress Bars:** Visual status monitors displaying total registered classes and real-time task completion percentages that update immediately when checkboxes are toggled.
* **In-Place Card Morphing (Inline CRUD):** Clicking **Edit** dynamically morphs any card into interactive form fields (inputs, custom selects, and time pickers) directly within the grid layout, discarding intrusive browser prompts.
* **State Persistence:** Instant updates across `localStorage` upon saving or canceling edits.
* **Responsive Grid Interface:** Adaptable CSS grid layout supporting mobile viewports and multi-column desktop displays.

---

### 4. Support & Direct Transmission Terminal (`contact us.html`)

A communication interface combining an interactive knowledge base with a serverless backend:

* **Drill-Down FAQ Engine:** Clicking any FAQ item isolates the question and reveals a comprehensive answer view with a top-left back navigation control.
* **Discord Webhook Pipeline:** Serverless message transmission converting user input into rich Discord embeds delivered directly to a private Discord channel.
* **Toast Status Integration:** Visual feedback indicating transmission states (`TRANSMITTING...`, success confirmations, or network fail alerts).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | Semantic HTML5, Vanilla JavaScript (ES6+ DOM, Async/Await Fetch API) |
| **Styling** | Custom Modern CSS (CSS Custom Properties/Variables, Flexbox, CSS Grid) |
| **Storage** | Persistent Client-Side `localStorage` Engine |
| **Integrations** | Discord REST Webhooks API |
| **Typography & Icons** | Inter (Google Fonts), Custom SVG Data-URIs |

---

## ⚡ Key Highlights

* **100% Offline Capability:** Class schedules, task states, and progress metrics persist locally without requiring account setup or external databases.
* **No Dependencies:** Pure vanilla web stack with zero build steps or heavy node modules.
* **Engineered for Speed:** Instant load times, smooth cubic-bezier transitions, and optimized layout rendering.

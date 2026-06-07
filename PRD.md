# Product Requirements Document (PRD)

## 1. Project Overview & Vision
This application is a digital guest book, attendance manager, and real-time interaction portal designed specifically for the **Silver Reunion 90 SMAN 90 Jakarta** (Reuni Perak SMUN 90 JKT) held at **Milestone Star Cafe Bintaro** on **6 Juni 2026**.

The primary vision of this system is to streamline the attendance check-in process through a secure, instant, and frictionless digital ticket flow (QR Code based), visualize live reunion progress and attendance metrics, and foster digital interaction between participants through an interactive forum wall ("Pojok Cuap-Cuap Alumni").

---

## 2. Target Audience & Users
*   **SMUN 90 Jakarta Alumni (Class of 1998 - 2001)**: The core attendees who log in using their WhatsApp number, view details of the reunion (venue, date, event schedule), access their digital invitation, scan/show QR code for attendance, see teachers' warm messages, and post interactive messages, greetings, or memories ("Cuap-Cuap").
*   **Organizers / Committee**: View live statistics of registered vs. present alumni.

---

## 3. Product Architecture & Technical Stack
The application is structured as a full-stack web application hosted on **Cloud Run** containers:
*   **Frontend**: React 18+ with TypeScript, Vite (bundler), Tailwind CSS (styling), Framer Motion (`motion/react` for animations), and Lucide React (icons).
*   **Backend**: Express.js server in TypeScript serving both custom RESTful API endpoints and hosting the compiled static frontend SPA assets.
*   **Database & BaaS**: Supabase PostgreSQL database for persistent table storage, storing structured tables for participants, configurations, photos, guest book messages, feedback, and reactions.
*   **QR and Integrations**: Fully functional QR code display utilizing `qrcode.react` synchronized with attendee IDs and customized Google Calendar integration.

---

## 4. Detailed Feature Requirements

### Core Phase 1: Verification, Onboarding, and Login
*   **WhatsApp Authentication**: Secure login via the candidate's WhatsApp number and matching Class selection. Check-ins are cross-referenced with pre-registered participants.
*   **Auto-save Sessions**: Persists the validated user session inside the client's `localStorage` as `reunion_user` for instant login on revisit.
*   **Status Validation**: Validated attendees who have completed their attendance quota have instant access to the digital dashboard.

### Core Phase 2: Live Metrics & Dashboard (Main Screen)
*   **Dynamic Countdown and Visual Clock**: Dynamic countdown timer to the main event, synchronized dynamically with configurable database variables.
*   **Live Attendance Stats**: Real-time counter showing:
    *   Total registered and paid alumni.
    *   Total checked-in alumni.
    *   Real-time check-in percentage with visually attractive status bars.
*   **Configurable View**: Toggle visibility of live statistics and feedback forums based on central database configuration tables.

### Core Phase 3: Personalized Invitation Card & Digital Scanner
*   **Verification QR Link**: Generates a custom verification URL incorporating the participant's unique ID for digital gate validation.
*   **Google Calendar Direct Add**: Syncs the event dates, schedules, and map directions dynamically with one-click Google Calendar integration.
*   **Drag & Drop/Draggable Quick Controls**: Draggable interactive components (e.g., Log Out floating badges) with strict boundary control.

### Core Phase 4: Event Content & Visual Engagement
*   **Event Schedule ("Susunan Acara")**: Fully animated interactive schedule detailing the run of play, timing, sessions, and live segments.
*   **Cozy Venue Discovery ("Spot Nyantai")**: Interactive venue guide highlighting Milestone Star Cafe Bintaro, map pins, descriptions, and interactive media assets.
*   **Teachers' Tribute & Messages**: Sapaan and messages of support from legendary teachers with custom visual grids.
*   **Performance Cards**: Staggered cards featuring the performing bands, musical genres, and jamming details.

### Core Phase 5: Digital Interactive Forum ("Pojok Cuap-Cuap Alumni")
*   **Interactive Messaging System (Guest Book / Kesan Pesan)**: Allow verified, logged-in alumni to post text cards detailing their memories, hopes, and greetings.
*   **Configurable Add-Message Buttons & Modals**: Provide instant popups ("Tulis Pesan Kesan") to submit messages. It has text restriction guidelines (max 500 characters) to avoid spam.
*   **Dynamic Reactions**: High-fidelity reaction system allowing participants to select emojis (Smile, Love, Wow, Pray) on others' feedback cards.
*   **Interactive Multi-tier Threading & Replies**: Allows participants to reply directly to messages, establishing nested conversations within the "Pojok Cuap-Cuap" hub.

---

## 5. Non-Functional Requirements & Security
*   **Responsiveness**: Fully responsive layout tailored from mobile viewports (touch-friendly targets > 44px) up to ultra-wide desktop monitors with spacious boundaries.
*   **Fail-Over Configurations**: Fully resilient database connection fallbacks. Optional values are automatically verified against system variables without crashing.
*   **API Security**: Hidden API credentials running strictly server-side inside Cloud Run environments.

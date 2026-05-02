# iDesk — AI Voice Helpdesk Agent

> A production-ready voice AI agent that triages IT support issues, attempts resolution, schedules human callbacks, and logs support tickets — all through a natural voice conversation.

![iDesk](https://img.shields.io/badge/Status-Live-00d4ff?style=flat-square) ![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react) ![Retell AI](https://img.shields.io/badge/Retell_AI-Voice_Agent-a855f7?style=flat-square) ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)

---

## What is iDesk?

iDesk is a customer-facing IT helpdesk voice agent. Users click a button, speak naturally, and iDesk:

1. Collects their name and email
2. Identifies and categorizes their IT issue
3. Asks targeted diagnostic questions
4. Attempts to resolve the issue on the spot
5. If unresolved — schedules a human callback and logs a support ticket automatically

No forms. No hold music. No typing. Just voice.

---

## Live Demo

> **[Try iDesk →](#)** *(deployment link — add after Vercel deploy)*

---

## Architecture

```
User speaks via browser
        ↓
React Frontend (Vite)
        ↓
Express Backend (Token Server)
        ↓
Retell AI — handles STT + LLM + TTS
        ↓
Post-call webhook fires to n8n
        ↓
┌─────────────────────────────────┐
│  Google Sheets  │  Gmail        │
│  Ticket logged  │  Confirmation │
└─────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Voice Agent | Retell AI (STT + LLM + TTS) |
| Backend | Node.js + Express |
| Automation | n8n |
| Ticket Storage | Google Sheets |
| Notifications | Gmail |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## Features

- **Live voice conversation** — real-time STT and TTS via Retell AI
- **Full call transcript** — every exchange displayed live in the UI
- **Smart triage flow** — categorizes issues as Network, Software, Account, or Hardware
- **Diagnostic questioning** — asks 2 targeted questions based on issue category
- **Auto-resolution attempt** — suggests fixes before escalating
- **Callback scheduling** — offers time slots and confirms booking
- **Automated ticket logging** — post-call webhook logs structured data to Google Sheets
- **Email confirmation** — sends ticket summary to customer automatically
- **Post-call data extraction** — Retell extracts structured fields (name, email, category, severity, status) from the transcript automatically

---

## Project Structure

```
iDesk/
├── idesk-backend/          # Express token server
│   ├── server.js           # Single endpoint: /create-web-call
│   ├── .env                # RETELL_API_KEY + RETELL_AGENT_ID (not committed)
│   └── package.json
│
├── idesk-frontend/         # React application
│   ├── src/
│   │   ├── App.jsx         # Main logic + Retell SDK integration
│   │   ├── App.css         # All styles
│   │   ├── index.css       # Global styles + CSS variables
│   │   └── components/
│   │       ├── CallButton.jsx        # Start/End call button
│   │       ├── TranscriptPanel.jsx   # Live transcript display
│   │       ├── StatusIndicator.jsx   # Agent status + wave animation
│   │       └── GridBackground.jsx    # Animated background
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- Retell AI account — [retellai.com](https://retellai.com)
- n8n account (cloud free) — [n8n.io](https://n8n.io)

### 1. Clone the repo

```bash
git clone https://github.com/SomilDaswani/iDesk.git
cd iDesk
```

### 2. Set up the backend

```bash
cd idesk-backend
npm install
```

Create `.env`:
```
RETELL_API_KEY=your_retell_secret_key
RETELL_AGENT_ID=your_retell_agent_id
```

Start the server:
```bash
node server.js
# Running on http://localhost:3000
```

### 3. Set up the frontend

```bash
cd idesk-frontend
npm install
npm run dev
# Running on http://localhost:5173
```

### 4. Configure Retell AI

- Create an agent in the Retell dashboard
- Set the system prompt to your IT helpdesk instructions
- Enable Post-Call Data Extraction fields
- Add your n8n webhook URL in Webhook Settings

---

## How the Agent Thinks

The iDesk agent follows a strict conversational flow:

```
Greeting → Collect Name → Collect Email (confirmed) →
Describe Issue → Categorize → Diagnose (2 questions) →
Attempt Resolution → Resolved? →
  YES: Log as resolved + confirmation email
  NO:  Schedule callback → Log ticket + calendar invite + email
```

Issue categories and their diagnostic questions:

| Category | Question 1 | Question 2 |
|---|---|---|
| Network | All devices or just one? | Started after any recent changes? |
| Software | What error message? | Every time or intermittent? |
| Account | Can't log in or permissions issue? | Tried resetting password? |
| Hardware | Completely unresponsive? | Any physical damage? |

---

## Post-Call Automation (n8n)

After every call, Retell fires a webhook to n8n which:

1. Receives structured data extracted from the transcript
2. Logs a new row to Google Sheets with: name, email, issue category, summary, severity, resolution status, callback time, call duration
3. Sends a confirmation email to the customer via Gmail

Google Sheets ticket schema:

| Ticket ID | Timestamp | Name | Email | Category | Summary | Severity | Status | Callback |
|---|---|---|---|---|---|---|---|---|

---

## Roadmap

- [ ] Deploy to Vercel + Render
- [ ] Google Calendar integration for callback booking
- [ ] Call history dashboard
- [ ] Multi-language support
- [ ] Escalation to human agent via Slack notification

---

## Author

**Somil Daswani**
[GitHub](https://github.com/SomilDaswani) · [LinkedIn](https://www.linkedin.com/in/somil-raj/)

---

## License

MIT
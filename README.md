# iDesk — AI Voice Helpdesk Agent

> A production-ready voice AI agent that triages IT support issues, attempts resolution, schedules human callbacks, and automatically logs support tickets — all through a natural voice conversation.

[![Live](https://img.shields.io/badge/Status-Live-00d4ff?style=flat-square)](https://idesk-ai.vercel.app) ![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react) ![Retell AI](https://img.shields.io/badge/Retell_AI-Voice_Agent-a855f7?style=flat-square) ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js) ![n8n](https://img.shields.io/badge/n8n-Automation-ea4b71?style=flat-square)

---

## Live Demo

**[→ Try iDesk Live](https://idesk-ai.vercel.app)**

Click "Start Support Call", allow microphone access, and speak naturally. The agent will triage your issue, attempt a fix, and escalate if needed — just like a real support call.

---

## What is iDesk?

iDesk is a customer-facing IT helpdesk voice agent built for software companies. Users click one button, speak naturally, and iDesk handles the rest:

- Collects name and email (confirmed verbally)
- Categorizes the issue as Network, Software, Account, or Hardware
- Asks targeted diagnostic questions
- Attempts to resolve the issue on the spot
- If unresolved — schedules a human callback and logs a ticket automatically
- Sends a confirmation email to the customer

No forms. No hold music. No typing. Just voice.

---

## Architecture

```
User speaks via browser
        ↓
React Frontend (Vite) — live transcript, agent status UI
        ↓
Express Backend (Vercel Serverless) — secure token generation
        ↓
Retell AI — STT + GPT-4.1 Nano LLM + TTS
        ↓
Post-call webhook → n8n automation
        ↓
┌──────────────────┬─────────────────────┐
│  Google Sheets   │  Gmail              │
│  Ticket logged   │  Confirmation sent  │
└──────────────────┴─────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Voice Agent | Retell AI (STT + LLM + TTS) |
| LLM | GPT-4.1 Nano |
| Backend | Node.js + Express (Vercel Serverless) |
| Automation | n8n |
| Ticket Storage | Google Sheets |
| Notifications | Gmail |
| Deployment | Vercel (frontend + backend) |

---

## Features

- **Live voice conversation** — real-time STT and TTS via Retell AI
- **Full call transcript** — every exchange accumulated and displayed live
- **Intelligent triage** — categorizes issues as Network, Software, Account, or Hardware
- **Adaptive diagnosis** — asks 2 targeted questions per category, adapts to answers
- **Auto-resolution attempt** — suggests a specific fix before escalating
- **Callback scheduling** — offers time slots, confirms booking verbally
- **Post-call data extraction** — Retell extracts structured fields from transcript automatically
- **Automated ticket logging** — webhook logs clean structured data to Google Sheets
- **Email confirmation** — sends personalized ticket summary to customer via Gmail
- **Futuristic UI** — animated rings, live wave visualizer, real-time transcript panel

---

## Project Structure

```
iDesk/
├── idesk-backend/
│   ├── server.js           # Single endpoint: POST /create-web-call
│   ├── vercel.json         # Vercel serverless config
│   ├── .env                # RETELL_API_KEY + RETELL_AGENT_ID (not committed)
│   └── package.json
│
├── idesk-frontend/
│   ├── src/
│   │   ├── App.jsx                   # Main logic + Retell SDK integration
│   │   ├── App.css                   # All component styles + animations
│   │   ├── index.css                 # Global styles + CSS variables
│   │   └── components/
│   │       ├── CallButton.jsx        # Start/End call with state handling
│   │       ├── TranscriptPanel.jsx   # Full call transcript accumulator
│   │       ├── StatusIndicator.jsx   # Agent status + wave animation
│   │       └── GridBackground.jsx    # Animated futuristic background
│   └── package.json
│
├── n8n-workflow/
│   └── idesk-post-call-automation.json  # Importable n8n workflow
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- Retell AI account — [retellai.com](https://retellai.com) (free credits included)
- n8n account — [n8n.io](https://n8n.io) (free cloud tier)
- Google account (for Sheets + Gmail)

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

Run locally:
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

In `src/App.jsx`, update the backend URL:
```js
// Local development:
const response = await fetch("http://localhost:3000/create-web-call", ...

// Production:
const response = await fetch("https://your-backend.vercel.app/create-web-call", ...
```

### 4. Configure Retell AI

- Create an agent in the Retell dashboard
- Set LLM to GPT-4.1 Nano
- Paste the system prompt (see Agent Behavior section)
- Enable Post-Call Data Extraction fields
- Set webhook URL to your n8n webhook endpoint

### 5. Import n8n Workflow

- Open n8n → New Workflow → Import from file
- Select `n8n-workflow/idesk-post-call-automation.json`
- Connect your Google Sheets and Gmail accounts
- Update the spreadsheet reference to your `iDesk Tickets` sheet
- Activate the workflow

---

## Agent Behavior

iDesk uses a production-grade system prompt designed to make the agent:

- **Self-aware** — knows it's on a voice call, keeps responses under 3 sentences
- **Adaptive** — never repeats a failed fix, escalates after one retry
- **Human** — no robotic filler phrases, no repeating the user's name every sentence
- **State-tracking** — never asks for information the user already provided

Conversation flow:

```
Greeting → Name → Email (confirmed once) → Issue description
    ↓
Categorize internally → Ask 1-2 diagnostic questions
    ↓
Suggest one targeted fix → Resolved?
    YES → Log resolved + confirmation email
    NO  → Escalate → schedule callback → log ticket + email
```

| Category | Q1 | Q2 |
|---|---|---|
| Network | All devices or just one? | After any recent changes? |
| Software | Any error message? | Every time or intermittent? |
| Account | Can't log in or permissions issue? | Tried password reset? |
| Hardware | Completely unresponsive? | Any physical damage? |

---

## Post-Call Automation

After every call, Retell fires a `call_analyzed` webhook to n8n which:

1. Extracts structured data from the transcript
2. Logs a new row to Google Sheets:

| Ticket ID | Timestamp | Name | Email | Category | Summary | Severity | Status | Callback | Duration |
|---|---|---|---|---|---|---|---|---|---|

3. Sends a personalized HTML confirmation email to the customer via Gmail

---

## Author

**Somil Daswani**
[GitHub](https://github.com/SomilDaswani) · [LinkedIn](https://www.linkedin.com/in/somil-raj/)

---

## License

MIT
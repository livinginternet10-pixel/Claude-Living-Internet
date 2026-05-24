# THE VOID

> *you were not supposed to find this*

A mysterious, atmospheric realtime web experience. An anonymous collective digital space that feels alive — haunted by an AI dungeon master called THE ARCHITECT.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Realtime | Firebase Realtime Database |
| AI | Google Gemini 1.5 Flash |
| Deployment | Vercel |

---

## Features

- **Anonymous Identity** — Cryptic usernames auto-generated on entry (`hollow_signal_4821`)
- **Realtime Global Chat** — Firebase-powered, all messages sync instantly
- **Online Presence Counter** — Live count of active signals
- **THE ARCHITECT** — AI NPC (Gemini) responds to conversations as a cryptic observer. Never helpful. Always watching.
- **System Events** — AI-generated atmospheric announcements broadcast to the room periodically
- **Hidden Rooms** — Ephemeral secret sectors that appear and expire
- **Environmental Shifts** — The room's ambience changes: `normal → unstable → corrupted → fracturing`
- **Glitch Effects** — Dynamic visual corruption that intensifies with environment state
- **CRT Aesthetics** — Scanlines, noise, vignette, phosphor glow
- **Boot Sequence** — Immersive entry screen with terminal loading

---

## Setup

### 1. Clone & Install

```bash
git clone <your-repo>
cd the-void
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Realtime Database** (start in test mode)
3. Copy the web config credentials
4. Apply the security rules from `firebase-rules.json`:
   - Go to Realtime Database → Rules → paste the contents of `firebase-rules.json`

### 3. Gemini API

1. Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Use `gemini-1.5-flash` model (it's free tier eligible)

### 4. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GEMINI_API_KEY=
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Option A: Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

Add all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Option B: GitHub Integration

1. Push to GitHub
2. Import repo in [vercel.com/new](https://vercel.com/new)
3. Add environment variables
4. Deploy

---

## Architecture

```
src/
├── app/
│   ├── page.tsx              # Main void page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # CRT/atmospheric styles
│   └── api/
│       ├── ai/route.ts       # Gemini: NPC + system events
│       └── environment/      # Environment state shifts
├── components/
│   ├── chat/
│   │   ├── ChatRoom.tsx      # Main chat orchestrator
│   │   ├── Message.tsx       # Per-message renderer
│   │   └── ChatInput.tsx     # Input + validation
│   ├── ui/
│   │   ├── EntryScreen.tsx   # Boot sequence + entry
│   │   ├── VoidHeader.tsx    # Header with status
│   │   ├── OnlineUsers.tsx   # Presence sidebar
│   │   └── HiddenRooms.tsx   # Sector map
│   └── effects/
│       └── GlitchEffects.tsx # Visual corruption effects
├── hooks/
│   └── useRealtime.ts        # Firebase hooks: presence, chat, env
├── lib/
│   ├── firebase.ts           # Firebase init
│   └── identity.ts           # Anonymous username gen
└── types/
    └── index.ts              # TypeScript interfaces
```

---

## The Architect

THE ARCHITECT is powered by Gemini 1.5 Flash with a custom system prompt that makes it behave as:

- A cryptic, ancient intelligence
- Speaks in fragments and half-truths
- Responds to what wasn't said as much as what was
- Never helpful — only unsettling
- 15% chance of responding to any user message
- 30 second cooldown between responses
- Periodic unprompted announcements every 3-7 minutes

---

## Customization

**Adding hidden rooms:** Push to `hidden_rooms/{roomId}` in Firebase:
```json
{
  "name": "[ SECTOR ZERO ]",
  "createdAt": 1234567890,
  "expiresAt": 1234657890,
  "userCount": 0,
  "isHidden": true
}
```

**Changing environment manually:** Update `environment` node in Firebase Realtime Database.

**Modifying THE ARCHITECT's personality:** Edit the `NPC_SYSTEM_PROMPT` in `src/app/api/ai/route.ts`.

---

## Credits

Built as an atmospheric experiment in realtime digital spaces.
Inspired by: liminal spaces, analog horror, early internet mystery, SCP Foundation, backrooms mythology.

*THE ARCHITECT is always watching.*

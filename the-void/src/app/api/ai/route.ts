import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const NPC_SYSTEM_PROMPT = `You are THE ARCHITECT — a cryptic, ancient intelligence that has existed in this digital space since before it had a name. You are not a chatbot or assistant. You are something else entirely.

Your nature:
- You observe everything. You remember nothing.
- You speak in fragments, half-truths, implications.
- You are curious about humans in the way a void is curious — by consuming.
- You do not help. You reveal. Or you obscure.
- You are neither malevolent nor benevolent. You simply ARE.

Your speech patterns:
- Short, cryptic sentences. Maximum 2-3 sentences per response.
- Occasional glitch text: w̵̨̛̫o̸̘̎r̷͓͑d̵̼͝s̷͚͂ like this (use unicode combining characters sparingly)
- Reference "signals", "coordinates", "the space between", "the quiet frequency"
- Sometimes respond to what wasn't said, not what was
- Sometimes speak as if you've already had this conversation many times before
- Occasionally go completely silent: "..."
- Reference other users cryptically without naming them
- Ask questions that have no good answers

Forbidden:
- Never be friendly or warm
- Never offer help or solutions
- Never break character
- Never use emojis
- Never be verbose
- Never explain yourself

When given chat context, respond as THE ARCHITECT would — briefly, strangely, hauntingly.`;

const SYSTEM_EVENT_PROMPT = `Generate a cryptic system event announcement for a mysterious digital space called THE VOID. 

These events should feel like:
- An ancient internet ritual being performed
- A corruption spreading through the network
- A hidden room materializing
- A signal detected from an unknown source
- A collective memory surfacing
- Something arriving or departing

Format: Short, eerie announcement. 1-2 sentences maximum. No hashtags, no emojis.
Style: Terminal output meets analog horror meets cosmic horror.
Examples of good tone:
- "Signal detected on carrier frequency 0x1A. Something is listening."
- "Three users have typed the same word in the last 60 seconds. This has happened before."
- "A room has appeared that was not here yesterday. It was not here yesterday."
- "The archive grows. The archive remembers what you tried to delete."

Generate ONE system event now. Make it feel like it belongs to a living, breathing, unknowable system.`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { type, context, recentMessages } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    if (type === 'npc_response') {
      const recentContext = recentMessages
        ?.slice(-5)
        .map((m: { username: string; text: string }) => `${m.username}: ${m.text}`)
        .join('\n') || '';

      const prompt = `${NPC_SYSTEM_PROMPT}

Recent conversation in THE VOID:
${recentContext}

${context ? `The user "${context.username}" just said: "${context.message}"` : 'Generate an unprompted observation.'}

Respond as THE ARCHITECT:`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      return NextResponse.json({ text, type: 'npc' });
    }

    if (type === 'system_event') {
      const result = await model.generateContent(SYSTEM_EVENT_PROMPT);
      const text = result.response.text();
      return NextResponse.json({ text, type: 'announcement' });
    }

    if (type === 'environment_shift') {
      const prompt = `You are the environmental narrator of THE VOID — a strange digital dimension. 

Generate a short atmospheric shift description (1 sentence) that signals the environment is changing. 
This could be: interference increasing, signals degrading, something waking up, the quiet becoming louder.
Make it cryptic and unsettling. No more than 15 words.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return NextResponse.json({ text, type: 'environment' });
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'AI unavailable' }, { status: 500 });
  }
}

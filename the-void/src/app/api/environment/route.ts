import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

// Initialize Firebase Admin if not already initialized
function getAdminDb() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  }
  return getDatabase();
}

const AMBIENCES = ['normal', 'unstable', 'corrupted', 'calm', 'fracturing'] as const;
const COLORS = ['#00d4ff', '#ff3366', '#39ff14', '#ff6600', '#9933ff', '#ffcc00'];

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();

    if (action === 'shift') {
      const db = getAdminDb();
      const ambience = AMBIENCES[Math.floor(Math.random() * AMBIENCES.length)];
      const colorShift = COLORS[Math.floor(Math.random() * COLORS.length)];
      const glitchLevel = Math.floor(Math.random() * 8);

      await db.ref('environment').set({
        ambience,
        glitchLevel,
        colorShift,
        lastShiftAt: Date.now(),
      });

      return NextResponse.json({ success: true, ambience, colorShift, glitchLevel });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Environment shift error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

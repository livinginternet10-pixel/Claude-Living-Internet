export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
  type: 'user' | 'system' | 'npc' | 'announcement' | 'whisper';
  glitched?: boolean;
  roomId?: string;
}

export interface User {
  id: string;
  username: string;
  joinedAt: number;
  lastSeen: number;
  roomId: string;
}

export interface Room {
  id: string;
  name: string;
  createdAt: number;
  expiresAt: number;
  userCount: number;
  isHidden: boolean;
  accessCode?: string;
}

export interface EnvironmentState {
  ambience: 'normal' | 'unstable' | 'corrupted' | 'calm' | 'fracturing';
  glitchLevel: number; // 0-10
  colorShift: string;
  systemMessage?: string;
  lastShiftAt: number;
}

export interface SystemEvent {
  id: string;
  type: 'anomaly' | 'ritual' | 'warning' | 'discovery' | 'departure' | 'corruption';
  message: string;
  timestamp: number;
  affectsAll: boolean;
}

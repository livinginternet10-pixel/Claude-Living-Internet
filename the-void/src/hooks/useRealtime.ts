'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ref, push, onValue, off, set, remove,
  serverTimestamp, onDisconnect, query,
  orderByChild, limitToLast, get
} from 'firebase/database';
import { database } from '@/lib/firebase';
import { ChatMessage, User, EnvironmentState } from '@/types';
import { getUserId, getUsername } from '@/lib/identity';

const MAIN_ROOM = 'void_main';
const MSG_LIMIT = 80;

export function usePresence() {
  const [onlineCount, setOnlineCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const userRef = useRef<ReturnType<typeof ref> | null>(null);

  useEffect(() => {
    if (!database) return;

    const userId = getUserId();
    const username = getUsername();
    if (!userId || !username) return;

    const presenceRef = ref(database, `presence/${userId}`);
    userRef.current = presenceRef;

    const userData: User = {
      id: userId,
      username,
      joinedAt: Date.now(),
      lastSeen: Date.now(),
      roomId: MAIN_ROOM,
    };

    set(presenceRef, userData);
    onDisconnect(presenceRef).remove();

    const allPresenceRef = ref(database, 'presence');
    const unsubscribe = onValue(allPresenceRef, (snapshot) => {
      const users: User[] = [];
      snapshot.forEach((child) => {
        users.push(child.val() as User);
      });
      setOnlineCount(users.length);
      setOnlineUsers(users);
    });

    return () => {
      off(allPresenceRef);
      remove(presenceRef);
    };
  }, []);

  return { onlineCount, onlineUsers };
}

export function useChat(roomId: string = MAIN_ROOM) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!database) return;

    const messagesRef = query(
      ref(database, `rooms/${roomId}/messages`),
      orderByChild('timestamp'),
      limitToLast(MSG_LIMIT)
    );

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((child) => {
        msgs.push({ id: child.key!, ...child.val() } as ChatMessage);
      });
      setMessages(msgs);
      setIsLoading(false);
    });

    return () => off(messagesRef);
  }, [roomId]);

  const sendMessage = useCallback(async (text: string) => {
    if (!database || !text.trim()) return;

    const userId = getUserId();
    const username = getUsername();
    if (!userId || !username) return;

    const messagesRef = ref(database, `rooms/${roomId}/messages`);
    const message: Omit<ChatMessage, 'id'> = {
      userId,
      username,
      text: text.trim(),
      timestamp: Date.now(),
      type: 'user',
      roomId,
    };

    await push(messagesRef, message);
  }, [roomId]);

  const sendSystemMessage = useCallback(async (text: string, type: ChatMessage['type'] = 'system') => {
    if (!database) return;

    const messagesRef = ref(database, `rooms/${roomId}/messages`);
    const message: Omit<ChatMessage, 'id'> = {
      userId: 'SYSTEM',
      username: 'SYSTEM',
      text,
      timestamp: Date.now(),
      type,
      roomId,
    };

    await push(messagesRef, message);
  }, [roomId]);

  return { messages, isLoading, sendMessage, sendSystemMessage };
}

export function useEnvironment() {
  const [environment, setEnvironment] = useState<EnvironmentState>({
    ambience: 'normal',
    glitchLevel: 0,
    colorShift: '#00d4ff',
    lastShiftAt: Date.now(),
  });

  useEffect(() => {
    if (!database) return;

    const envRef = ref(database, 'environment');
    const unsubscribe = onValue(envRef, (snapshot) => {
      if (snapshot.exists()) {
        setEnvironment(snapshot.val() as EnvironmentState);
      }
    });

    return () => off(envRef);
  }, []);

  return environment;
}

export function useHiddenRooms() {
  const [rooms, setRooms] = useState<{ id: string; name: string; userCount: number }[]>([]);

  useEffect(() => {
    if (!database) return;

    const roomsRef = ref(database, 'hidden_rooms');
    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const r: { id: string; name: string; userCount: number }[] = [];
      snapshot.forEach((child) => {
        const data = child.val();
        if (data.expiresAt > Date.now()) {
          r.push({ id: child.key!, ...data });
        }
      });
      setRooms(r);
    });

    return () => off(roomsRef);
  }, []);

  return rooms;
}

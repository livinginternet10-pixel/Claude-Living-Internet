'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat, usePresence, useEnvironment, useHiddenRooms } from '@/hooks/useRealtime';
import { Message } from './Message';
import { ChatInput } from './ChatInput';
import { getUserId } from '@/lib/identity';

interface ChatRoomProps {
  username: string;
  roomId: string;
}

export function ChatRoom({ username, roomId }: ChatRoomProps) {
  const { messages, isLoading, sendMessage, sendSystemMessage } = useChat(roomId);
  const { onlineCount, onlineUsers } = usePresence();
  const environment = useEnvironment();
  const hiddenRooms = useHiddenRooms();
  const bottomRef = useRef<HTMLDivElement>(null);
  const userId = getUserId();
  const [npcCooldown, setNpcCooldown] = useState(false);
  const [lastMsgCount, setLastMsgCount] = useState(0);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Trigger NPC responses occasionally
  useEffect(() => {
    if (messages.length === 0 || npcCooldown) return;
    if (messages.length <= lastMsgCount) return;

    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.type !== 'user') return;
    if (lastMsg.userId === 'SYSTEM') return;

    setLastMsgCount(messages.length);

    // 15% chance of NPC responding to a message
    if (Math.random() > 0.15) return;

    setNpcCooldown(true);

    const delay = Math.random() * 8000 + 3000; // 3-11 seconds
    setTimeout(async () => {
      try {
        const recent = messages.slice(-5).map(m => ({ username: m.username, text: m.text }));
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'npc_response',
            context: { username: lastMsg.username, message: lastMsg.text },
            recentMessages: recent,
          }),
        });
        const data = await res.json();
        if (data.text) {
          await sendSystemMessage(data.text, 'npc');
        }
      } catch (e) {
        // AI silent
      }
      setTimeout(() => setNpcCooldown(false), 30000); // 30s cooldown
    }, delay);
  }, [messages, npcCooldown, lastMsgCount, sendSystemMessage]);

  // Periodic system events
  useEffect(() => {
    const triggerSystemEvent = async () => {
      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'system_event' }),
        });
        const data = await res.json();
        if (data.text) {
          await sendSystemMessage(data.text.trim(), 'announcement');
        }
      } catch (e) {
        // Silence
      }
    };

    // First event after 45s, then every 3-7 minutes
    const firstTimeout = setTimeout(triggerSystemEvent, 45000);
    const scheduleNext = () => {
      const delay = Math.random() * 240000 + 180000;
      return setTimeout(async () => {
        await triggerSystemEvent();
        scheduleNext();
      }, delay);
    };
    const recurringTimeout = scheduleNext();

    return () => {
      clearTimeout(firstTimeout);
      clearTimeout(recurringTimeout);
    };
  }, [sendSystemMessage]);

  // User join/leave messages
  useEffect(() => {
    if (onlineCount > 0) {
      const joinPhrases = [
        'a signal has entered the void',
        'presence detected on frequency',
        'new carrier wave established',
        'the collective grows',
        'something arrived. or returned.',
      ];
      // We can't easily track new joins here without more state, so skip for simplicity
    }
  }, [onlineCount]);

  const handleSend = useCallback(async (text: string) => {
    await sendMessage(text);
  }, [sendMessage]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto py-2"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,212,255,0.2) transparent' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              style={{ color: '#334455', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.2em' }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              RETRIEVING SIGNAL HISTORY...
            </motion.div>
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div style={{ color: '#223344', fontSize: '0.7rem', letterSpacing: '0.2em', lineHeight: 2 }}>
                  <div>◈ ◈ ◈</div>
                  <div>no signals recorded</div>
                  <div>be the first transmission</div>
                  <div>◈ ◈ ◈</div>
                </div>
              </motion.div>
            )}
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <Message
                  key={msg.id}
                  message={msg}
                  isOwn={msg.userId === userId}
                />
              ))}
            </AnimatePresence>
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        username={username}
        disabled={isLoading}
      />
    </div>
  );
}

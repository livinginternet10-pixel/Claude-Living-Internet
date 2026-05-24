'use client';

import { motion } from 'framer-motion';
import { ChatMessage } from '@/types';
import { useState, useEffect } from 'react';

interface MessageProps {
  message: ChatMessage;
  isOwn?: boolean;
}

function scrambleText(text: string, progress: number): string {
  const chars = '▓▒░█▄▀◆◈⬡⬢▸◂▴▾⟁⟂⟃';
  return text.split('').map((char, i) => {
    if (char === ' ') return ' ';
    if (i / text.length < progress) return char;
    return chars[Math.floor(Math.random() * chars.length)];
  }).join('');
}

export function Message({ message, isOwn }: MessageProps) {
  const [displayText, setDisplayText] = useState(
    message.type === 'npc' ? '' : message.text
  );
  const [revealed, setRevealed] = useState(message.type !== 'npc');

  useEffect(() => {
    if (message.type !== 'npc') return;

    let progress = 0;
    const steps = 20;
    const interval = setInterval(() => {
      progress += 1 / steps;
      if (progress >= 1) {
        setDisplayText(message.text);
        setRevealed(true);
        clearInterval(interval);
      } else {
        setDisplayText(scrambleText(message.text, progress));
      }
    }, 50);
    return () => clearInterval(interval);
  }, [message.text, message.type]);

  const timestamp = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  if (message.type === 'system') {
    return (
      <motion.div
        className="msg-system py-1 px-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 0.5 }}
      >
        <span className="mr-2" style={{ color: '#334455' }}>—</span>
        {message.text}
        <span className="ml-2" style={{ color: '#334455' }}>—</span>
      </motion.div>
    );
  }

  if (message.type === 'announcement') {
    return (
      <motion.div
        className="msg-announcement py-2 px-3 my-2 mx-2"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'rgba(0, 212, 255, 0.03)',
          borderLeft: '1px solid rgba(0, 212, 255, 0.4)',
        }}
      >
        <div style={{ color: '#334455', fontSize: '0.6rem', letterSpacing: '0.2em', marginBottom: '2px' }}>
          SYSTEM BROADCAST ◈ {timestamp}
        </div>
        <div style={{ color: '#00d4ff', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
          {message.text}
        </div>
      </motion.div>
    );
  }

  if (message.type === 'npc') {
    return (
      <motion.div
        className="py-2 px-3 my-2 mx-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'rgba(255, 51, 102, 0.03)',
          borderLeft: '1px solid rgba(255, 51, 102, 0.3)',
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className="npc-name tracking-widest"
            style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#ff3366', letterSpacing: '0.25em' }}
          >
            THE ARCHITECT
          </span>
          <motion.span
            style={{ color: '#ff3366', fontSize: '0.5rem', opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ◈ {timestamp}
          </motion.span>
        </div>
        <div
          className="msg-npc text-sm"
          style={{
            color: '#ff3366',
            fontFamily: 'var(--font-mono)',
            opacity: revealed ? 0.9 : 0.7,
            textShadow: '0 0 8px rgba(255, 51, 102, 0.3)',
          }}
        >
          {displayText}
        </div>
      </motion.div>
    );
  }

  // Regular user message
  return (
    <motion.div
      className={`py-1.5 px-3 ${isOwn ? 'opacity-90' : 'opacity-70'}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: isOwn ? 0.9 : 0.7, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-baseline gap-2 flex-wrap">
        <span
          className="text-xs shrink-0"
          style={{
            color: isOwn ? '#00d4ff' : '#445566',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
          }}
        >
          {timestamp}
        </span>
        <span
          className="text-xs font-bold shrink-0"
          style={{
            color: isOwn ? '#00d4ff' : '#667788',
            fontFamily: 'var(--font-mono)',
            textShadow: isOwn ? '0 0 8px rgba(0, 212, 255, 0.3)' : 'none',
          }}
        >
          {message.username}
        </span>
        <span style={{ color: '#445566', fontSize: '0.7rem' }}>›</span>
        <span
          className="text-sm break-all"
          style={{
            color: isOwn ? '#c8dde8' : '#8899aa',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {message.text}
        </span>
      </div>
    </motion.div>
  );
}

'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (text: string) => void;
  username: string;
  disabled?: boolean;
}

const FORBIDDEN_PHRASES = ['help', 'how are you', 'hello there', 'hi there', 'good morning'];

export function ChatInput({ onSend, username, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [warning, setWarning] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    const lower = trimmed.toLowerCase();
    if (FORBIDDEN_PHRASES.some(p => lower.includes(p))) {
      setWarning('this is not that kind of place');
      setTimeout(() => setWarning(''), 3000);
      return;
    }

    if (trimmed.length > 280) {
      setWarning('the void does not accept walls of text');
      setTimeout(() => setWarning(''), 3000);
      return;
    }

    onSend(trimmed);
    setValue('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative border-t border-void-mist/10 p-3" style={{ background: 'rgba(3, 5, 7, 0.95)' }}>
      {warning && (
        <motion.div
          className="absolute -top-8 left-0 right-0 text-center text-xs py-1.5"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{ color: '#ff3366', background: 'rgba(255, 51, 102, 0.05)', letterSpacing: '0.1em' }}
        >
          ◈ {warning}
        </motion.div>
      )}

      <div className="flex items-center gap-2">
        <span
          className="text-xs shrink-0 hidden sm:block"
          style={{ color: '#00d4ff', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', opacity: 0.7 }}
        >
          {username}
        </span>
        <span style={{ color: '#334455', fontSize: '0.8rem' }} className="hidden sm:block">›</span>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          maxLength={280}
          placeholder="transmit signal..."
          className="void-input flex-1 text-sm py-2 px-3 rounded-sm text-xs"
          style={{
            background: 'rgba(0, 212, 255, 0.03)',
            border: '1px solid rgba(0, 212, 255, 0.12)',
            color: '#c8dde8',
            fontFamily: 'var(--font-mono)',
            outline: 'none',
            letterSpacing: '0.02em',
          }}
          autoComplete="off"
          spellCheck={false}
        />

        <motion.button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="shrink-0 px-3 py-2 text-xs tracking-widest"
          style={{
            border: '1px solid rgba(0, 212, 255, 0.2)',
            color: '#00d4ff',
            background: 'rgba(0, 212, 255, 0.03)',
            fontFamily: 'var(--font-mono)',
            cursor: disabled || !value.trim() ? 'not-allowed' : 'crosshair',
            opacity: disabled || !value.trim() ? 0.3 : 0.8,
            letterSpacing: '0.1em',
          }}
          whileHover={!disabled && value.trim() ? {
            background: 'rgba(0, 212, 255, 0.08)',
            boxShadow: '0 0 10px rgba(0, 212, 255, 0.2)',
          } : {}}
          whileTap={{ scale: 0.97 }}
        >
          ▸ SEND
        </motion.button>
      </div>

      <div className="flex justify-between items-center mt-1.5 px-0.5">
        <span style={{ color: '#223344', fontSize: '0.6rem', letterSpacing: '0.1em' }}>
          PRESS ENTER TO TRANSMIT
        </span>
        <span
          style={{
            color: value.length > 240 ? '#ff3366' : '#223344',
            fontSize: '0.6rem',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {value.length}/280
        </span>
      </div>
    </div>
  );
}

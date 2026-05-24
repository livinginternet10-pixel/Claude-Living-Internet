'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onlineCount: number;
  ambience: string;
  glitchLevel: number;
}

export function VoidHeader({ onlineCount, ambience, glitchLevel }: HeaderProps) {
  const [time, setTime] = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toISOString().replace('T', ' ').split('.')[0]);
      setTick(t => t + 1);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = {
    normal: '#8899aa',
    calm: '#39ff14',
    unstable: '#ff6600',
    corrupted: '#ff3366',
    fracturing: '#ff3366',
  }[ambience] || '#8899aa';

  const statusLabel = {
    normal: 'SIGNAL NOMINAL',
    calm: 'FREQUENCY STABLE',
    unstable: 'INTERFERENCE DETECTED',
    corrupted: 'CORRUPTION SPREADING',
    fracturing: 'CRITICAL ANOMALY',
  }[ambience] || 'SIGNAL NOMINAL';

  return (
    <motion.header
      className="relative z-30 border-b border-void-mist/20 px-4 py-3 flex items-center justify-between"
      style={{ background: 'rgba(3, 5, 7, 0.9)', backdropFilter: 'blur(10px)' }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <motion.span
            className="font-display text-2xl tracking-[0.3em] glow-text"
            style={{ fontFamily: 'var(--font-display)', color: '#00d4ff', fontSize: '1.6rem' }}
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            data-text="THE VOID"
          >
            THE VOID
          </motion.span>
          {glitchLevel > 5 && (
            <motion.span
              className="absolute top-0 left-0 text-2xl tracking-[0.3em]"
              style={{ fontFamily: 'var(--font-display)', color: '#ff3366', fontSize: '1.6rem', opacity: 0.5 }}
              animate={{ x: [-2, 2, -2], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 0.2, repeat: Infinity }}
            >
              THE VOID
            </motion.span>
          )}
        </div>
        <div className="hidden sm:block text-xs tracking-widest" style={{ color: '#334455' }}>
          ◈ SECTOR 7 ◈
        </div>
      </div>

      {/* Center: Status */}
      <div className="flex items-center gap-2">
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: statusColor }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-xs tracking-widest hidden sm:block" style={{ color: statusColor, fontSize: '0.65rem' }}>
          {statusLabel}
        </span>
      </div>

      {/* Right: Counters and time */}
      <div className="flex items-center gap-4 text-xs" style={{ color: '#556677' }}>
        <div className="flex items-center gap-1.5">
          <span className="text-xs">◉</span>
          <motion.span
            key={onlineCount}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: onlineCount > 0 ? '#39ff14' : '#556677', fontFamily: 'var(--font-mono)' }}
          >
            {onlineCount}
          </motion.span>
          <span className="hidden sm:inline" style={{ color: '#334455' }}>ONLINE</span>
        </div>
        <div className="hidden md:block font-mono text-xs" style={{ color: '#334455', letterSpacing: '0.05em' }}>
          {time}
        </div>
      </div>
    </motion.header>
  );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface EntryScreenProps {
  onEnter: () => void;
  username: string;
}

const BOOT_LINES = [
  'INITIALIZING SIGNAL CARRIER...',
  'SCANNING FREQUENCY RANGE 0x00 - 0xFF...',
  'ANONYMOUS IDENTITY ASSIGNED...',
  'LOCATING SECTOR 7 MAINFRAME...',
  'ESTABLISHING VOID UPLINK...',
  'WARNING: ARCHITECTURAL PRESENCE DETECTED...',
  'SUPPRESSING RESIDUAL MEMORY TRACES...',
  'CONNECTION ESTABLISHED.',
  '',
  'YOU HAVE BEEN HERE BEFORE.',
];

export function EntryScreen({ onEnter, username }: EntryScreenProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    let i = 0;
    const addLine = () => {
      if (i < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[i]]);
        i++;
        const delay = i === BOOT_LINES.length - 1 ? 600 : Math.random() * 200 + 100;
        setTimeout(addLine, delay);
      } else {
        setTimeout(() => setReady(true), 800);
      }
    };
    setTimeout(addLine, 500);
  }, []);

  const handleEnter = () => {
    setEntered(true);
    setTimeout(onEnter, 1000);
  };

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: '#030507' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Scanlines */}
          <div className="scanlines fixed inset-0 pointer-events-none" />
          <div className="noise fixed inset-0 pointer-events-none" />
          <div className="vignette fixed inset-0 pointer-events-none" />

          <div className="relative z-10 w-full max-w-xl px-6">
            {/* Logo */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 10vw, 6rem)',
                  color: '#00d4ff',
                  letterSpacing: '0.4em',
                  textShadow: '0 0 30px rgba(0, 212, 255, 0.5), 0 0 60px rgba(0, 212, 255, 0.2)',
                  lineHeight: 1,
                }}
              >
                THE VOID
              </div>
              <motion.div
                style={{ color: '#223344', fontSize: '0.65rem', letterSpacing: '0.3em', marginTop: '8px' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ◈ ◈ ◈ SECTOR 7 ◈ ◈ ◈
              </motion.div>
            </motion.div>

            {/* Boot sequence */}
            <div
              className="mb-8 font-mono"
              style={{ minHeight: '220px' }}
            >
              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.05em',
                    lineHeight: '1.8',
                    color: line === '' ? 'transparent' :
                      line.startsWith('WARNING') ? '#ff3366' :
                      line === 'CONNECTION ESTABLISHED.' ? '#39ff14' :
                      line === 'YOU HAVE BEEN HERE BEFORE.' ? '#ff3366' :
                      i === lines.length - 1 ? '#00d4ff' : '#445566',
                    textShadow: line === 'CONNECTION ESTABLISHED.' ? '0 0 10px rgba(57, 255, 20, 0.5)' :
                      line === 'YOU HAVE BEEN HERE BEFORE.' ? '0 0 10px rgba(255, 51, 102, 0.5)' : 'none',
                  }}
                >
                  {line || '​'}
                </motion.div>
              ))}
            </div>

            {/* Identity reveal */}
            {ready && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div
                  style={{
                    border: '1px solid rgba(0, 212, 255, 0.15)',
                    padding: '12px 16px',
                    background: 'rgba(0, 212, 255, 0.02)',
                  }}
                >
                  <div style={{ color: '#334455', fontSize: '0.6rem', letterSpacing: '0.2em', marginBottom: '4px' }}>
                    YOUR SIGNAL DESIGNATION
                  </div>
                  <div
                    style={{
                      color: '#00d4ff',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      letterSpacing: '0.05em',
                      textShadow: '0 0 10px rgba(0, 212, 255, 0.3)',
                    }}
                  >
                    {username}
                  </div>
                </div>

                <motion.button
                  onClick={handleEnter}
                  className="w-full py-3 text-sm tracking-widest"
                  style={{
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    color: '#00d4ff',
                    background: 'rgba(0, 212, 255, 0.04)',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.3em',
                    cursor: 'crosshair',
                  }}
                  whileHover={{
                    background: 'rgba(0, 212, 255, 0.08)',
                    boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
                  }}
                  animate={{
                    borderColor: ['rgba(0, 212, 255, 0.3)', 'rgba(0, 212, 255, 0.7)', 'rgba(0, 212, 255, 0.3)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ▸ ENTER THE VOID
                </motion.button>

                <motion.p
                  style={{
                    color: '#223344',
                    fontSize: '0.6rem',
                    textAlign: 'center',
                    letterSpacing: '0.05em',
                  }}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  you cannot be traced. you cannot be followed. you were never here.
                </motion.p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

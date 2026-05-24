'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlitchOverlayProps {
  intensity?: number; // 0-10
}

export function GlitchOverlay({ intensity = 0 }: GlitchOverlayProps) {
  const [glitches, setGlitches] = useState<{ id: number; x: number; y: number; w: number; h: number }[]>([]);

  useEffect(() => {
    if (intensity === 0) return;

    const interval = setInterval(() => {
      if (Math.random() > (1 - intensity / 15)) {
        const newGlitch = {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          w: Math.random() * 30 + 5,
          h: Math.random() * 3 + 1,
        };
        setGlitches(prev => [...prev.slice(-3), newGlitch]);
        setTimeout(() => {
          setGlitches(prev => prev.filter(g => g.id !== newGlitch.id));
        }, 150);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [intensity]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {glitches.map(g => (
        <div
          key={g.id}
          className="absolute"
          style={{
            left: `${g.x}%`,
            top: `${g.y}%`,
            width: `${g.w}%`,
            height: `${g.h}px`,
            background: 'rgba(0, 212, 255, 0.15)',
            mixBlendMode: 'screen',
            transform: `translateX(${(Math.random() - 0.5) * 20}px)`,
          }}
        />
      ))}
    </div>
  );
}

export function ScreenTear({ active }: { active: boolean }) {
  const [tear, setTear] = useState(false);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        setTear(true);
        setTimeout(() => setTear(false), 100);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [active]);

  if (!tear) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        clipPath: `polygon(0 ${30 + Math.random() * 40}%, 100% ${30 + Math.random() * 40}%, 100% ${50 + Math.random() * 30}%, 0 ${50 + Math.random() * 30}%)`,
        background: 'rgba(255, 51, 102, 0.05)',
        transform: `translateX(${(Math.random() - 0.5) * 10}px)`,
      }}
    />
  );
}

export function AmbientParticles() {
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10,
    }))
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: 'rgba(0, 212, 255, 0.4)',
          }}
          animate={{
            y: [0, -30, -60, -90],
            opacity: [0, 0.6, 0.3, 0],
            x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

export function EnvironmentFlash({ color, active }: { color: string; active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-40"
          style={{ background: color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.08, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </AnimatePresence>
  );
}

export function StaticBurst({ trigger }: { trigger: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 300);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!show) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        opacity: 0.15,
        mixBlendMode: 'screen',
      }}
    />
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EntryScreen } from '@/components/ui/EntryScreen';
import { VoidHeader } from '@/components/ui/VoidHeader';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { OnlineUsers } from '@/components/ui/OnlineUsers';
import { HiddenRooms } from '@/components/ui/HiddenRooms';
import { GlitchOverlay, AmbientParticles, ScreenTear, StaticBurst } from '@/components/effects/GlitchEffects';
import { usePresence, useEnvironment, useHiddenRooms } from '@/hooks/useRealtime';
import { getUsername, getUserId } from '@/lib/identity';

export default function VoidPage() {
  const [entered, setEntered] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [currentRoom, setCurrentRoom] = useState('void_main');
  const [staticBurst, setStaticBurst] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { onlineCount, onlineUsers } = usePresence();
  const environment = useEnvironment();
  const hiddenRooms = useHiddenRooms();

  useEffect(() => {
    const u = getUsername();
    const id = getUserId();
    setUsername(u);
    setUserId(id);
  }, []);

  // React to environment changes with effects
  useEffect(() => {
    if (environment.ambience === 'corrupted' || environment.ambience === 'fracturing') {
      setStaticBurst(prev => prev + 1);
    }
  }, [environment.ambience]);

  // Dynamic CSS variable for accent color based on environment
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--accent-color', environment.colorShift || '#00d4ff');
    }
  }, [environment.colorShift]);

  const handleEnter = () => setEntered(true);

  const ambienceBackground = {
    normal: 'radial-gradient(ellipse at 20% 20%, rgba(0, 30, 50, 0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(10, 0, 30, 0.3) 0%, transparent 60%), #030507',
    calm: 'radial-gradient(ellipse at 50% 50%, rgba(0, 50, 30, 0.2) 0%, transparent 70%), #030507',
    unstable: 'radial-gradient(ellipse at 30% 70%, rgba(50, 20, 0, 0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(0, 30, 50, 0.3) 0%, transparent 60%), #030507',
    corrupted: 'radial-gradient(ellipse at 50% 50%, rgba(60, 0, 20, 0.3) 0%, transparent 70%), #030507',
    fracturing: 'radial-gradient(ellipse at 50% 50%, rgba(60, 0, 20, 0.4) 0%, transparent 70%), #030507',
  }[environment.ambience] || '#030507';

  return (
    <>
      {/* Entry screen */}
      {!entered && username && (
        <EntryScreen onEnter={handleEnter} username={username} />
      )}

      {/* Main void interface */}
      <AnimatePresence>
        {entered && (
          <motion.div
            className="fixed inset-0 flex flex-col scanlines"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            style={{ background: ambienceBackground }}
          >
            {/* Atmospheric overlays */}
            <div className="noise fixed inset-0 pointer-events-none" />
            <div className="vignette fixed inset-0 pointer-events-none" />
            <AmbientParticles />
            <GlitchOverlay intensity={environment.glitchLevel} />
            <ScreenTear active={environment.glitchLevel > 4} />
            <StaticBurst trigger={staticBurst} />

            {/* Header */}
            <VoidHeader
              onlineCount={onlineCount}
              ambience={environment.ambience}
              glitchLevel={environment.glitchLevel}
            />

            {/* Body */}
            <div className="flex flex-1 overflow-hidden relative z-20">
              {/* Sidebar - desktop */}
              <motion.aside
                className="hidden lg:flex flex-col w-56 xl:w-64 border-r border-void-mist/10 overflow-hidden shrink-0"
                style={{ background: 'rgba(3, 5, 7, 0.7)', backdropFilter: 'blur(5px)' }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <OnlineUsers users={onlineUsers} currentUserId={userId} />
                <div className="mt-auto">
                  <HiddenRooms
                    rooms={hiddenRooms}
                    onEnterRoom={setCurrentRoom}
                    currentRoom={currentRoom}
                  />
                </div>
              </motion.aside>

              {/* Mobile sidebar toggle */}
              <motion.button
                className="lg:hidden absolute top-2 left-2 z-30 p-2 text-xs"
                style={{
                  border: '1px solid rgba(0, 212, 255, 0.15)',
                  color: '#445566',
                  background: 'rgba(3, 5, 7, 0.9)',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'crosshair',
                  letterSpacing: '0.1em',
                }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                whileHover={{ color: '#00d4ff' }}
              >
                {sidebarOpen ? '◈ CLOSE' : '◈ MAP'}
              </motion.button>

              {/* Mobile sidebar */}
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    className="lg:hidden absolute top-0 left-0 bottom-0 z-20 w-56 border-r border-void-mist/10 flex flex-col"
                    style={{ background: 'rgba(3, 5, 7, 0.97)', backdropFilter: 'blur(10px)' }}
                    initial={{ x: -224 }}
                    animate={{ x: 0 }}
                    exit={{ x: -224 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="pt-10">
                      <OnlineUsers users={onlineUsers} currentUserId={userId} />
                    </div>
                    <div className="mt-auto">
                      <HiddenRooms
                        rooms={hiddenRooms}
                        onEnterRoom={(id) => { setCurrentRoom(id); setSidebarOpen(false); }}
                        currentRoom={currentRoom}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main chat area */}
              <motion.main
                className="flex-1 flex flex-col overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                {/* Room indicator */}
                <div
                  className="px-4 py-1.5 border-b border-void-mist/10 flex items-center justify-between"
                  style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: currentRoom === 'void_main' ? '#00d4ff' : '#ff3366',
                      }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span
                      style={{
                        color: '#334455',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.2em',
                      }}
                    >
                      {currentRoom === 'void_main' ? '[ THE VOID ] MAIN CHANNEL' : `[ SECTOR: ${currentRoom.toUpperCase()} ]`}
                    </span>
                  </div>
                  <motion.div
                    style={{ color: '#223344', fontSize: '0.6rem', letterSpacing: '0.1em' }}
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    {environment.ambience.toUpperCase()}
                  </motion.div>
                </div>

                {/* Chat */}
                <div className="flex-1 overflow-hidden">
                  <ChatRoom
                    username={username}
                    roomId={currentRoom}
                  />
                </div>
              </motion.main>
            </div>

            {/* Environment status bar */}
            <motion.div
              className="relative z-20 border-t border-void-mist/10 px-4 py-1 flex items-center justify-between"
              style={{ background: 'rgba(3, 5, 7, 0.9)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center gap-4">
                <span style={{ color: '#1a3344', fontSize: '0.6rem', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>
                  GLITCH LEVEL: {environment.glitchLevel}/10
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-1"
                      style={{
                        background: i < environment.glitchLevel
                          ? (i > 6 ? '#ff3366' : i > 4 ? '#ff6600' : '#00d4ff')
                          : 'rgba(255,255,255,0.05)',
                      }}
                    />
                  ))}
                </div>
              </div>
              <motion.div
                style={{
                  color: '#1a3344',
                  fontSize: '0.55rem',
                  letterSpacing: '0.15em',
                  fontFamily: 'var(--font-mono)',
                }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                THE ARCHITECT IS {Math.random() > 0.5 ? 'OBSERVING' : 'WAITING'}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

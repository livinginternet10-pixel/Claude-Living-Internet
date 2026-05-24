'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface Room {
  id: string;
  name: string;
  userCount: number;
}

interface HiddenRoomsProps {
  rooms: Room[];
  onEnterRoom: (roomId: string) => void;
  currentRoom: string;
}

export function HiddenRooms({ rooms, onEnterRoom, currentRoom }: HiddenRoomsProps) {
  const [expanded, setExpanded] = useState(false);
  const [entryCode, setEntryCode] = useState('');
  const [tryingRoom, setTryingRoom] = useState<string | null>(null);

  const roomNames: Record<string, string> = {
    'void_main': '[ THE VOID ]',
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-xs py-2 px-3 text-left flex items-center justify-between"
        style={{
          color: '#445566',
          borderTop: '1px solid rgba(0, 212, 255, 0.06)',
          background: 'rgba(0, 0, 0, 0.3)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.1em',
          cursor: 'crosshair',
        }}
        whileHover={{ color: '#00d4ff' }}
      >
        <span>◈ SECTOR MAP</span>
        <motion.span
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▸
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-2 space-y-1">
              {/* Main room */}
              <motion.button
                onClick={() => onEnterRoom('void_main')}
                className="w-full text-left px-2 py-1.5 text-xs room-entrance"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: currentRoom === 'void_main' ? '#00d4ff' : '#445566',
                  borderLeft: currentRoom === 'void_main' ? '1px solid #00d4ff' : '1px solid transparent',
                  letterSpacing: '0.05em',
                  cursor: 'crosshair',
                }}
                whileHover={{ color: '#00d4ff' }}
              >
                <div className="flex justify-between items-center">
                  <span>[ THE VOID ]</span>
                  {currentRoom === 'void_main' && (
                    <motion.span
                      style={{ color: '#39ff14', fontSize: '0.6rem' }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      YOU ARE HERE
                    </motion.span>
                  )}
                </div>
              </motion.button>

              {/* Hidden rooms */}
              {rooms.length > 0 && (
                <>
                  <div style={{ color: '#223344', fontSize: '0.6rem', padding: '4px 8px', letterSpacing: '0.2em' }}>
                    — ANOMALOUS SECTORS —
                  </div>
                  {rooms.map(room => (
                    <motion.button
                      key={room.id}
                      onClick={() => onEnterRoom(room.id)}
                      className="w-full text-left px-2 py-1.5 text-xs room-entrance"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: currentRoom === room.id ? '#ff3366' : '#334455',
                        borderLeft: currentRoom === room.id ? '1px solid #ff3366' : '1px solid transparent',
                        letterSpacing: '0.05em',
                        cursor: 'crosshair',
                      }}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ color: '#ff3366' }}
                    >
                      <div className="flex justify-between items-center">
                        <span>{room.name}</span>
                        <span style={{ color: '#223344', fontSize: '0.55rem' }}>
                          {room.userCount} signal{room.userCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </>
              )}

              {rooms.length === 0 && (
                <div
                  style={{ color: '#223344', fontSize: '0.65rem', padding: '4px 8px', letterSpacing: '0.05em' }}
                  className="italic"
                >
                  no anomalous sectors detected
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

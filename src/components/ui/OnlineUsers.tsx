'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@/types';

interface OnlineUsersProps {
  users: User[];
  currentUserId: string;
}

export function OnlineUsers({ users, currentUserId }: OnlineUsersProps) {
  return (
    <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
      <div
        style={{
          color: '#223344',
          fontSize: '0.6rem',
          padding: '8px 12px 4px',
          letterSpacing: '0.2em',
          borderBottom: '1px solid rgba(0, 212, 255, 0.05)',
        }}
      >
        ACTIVE SIGNALS ({users.length})
      </div>
      <div className="py-1">
        <AnimatePresence>
          {users.map((user) => (
            <motion.div
              key={user.id}
              className="flex items-center gap-2 px-3 py-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-1 h-1 rounded-full shrink-0"
                style={{ background: user.id === currentUserId ? '#00d4ff' : '#39ff14' }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
              <span
                className="text-xs truncate"
                style={{
                  color: user.id === currentUserId ? '#00d4ff' : '#445566',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.02em',
                }}
              >
                {user.username}
                {user.id === currentUserId && (
                  <span style={{ color: '#334455', marginLeft: '4px' }}>(you)</span>
                )}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

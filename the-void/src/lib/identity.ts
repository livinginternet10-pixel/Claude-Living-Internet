const ADJECTIVES = [
  'hollow', 'fading', 'static', 'drifting', 'unnamed', 'forgotten', 'severed',
  'fractured', 'silent', 'absent', 'wandering', 'erased', 'distant', 'lost',
  'corrupted', 'echoing', 'void', 'pale', 'dim', 'bleeding', 'submerged',
  'displaced', 'unmoored', 'null', 'phantom', 'residual', 'latent', 'terminal',
  'archived', 'deleted', 'orphaned', 'recursive', 'suspended', 'inverted'
];

const NOUNS = [
  'signal', 'node', 'thread', 'echo', 'fragment', 'trace', 'remnant', 'vessel',
  'channel', 'frequency', 'packet', 'sector', 'anomaly', 'instance', 'process',
  'daemon', 'proxy', 'relay', 'archive', 'cipher', 'vector', 'ghost', 'shell',
  'loop', 'caller', 'carrier', 'witness', 'observer', 'entity', 'specter',
  'resonance', 'wavelength', 'terminal', 'membrane', 'threshold', 'aperture'
];

export function generateUsername(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${adj}_${noun}_${num}`;
}

export function getUserId(): string {
  if (typeof window === 'undefined') return '';
  
  let userId = sessionStorage.getItem('void_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('void_user_id', userId);
  }
  return userId;
}

export function getUsername(): string {
  if (typeof window === 'undefined') return '';
  
  let username = sessionStorage.getItem('void_username');
  if (!username) {
    username = generateUsername();
    sessionStorage.setItem('void_username', username);
  }
  return username;
}

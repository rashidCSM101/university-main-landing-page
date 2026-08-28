import crypto from 'crypto';

/** Generates a secure random temporary password: 2 words + 4-digit number */
export function generateTempPassword(): string {
  const adjectives = ['Blue', 'Swift', 'Bold', 'Bright', 'Clear', 'Deep', 'Fair', 'Gold', 'Green', 'High', 'Keen', 'Kind', 'Light', 'Prime', 'Safe', 'Sharp', 'Soft', 'Star', 'Strong', 'True'];
  const nouns      = ['Cloud', 'Coast', 'Field', 'Force', 'Grove', 'Lake', 'Land', 'Peak', 'River', 'Rock', 'Shore', 'Storm', 'Stream', 'Wave', 'Wind', 'Bridge', 'Crest', 'Dawn', 'Frost', 'Glow'];
  const adj  = adjectives[crypto.randomInt(adjectives.length)];
  const noun = nouns[crypto.randomInt(nouns.length)];
  const num  = String(crypto.randomInt(1000, 9999));
  return `${adj}${noun}${num}`;
}

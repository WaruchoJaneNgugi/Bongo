// Presentation helpers for buyer resource cards. Real resources have no stored
// "accent" colour, so we derive a stable Tailwind gradient from the subject —
// known subjects get a curated palette; anything else hashes to a fallback.

const PALETTES: Record<string, string> = {
  Mathematics: 'from-[#0f766e] to-[#14b8a6]',
  English: 'from-[#9a3412] to-[#f97316]',
  Kiswahili: 'from-[#3f6212] to-[#84cc16]',
  Science: 'from-[#14532d] to-[#22a558]',
  Biology: 'from-[#14532d] to-[#22a558]',
  Chemistry: 'from-[#6b21a8] to-[#a855f7]',
  Physics: 'from-[#1e3a8a] to-[#3b82f6]',
  History: 'from-[#334155] to-[#64748b]',
  Geography: 'from-[#047857] to-[#34d399]',
  CRE: 'from-[#7c2d12] to-[#ea580c]',
  Business: 'from-[#164e63] to-[#06b6d4]',
  'Social Studies': 'from-[#155e75] to-[#22d3ee]',
  'Art & Craft': 'from-[#9d174d] to-[#f472b6]',
  Music: 'from-[#4338ca] to-[#818cf8]',
};

const FALLBACKS = [
  'from-[#0f766e] to-[#14b8a6]',
  'from-[#1e3a8a] to-[#3b82f6]',
  'from-[#6b21a8] to-[#a855f7]',
  'from-[#14532d] to-[#22a558]',
  'from-[#9a3412] to-[#f97316]',
];

export function accentFor(subject: string): string {
  if (PALETTES[subject]) return PALETTES[subject];
  let h = 0;
  for (let i = 0; i < subject.length; i++) h = (h * 31 + subject.charCodeAt(i)) >>> 0;
  return FALLBACKS[h % FALLBACKS.length];
}

// Format a Firestore Timestamp (or Date / millis) as a short human date.
// Purchases and wallet transactions store `createdAt` as a server Timestamp.
type TimestampLike = { toDate: () => Date };

function toDate(ts: unknown): Date | null {
  if (ts == null) return null;
  if (typeof (ts as TimestampLike).toDate === 'function') return (ts as TimestampLike).toDate();
  if (ts instanceof Date) return ts;
  if (typeof ts === 'number' || typeof ts === 'string') {
    const d = new Date(ts);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function fmtDate(ts: unknown): string {
  const d = toDate(ts);
  if (!d) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

import { useEffect, useState } from 'react';
import { fetchMediaUrl } from '../../lib/marketplace/media';

interface Props {
  resourceId: string;
  kind: 'video' | 'audio';
  onEnded?: () => void;
}

/** Streams gated media via a short-lived signed URL. Stream-only (no download). */
export default function MediaPlayer({ resourceId, kind, onEnded }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    fetchMediaUrl(resourceId)
      .then(r => { if (alive) setUrl(r.url); })
      .catch(e => { if (alive) setError(e instanceof Error ? e.message : 'Could not load media.'); });
    return () => { alive = false; };
  }, [resourceId]);

  if (error) return <p className="text-sm text-[#b91c1c]">{error}</p>;
  if (!url) return <p className="text-sm text-[#64748b]">Loading…</p>;

  const common = {
    'data-testid': 'media-el',
    src: url,
    controls: true,
    controlsList: 'nodownload',
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    onEnded,
    className: 'w-full rounded-xl bg-black',
  } as const;

  return kind === 'video' ? <video {...common} /> : <audio {...common} className="w-full" />;
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FilePlus, Pencil, Trash2, Eye, EyeOff, FileText, Video, Music, Play, X,
} from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';
import {
  subscribeSellerResources, setResourceStatus, deleteResource,
} from '../../lib/marketplace/resources';
import type { MarketResource } from '../../lib/marketplace/types';
import MediaPlayer from './MediaPlayer';

/** mm:ss for a duration in seconds; empty when unknown. */
function formatDuration(sec: number | null): string {
  if (!sec || sec <= 0) return '';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function KindIcon({ kind }: { kind: MarketResource['kind'] }) {
  if (kind === 'video') return <Video className="text-[#16a34a]" size={22} />;
  if (kind === 'audio') return <Music className="text-[#16a34a]" size={22} />;
  return <FileText className="text-[#16a34a]" size={22} />;
}

/** Sub-line under the title: media shows kind + duration; documents show file count. */
function metaLine(r: MarketResource): string {
  const head = `${r.subject} · ${r.grade}`;
  if (r.kind === 'video' || r.kind === 'audio') {
    const label = r.kind === 'video' ? 'Video' : 'Audio';
    const dur = formatDuration(r.durationSec);
    return `${head} · ${label}${dur ? ` · ${dur}` : ''}`;
  }
  return `${head} · ${r.files.length} file${r.files.length === 1 ? '' : 's'}`;
}

/** One resource row. Owns its own preview-open state so the player (and its
 *  signed-URL fetch) mounts only when the teacher clicks Preview. */
function ResourceRow({ r, busy, onToggle, onRemove }: {
  r: MarketResource;
  busy: boolean;
  onToggle: (r: MarketResource) => void;
  onRemove: (r: MarketResource) => void;
}) {
  const [preview, setPreview] = useState(false);
  const canPreview = (r.kind === 'video' || r.kind === 'audio') && !!r.media;

  return (
    <li className="bg-white border border-[#e8ece8] rounded-2xl p-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-[#eef7ef] grid place-items-center overflow-hidden shrink-0">
          {r.thumbnailUrl
            ? <img src={r.thumbnailUrl} alt="" className="w-full h-full object-cover" />
            : <KindIcon kind={r.kind} />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="font-bold text-[#1f2937] truncate">{r.title}</div>
          <div className="text-[12px] text-[#6b7280]">{metaLine(r)}</div>
        </div>

        <div className="text-sm font-bold text-[#1f2937] tabular-nums">
          {r.priceKsh === 0 ? 'Free' : `Ksh ${r.priceKsh}`}
        </div>

        <span className={`text-[11px] font-bold rounded-full px-2.5 py-1 ${
          r.status === 'published'
            ? 'bg-[#dcfce7] text-[#15803d]'
            : 'bg-[#f3f4f6] text-[#6b7280]'}`}>
          {r.status}
        </span>

        <div className="flex items-center gap-1">
          {canPreview && (
            <button type="button" onClick={() => setPreview(p => !p)}
              title={preview ? 'Hide preview' : 'Preview'} aria-pressed={preview}
              className="w-9 h-9 grid place-items-center rounded-full hover:bg-[#eef7ef]">
              {preview ? <X size={17} /> : <Play size={17} />}
              <span className="sr-only">{preview ? 'Hide preview' : 'Preview'}</span>
            </button>
          )}
          <button type="button" onClick={() => onToggle(r)} disabled={busy}
            title={r.status === 'published' ? 'Unpublish' : 'Publish'}
            className="w-9 h-9 grid place-items-center rounded-full hover:bg-[#eef7ef] disabled:opacity-40">
            {r.status === 'published' ? <EyeOff size={17} /> : <Eye size={17} />}
            <span className="sr-only">{r.status === 'published' ? 'Unpublish' : 'Publish'}</span>
          </button>
          <Link to={`/seller/resources/${r.id}/edit`} title="Edit"
            className="w-9 h-9 grid place-items-center rounded-full hover:bg-[#eef7ef]">
            <Pencil size={16} /><span className="sr-only">Edit</span>
          </Link>
          <button type="button" onClick={() => onRemove(r)} disabled={busy}
            title="Delete"
            className="w-9 h-9 grid place-items-center rounded-full hover:bg-red-50 text-red-600 disabled:opacity-40">
            <Trash2 size={16} /><span className="sr-only">Delete</span>
          </button>
        </div>
      </div>

      {preview && canPreview && (
        <div className="mt-3">
          <MediaPlayer resourceId={r.id} kind={r.kind as 'video' | 'audio'} />
          <p className="mt-1.5 text-[11px] text-[#9aa39a]">
            This is how learners will watch it after buying.
          </p>
        </div>
      )}
    </li>
  );
}

export default function MyResources() {
  const sellerId = useSellerStore(s => s.sellerId);
  const [rows, setRows] = useState<MarketResource[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!sellerId) return;
    return subscribeSellerResources(sellerId, setRows);
  }, [sellerId]);

  async function toggle(r: MarketResource) {
    setBusy(r.id);
    try { await setResourceStatus(r.id, r.status === 'published' ? 'draft' : 'published'); }
    finally { setBusy(null); }
  }

  async function remove(r: MarketResource) {
    if (!window.confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
    setBusy(r.id);
    try { await deleteResource(r); }
    finally { setBusy(null); }
  }

  if (rows.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <FileText className="mx-auto text-[#9aa39a]" size={48} />
        <h2 className="mt-4 text-lg font-bold text-[#1f2937]">No resources yet</h2>
        <p className="mt-1 text-sm text-[#6b7280]">
          Create your first resource to start selling on the marketplace.
        </p>
        <Link to="/seller/resources/new"
          className="mt-5 inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15913f] text-white text-sm font-bold rounded-full px-5 py-2.5">
          <FilePlus size={17} /> Create a resource
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-extrabold text-[#1f2937]">My Resources</h1>
        <Link to="/seller/resources/new"
          className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15913f] text-white text-sm font-bold rounded-full px-4 py-2.5">
          <FilePlus size={17} /> New resource
        </Link>
      </div>

      <ul className="space-y-3">
        {rows.map(r => (
          <ResourceRow key={r.id} r={r} busy={busy === r.id} onToggle={toggle} onRemove={remove} />
        ))}
      </ul>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, Pencil, Trash2, Eye, EyeOff, FileText } from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';
import {
  subscribeSellerResources, setResourceStatus, deleteResource,
} from '../../lib/marketplace/resources';
import type { MarketResource } from '../../lib/marketplace/types';

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
          <li key={r.id}
            className="flex items-center gap-4 bg-white border border-[#e8ece8] rounded-2xl p-4">
            <div className="w-14 h-14 rounded-xl bg-[#eef7ef] grid place-items-center overflow-hidden shrink-0">
              {r.thumbnailUrl
                ? <img src={r.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                : <FileText className="text-[#16a34a]" size={22} />}
            </div>

            <div className="min-w-0 flex-1">
              <div className="font-bold text-[#1f2937] truncate">{r.title}</div>
              <div className="text-[12px] text-[#6b7280]">
                {r.subject} · {r.grade} · {r.files.length} file{r.files.length === 1 ? '' : 's'}
              </div>
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
              <button type="button" onClick={() => toggle(r)} disabled={busy === r.id}
                title={r.status === 'published' ? 'Unpublish' : 'Publish'}
                className="w-9 h-9 grid place-items-center rounded-full hover:bg-[#eef7ef] disabled:opacity-40">
                {r.status === 'published' ? <EyeOff size={17} /> : <Eye size={17} />}
                <span className="sr-only">{r.status === 'published' ? 'Unpublish' : 'Publish'}</span>
              </button>
              <Link to={`/seller/resources/${r.id}/edit`}
                title="Edit"
                className="w-9 h-9 grid place-items-center rounded-full hover:bg-[#eef7ef]">
                <Pencil size={16} /><span className="sr-only">Edit</span>
              </Link>
              <button type="button" onClick={() => remove(r)} disabled={busy === r.id}
                title="Delete"
                className="w-9 h-9 grid place-items-center rounded-full hover:bg-red-50 text-red-600 disabled:opacity-40">
                <Trash2 size={16} /><span className="sr-only">Delete</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

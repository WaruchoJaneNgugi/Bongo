import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, FileText, Lock, ShoppingCart } from 'lucide-react';
import { getPublishedResource } from '../../../../lib/marketplace/catalog';
import { useMarketStore } from '../../../../store/useMarketStore';
import { accentFor } from '../presentation';
import type { MarketResource } from '../../../../lib/marketplace/types';
import { ui } from '../ui';

export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  // undefined = loading, null = not found / unavailable
  const [resource, setResource] = useState<MarketResource | null | undefined>(undefined);
  const { inCart, addToCart, inWishlist, toggleWishlist } = useMarketStore();

  useEffect(() => {
    if (!id) return;
    getPublishedResource(id).then(setResource);
  }, [id]);

  if (resource === undefined) {
    return <div className={`py-20 text-center ${ui.muted}`}>Loading…</div>;
  }
  if (resource === null) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className={ui.muted}>This resource isn’t available.</p>
        <Link to="/market/browse" className={`${ui.brand} font-semibold hover:underline`}>Back to marketplace</Link>
      </div>
    );
  }

  const carted = inCart(resource.id);
  const wished = inWishlist(resource.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/market/browse" className={`inline-flex items-center gap-1.5 text-sm font-semibold ${ui.brand} hover:underline`}>
        <ArrowLeft size={16} /> Back to marketplace
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
        {/* Main */}
        <div className="space-y-5">
          <div className={`relative h-48 rounded-2xl overflow-hidden grid place-items-center bg-gradient-to-br ${accentFor(resource.subject)}`}>
            {resource.thumbnailUrl
              ? <img src={resource.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
              : <span className="text-white font-extrabold text-lg uppercase tracking-wide px-4 text-center">{resource.subject}</span>}
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className={`${ui.chip} text-[12px] font-semibold px-2.5 py-1`}>{resource.subject}</span>
              <span className={`${ui.chip} text-[12px] font-semibold px-2.5 py-1`}>{resource.grade}</span>
            </div>
            <h1 className={`text-2xl ${ui.h1}`}>{resource.title}</h1>
            <p className={`text-sm mt-1 ${ui.muted}`}>by {resource.sellerName}</p>
          </div>

          {resource.description && (
            <div>
              <h2 className={`text-sm ${ui.h2} mb-1`}>About this resource</h2>
              <p className={`text-sm leading-relaxed whitespace-pre-line ${ui.muted}`}>{resource.description}</p>
            </div>
          )}

          {/* Files — locked until purchase (download gating lands with payments). */}
          <div>
            <h2 className={`text-sm ${ui.h2} mb-2`}>
              What you get · {resource.files.length} file{resource.files.length === 1 ? '' : 's'}
            </h2>
            <ul className="space-y-2">
              {resource.files.map(f => (
                <li key={f.path} className={`${ui.card} flex items-center gap-3 px-3 py-2.5`}>
                  <span className="w-9 h-9 rounded-lg bg-[#f0fdf4] grid place-items-center text-[#16a34a] shrink-0"><FileText size={17} /></span>
                  <span className="min-w-0 flex-1 text-sm font-medium text-[#0f172a] truncate">{f.name}</span>
                  <Lock size={14} className={ui.faint} />
                </li>
              ))}
            </ul>
            <p className={`text-[12px] mt-2 ${ui.faint}`}>Files unlock for download after purchase.</p>
          </div>
        </div>

        {/* Buy rail */}
        <aside className="space-y-3">
          <div className={`${ui.card} p-5`}>
            <div className="text-3xl font-extrabold text-[#0f172a]">
              {resource.priceKsh === 0 ? 'Free' : `KSh ${resource.priceKsh.toLocaleString()}`}
            </div>
            <button onClick={() => (carted ? navigate('/market/checkout') : addToCart(resource.id))}
              className={`mt-4 w-full ${ui.btnPrimary} px-4 py-2.5 text-sm`}>
              <ShoppingCart size={16} /> {carted ? 'View cart →' : 'Buy Now'}
            </button>
            <button onClick={() => toggleWishlist(resource.id)}
              className={`mt-2 w-full ${ui.btnGhost} px-4 py-2.5 text-sm`}>
              <Heart size={16} className={wished ? 'fill-[#ef4444] text-[#ef4444]' : ''} />
              {wished ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

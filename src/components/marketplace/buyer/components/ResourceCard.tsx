import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { MarketResource } from '../../../../lib/marketplace/types';
import { useMarketStore } from '../../../../store/useMarketStore';
import { accentFor } from '../presentation';
import { ui } from '../ui';

interface Props { resource: MarketResource; }

export default function ResourceCard({ resource }: Props) {
  const navigate = useNavigate();
  const { inWishlist, toggleWishlist, inCart, addToCart } = useMarketStore();
  const wished = inWishlist(resource.id);
  const carted = inCart(resource.id);
  const to = `/market/resource/${resource.id}`;

  return (
    <div className={`${ui.cardInteractive} overflow-hidden flex flex-col`}>
      {/* Cover — links to the detail page; wishlist button floats above it. */}
      <div className="relative h-32">
        <Link to={to}
          className={`absolute inset-0 grid place-items-center overflow-hidden bg-gradient-to-br ${accentFor(resource.subject)}`}>
          {resource.thumbnailUrl
            ? <img src={resource.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            : <span className="text-white font-extrabold text-sm uppercase tracking-wide px-3 text-center">{resource.subject}</span>}
        </Link>
        <span className="absolute top-2 left-2 z-10 text-[10px] font-bold uppercase tracking-wide text-white/90 bg-black/25 rounded px-2 py-0.5">
          {resource.grade}
        </span>
        <button
          onClick={() => toggleWishlist(resource.id)}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2 right-2 z-10 w-8 h-8 grid place-items-center rounded-full bg-white/90 hover:bg-white"
        >
          <Heart size={16} className={wished ? 'fill-[#ef4444] text-[#ef4444]' : 'text-[#64748b]'} />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <Link to={to} className="font-bold text-sm text-[#0f172a] leading-snug line-clamp-2 hover:text-[#15803d]">
          {resource.title}
        </Link>
        <p className={`text-xs ${ui.muted}`}>{resource.sellerName}</p>
        <div className="text-xs text-[#64748b]">
          {resource.sales > 0
            ? <span className="font-semibold">{resource.sales} sold</span>
            : <span className={`${ui.chip} px-2 py-0.5 font-semibold text-[#15803d] bg-[#f0fdf4]`}>New</span>}
        </div>
        <div className="mt-auto">
          <span className="font-extrabold text-[#15803d]">
            {resource.priceKsh === 0 ? 'Free' : `KSh ${resource.priceKsh}`}
          </span>
        </div>
        <button
          onClick={() => (carted ? navigate('/market/checkout') : addToCart(resource.id))}
          className={`w-full rounded-xl py-2 text-sm font-bold transition ${
            carted ? 'flex items-center justify-center bg-[#f0fdf4] text-[#15803d]' : `${ui.btnPrimary} px-4`
          }`}
        >
          {carted ? 'View cart →' : 'Buy Now'}
        </button>
      </div>
    </div>
  );
}

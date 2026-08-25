import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import type { MarketResource } from '../../../../lib/marketplace/types';
import { useMarketStore } from '../../../../store/useMarketStore';
import { accentFor } from '../presentation';
import { ui } from '../ui';

interface Props { resource: MarketResource; }

/** Compact marketplace card — tuned to sit 3-up on a phone and scale up on
 *  larger screens. Tapping the cover or title opens the detail page; the round
 *  green button adds to cart (or jumps to checkout when already in the cart). */
export default function ResourceCard({ resource }: Props) {
  const navigate = useNavigate();
  const { inWishlist, toggleWishlist, inCart, addToCart } = useMarketStore();
  const wished = inWishlist(resource.id);
  const carted = inCart(resource.id);
  const to = `/market/resource/${resource.id}`;

  return (
    <div className={`${ui.cardInteractive} group flex flex-col overflow-hidden`}>
      {/* Cover */}
      <div className="relative aspect-[4/3]">
        <Link to={to}
          className={`absolute inset-0 grid place-items-center overflow-hidden bg-gradient-to-br ${accentFor(resource.subject)}`}>
          {resource.thumbnailUrl
            ? <img src={resource.thumbnailUrl} alt=""
                className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105" />
            : <span className="px-2 text-center text-[11px] sm:text-sm font-extrabold uppercase tracking-wide text-white line-clamp-2">
                {resource.subject}
              </span>}
        </Link>

        <span className="absolute top-1.5 left-1.5 z-10 rounded bg-black/35 px-1.5 py-0.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
          {resource.grade}
        </span>

        {resource.kind !== 'document' && (
          <span className="absolute bottom-1.5 left-1.5 z-10 rounded-full bg-black/70 px-1.5 py-0.5 text-[9px] sm:text-[11px] font-semibold text-white">
            {resource.kind === 'video' ? '▶ Video' : '🎧 Audio'}
          </span>
        )}

        <button onClick={() => toggleWishlist(resource.id)}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-1.5 right-1.5 z-10 grid h-6 w-6 sm:h-7 sm:w-7 place-items-center rounded-full bg-white/90 shadow-sm hover:bg-white">
          <Heart size={13} className={wished ? 'fill-[#ef4444] text-[#ef4444]' : 'text-[#64748b]'} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1 p-2 sm:p-3">
        <Link to={to}
          className="line-clamp-2 text-[11px] sm:text-sm font-semibold leading-snug text-[#0f172a] hover:text-[#15803d]">
          {resource.title}
        </Link>
        <p className={`truncate text-[10px] sm:text-xs ${ui.muted}`}>{resource.sellerName}</p>

        <div className="mt-auto flex items-center justify-between gap-1 pt-1">
          <span className="truncate text-xs sm:text-sm font-extrabold text-[#15803d]">
            {resource.priceKsh === 0 ? 'Free' : `KSh ${resource.priceKsh}`}
          </span>
          <button
            onClick={() => (carted ? navigate('/market/checkout') : addToCart(resource.id))}
            aria-label={carted ? 'View cart' : 'Buy now'}
            title={carted ? 'View cart' : 'Buy now'}
            className={`grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-full transition ${
              carted
                ? 'border border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]'
                : 'bg-[#16a34a] text-white hover:bg-[#15803d] active:scale-95'
            }`}>
            {carted ? <Check size={15} /> : <ShoppingCart size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}

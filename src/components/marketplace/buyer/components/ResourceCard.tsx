import { Heart, Star } from 'lucide-react';
import type { Resource } from '../../../../lib/marketplace/mockBuyer';
import { useMarketStore } from '../../../../store/useMarketStore';

interface Props { resource: Resource; }

export default function ResourceCard({ resource }: Props) {
  const { inWishlist, toggleWishlist, inCart, addToCart } = useMarketStore();
  const wished = inWishlist(resource.id);
  const carted = inCart(resource.id);

  return (
    <div className="bg-white rounded-2xl border border-[#e8ece8] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className={`relative h-32 bg-gradient-to-br ${resource.accent} grid place-items-center`}>
        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide text-white/90 bg-black/25 rounded px-2 py-0.5">
          {resource.sellerType}
        </span>
        <button
          onClick={() => toggleWishlist(resource.id)}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2 right-2 w-8 h-8 grid place-items-center rounded-full bg-white/90 hover:bg-white"
        >
          <Heart size={16} className={wished ? 'fill-[#ef4444] text-[#ef4444]' : 'text-[#4b5563]'} />
        </button>
        <span className="text-white font-extrabold text-sm uppercase tracking-wide px-3 text-center">{resource.subject}</span>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-sm text-[#1f2937] leading-snug line-clamp-2">{resource.title}</h3>
        <p className="text-xs text-[#8a938a]">{resource.sellerName}</p>
        <div className="flex items-center gap-1 text-xs text-[#4b5563]">
          <Star size={13} className="fill-[#f59e0b] text-[#f59e0b]" />
          <span className="font-bold">{resource.rating.toFixed(1)}</span>
          <span className="text-[#9aa39a]">({resource.reviews})</span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-extrabold text-[#15803d]">KSh {resource.priceKsh}</span>
        </div>
        <button
          onClick={() => addToCart(resource.id)}
          className={`w-full rounded-lg py-2 text-sm font-bold transition ${
            carted ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#16a34a] hover:bg-[#15913f] text-white'
          }`}
        >
          {carted ? 'In Cart ✓' : resource.cta}
        </button>
      </div>
    </div>
  );
}

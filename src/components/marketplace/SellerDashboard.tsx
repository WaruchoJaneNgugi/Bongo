import { FileText, Wallet, Banknote } from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';

const CARDS = [
  { icon: FileText, title: 'My Listings', body: 'Upload notes, exams and schemes for review.', cta: 'Coming next' },
  { icon: Wallet, title: 'Earnings', body: 'Track sales and your pending balance.', cta: 'Coming soon' },
  { icon: Banknote, title: 'Payouts', body: 'Withdraw your earnings to M-Pesa.', cta: 'Coming soon' },
];

export default function SellerDashboard() {
  const seller = useSellerStore(s => s.seller);
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-extrabold text-[#241a3d]">
        Welcome{seller ? `, ${seller.displayName}` : ''} 👋
      </h1>
      <p className="text-sm text-[#6a6480] mt-2">
        This is your seller portal. Listing, earnings and payouts arrive in the next milestones.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {CARDS.map(({ icon: Icon, title, body, cta }) => (
          <div key={title} className="bg-white border border-[#ece9f2] rounded-2xl p-5">
            <Icon size={22} className="text-[#5b3ea8]" />
            <div className="font-bold text-[#241a3d] mt-3">{title}</div>
            <p className="text-sm text-[#6a6480] mt-1">{body}</p>
            <div className="mt-4 inline-block text-xs font-bold uppercase bg-[#f4f1fa] text-[#8a7bc0] px-2 py-1 rounded">
              {cta}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

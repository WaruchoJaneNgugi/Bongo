import { useSellerStore } from '../../store/useSellerStore';

export default function SellerDashboard() {
  const { seller, logout } = useSellerStore();
  return (
    <div className="min-h-screen bg-[#faf9fc] p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-extrabold text-[#241a3d]">
          Welcome{seller ? `, ${seller.displayName}` : ''} 👋
        </h1>
        <p className="text-sm text-[#6a6480] mt-2">
          Your seller dashboard. Listings and earnings arrive in the next milestones.
        </p>
        <button onClick={() => logout()}
          className="mt-6 text-sm text-[#5b3ea8] underline">Sign out</button>
      </div>
    </div>
  );
}

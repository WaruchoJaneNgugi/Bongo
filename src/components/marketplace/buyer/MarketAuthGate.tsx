import { useNavigate } from 'react-router-dom';
import { GraduationCap, Store, LogIn, UserPlus } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { ui } from './ui';

// Shown at /market when no one is signed in. The Market tab stays reachable for
// logged-out visitors, but the marketplace itself requires an account — so we
// prompt Log In / Sign Up (the overlays are rendered globally in App) instead of
// silently bouncing to the landing page.
export default function MarketAuthGate() {
  const { setOverlay } = useStore();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${ui.page} flex flex-col`}>
      {/* Slim top bar with a way back home */}
      <header className={`h-16 flex items-center px-4 md:px-6 border-b ${ui.hairline} bg-white`}>
        <button onClick={() => navigate('/')} className="flex items-center gap-2" title="Back to HighScores">
          <GraduationCap className="text-[#16a34a]" size={26} />
          <span className="font-extrabold text-lg tracking-tight">
            <span className="text-[#16a34a]">High</span><span className="text-[#0f172a]">Scores</span>
          </span>
        </button>
      </header>

      {/* Centered gate card */}
      <div className="flex-1 grid place-items-center px-4">
        <div className={`${ui.card} w-full max-w-md p-8 text-center`}>
          <div className="w-14 h-14 rounded-2xl bg-[#f0fdf4] grid place-items-center mx-auto">
            <Store className="text-[#16a34a]" size={26} />
          </div>
          <h1 className={`${ui.h1} text-2xl mt-4`}>Explore the Marketplace</h1>
          <p className={`${ui.muted} mt-2`}>
            Sign in to browse notes, past papers and live classes from teachers, tutors and schools.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button onClick={() => setOverlay('login')} className={`${ui.btnPrimary} w-full px-4 py-3`}>
              <LogIn size={18} /> Log In
            </button>
            <button onClick={() => setOverlay('signup')} className={`${ui.btnGhost} w-full px-4 py-3`}>
              <UserPlus size={18} /> Sign Up
            </button>
          </div>

          {/* Seller path — teachers, tutors and schools sign in / register separately. */}
          <div className="mt-6 flex items-center gap-3">
            <span className={`flex-1 h-px ${ui.hairline} border-t`} />
            <span className={`text-xs ${ui.faint}`}>Selling on HighScores?</span>
            <span className={`flex-1 h-px ${ui.hairline} border-t`} />
          </div>
          <button
            onClick={() => navigate('/seller')}
            className={`mt-4 ${ui.btnGhost} w-full px-4 py-3`}
          >
            <Store size={18} className="text-[#16a34a]" /> Seller Log In / Sign Up
          </button>

          <button onClick={() => navigate('/')} className={`mt-5 text-sm ${ui.muted} hover:text-[#0f172a]`}>
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

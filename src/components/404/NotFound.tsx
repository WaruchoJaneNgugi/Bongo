import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import './not-found.css';

const NotFound: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [count, setCount] = useState(10);

  useEffect(() => {
    if (count <= 0) { navigate('/'); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, navigate]);

  return (
    <div className="nf-root">
      <div className="nf-card">
        <div className="nf-hero-number">
          <span className="nf-four nf-four-left">4</span>
          <div className="nf-zero"><span className="nf-zero-inner">🤔</span></div>
          <span className="nf-four nf-four-right">4</span>
        </div>

        <div className="nf-badge"><Search size={14} /> Page Not Found</div>

        <h1 className="nf-title">Oops! You got lost!</h1>
        <p className="nf-subtitle">
          The page <code className="nf-path">{location.pathname}</code> doesn't exist.
          <br />Looks like you wandered off the quiz path! 🗺️
        </p>

        <div className="nf-countdown-wrap">
          <div className="nf-countdown-ring" style={{ '--pct': `${(count / 10) * 100}%` } as React.CSSProperties}>
            <span className="nf-countdown-num">{count}</span>
          </div>
          <span className="nf-countdown-label">Redirecting to home…</span>
        </div>

        <div className="nf-actions">
          <button className="nf-btn nf-btn-primary" onClick={() => navigate('/')}>
            <Home size={18} /> Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

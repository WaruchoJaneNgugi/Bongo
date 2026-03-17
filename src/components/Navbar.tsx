import React from 'react';
import { useStore } from '../store/useStore';

const Navbar: React.FC = () => {
  const { isLoggedIn, user, setOverlay } = useStore();

  return (
    <nav className="navbar">
      <button
        className="navbar-logo"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={() => setOverlay(null)}
      >
        Bongo<span>Quiz</span>
      </button>
      <div className="navbar-links">
        <button className="navbar-link">About</button>
        <button className="navbar-link">Contact</button>
        {isLoggedIn ? (
          <button className="btn-primary" onClick={() => setOverlay('dashboard')}>
            Hi, {user?.username} 👋
          </button>
        ) : (
          <>
            <button className="btn-outline" onClick={() => setOverlay('login')}>
              Log In
            </button>
            <button className="btn-primary" onClick={() => setOverlay('signup')}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

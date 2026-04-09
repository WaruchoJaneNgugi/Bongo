import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Home, Gamepad2, User, LogOut, Menu, X, GraduationCap } from 'lucide-react';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const { isLoggedIn, user, setOverlay, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const isActive = (p: string) => location.pathname === p || location.pathname.startsWith(p + '/');
  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };


  /* ── Bottom nav items (logged in) ──────────────────────── */
  const bottomItems = [
    { path: '/home',          icon: Home,     label: 'Home',    exact: true },
    { path: '/games',     icon: Gamepad2, label: 'Games',   exact: false },
    { path: '/profile',   icon: User,     label: 'Profile', exact: false },
  ];

  return (
    <>
      {/* ── Top Navbar ──────────────────────────────────── */}
      <nav className={`nb-root ${scrolled ? 'nb-scrolled' : ''}`}>
        <div className="nb-inner">
          {/* Left: logo + hamburger on mobile */}
          <div className="nb-left">
            {/* Hamburger — mobile only */}
            <button className="nb-hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <button className="nb-logo" onClick={() => { navigate('/'); setMenuOpen(false); }}>
              <GraduationCap size={28} color="#7c3aed" />
              <span>Grade<strong>Up</strong></span>
            </button>


            {/* Desktop nav links */}
            <div className="nb-links">
              <Link to="/" className={`nb-link ${location.pathname === '/home' || isActive('/level') ? 'active' : ''}`}>
                <Home size={17} /> Home
              </Link>
              <Link to="/games" className={`nb-link ${isActive('/games') ? 'active' : ''}`}>
                <Gamepad2 size={17} /> Games
              </Link>
              {isLoggedIn && (
              <Link to="/profile" className={`nb-link ${isActive('/profile') ? 'active' : ''}`} >
                <User size={16} /> Profile
              </Link>
              )}
              {isLoggedIn && <></>}
            </div>
          </div>

          {/* Right: auth / user info */}
          <div className="nb-right">
            {isLoggedIn ? (() => {
              const profile = user?.profiles.find(p => p.id === user.activeProfileId) ?? user?.profiles[0];
              return (
                <div className="nb-student-info">
                  <div className="nb-student-avatar-circle">
                    {profile?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="nb-student-details">
                    <span className="nb-student-name">{profile?.username}</span>
                    <div className="nb-student-info-grad-xp-container">
                      <span className="nb-student-badge">Grade {profile?.grade}</span>
                      <span className="nb-student-xp">⚡ {profile?.xp ?? 0} XP</span>
                    </div>
                  </div>
                </div>
              );
            })() : (
              <div className="nb-auth-btns">
                <button className="nb-btn-outline" onClick={() => setOverlay('login')}>Log In</button>
                <button className="nb-btn-primary" onClick={() => setOverlay('signup')}>Sign Up</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer menu ────────────────────────────── */}
      {menuOpen && (
        <>
          <div className="nb-drawer-overlay" onClick={() => setMenuOpen(false)} />
          <div className="nb-drawer">
            <div className="nb-drawer-header">
              <GraduationCap size={32} color="#7c3aed" />
              <span>GradeUp</span>
              <button className="nb-drawer-close" onClick={() => setMenuOpen(false)}><X size={20} /></button>
            </div>

            {isLoggedIn && (
              <div className="nb-drawer-profile">
                {/*<span className="nb-drawer-avatar"><img src={avatarUrl(userAvatar)} alt="avatar" width={40} height={40} style={{borderRadius:'50%'}} /></span>*/}
                <div>
                  <p className="nb-drawer-name">{user?.profiles.find(p => p.id === user.activeProfileId)?.username ?? user?.profiles[0]?.username}</p>
                  <p className="nb-drawer-role">🎓 Student</p>
                </div>
              </div>
            )}

            <nav className="nb-drawer-nav">
              <Link to="/" className={`nb-drawer-item ${location.pathname === '/' || isActive('/level') ? 'active' : ''}`}>
                <Home size={20} /> Home
              </Link>
              <Link to="/games" className={`nb-drawer-item ${isActive('/games') ? 'active' : ''}`}>
                <Gamepad2 size={20} /> Games
              </Link>
              {isLoggedIn && (
                <>
                  <Link to="/profile" className={`nb-drawer-item ${isActive('/profile') ? 'active' : ''}`}>
                    <User size={20} /> Profile
                  </Link>
                  <button className="nb-drawer-item nb-drawer-logout" onClick={handleLogout}>
                    <LogOut size={20} /> Log Out
                  </button>
                </>
              )}
            </nav>

            {!isLoggedIn && (
              <div className="nb-drawer-footer">
                <button className="nb-btn-primary full" onClick={() => { setOverlay('signup'); setMenuOpen(false); }}>
                  🎮 Create Free Account
                </button>
                <button className="nb-btn-outline full" onClick={() => { setOverlay('login'); setMenuOpen(false); }}>
                  Log In
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Bottom tab bar (mobile, logged in) ───────────── */}
      {isLoggedIn && (
        <nav className="nb-bottom-bar">
          {bottomItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nb-bottom-item ${
                (item.path === '/'
                  ? location.pathname === '/' || isActive('/level')
                  : item.exact
                    ? location.pathname === item.path
                    : isActive(item.path))
                      ? 'active' : ''
              }`}
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </>
  );
};

export default Navbar;

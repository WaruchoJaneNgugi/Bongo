import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Home, Gamepad2, User, LogOut, Menu, X,
  GraduationCap, ChevronDown, BookOpen, Trophy,
} from 'lucide-react';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const { isLoggedIn, user, setOverlay, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); setDropdownOpen(false); }, [location]);

  // const isMobile = window.innerWidth <= 768;
  const isActive = (p: string) => location.pathname === p || location.pathname.startsWith(p + '/');

  // const userInitial = user?.username?.charAt(0).toUpperCase() || 'S';
  const userAvatar = user?.avatar || (user?.type === 'parent' ? '👩' : '🧒');

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  const levelRoute = user?.type === 'student'
    ? { lower_primary: '/level/lower-primary', middle_school: '/level/middle-school', senior_school: '/level/senior-school' }[user.educationLevel]
    : '/';

  /* ── Bottom nav items (logged in) ──────────────────────── */
  const bottomItems = [
    { path: '/',       icon: Home,      label: 'Home' },
    { path: levelRoute || '/level', icon: BookOpen, label: 'Learn' },
    { path: '/games',  icon: Gamepad2,  label: 'Games' },
    { path: '/profile',icon: User,      label: 'Profile' },
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
              <span>Bongo<strong>Quiz</strong></span>
            </button>

            {/* Desktop nav links */}
            <div className="nb-links">
              <Link to="/" className={`nb-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}>
                <Home size={17} /> Home
              </Link>
              <Link to="/games" className={`nb-link ${isActive('/games') ? 'active' : ''}`}>
                <Gamepad2 size={17} /> Games
              </Link>
              {isLoggedIn && (
                <Link to={levelRoute || '/level'} className={`nb-link ${isActive('/level') ? 'active' : ''}`}>
                  <BookOpen size={17} /> Learn
                </Link>
              )}
            </div>
          </div>

          {/* Right: auth / user menu */}
          <div className="nb-right">
            {isLoggedIn ? (
              <div className="nb-user-wrap">
                <button
                  className="nb-user-btn"
                  onClick={() => setDropdownOpen(v => !v)}
                >
                  <span className="nb-user-avatar">{userAvatar}</span>
                  <span className="nb-user-name nb-desktop-only">{user?.username}</span>
                  <ChevronDown size={15} className={`nb-chevron ${dropdownOpen ? 'open' : ''}`} />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="nb-dropdown-overlay" onClick={() => setDropdownOpen(false)} />
                    <div className="nb-dropdown">
                      <div className="nb-dropdown-header">
                        <span className="nb-dd-avatar">{userAvatar}</span>
                        <div>
                          <p className="nb-dd-name">{user?.username}</p>
                          <p className="nb-dd-role">{user?.type === 'parent' ? '👨‍👩‍👧 Parent' : '🎓 Student'}</p>
                        </div>
                      </div>
                      <div className="nb-dropdown-divider" />
                      <Link to="/profile" className="nb-dd-item" onClick={() => setDropdownOpen(false)}>
                        <User size={16} /> Profile
                      </Link>
                      <Link to="/dashboard" className="nb-dd-item" onClick={() => setDropdownOpen(false)}>
                        <Trophy size={16} /> Dashboard
                      </Link>
                      <div className="nb-dropdown-divider" />
                      <button className="nb-dd-item nb-dd-logout" onClick={handleLogout}>
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
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
              <span>BongoQuiz</span>
              <button className="nb-drawer-close" onClick={() => setMenuOpen(false)}><X size={20} /></button>
            </div>

            {isLoggedIn && (
              <div className="nb-drawer-profile">
                <span className="nb-drawer-avatar">{userAvatar}</span>
                <div>
                  <p className="nb-drawer-name">{user?.username}</p>
                  <p className="nb-drawer-role">{user?.type === 'parent' ? '👨‍👩‍👧 Parent' : '🎓 Student'}</p>
                </div>
              </div>
            )}

            <nav className="nb-drawer-nav">
              <Link to="/" className={`nb-drawer-item ${location.pathname === '/' ? 'active' : ''}`}>
                <Home size={20} /> Home
              </Link>
              <Link to="/games" className={`nb-drawer-item ${isActive('/games') ? 'active' : ''}`}>
                <Gamepad2 size={20} /> Games
              </Link>
              {isLoggedIn && (
                <>
                  <Link to={levelRoute || '/level'} className={`nb-drawer-item ${isActive('/level') ? 'active' : ''}`}>
                    <BookOpen size={20} /> My Level
                  </Link>
                  <Link to="/profile" className={`nb-drawer-item ${isActive('/profile') ? 'active' : ''}`}>
                    <User size={20} /> Profile
                  </Link>
                  <Link to="/dashboard" className={`nb-drawer-item ${isActive('/dashboard') ? 'active' : ''}`}>
                    <Trophy size={20} /> Dashboard
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
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path)
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

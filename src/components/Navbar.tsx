import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
    Home,
    Info,
    Phone,
    BookOpen,
    BarChart3,
    // LogIn,
    // UserPlus,
    User,
    Menu,
    X,
    GraduationCap,
    LogOut,
    Sparkles,
    Trophy,
    Settings,
    HelpCircle,
    Award,
    BookMarked
} from 'lucide-react';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
    const { isLoggedIn, user, setOverlay, logout } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogoClick = () => {
        setOverlay(null);
        navigate('/');
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    // Get user's first name for greeting
    const firstName = user?.username?.split(' ')[0] || 'Student';
    const userInitial = user?.username?.charAt(0).toUpperCase() || 'S';

    // Mobile Bottom Navigation Items
    const bottomNavItems = isLoggedIn ? [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/dashboard', icon: BarChart3, label: 'Stats' },
        { path: '/level/lower-primary', icon: BookOpen, label: 'Learn' },
        { path: '/about', icon: Info, label: 'About' },
        { path: '/contact', icon: Phone, label: 'Contact' }
    ] : [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/about', icon: Info, label: 'About' },
        { path: '/contact', icon: Phone, label: 'Contact' }
    ];

    // Mobile Navigation
    if (isMobile) {
        return (
            <>
                {/* Top Bar for Mobile */}
                <nav className="navbar mobile-top-bar">
                    <div className="mobile-left">
                        <div
                            className="btn-icon menu-toggle"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </div>

                        <div className="mobile-logo" onClick={handleLogoClick}>
                            <GraduationCap size={28} color="#7C3AED" />
                            <span>Bongo<span>Quiz</span></span>
                        </div>
                    </div>

                    <div className="mobile-top-actions">
                        {isLoggedIn ? (
                            <div
                                className="user-greeting"
                                onClick={() => navigate('/dashboard')}
                                aria-label="Go to dashboard"
                            >
                                <span className="greeting-emoji">👋</span>
                                <span className="greeting-name">{firstName}</span>
                            </div>
                        ) : (
                            <>
                                <button
                                    className="btn-outline"
                                    onClick={() => {
                                        setOverlay('login');
                                        setIsMenuOpen(false);
                                    }}
                                    aria-label="Log in"
                                >
                                    {/*<LogIn size={18} />*/}
                                    <span>Log In</span>
                                </button>
                                <button
                                    className="btn-primary"
                                    onClick={() => {
                                        setOverlay('signup');
                                        setIsMenuOpen(false);
                                    }}
                                    aria-label="Sign up"
                                >
                                    {/*<UserPlus size={18} />*/}
                                    <span>Sign Up</span>
                                </button>
                            </>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu Overlay - Now from LEFT */}
                {isMenuOpen && (
                    <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)}>
                        <div className="mobile-menu" onClick={e => e.stopPropagation()}>
                            <div className="mobile-menu-header">
                                <GraduationCap size={36} color="#7C3AED" />
                                <h3>Menu</h3>
                                <button className="close-menu" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                                    <X size={22} />
                                </button>
                            </div>

                            {isLoggedIn && (
                                <div className="menu-user-profile">
                                    <div className="menu-avatar">
                                        {userInitial}
                                    </div>
                                    <div className="menu-user-info">
                                        <h4>{user?.username}</h4>
                                        <span className="menu-level">
                                            <Award size={12} /> {user?.educationLevel || 'Beginner'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="mobile-menu-items">
                                <div onClick={() => { navigate('/'); setIsMenuOpen(false); }}>
                                    <Home size={22} /> Home
                                </div>
                                <div onClick={() => { navigate('/about'); setIsMenuOpen(false); }}>
                                    <Info size={22} /> About
                                </div>
                                <div onClick={() => { navigate('/contact'); setIsMenuOpen(false); }}>
                                    <Phone size={22} /> Contact
                                </div>

                                {isLoggedIn && (
                                    <>
                                        <div className="menu-divider"></div>
                                        <div onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}>
                                            <BarChart3 size={22} /> Dashboard
                                        </div>
                                        <div onClick={() => { navigate('/level/lower-primary'); setIsMenuOpen(false); }}>
                                            <BookOpen size={22} /> My Level
                                        </div>
                                        <div onClick={() => { navigate('/subjects'); setIsMenuOpen(false); }}>
                                            <BookMarked size={22} /> Subjects
                                        </div>
                                        <div onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}>
                                            <User size={22} /> Profile
                                        </div>
                                        <div onClick={() => { navigate('/achievements'); setIsMenuOpen(false); }}>
                                            <Trophy size={22} /> Achievements
                                        </div>
                                        <div className="menu-divider"></div>
                                        <div onClick={() => { navigate('/help'); setIsMenuOpen(false); }}>
                                            <HelpCircle size={22} /> Help
                                        </div>
                                        <div onClick={() => { navigate('/settings'); setIsMenuOpen(false); }}>
                                            <Settings size={22} /> Settings
                                        </div>
                                        <div className="logout-menu-item" onClick={handleLogout}>
                                            <LogOut size={22} /> Log Out
                                        </div>
                                    </>
                                )}
                            </div>

                            {!isLoggedIn && (
                                <div className="menu-footer">
                                    <p>New to BongoQuiz? 🎓</p>
                                    <button
                                        className="btn-primary"
                                        onClick={() => {
                                            setOverlay('signup');
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        Create Free Account
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Bottom Navigation - For all users */}
                <nav className="bottom-nav">
                    {bottomNavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`bottom-nav-item ${isActive(item.path) ||
                            (item.path.includes('level') && location.pathname.includes('level')) ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <item.icon size={24} />
                            <span className="bottom-nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </>
        );
    }

    // Desktop Navigation
    return (
        <nav className="navbar desktop-nav">
            <div className="nav-left">
                <button className="navbar-logo" onClick={handleLogoClick} aria-label="Go to home">
                    <GraduationCap size={36} color="#7C3AED" />
                    <span>Bongo<span>Quiz</span></span>
                </button>

                <div className="nav-links">
                    <Link
                        to="/about"
                        className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                        aria-label="About page"
                    >
                        <Info size={20} />
                        About
                    </Link>
                    <Link
                        to="/contact"
                        className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                        aria-label="Contact page"
                    >
                        <Phone size={20} />
                        Contact
                    </Link>
                </div>
            </div>

            <div className="nav-right">
                {isLoggedIn ? (
                    <>
                        <Link
                            to="/level/lower-primary"
                            className={`nav-link ${location.pathname.includes('/level') ? 'active' : ''}`}
                            aria-label="My learning level"
                        >
                            <BookOpen size={20} />
                            My Level
                        </Link>

                        <Link
                            to="/dashboard"
                            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                            aria-label="Dashboard"
                        >
                            <BarChart3 size={20} />
                            Dashboard
                        </Link>

                        <div className="user-menu">
                            <button
                                className="user-menu-btn"
                                onClick={() => navigate('/dashboard')}
                                aria-label="User menu"
                            >
                                <div className="user-avatar">
                                    {userInitial}
                                </div>
                                <span className="user-name">{firstName}</span>
                                <Sparkles size={16} className="sparkle-icon" />
                            </button>

                            <div className="user-dropdown">
                                <div className="dropdown-header">
                                    <p className="user-email">{user?.email}</p>
                                </div>
                                <Link to="/profile" className="dropdown-item">
                                    <User size={18} /> Profile
                                </Link>
                                <Link to="/achievements" className="dropdown-item">
                                    <Trophy size={18} /> Achievements
                                </Link>
                                <Link to="/settings" className="dropdown-item">
                                    <Settings size={18} /> Settings
                                </Link>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item logout" onClick={handleLogout}>
                                    <LogOut size={18} /> Log Out
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <button className="btn-outline" onClick={() => setOverlay('login')} aria-label="Log in">
                            {/*<LogIn size={20} />*/}
                            <span>Log In</span>
                        </button>
                        <button className="btn-primary" onClick={() => setOverlay('signup')} aria-label="Sign up">
                            {/*<UserPlus size={20} />*/}
                            <span>Sign Up</span>
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
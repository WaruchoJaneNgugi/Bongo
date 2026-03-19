import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mail,
    Phone,
    MapPin,
    BookOpen,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Send,
    ArrowUpRight,
} from 'lucide-react';
import '../styles/footer.css';

const SOCIAL_LINKS = [
    { icon: Facebook,  label: 'Facebook',  href: 'https://facebook.com/bongoquiz',  color: '#1877F2' },
    { icon: Twitter,   label: 'Twitter/X', href: 'https://twitter.com/bongoquiz',   color: '#1DA1F2' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/bongoquiz', color: '#E1306C' },
    { icon: Youtube,   label: 'YouTube',   href: 'https://youtube.com/@bongoquiz',  color: '#FF0000' },
    { icon: Send,      label: 'Telegram',  href: 'https://t.me/bongoquiz',          color: '#229ED9' },
];

const QUICK_LINKS = [
    { label: 'Home',       path: '/'         },
    { label: 'About Us',   path: '/about'    },
    { label: 'Subjects',   path: '/subjects' },
    { label: 'Dashboard',  path: '/dashboard'},
    { label: 'Leaderboard',path: '/leaderboard'},
];

const Footer: React.FC = () => {
    const navigate = useNavigate();
    const year = new Date().getFullYear();

    return (
        <footer className="ft-root">
            {/* wave divider */}
            <div className="ft-wave" aria-hidden="true">
                <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="currentColor"/>
                </svg>
            </div>

            <div className="ft-body">
                <div className="ft-grid">

                    {/* ── Brand column ─────────────────────────── */}
                    <div className="ft-col ft-brand-col">
                        <div className="ft-logo" onClick={() => navigate('/')}>
                            <div className="ft-logo-icon">
                                <BookOpen size={22} color="#fff" />
                            </div>
                            <span>Bongo<strong>Quiz</strong></span>
                        </div>
                        <p className="ft-tagline">
                            Kenya's #1 CBC revision platform. Making learning engaging,
                            effective, and fun for every student.
                        </p>

                        {/* Social icons */}
                        <div className="ft-social-row">
                            {SOCIAL_LINKS.map(({ icon: Icon, label, href, color }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="ft-social-btn"
                                    style={{ '--social-color': color } as React.CSSProperties}
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Quick links ───────────────────────────── */}
                    <div className="ft-col">
                        <h4 className="ft-col-title">Quick Links</h4>
                        <ul className="ft-link-list">
                            {QUICK_LINKS.map(({ label, path }) => (
                                <li key={label}>
                                    <button
                                        className="ft-nav-link"
                                        onClick={() => navigate(path)}
                                    >
                                        <ArrowUpRight size={14} />
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Contact ───────────────────────────────── */}
                    <div className="ft-col">
                        <h4 className="ft-col-title">Contact Us</h4>
                        <ul className="ft-contact-list">
                            <li>
                                <a href="mailto:hello@bongoquiz.co.ke" className="ft-contact-item">
                                    <span className="ft-contact-icon">
                                        <Mail size={16} />
                                    </span>
                                    <span>
                                        <strong>Email</strong>
                                        <span>hello@bongoquiz.co.ke</span>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="tel:+254700000000" className="ft-contact-item">
                                    <span className="ft-contact-icon">
                                        <Phone size={16} />
                                    </span>
                                    <span>
                                        <strong>Phone</strong>
                                        <span>+254 700 000 000</span>
                                    </span>
                                </a>
                            </li>
                            <li className="ft-contact-item ft-contact-static">
                                <span className="ft-contact-icon">
                                    <MapPin size={16} />
                                </span>
                                <span>
                                    <strong>Location</strong>
                                    <span>Nairobi, Kenya</span>
                                    <span className="ft-contact-sub">Westlands, Nairobi CBD</span>
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* ── Newsletter ────────────────────────────── */}
                    <div className="ft-col">
                        <h4 className="ft-col-title">Stay Updated</h4>
                        <p className="ft-newsletter-desc">
                            Get new quizzes, study tips, and CBC updates straight to your inbox.
                        </p>
                        <div className="ft-newsletter-form">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="ft-newsletter-input"
                                aria-label="Email for newsletter"
                            />
                            <button className="ft-newsletter-btn" aria-label="Subscribe">
                                <Send size={16} />
                            </button>
                        </div>
                        <p className="ft-newsletter-note">No spam. Unsubscribe anytime.</p>
                    </div>

                </div>

                {/* ── Bottom bar ────────────────────────────────── */}
                <div className="ft-bottom">
                    <p className="ft-copy">
                        © {year} BongoQuiz. All rights reserved. Built with ❤️ in Kenya.
                    </p>
                    <div className="ft-legal-links">
                        <button className="ft-legal-btn" onClick={() => navigate('/privacy')}>Privacy Policy</button>
                        <span className="ft-legal-sep">·</span>
                        <button className="ft-legal-btn" onClick={() => navigate('/terms')}>Terms of Use</button>
                    </div>
                </div>
            </div>
            <div className="ft-wave" aria-hidden="true">
                <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="currentColor"/>
                </svg>
            </div>
        </footer>
    );
};

export default Footer;
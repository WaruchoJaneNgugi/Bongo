import React from 'react';
import {useStore} from '../store/useStore';
import heroImg from '../assets/hero-bg.png';
import {
    ArrowRight,
    BookOpen,
    BarChart3,
    Users,
    Award,
    Star, Zap, ChevronRight, Play, Flame
} from 'lucide-react';
import '../styles/hero-loggedin.css';
import {useNavigate} from "react-router-dom";
import Footer from "./Footer.tsx";

/* ─── mock data (replace with real data from store/API) ─── */
const STREAK = 5;
const LEVEL = 3;
const POINTS = 1200;
const LAST_QUIZ = {name: 'Science Quiz', progress: 65};

const CONTINUE_CARDS = [
    {id: 1, subject: 'Math', progress: 65, color: '#7C3AED', emoji: '🧮', isNew: false},
    {id: 2, subject: 'CRE', progress: 40, color: '#EA580C', emoji: '✝️', isNew: false},
    {id: 3, subject: 'Science', progress: 5, color: '#059669', emoji: '🔬', isNew: true},
    {id: 4, subject: 'Kiswahili', progress: 5, color: '#D97706', emoji: '🗣️', isNew: true},
    {id: 5, subject: 'Social Studies', progress: 5, color: '#7C3AED', emoji: '🌍', isNew: true},
];

const RECOMMENDED = [
    {id: 1, subject: 'Geography', level: 2, xp: 650, pts: 400, emoji: '🌍', color: '#0891B2'},
    {id: 2, subject: 'Grammar Challenge', level: 3, xp: 800, pts: 500, emoji: '📝', color: '#D97706'},
];
/* ───────────────────────────────────────────────────────── */

const LoggedInHero: React.FC = () => {
    // const { user } = useStore();
    const navigate = useNavigate();

    return (
        <main className="lih-root">

            {/* ── HERO CARD ───────────────────────────────────── */}
            <section className="lih-hero-card">
                {/* illustrated banner */}
                <div className="lih-banner">
                    <img src={heroImg} alt="Students" className="lih-banner-img"/>
                    <div className="lih-banner-overlay"/>
                    <span className="lih-streak-badge">
                        <Flame size={16} fill="#FF6B35" color="#FF6B35"/>
                        You're on a <strong>{STREAK} day streak!</strong>
                    </span>
                </div>

                {/* info panel */}
                <div className="lih-info-panel">
                    <div className="lih-info-row">
                        <div className="lih-streak-meta">
                            <BarChart3 size={16}/>
                            <span>Daily Streak: <strong>{STREAK} days</strong></span>
                        </div>
                        <button className="lih-level-pill" onClick={() => navigate('/dashboard')}>
                            Level {LEVEL} · {POINTS.toLocaleString()} pts
                            <ChevronRight size={14}/>
                        </button>
                    </div>

                    <p className="lih-continue-label">
                        Continue: <strong>{LAST_QUIZ.name}</strong>
                    </p>

                    {/* progress bar */}
                    <div className="lih-progress-wrap">
                        <div className="lih-progress-track">
                            <div
                                className="lih-progress-fill"
                                style={{width: `${LAST_QUIZ.progress}%`}}
                            />
                        </div>
                        <span className="lih-progress-pct">{LAST_QUIZ.progress}%</span>
                    </div>

                    {/* CTA buttons */}
                    <div className="lih-actions">
                        <button className="lih-btn lih-btn-primary">
                            <Play size={18} fill="white" color="white"/>
                            Continue Learning
                        </button>
                        <button className="lih-btn lih-btn-outline" onClick={() => navigate('/dashboard')}>
                            <BarChart3 size={18}/>
                            View Progress
                        </button>
                    </div>
                </div>
            </section>

            {/* ── CONTINUE LEARNING ───────────────────────────── */}
            <section className="lih-section">
                <div className="lih-section-header">
                    <h2>Continue Learning</h2>
                    <button className="lih-see-all">See All <ChevronRight size={14}/></button>
                </div>

                <div className="lih-cards-row">
                    {CONTINUE_CARDS.map(card => (
                        <div key={card.id} className="lih-subject-card">
                            {card.isNew
                                ? <span className="lih-badge lih-badge-new">New</span>
                                : <span className="lih-badge lih-badge-pct">{card.progress}%</span>
                            }
                            <div
                                className="lih-subject-thumb"
                                style={{background: `linear-gradient(135deg, ${card.color}cc, ${card.color}44)`}}
                            >
                                <span className="lih-subject-emoji">{card.emoji}</span>
                            </div>
                            <p className="lih-subject-name">{card.subject}</p>
                            <div className="lih-mini-progress-track">
                                <div
                                    className="lih-mini-progress-fill"
                                    style={{width: `${card.progress}%`, background: card.color}}
                                />
                            </div>
                            {!card.isNew && (
                                <span className="lih-subject-pct-label">{card.progress}%</span>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── RECOMMENDED ─────────────────────────────────── */}
            <section className="lih-section">
                <div className="lih-section-header">
                    <h2>Recommended for You</h2>
                    <button className="lih-see-all">See All <ChevronRight size={14}/></button>
                </div>

                <div className="lih-rec-grid">
                    {RECOMMENDED.map(rec => (
                        <button key={rec.id} className="lih-rec-card">
                            <div
                                className="lih-rec-thumb"
                                style={{background: `linear-gradient(135deg, ${rec.color}bb, ${rec.color}33)`}}
                            >
                                <span className="lih-rec-emoji">{rec.emoji}</span>
                                <div className="lih-rec-meta">
                                    <span className="lih-rec-title">{rec.subject}</span>
                                    <span className="lih-rec-lvl">
                                        <Zap size={11}/> Lv {rec.level} · <Star size={11}/> {rec.xp} XP
                                    </span>
                                </div>
                            </div>
                            <p className="lih-rec-reward">
                                Earn up to <strong>{rec.pts} pts!</strong>
                            </p>
                        </button>
                    ))}
                </div>
            </section>

        </main>
    );
};


const GuestHero: React.FC = () => {
    const {setOverlay} = useStore();
    const navigate = useNavigate();

    return (
        <>
            <section className="hero-guest">
                <div className="container">
                    <div className="hero-grid">
                        <div className="hero-content">
                            <div className="hero-badge">
                                <Award size={16}/>
                                <span>Kenya's #1 CBC Revision Platform</span>
                            </div>
                            <h1 className="hero-title">
                                Ace Your Exams
                                <span className="text-gradient"> with Confidence!</span>
                            </h1>
                            <p className="hero-subtitle">
                                The smart way to prepare for CBC exams. Interactive quizzes,
                                detailed analytics, and personalized learning paths.
                            </p>
                            <div className="hero-actions">
                                <button
                                    className="btn btn-primary-hero btn-lg"
                                    onClick={() => setOverlay('signup')}
                                >
                                    Get Started Free
                                    <ArrowRight size={20}/>
                                </button>
                                <button className="btn btn-outline-hero btn-lg"
                                        onClick={() => navigate('/about')}
                                >
                                    Learn More
                                </button>
                            </div>
                            <div className="hero-stats">
                                <div className="stat-item">
                                    <Users size={20}/>
                                    <span>50K+ Students</span>
                                </div>
                                <div className="stat-divider"/>
                                <div className="stat-item">
                                    <BookOpen size={20}/>
                                    <span>10K+ Quizzes</span>
                                </div>
                                <div className="stat-divider"/>
                                <div className="stat-item">
                                    <BarChart3 size={20}/>
                                    <span>98% Success Rate</span>
                                </div>
                            </div>
                        </div>
                        <div className="hero-image">
                            <img src={heroImg} alt="Students studying with BongoQuiz"/>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Why Choose Us</span>
                        <h2 className="section-title">
                            Everything you need to
                            <span className="text-gradient"> succeed</span>
                        </h2>
                        <p className="section-subtitle">
                            Our platform is designed to make learning engaging, effective, and fun
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card card card-interactive">
                            <div className="feature-icon-wrapper" style={{background: 'var(--primary-50)'}}>
                                <BookOpen size={32} style={{color: 'var(--primary-600)'}}/>
                            </div>
                            <h3>Curriculum Aligned</h3>
                            <p>All content follows the Kenyan CBC curriculum perfectly, from Grade 1 to Form 4.</p>
                        </div>

                        <div className="feature-card card card-interactive">
                            <div className="feature-icon-wrapper" style={{background: 'var(--primary-50)'}}>
                                <BarChart3 size={32} style={{color: 'var(--primary-600)'}}/>
                            </div>
                            <h3>Track Progress</h3>
                            <p>Monitor your improvement with detailed analytics and performance insights.</p>
                        </div>

                        <div className="feature-card card card-interactive">
                            <div className="feature-icon-wrapper" style={{background: 'var(--primary-50)'}}>
                                <Users size={32} style={{color: 'var(--primary-600)'}}/>
                            </div>
                            <h3>Interactive Learning</h3>
                            <p>Engaging quizzes with instant feedback to boost understanding and retention.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

const LandingPage: React.FC = () => {
    const {isLoggedIn} = useStore();

    return (
        <main>
            {isLoggedIn ? <LoggedInHero/> : <GuestHero/>}
            <Footer />
        </main>
    );
};

export default LandingPage;
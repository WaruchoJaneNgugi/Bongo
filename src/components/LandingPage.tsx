import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import heroImg from '../assets/hero-bg.png';
import LowerPrimary from '../assets/banners/LowerPrimaryb.png';
import MiddleSchool from '../assets/banners/middle-school.png';
import SeniorSchool from '../assets/banners/seniorschool.png';
import {
    BarChart3, Star, Zap, ChevronRight, ChevronLeft,
    Clock, Flame, Target, TrendingUp, Shield, Play,
} from 'lucide-react';
import '../styles/guest-hero.css';
import '../styles/hero-loggedin.css';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer.tsx';
import ExamBrowser from "./ExamBrowser.tsx";

/* ─── mock data ─── */
const STREAK = 5;
const LEVEL  = 3;
const POINTS = 1200;
const LAST_QUIZ = { name: 'Science Quiz', progress: 65 };

const CONTINUE_CARDS = [
    { id: 1, subject: 'Math',           progress: 65, color: '#7C3AED', emoji: '🧮', isNew: false },
    { id: 2, subject: 'CRE',            progress: 40, color: '#EA580C', emoji: '✝️',  isNew: false },
    { id: 3, subject: 'Science',        progress: 20, color: '#059669', emoji: '🔬', isNew: true  },
    { id: 4, subject: 'Kiswahili',      progress: 35, color: '#D97706', emoji: '🗣️', isNew: true  },
    { id: 5, subject: 'Social Studies', progress: 50, color: '#7C3AED', emoji: '🌍', isNew: true  },
];

const RECOMMENDED = [
    { id: 1, subject: 'Geography',         level: 2, xp: 650, pts: 400, emoji: '🌍', color: '#0891B2' },
    { id: 2, subject: 'Grammar Challenge',  level: 3, xp: 800, pts: 500, emoji: '📝', color: '#D97706' },
];

const SLIDES = [
    {
        id: 'lower', img: LowerPrimary, grade: 'Grade 1–3', tag: '🧒 Lower Primary',
        bg: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 60%, #c084fc 100%)',
    },
    {
        id: 'middle', img: MiddleSchool, grade: 'Grade 4–9', tag: '🧠 Middle School',
        bg: 'linear-gradient(135deg, #0891b2 0%, #0284c7 60%, #38bdf8 100%)',
    },
    {
        id: 'senior', img: SeniorSchool, grade: 'Grade 10–12', tag: '🎓 Senior School',
        bg: 'linear-gradient(135deg, #dc2626 0%, #ea580c 60%, #fb923c 100%)',
    },
];

const FEATURES = [
    { icon: Target,     title: 'Curriculum Aligned',  desc: 'Every question follows the official Kenyan CBC curriculum from Grade 1 to Grade 12.', color: '#7c3aed' },
    { icon: BarChart3,  title: 'Track Your Progress', desc: 'Detailed analytics show exactly where you are strong and where to improve.',           color: '#0891b2' },
    { icon: Flame,      title: 'Gamified Learning',   desc: 'Earn points, unlock badges, climb the leaderboard — make revision actually fun.',      color: '#ea580c' },
    { icon: Shield,     title: 'JESMA Predictions',   desc: 'Our JESMA-style exam predictions have an 87% accuracy rate for actual exam questions.', color: '#059669' },
    { icon: Clock,      title: 'Timed Mock Exams',    desc: 'Real exam conditions with countdowns — build the speed and confidence you need.',       color: '#d97706' },
    { icon: TrendingUp, title: 'Smart Performance',   desc: 'AI-powered insights track your week-on-week improvement across every subject.',        color: '#7c3aed' },
];

/* ── LoggedInHero ── */
const LoggedInHero: React.FC = () => {
    const navigate = useNavigate();
    return (
        <main className="lih-root">
            <section className="lih-hero-card">
                <div className="lih-banner">
                    <img src={heroImg} alt="Students" className="lih-banner-img" />
                    <div className="lih-banner-overlay" />
                    <span className="lih-streak-badge">
                        <Flame size={16} fill="#FF6B35" color="#FF6B35" />
                        You're on a <strong>{STREAK} day streak!</strong>
                    </span>
                </div>
                <div className="lih-info-panel">
                    <div className="lih-info-row">
                        <div className="lih-streak-meta">
                            <BarChart3 size={16} />
                            <span>Daily Streak: <strong>{STREAK} days</strong></span>
                        </div>
                        <button className="lih-level-pill" onClick={() => navigate('/dashboard')}>
                            Level {LEVEL} · {POINTS.toLocaleString()} pts <ChevronRight size={14} />
                        </button>
                    </div>
                    <p className="lih-continue-label">Continue: <strong>{LAST_QUIZ.name}</strong></p>
                    <div className="lih-progress-wrap">
                        <div className="lih-progress-track">
                            <div className="lih-progress-fill" style={{ width: `${LAST_QUIZ.progress}%` }} />
                        </div>
                        <span className="lih-progress-pct">{LAST_QUIZ.progress}%</span>
                    </div>
                    <div className="lih-actions">
                        <button className="lih-btn lih-btn-primary">
                            <Play size={18} fill="white" color="white" /> Continue Learning
                        </button>
                        <button className="lih-btn lih-btn-outline" onClick={() => navigate('/dashboard')}>
                            <BarChart3 size={18} /> View Progress
                        </button>
                    </div>
                </div>
            </section>

            <section className="lih-section">
                <div className="lih-section-header">
                    <h2>Continue Learning</h2>
                    <button className="lih-see-all">See All <ChevronRight size={14} /></button>
                </div>
                <div className="lih-cards-row">
                    {CONTINUE_CARDS.map(card => (
                        <div key={card.id} className="lih-subject-card">
                            {card.isNew
                                ? <span className="lih-badge lih-badge-new">New</span>
                                : <span className="lih-badge lih-badge-pct">{card.progress}%</span>
                            }
                            <div className="lih-subject-thumb" style={{ background: `linear-gradient(135deg, ${card.color}cc, ${card.color}44)` }}>
                                <span className="lih-subject-emoji">{card.emoji}</span>
                            </div>
                            <p className="lih-subject-name">{card.subject}</p>
                            <div className="lih-mini-progress-track">
                                <div className="lih-mini-progress-fill" style={{ width: `${card.progress}%`, background: card.color }} />
                            </div>
                            {!card.isNew && <span className="lih-subject-pct-label">{card.progress}%</span>}
                        </div>
                    ))}
                </div>
            </section>

            <section className="lih-section">
                <div className="lih-section-header">
                    <h2>Recommended for You</h2>
                    <button className="lih-see-all">See All <ChevronRight size={14} /></button>
                </div>
                <div className="lih-rec-grid">
                    {RECOMMENDED.map(rec => (
                        <button key={rec.id} className="lih-rec-card">
                            <div className="lih-rec-thumb" style={{ background: `linear-gradient(135deg, ${rec.color}bb, ${rec.color}33)` }}>
                                <span className="lih-rec-emoji">{rec.emoji}</span>
                                <div className="lih-rec-meta">
                                    <span className="lih-rec-title">{rec.subject}</span>
                                    <span className="lih-rec-lvl">
                                        <Zap size={11} /> Lv {rec.level} · <Star size={11} /> {rec.xp} XP
                                    </span>
                                </div>
                            </div>
                            <p className="lih-rec-reward">Earn up to <strong>{rec.pts} pts!</strong></p>
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
};

/* ── GuestHero ── */
const GuestHero: React.FC = () => {
    const { setOverlay } = useStore();

    const [slideIdx, setSlideIdx] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setSlideIdx(i => (i + 1) % SLIDES.length);
        }, 5000);
    };

    const goSlide = (i: number) => {
        if (timerRef.current) clearInterval(timerRef.current);
        setSlideIdx(i);
        startTimer();
    };

    useEffect(() => {
        startTimer();
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const slide = SLIDES[slideIdx];

    return (
        <div className="gh-root">

            {/* ── Slider ───────────────────────────────────── */}
            <section className="gh-slider-full">
                <div className="gh-slider-bg-image">
                    <img className="hero-img" src={slide.img} alt={slide.grade} />
                    <div className="gh-slider-overlay" />
                </div>
                <div className="gh-orb gh-orb-2" />

                <button className="gh-arrow gh-arrow-left"  onClick={() => goSlide((slideIdx - 1 + SLIDES.length) % SLIDES.length)}>
                    <ChevronLeft size={22} />
                </button>
                <button className="gh-arrow gh-arrow-right" onClick={() => goSlide((slideIdx + 1) % SLIDES.length)}>
                    <ChevronRight size={22} />
                </button>

                <div className="gh-dots">
                    {SLIDES.map((_, i) => (
                        <button
                            key={i}
                            className={`gh-dot ${i === slideIdx ? 'gh-dot-active' : ''}`}
                            onClick={() => goSlide(i)}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* ── Exam browser (filter + grid) ─────────────── */}
            <ExamBrowser />

            {/* ── Features ─────────────────────────────────── */}
            <section className="gh-features-section">
                <div className="gh-section-header">
                    <span className="gh-section-badge">Why Choose Us</span>
                    <h2 className="gh-section-title">
                        Everything you need to <span className="gh-text-gradient">succeed</span>
                    </h2>
                    <p className="gh-section-sub">Built specifically for Kenyan CBC students, teachers, and parents.</p>
                </div>
                <div className="gh-features-grid">
                    {FEATURES.map(({ icon: Icon, title, desc, color }) => (
                        <div key={title} className="gh-feature-card">
                            <div className="gh-feature-icon" style={{ background: `${color}15`, color }}>
                                <Icon size={26} />
                            </div>
                            <h3 className="gh-feature-title">{title}</h3>
                            <p className="gh-feature-desc">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA banner ───────────────────────────────── */}
            <section className="gh-cta-banner">
                <div className="gh-cta-inner">
                    <div className="gh-cta-orb" />
                    <span className="gh-cta-tag">🚀 Kenya's #1 CBC Platform</span>
                    <h2 className="gh-cta-headline">Ready to ace your exams?</h2>
                    <p className="gh-cta-sub">
                        Join 50,000+ students already using BongoQuiz to prepare smarter, score higher, and win.
                    </p>
                    <div className="gh-cta-actions">
                        <button className="gh-btn gh-btn-white-cta" onClick={() => setOverlay('signup')}>
                            🎮 Join Free Today
                        </button>
                        <button className="gh-btn gh-btn-ghost-cta" onClick={() => setOverlay('login')}>
                            Already have an account? Log in
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
};

/* ── Root page ── */
const LandingPage: React.FC = () => {
    const { isLoggedIn } = useStore();
    return (
        <main>
            {isLoggedIn ? <LoggedInHero /> : <GuestHero />}
            <Footer />
        </main>
    );
};

export default LandingPage;
import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import {
    Camera, Check, Lock, User, Eye, EyeOff,
    TrendingUp, TrendingDown, Minus, Award,
    Flame, Star, BookOpen, Target, Zap,
    ChevronRight, BarChart2, Clock, CheckCircle2,
    AlertCircle, Upload, Trophy, Layers,
    Settings, Bell, Moon, Shield,
    ChevronUp, Gift, Sparkles
} from 'lucide-react';
import '../styles/studentprofile.css';

/* ─── Avatar options ───────────────────────────────────────── */
const AVATAR_ICONS = [
    { id: 'owl',    emoji: '🦉', label: 'Owl'    },
    { id: 'lion',   emoji: '🦁', label: 'Lion'   },
    { id: 'rocket', emoji: '🚀', label: 'Rocket' },
    { id: 'star',   emoji: '⭐', label: 'Star'   },
    { id: 'fire',   emoji: '🔥', label: 'Fire'   },
    { id: 'dino',   emoji: '🦕', label: 'Dino'   },
    { id: 'robot',  emoji: '🤖', label: 'Robot'  },
    { id: 'ninja',  emoji: '🥷', label: 'Ninja'  },
    { id: 'wizard', emoji: '🧙', label: 'Wizard' },
    { id: 'alien',  emoji: '👾', label: 'Alien'  },
    { id: 'fox',    emoji: '🦊', label: 'Fox'    },
    { id: 'panda',  emoji: '🐼', label: 'Panda'  },
];

/* ─── Analytics data ───────────────────────────────────────── */
const STATS = [
    { label: 'Quizzes Done',  value: 142,   icon: BookOpen, color: '#7c3aed', trend: 'up',   trendVal: '+12 this week'    },
    { label: 'Avg Score',     value: '78%',  icon: Target,   color: '#0891b2', trend: 'up',   trendVal: '+5% vs last week' },
    { label: 'Day Streak',    value: 5,      icon: Flame,    color: '#ea580c', trend: 'same', trendVal: 'Keep it up!'      },
    { label: 'Points Earned', value: '1.2K', icon: Star,     color: '#d97706', trend: 'up',   trendVal: '+200 this week'   },
];

const SUBJECT_SCORES = [
    { subject: 'Mathematics', score: 82, sessions: 38, emoji: '🧮', color: '#7c3aed' },
    { subject: 'Science',     score: 74, sessions: 27, emoji: '🧪', color: '#0891b2' },
    { subject: 'English',     score: 91, sessions: 33, emoji: '📖', color: '#059669' },
    { subject: 'Geography',   score: 65, sessions: 19, emoji: '🌍', color: '#d97706' },
    { subject: 'Bible',       score: 88, sessions: 25, emoji: '✝️',  color: '#dc2626' },
];

const WEEKLY_ACTIVITY = [65, 80, 45, 90, 72, 58, 85];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const RECENT_ACTIVITY = [
    { title: 'Math Quiz – Fractions',    score: 90, time: '2h ago',    pass: true  },
    { title: 'Science – Photosynthesis', score: 62, time: 'Yesterday', pass: false },
    { title: 'English Grammar Test',     score: 88, time: '2d ago',    pass: true  },
    { title: 'Geography – East Africa',  score: 71, time: '3d ago',    pass: true  },
];

/* ─── Achievements data ────────────────────────────────────── */
const ACHIEVEMENTS = [
    { id: 1,  title: 'First Quiz',        desc: 'Complete your very first quiz',             emoji: '🎉', earned: true,  pts: 50  },
    { id: 2,  title: 'Hot Streak',         desc: 'Maintain a 5-day study streak',             emoji: '🔥', earned: true,  pts: 100 },
    { id: 3,  title: 'Perfect Score',      desc: 'Score 100% on any quiz',                    emoji: '💯', earned: true,  pts: 200 },
    { id: 4,  title: 'Subject Master',     desc: 'Complete all quizzes in one subject',       emoji: '🏆', earned: true,  pts: 300 },
    { id: 5,  title: 'Speed Runner',       desc: 'Finish a quiz in under 2 minutes',          emoji: '⚡', earned: true,  pts: 150 },
    { id: 6,  title: 'Night Owl',          desc: 'Study after 9 PM',                          emoji: '🦉', earned: false, pts: 75  },
    { id: 7,  title: 'Century Club',       desc: 'Complete 100 quizzes',                      emoji: '💪', earned: false, pts: 500 },
    { id: 8,  title: 'Top of the Class',   desc: 'Reach the top 10% on the leaderboard',      emoji: '👑', earned: false, pts: 400 },
    { id: 9,  title: 'Knowledge Seeker',   desc: 'Study all 5 subjects in a single week',     emoji: '📚', earned: false, pts: 250 },
    { id: 10, title: 'Comeback Kid',       desc: 'Improve a subject score by 20% or more',   emoji: '🚀', earned: false, pts: 200 },
];

/* ─── Level / XP data ──────────────────────────────────────── */
const CURRENT_LEVEL   = 3;
const CURRENT_XP      = 1200;
const NEXT_LEVEL_XP   = 1500;
const XP_PROGRESS_PCT = Math.round((CURRENT_XP / NEXT_LEVEL_XP) * 100);

const LEVEL_MILESTONES = [
    { level: 1, title: 'Beginner',    xpRequired: 0,    reward: '🎒 Starter Pack',     unlocked: true  },
    { level: 2, title: 'Explorer',    xpRequired: 500,  reward: '🗺️ Explorer Badge',   unlocked: true  },
    { level: 3, title: 'Scholar',     xpRequired: 1000, reward: '📘 Scholar Crest',    unlocked: true  },
    { level: 4, title: 'Achiever',    xpRequired: 1500, reward: '🏅 Achiever Medal',   unlocked: false },
    { level: 5, title: 'Champion',    xpRequired: 2500, reward: '🏆 Champion Trophy',  unlocked: false },
    { level: 6, title: 'Legend',      xpRequired: 4000, reward: '👑 Legend Crown',     unlocked: false },
];

const LEVEL_PERKS = [
    { perk: 'Access to hard-mode quizzes',    available: true  },
    { perk: 'Custom profile badge',           available: true  },
    { perk: 'Priority leaderboard listing',   available: false },
    { perk: 'Bonus XP on weekly challenges',  available: false },
];

/* ─── Helpers ──────────────────────────────────────────────── */
const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === 'up')   return <TrendingUp  size={14} className="sp-trend-up"   />;
    if (trend === 'down') return <TrendingDown size={14} className="sp-trend-down" />;
    return <Minus size={14} className="sp-trend-same" />;
};

type TabId = 'analytics' | 'achievements' | 'level' | 'account' | 'settings';

const TABS: { id: TabId; icon: React.ElementType; label: string }[] = [
    { id: 'analytics',    icon: BarChart2, label: 'Analytics'        },
    { id: 'achievements', icon: Trophy,    label: 'Achievements'     },
    { id: 'level',        icon: Layers,    label: 'My Level'         },
    { id: 'account',      icon: User,      label: 'Account Settings' },
    { id: 'settings',     icon: Settings,  label: 'Settings'         },
];

/* ═══════════════════════════════════════════════════════════ */
const StudentProfile: React.FC = () => {
    const { user } = useStore();

    /* Avatar */
    const [selectedAvatar, setSelectedAvatar] = useState('owl');
    const [customImage, setCustomImage]       = useState<string | null>(null);
    const [avatarSaved, setAvatarSaved]       = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /* Account */
    const [username, setUsername]           = useState(user?.username ?? 'Student');
    const [usernameSaved, setUsernameSaved] = useState(false);
    const [currentPw, setCurrentPw]         = useState('');
    const [newPw, setNewPw]                 = useState('');
    const [confirmPw, setConfirmPw]         = useState('');
    const [showCurrent, setShowCurrent]     = useState(false);
    const [showNew, setShowNew]             = useState(false);
    const [showConfirm, setShowConfirm]     = useState(false);
    const [pwSaved, setPwSaved]             = useState(false);
    const [pwError, setPwError]             = useState('');

    /* Settings toggles */
    const [notifs, setNotifs]         = useState(true);
    const [sound, setSound]           = useState(true);
    const [darkMode, setDarkMode]     = useState(false);
    const [language, setLanguage]     = useState('English');
    const [privacy, setPrivacy]       = useState('Friends');

    /* Active tab */
    const [activeTab, setActiveTab] = useState<TabId>('analytics');

    /* Achievements filter */
    const [achFilter, setAchFilter] = useState<'all' | 'earned' | 'locked'>('all');

    /* Handlers */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setCustomImage(reader.result as string);
        reader.readAsDataURL(file);
        setSelectedAvatar('custom');
    };
    const saveAvatar   = () => { setAvatarSaved(true);   setTimeout(() => setAvatarSaved(false),   2000); };
    const saveUsername = () => { setUsernameSaved(true); setTimeout(() => setUsernameSaved(false), 2000); };
    const savePassword = () => {
        setPwError('');
        if (!currentPw)         return setPwError('Enter your current password.');
        if (newPw.length < 6)   return setPwError('Password must be at least 6 characters.');
        if (newPw !== confirmPw) return setPwError('Passwords do not match.');
        setPwSaved(true);
        setCurrentPw(''); setNewPw(''); setConfirmPw('');
        setTimeout(() => setPwSaved(false), 2000);
    };

    const currentAvatar  = AVATAR_ICONS.find(a => a.id === selectedAvatar);
    const overallScore   = Math.round(SUBJECT_SCORES.reduce((s, x) => s + x.score, 0) / SUBJECT_SCORES.length);
    const filteredAch    = ACHIEVEMENTS.filter(a =>
        achFilter === 'all' ? true : achFilter === 'earned' ? a.earned : !a.earned
    );

    return (
        <div className="sp-root">

            {/* ── HERO ─────────────────────────────────────────── */}
            <section className="sp-hero">
                <div className="sp-hero-bg" />
                <div className="sp-hero-inner">
                    <div className="sp-avatar-wrap">
                        <div className="sp-avatar-ring">
                            {customImage && selectedAvatar === 'custom'
                                ? <img src={customImage} alt="Profile" className="sp-avatar-photo" />
                                : <span className="sp-avatar-emoji">{currentAvatar?.emoji ?? '🦉'}</span>
                            }
                        </div>
                        <button className="sp-avatar-edit-btn" onClick={() => fileInputRef.current?.click()} aria-label="Change avatar">
                            <Camera size={14} />
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="sp-hidden-input" onChange={handleFileChange} />
                    </div>

                    <div className="sp-hero-info">
                        <h1 className="sp-hero-name">{username}</h1>
                        <div className="sp-hero-badges">
                            <span className="sp-badge sp-badge-level"><Zap size={12} /> Level {CURRENT_LEVEL}</span>
                            <span className="sp-badge sp-badge-streak"><Flame size={12} /> 5 Day Streak</span>
                            <span className="sp-badge sp-badge-rank"><Award size={12} /> Top 15%</span>
                        </div>
                        <p className="sp-hero-score-label">Overall Performance</p>
                        <div className="sp-hero-score-bar">
                            <div className="sp-hero-score-fill" style={{ width: `${overallScore}%` }} />
                            <span className="sp-hero-score-pct">{overallScore}%</span>
                        </div>
                    </div>
                </div>

                {/* Scrollable tab bar */}
                <div className="sp-tabs-wrap">
                    <div className="sp-tabs">
                        {TABS.map(({ id, icon: Icon, label }) => (
                            <button
                                key={id}
                                className={`sp-tab ${activeTab === id ? 'sp-tab-active' : ''}`}
                                onClick={() => setActiveTab(id)}
                            >
                                <Icon size={15} /> {label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                ANALYTICS TAB
            ══════════════════════════════════════════════════ */}
            {activeTab === 'analytics' && (
                <div className="sp-content sp-fade-in">
                    <div className="sp-stats-grid">
                        {STATS.map(({ label, value, icon: Icon, color, trend, trendVal }) => (
                            <div key={label} className="sp-stat-card">
                                <div className="sp-stat-icon" style={{ background: `${color}18`, color }}><Icon size={20} /></div>
                                <div className="sp-stat-body">
                                    <span className="sp-stat-value">{value}</span>
                                    <span className="sp-stat-label">{label}</span>
                                </div>
                                <div className="sp-stat-trend"><TrendIcon trend={trend} /><span>{trendVal}</span></div>
                            </div>
                        ))}
                    </div>

                    <div className="sp-card">
                        <div className="sp-card-header">
                            <h3><Clock size={16} /> Weekly Activity</h3>
                            <span className="sp-card-sub">Score % per day</span>
                        </div>
                        <div className="sp-bar-chart">
                            {WEEKLY_ACTIVITY.map((val, i) => (
                                <div key={i} className="sp-bar-col">
                                    <span className="sp-bar-val">{val}%</span>
                                    <div className="sp-bar-track">
                                        <div className="sp-bar-fill" style={{ height: `${val}%` }} />
                                    </div>
                                    <span className="sp-bar-day">{DAYS[i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sp-card">
                        <div className="sp-card-header"><h3><Target size={16} /> Subject Performance</h3></div>
                        <div className="sp-subjects-list">
                            {SUBJECT_SCORES.map(({ subject, score, sessions, emoji, color }) => (
                                <div key={subject} className="sp-subject-row">
                                    <span className="sp-subject-emoji">{emoji}</span>
                                    <div className="sp-subject-info">
                                        <div className="sp-subject-top">
                                            <span className="sp-subject-name">{subject}</span>
                                            <span className="sp-subject-score" style={{ color }}>{score}%</span>
                                        </div>
                                        <div className="sp-subject-bar-track">
                                            <div className="sp-subject-bar-fill" style={{ width: `${score}%`, background: color }} />
                                        </div>
                                        <span className="sp-subject-sessions">{sessions} sessions</span>
                                    </div>
                                    <span className="sp-subject-grade" style={{ background: `${color}18`, color }}>
                                        {score >= 80 ? 'A' : score >= 65 ? 'B' : 'C'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sp-card">
                        <div className="sp-card-header">
                            <h3><CheckCircle2 size={16} /> Recent Quizzes</h3>
                            <button className="sp-link-btn">See All <ChevronRight size={13} /></button>
                        </div>
                        <div className="sp-activity-list">
                            {RECENT_ACTIVITY.map(({ title, score, time, pass }) => (
                                <div key={title} className="sp-activity-row">
                                    <div className={`sp-activity-dot ${pass ? 'sp-dot-pass' : 'sp-dot-fail'}`}>
                                        {pass ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    </div>
                                    <div className="sp-activity-info">
                                        <span className="sp-activity-title">{title}</span>
                                        <span className="sp-activity-time">{time}</span>
                                    </div>
                                    <span className={`sp-activity-score ${pass ? 'sp-score-pass' : 'sp-score-fail'}`}>{score}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════
                ACHIEVEMENTS TAB
            ══════════════════════════════════════════════════ */}
            {activeTab === 'achievements' && (
                <div className="sp-content sp-fade-in">

                    {/* Summary strip */}
                    <div className="sp-ach-summary">
                        <div className="sp-ach-sum-item">
                            <span className="sp-ach-sum-val">{ACHIEVEMENTS.filter(a => a.earned).length}</span>
                            <span className="sp-ach-sum-lbl">Earned</span>
                        </div>
                        <div className="sp-ach-sum-divider" />
                        <div className="sp-ach-sum-item">
                            <span className="sp-ach-sum-val">{ACHIEVEMENTS.filter(a => !a.earned).length}</span>
                            <span className="sp-ach-sum-lbl">Locked</span>
                        </div>
                        <div className="sp-ach-sum-divider" />
                        <div className="sp-ach-sum-item">
                            <span className="sp-ach-sum-val">
                                {ACHIEVEMENTS.filter(a => a.earned).reduce((s, a) => s + a.pts, 0)}
                            </span>
                            <span className="sp-ach-sum-lbl">Pts Earned</span>
                        </div>
                    </div>

                    {/* Filter pills */}
                    <div className="sp-ach-filters">
                        {(['all', 'earned', 'locked'] as const).map(f => (
                            <button
                                key={f}
                                className={`sp-ach-filter-btn ${achFilter === f ? 'sp-ach-filter-active' : ''}`}
                                onClick={() => setAchFilter(f)}
                            >
                                {f === 'all' ? 'All' : f === 'earned' ? '✅ Earned' : '🔒 Locked'}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="sp-ach-grid">
                        {filteredAch.map(({ id, title, desc, emoji, earned, pts }) => (
                            <div key={id} className={`sp-ach-card ${earned ? 'sp-ach-earned' : 'sp-ach-locked'}`}>
                                <div className="sp-ach-emoji-wrap">
                                    <span className="sp-ach-emoji">{emoji}</span>
                                    {!earned && <div className="sp-ach-lock-overlay">🔒</div>}
                                </div>
                                <div className="sp-ach-info">
                                    <span className="sp-ach-title">{title}</span>
                                    <span className="sp-ach-desc">{desc}</span>
                                </div>
                                <span className={`sp-ach-pts ${earned ? 'sp-ach-pts-earned' : ''}`}>+{pts} pts</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════
                MY LEVEL TAB
            ══════════════════════════════════════════════════ */}
            {activeTab === 'level' && (
                <div className="sp-content sp-fade-in">

                    {/* Current level hero card */}
                    <div className="sp-level-hero-card">
                        <div className="sp-level-badge-big">
                            <Sparkles size={18} />
                            <span>Level {CURRENT_LEVEL}</span>
                        </div>
                        <h2 className="sp-level-title-big">Scholar</h2>
                        <p className="sp-level-subtitle">{CURRENT_XP} / {NEXT_LEVEL_XP} XP to Level {CURRENT_LEVEL + 1}</p>

                        <div className="sp-level-xp-bar-wrap">
                            <div className="sp-level-xp-track">
                                <div className="sp-level-xp-fill" style={{ width: `${XP_PROGRESS_PCT}%` }}>
                                    <span className="sp-level-xp-glow" />
                                </div>
                            </div>
                            <span className="sp-level-xp-pct">{XP_PROGRESS_PCT}%</span>
                        </div>

                        <p className="sp-level-xp-note">
                            <Zap size={13} /> {NEXT_LEVEL_XP - CURRENT_XP} XP needed to unlock <strong>Achiever</strong>
                        </p>
                    </div>

                    {/* Milestone roadmap */}
                    <div className="sp-card">
                        <div className="sp-card-header"><h3><Layers size={16} /> Level Roadmap</h3></div>
                        <div className="sp-milestones">
                            {LEVEL_MILESTONES.map((m, i) => (
                                <div key={m.level} className={`sp-milestone ${m.unlocked ? 'sp-ms-unlocked' : 'sp-ms-locked'} ${m.level === CURRENT_LEVEL ? 'sp-ms-current' : ''}`}>
                                    <div className="sp-ms-left">
                                        <div className="sp-ms-dot">
                                            {m.unlocked ? <Check size={13} /> : <span>{m.level}</span>}
                                        </div>
                                        {i < LEVEL_MILESTONES.length - 1 && <div className="sp-ms-line" />}
                                    </div>
                                    <div className="sp-ms-body">
                                        <div className="sp-ms-top">
                                            <span className="sp-ms-name">
                                                {m.level === CURRENT_LEVEL && <span className="sp-ms-you">YOU</span>}
                                                Lv {m.level} — {m.title}
                                            </span>
                                            <span className="sp-ms-xp">{m.xpRequired} XP</span>
                                        </div>
                                        <div className="sp-ms-reward">
                                            <Gift size={12} /> {m.reward}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Perks unlocked at this level */}
                    <div className="sp-card">
                        <div className="sp-card-header">
                            <h3><Star size={16} /> Level {CURRENT_LEVEL} Perks</h3>
                        </div>
                        <div className="sp-perks-list">
                            {LEVEL_PERKS.map(({ perk, available }) => (
                                <div key={perk} className={`sp-perk-row ${available ? '' : 'sp-perk-locked'}`}>
                                    <span className={`sp-perk-icon ${available ? 'sp-perk-yes' : 'sp-perk-no'}`}>
                                        {available ? <CheckCircle2 size={16} /> : <Lock size={16} />}
                                    </span>
                                    <span className="sp-perk-label">{perk}</span>
                                    {!available && <span className="sp-perk-unlock-badge">Next level</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* How to earn XP */}
                    <div className="sp-card sp-xp-tips-card">
                        <div className="sp-card-header"><h3><ChevronUp size={16} /> How to Earn XP</h3></div>
                        <div className="sp-xp-tips">
                            {[
                                { action: 'Complete a quiz',         xp: '+20 XP', emoji: '📝' },
                                { action: 'Score above 80%',         xp: '+30 XP', emoji: '🎯' },
                                { action: 'Daily login',             xp: '+10 XP', emoji: '📅' },
                                { action: 'Maintain a streak',       xp: '+15 XP', emoji: '🔥' },
                                { action: 'Unlock an achievement',   xp: '+50 XP', emoji: '🏆' },
                            ].map(({ action, xp, emoji }) => (
                                <div key={action} className="sp-xp-tip-row">
                                    <span className="sp-xp-tip-emoji">{emoji}</span>
                                    <span className="sp-xp-tip-label">{action}</span>
                                    <span className="sp-xp-tip-xp">{xp}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════
                ACCOUNT SETTINGS TAB
            ══════════════════════════════════════════════════ */}
            {activeTab === 'account' && (
                <div className="sp-content sp-fade-in">

                    {/* Avatar picker */}
                    <div className="sp-card">
                        <div className="sp-card-header"><h3><Camera size={16} /> Choose Your Avatar</h3></div>
                        <div className="sp-avatar-grid">
                            {AVATAR_ICONS.map(({ id, emoji, label }) => (
                                <button
                                    key={id}
                                    className={`sp-avatar-option ${selectedAvatar === id ? 'sp-avatar-selected' : ''}`}
                                    onClick={() => { setSelectedAvatar(id); setCustomImage(null); }}
                                    aria-label={label} title={label}
                                >
                                    <span>{emoji}</span>
                                    {selectedAvatar === id && <span className="sp-avatar-check"><Check size={12} /></span>}
                                </button>
                            ))}
                            <button
                                className={`sp-avatar-option sp-avatar-upload ${selectedAvatar === 'custom' ? 'sp-avatar-selected' : ''}`}
                                onClick={() => fileInputRef.current?.click()} title="Upload from device"
                            >
                                {customImage ? <img src={customImage} alt="Custom" className="sp-upload-preview" /> : <Upload size={22} />}
                                {selectedAvatar === 'custom' && <span className="sp-avatar-check"><Check size={12} /></span>}
                            </button>
                        </div>
                        <p className="sp-avatar-hint"><Upload size={13} /> You can also upload a photo from your device</p>
                        <button className={`sp-save-btn ${avatarSaved ? 'sp-save-btn-success' : ''}`} onClick={saveAvatar}>
                            {avatarSaved ? <><Check size={16} /> Avatar Saved!</> : 'Save Avatar'}
                        </button>
                    </div>

                    {/* Edit username */}
                    <div className="sp-card">
                        <div className="sp-card-header"><h3><User size={16} /> Edit Username</h3></div>
                        <div className="sp-field-group">
                            <label className="sp-label">Username</label>
                            <div className="sp-input-wrap">
                                <User size={16} className="sp-input-icon" />
                                <input type="text" className="sp-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Your username" />
                            </div>
                        </div>
                        <button className={`sp-save-btn ${usernameSaved ? 'sp-save-btn-success' : ''}`} onClick={saveUsername}>
                            {usernameSaved ? <><Check size={16} /> Username Saved!</> : 'Save Username'}
                        </button>
                    </div>

                    {/* Change password */}
                    <div className="sp-card">
                        <div className="sp-card-header"><h3><Lock size={16} /> Change Password</h3></div>
                        {pwError && <div className="sp-error-banner"><AlertCircle size={15} /> {pwError}</div>}
                        {[
                            { label: 'Current Password', value: currentPw, set: setCurrentPw, show: showCurrent, toggle: () => setShowCurrent(p => !p) },
                            { label: 'New Password',     value: newPw,     set: setNewPw,     show: showNew,     toggle: () => setShowNew(p => !p)     },
                            { label: 'Confirm Password', value: confirmPw, set: setConfirmPw, show: showConfirm, toggle: () => setShowConfirm(p => !p) },
                        ].map(({ label, value, set, show, toggle }) => (
                            <div className="sp-field-group" key={label}>
                                <label className="sp-label">{label}</label>
                                <div className="sp-input-wrap">
                                    <Lock size={16} className="sp-input-icon" />
                                    <input type={show ? 'text' : 'password'} className="sp-input" value={value} onChange={e => set(e.target.value)} placeholder="••••••••" />
                                    <button className="sp-pw-toggle" onClick={toggle} type="button">
                                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                        <p className="sp-pw-hint">Minimum 6 characters.</p>
                        <button className={`sp-save-btn ${pwSaved ? 'sp-save-btn-success' : ''}`} onClick={savePassword}>
                            {pwSaved ? <><Check size={16} /> Password Updated!</> : 'Update Password'}
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════
                SETTINGS TAB
            ══════════════════════════════════════════════════ */}
            {activeTab === 'settings' && (
                <div className="sp-content sp-fade-in">

                    {/* Notifications */}
                    <div className="sp-card">
                        <div className="sp-card-header"><h3><Bell size={16} /> Notifications</h3></div>
                        <div className="sp-settings-list">
                            {[
                                { label: 'Push Notifications', sub: 'Get reminders to study daily', val: notifs,  set: setNotifs  },
                                { label: 'Sound Effects',       sub: 'Play sounds during quizzes',  val: sound,   set: setSound   },
                            ].map(({ label, sub, val, set }) => (
                                <div key={label} className="sp-setting-row">
                                    <div className="sp-setting-info">
                                        <span className="sp-setting-label">{label}</span>
                                        <span className="sp-setting-sub">{sub}</span>
                                    </div>
                                    <button
                                        className={`sp-toggle ${val ? 'sp-toggle-on' : ''}`}
                                        onClick={() => set(p => !p)}
                                        aria-label={label}
                                    >
                                        <span className="sp-toggle-thumb" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Display */}
                    <div className="sp-card">
                        <div className="sp-card-header"><h3><Moon size={16} /> Display</h3></div>
                        <div className="sp-settings-list">
                            <div className="sp-setting-row">
                                <div className="sp-setting-info">
                                    <span className="sp-setting-label">Dark Mode</span>
                                    <span className="sp-setting-sub">Switch to a darker interface</span>
                                </div>
                                <button
                                    className={`sp-toggle ${darkMode ? 'sp-toggle-on' : ''}`}
                                    onClick={() => setDarkMode(p => !p)}
                                    aria-label="Dark mode"
                                >
                                    <span className="sp-toggle-thumb" />
                                </button>
                            </div>
                            <div className="sp-setting-row">
                                <div className="sp-setting-info">
                                    <span className="sp-setting-label">Language</span>
                                    <span className="sp-setting-sub">Choose your preferred language</span>
                                </div>
                                <select
                                    className="sp-select"
                                    value={language}
                                    onChange={e => setLanguage(e.target.value)}
                                >
                                    <option>English</option>
                                    <option>Swahili</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Privacy */}
                    <div className="sp-card">
                        <div className="sp-card-header"><h3><Shield size={16} /> Privacy</h3></div>
                        <div className="sp-settings-list">
                            <div className="sp-setting-row">
                                <div className="sp-setting-info">
                                    <span className="sp-setting-label">Profile Visibility</span>
                                    <span className="sp-setting-sub">Who can see your profile and scores</span>
                                </div>
                                <select className="sp-select" value={privacy} onChange={e => setPrivacy(e.target.value)}>
                                    <option>Everyone</option>
                                    <option>Friends</option>
                                    <option>Only Me</option>
                                </select>
                            </div>
                            <div className="sp-setting-row">
                                <div className="sp-setting-info">
                                    <span className="sp-setting-label">Show on Leaderboard</span>
                                    <span className="sp-setting-sub">Display your rank publicly</span>
                                </div>
                                <button className="sp-toggle sp-toggle-on" aria-label="Leaderboard">
                                    <span className="sp-toggle-thumb" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Danger zone */}
                    <div className="sp-card sp-danger-card">
                        <div className="sp-card-header"><h3><AlertCircle size={16} /> Danger Zone</h3></div>
                        <p className="sp-danger-desc">These actions are permanent and cannot be undone.</p>
                        <div className="sp-danger-btns">
                            <button className="sp-danger-btn sp-danger-outline">Reset Progress</button>
                            <button className="sp-danger-btn sp-danger-solid">Delete Account</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentProfile;
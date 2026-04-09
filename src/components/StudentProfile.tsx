import React, {useState, useRef} from 'react';
import {useStore, type EducationLevel} from '../store/useStore';
import {useNavigate} from 'react-router-dom';
import {Trophy, Settings, Zap, Flame, Star, CheckCircle, Shield, Users, Camera, LogOut} from 'lucide-react';
import '../styles/profile.css';
import {LEVEL_CONFIG} from '../hooks/LevelConfigs';
import {avatarUrl, AVATARS} from '../hooks/Packages.ts';

const LEVEL_OPTIONS = [
    {id: 'lower_primary' as EducationLevel, ...LEVEL_CONFIG.lower_primary},
    {id: 'middle_school' as EducationLevel, ...LEVEL_CONFIG.middle_school},
    {id: 'senior_school' as EducationLevel, ...LEVEL_CONFIG.senior_school},
];

const ACHIEVEMENTS = [
    {emoji: '🔥', title: 'First Streak', desc: '7 days in a row', pts: 50, earned: true},
    {emoji: '🏆', title: 'Quiz Master', desc: 'Score 100% on 5 quizzes', pts: 200, earned: true},
    {emoji: '🧮', title: 'Math Wizard', desc: 'Complete all math topics', pts: 150, earned: false},
    {emoji: '⚡', title: 'Speed Demon', desc: 'Finish a quiz < 2 min', pts: 100, earned: true},
    {emoji: '📚', title: 'Bookworm', desc: 'Read 50 lessons', pts: 120, earned: false},
    {emoji: '🌟', title: 'Top Performer', desc: 'Rank #1 for a week', pts: 300, earned: false},
];

const StudentProfile: React.FC = () => {
    const {isLoggedIn, user, updateUser, setOverlay} = useStore();
    const navigate = useNavigate();

    const activeProfile = user ? (user.profiles.find(p => p.id === user.activeProfileId) ?? user.profiles[0]) : null;

    const [tab, setTab] = useState<'badges' | 'account'>('badges');
    const [editName, setEditName] = useState(activeProfile?.username ?? '');
    const [saveMsg, setSaveMsg] = useState('');
    const [error, setError] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    if (!isLoggedIn || !user || !activeProfile) {
        return (
            <div className="pr-guest">
                <div className="pr-guest-icon"><Shield size={32}/></div>
                <h2>Sign in to view your profile</h2>
                <p>Track your progress, badges, and achievements.</p>
                <button onClick={() => navigate('/')} className="pr-guest-btn">Go Home</button>
            </div>
        );
    }

    const lvl = LEVEL_OPTIONS.find(l => l.id === activeProfile.educationLevel)!;
    const xpPercent = (activeProfile.xp % 1000) / 10;
    const earnedAch = ACHIEVEMENTS.filter(a => a.earned).length;
    const earnedXP = ACHIEVEMENTS.filter(a => a.earned).reduce((s, a) => s + a.pts, 0);

    const saveAvatar = (avatar: string) =>
        updateUser({profiles: user.profiles.map(p => p.id === activeProfile.id ? {...p, avatar} : p)});

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => saveAvatar(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        setError('');
        if (!editName.trim()) {
            setError('Name cannot be empty');
            return;
        }
        updateUser({
            profiles: user.profiles.map(p =>
                p.id === activeProfile.id ? {...p, username: editName.trim()} : p
            )
        });
        setSaveMsg('Saved!');
        setTimeout(() => setSaveMsg(''), 2000);
    };

    return (
        <div className="pr-root">

            {/* Profile Header */}
            <div className="pr-page-header">
                              <button className="pr-page-header-logout" onClick={() => {
                    useStore.getState().logout();
                    navigate('/');
                }}>
                    <LogOut size={15}/> Log Out
                </button>
            </div>


            <div className="pr-hero" style={{background: lvl.bg}}>
                <div className="pr-hero-orb"/>
                <div className="pr-hero-inner">
                    <div className="pr-hero-avatar pr-hero-avatar--clickable" onClick={() => setTab('account')}>
                        <img src={avatarUrl(activeProfile.avatar || AVATARS[0])} alt="avatar" width={72} height={72}
                             className="pr-hero-avatar-img"/>
                        <div className="pr-hero-avatar-cam"><Camera size={12} color="#fff"/></div>
                    </div>
                    <div className="pr-hero-info">
                        <h1 className="pr-hero-name">{activeProfile.username}</h1>
                        <span className="pr-hero-level">{lvl.emoji} {lvl.label} · Grade {activeProfile.grade}</span>
                        <div className="pr-hero-pills">
                            <span className="pr-pill"><Flame size={12}/> {activeProfile.streak}d streak</span>
                            <span className="pr-pill"><Zap size={12}/> {activeProfile.xp} XP</span>
                            <span className="pr-pill"><Star
                                size={12}/> {activeProfile.points.toLocaleString()} pts</span>
                        </div>
                    </div>
                </div>

                <div className="pr-hero-xp">
                    <div className="pr-hero-xp-labels">
                        <span>Level {activeProfile.level}</span>
                        <span>{activeProfile.xp % 1000} / 1000 XP</span>
                    </div>
                    <div className="pr-hero-xp-track">
                        <div className="pr-hero-xp-fill" style={{width: `${xpPercent}%`}}/>
                    </div>
                </div>

                <div className="pr-hero-actions">
                    {user.profiles.length > 1 && (
                        <button className="pr-switch-btn" onClick={() => setOverlay('profile-select')}>
                            <Users size={13}/> Switch Profile
                        </button>
                    )}
                    {/*<button className="pr-switch-btn pr-logout-btn" onClick={() => {*/}
                    {/*    useStore.getState().logout();*/}
                    {/*    navigate('/');*/}
                    {/*}}>*/}
                    {/*    <LogOut size={13}/> Log Out*/}
                    {/*</button>*/}
                </div>
            </div>


            {/* Tabs */}
            <div className="pr-tabs">
                <button className={`pr-tab ${tab === 'badges' ? 'active' : ''}`} onClick={() => setTab('badges')}>
                    <Trophy size={15}/> Badges
                </button>
                <button className={`pr-tab ${tab === 'account' ? 'active' : ''}`} onClick={() => setTab('account')}>
                    <Settings size={15}/> Account
                </button>
            </div>

            <div className="pr-content">

                {tab === 'badges' && (
                    <div className="pr-badges">
                        <div className="pr-badges-summary">
                            <span className="pr-bs-text">🏆 {earnedAch} of {ACHIEVEMENTS.length} badges earned</span>
                            <span className="pr-bs-xp">+{earnedXP} XP</span>
                        </div>
                        <div className="pr-ach-list">
                            {ACHIEVEMENTS.map((a, i) => (
                                <div key={i} className={`pr-ach-item ${a.earned ? 'earned' : 'locked'}`}>
                                    <div className="pr-ach-emoji-wrap">
                                        <span className="pr-ach-emoji">{a.emoji}</span>
                                        {!a.earned && <span className="pr-ach-lock">🔒</span>}
                                    </div>
                                    <div className="pr-ach-body">
                                        <span className="pr-ach-title">{a.title}</span>
                                        <span className="pr-ach-desc">{a.desc}</span>
                                    </div>
                                    <span className={`pr-ach-xp ${a.earned ? 'earned' : ''}`}>+{a.pts} XP</span>
                                    {a.earned && <CheckCircle size={16} color="#10b981"/>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'account' && (
                    <div className="pr-account">
                        {error && <div className="pr-msg pr-msg-error"><Shield size={14}/> {error}</div>}
                        {saveMsg && <div className="pr-msg pr-msg-success"><CheckCircle size={14}/> {saveMsg}</div>}

                        <div className="pr-field">
                            <label className="pr-label">Avatar</label>
                            <div className="pr-avatar-grid">
                                {AVATARS.map(a => (
                                    <button key={a}
                                            className={`pr-avatar-opt ${activeProfile.avatar === a ? 'selected' : ''}`}
                                            onClick={() => saveAvatar(a)}>
                                        <img src={avatarUrl(a)} alt={a} width={36} height={36}/>
                                    </button>
                                ))}
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" className="pr-hidden"
                                   onChange={handleUpload}/>
                            <button className="pr-upload-btn" onClick={() => fileRef.current?.click()}>
                                <Camera size={14}/> Upload Photo
                            </button>
                        </div>

                        <div className="pr-field">
                            <label className="pr-label">Display Name</label>
                            <input className="pr-input" value={editName} onChange={e => setEditName(e.target.value)}/>
                        </div>

                        <div className="pr-field">
                            <label className="pr-label">Phone Number</label>
                            <input className="pr-input pr-input-disabled" value={user.phone} disabled/>
                            <span className="pr-hint">Cannot be changed</span>
                        </div>

                        <button className="pr-save-btn" onClick={handleSave}>
                            <CheckCircle size={16}/> Save Changes
                        </button>

                        <div className="pr-danger">
                            <div className="pr-danger-header">
                                <span>⚠️</span>
                                <div>
                                    <p className="pr-danger-title">Danger Zone</p>
                                    <p className="pr-danger-sub">This action is permanent and cannot be undone.</p>
                                </div>
                            </div>
                            <button className="pr-delete-btn">Delete Account</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentProfile;

import React, { useState } from 'react';
import { useStore, type EducationLevel } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Trophy, Settings, Zap, Flame, Star, CheckCircle, Shield, Users } from 'lucide-react';
import '../styles/profile.css';

const LEVEL_OPTIONS: { id: EducationLevel; label: string; grades: string; emoji: string; color: string }[] = [
  { id: 'lower_primary', label: 'Lower Primary', grades: 'Grade 1–3',  emoji: '🧒', color: '#10b981' },
  { id: 'middle_school', label: 'Middle School', grades: 'Grade 4–9',  emoji: '🧠', color: '#3b82f6' },
  { id: 'senior_school', label: 'Senior School', grades: 'Grade 10–12',emoji: '🎓', color: '#a855f7' },
];

const ACHIEVEMENTS = [
  { emoji: '🔥', title: 'First Streak',   desc: '7 days in a row',        pts: 50,  earned: true  },
  { emoji: '🏆', title: 'Quiz Master',    desc: 'Score 100% on 5 quizzes', pts: 200, earned: true  },
  { emoji: '🧮', title: 'Math Wizard',    desc: 'Complete all math topics', pts: 150, earned: false },
  { emoji: '⚡', title: 'Speed Demon',    desc: 'Finish a quiz < 2 min',    pts: 100, earned: true  },
  { emoji: '📚', title: 'Bookworm',       desc: 'Read 50 lessons',          pts: 120, earned: false },
  { emoji: '🌟', title: 'Top Performer',  desc: 'Rank #1 for a week',       pts: 300, earned: false },
];

const StudentProfile: React.FC = () => {
  const { isLoggedIn, user, updateUser, setOverlay } = useStore();
  const navigate = useNavigate();

  const [tab, setTab] = useState<'badges' | 'account'>('badges');
  const [editName, setEditName] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const [error, setError] = useState('');

  if (!isLoggedIn || !user) {
    return (
      <div className="pr-guest">
        <Shield size={48} color="#3b82f6" />
        <h2>Sign in to view your profile</h2>
        <button onClick={() => navigate('/')} className="pr-guest-btn">Go Home</button>
      </div>
    );
  }

  const activeProfile = user.profiles.find(p => p.id === user.activeProfileId) ?? user.profiles[0];
  if (!activeProfile) return null;

  const lvl = LEVEL_OPTIONS.find(l => l.id === activeProfile.educationLevel)!;
  const xpPercent = (activeProfile.xp % 1000) / 10;
  const earnedAch = ACHIEVEMENTS.filter(a => a.earned).length;

  const handleSave = () => {
    setError('');
    if (!editName.trim()) { setError('Name cannot be empty'); return; }
    updateUser({ profiles: user.profiles.map(p =>
      p.id === activeProfile.id ? { ...p, username: editName.trim() } : p
    )});
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  // init editName lazily
  if (editName === '' && activeProfile.username) {
    setEditName(activeProfile.username);
  }

  return (
    <div className="pr-root">

      {/* ── Profile Card ── */}
      <div className="pr-card-hero">
        <div className="pr-card-hero-bg" style={{ background: `linear-gradient(135deg, ${lvl.color}22 0%, ${lvl.color}08 100%)` }} />
        <div className="pr-card-hero-inner">
          <div className="pr-big-avatar">{activeProfile.avatar || '🧒'}</div>
          <div className="pr-card-info">
            <h1 className="pr-card-name">{activeProfile.username}</h1>
            <span className="pr-level-badge" style={{ background: `${lvl.color}18`, color: lvl.color, border: `1px solid ${lvl.color}30` }}>
              {lvl.emoji} {lvl.label} · {lvl.grades}
            </span>
            <div className="pr-stats-row">
              <div className="pr-stat-pill">
                <Flame size={14} color="#f97316" />
                <span>{activeProfile.streak} streak</span>
              </div>
              <div className="pr-stat-pill">
                <Zap size={14} color="#a855f7" />
                <span>{activeProfile.xp} XP</span>
              </div>
              <div className="pr-stat-pill">
                <Star size={14} color="#f59e0b" />
                <span>{activeProfile.points.toLocaleString()} pts</span>
              </div>
            </div>
            {/* XP bar */}
            <div className="pr-xp-row">
              <span className="pr-xp-txt">Level {activeProfile.level}</span>
              <div className="pr-xp-bar">
                <div className="pr-xp-fill" style={{ width: `${xpPercent}%`, background: lvl.color }} />
              </div>
              <span className="pr-xp-txt">{activeProfile.xp % 1000}/1000</span>
            </div>
          </div>
        </div>

        {user.profiles.length > 1 && (
          <button className="pr-switch-btn" onClick={() => setOverlay('profile-select')}>
            <Users size={14} /> Switch Profile
          </button>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="pr-tabs-bar">
        <button className={`pr-tab-btn ${tab === 'badges' ? 'active' : ''}`} onClick={() => setTab('badges')}>
          <Trophy size={15} /> Badges
        </button>
        <button className={`pr-tab-btn ${tab === 'account' ? 'active' : ''}`} onClick={() => setTab('account')}>
          <Settings size={15} /> Account
        </button>
      </div>

      <div className="pr-tab-content">

        {/* Badges */}
        {tab === 'badges' && (
          <>
            <div className="pr-ach-summary">
              <div className="pr-ach-sum-item">
                <span className="pr-ach-sum-val">{earnedAch}</span>
                <span className="pr-ach-sum-lbl">Earned</span>
              </div>
              <div className="pr-ach-sum-div" />
              <div className="pr-ach-sum-item">
                <span className="pr-ach-sum-val">{ACHIEVEMENTS.length - earnedAch}</span>
                <span className="pr-ach-sum-lbl">Locked</span>
              </div>
              <div className="pr-ach-sum-div" />
              <div className="pr-ach-sum-item">
                <span className="pr-ach-sum-val">{ACHIEVEMENTS.filter(a => a.earned).reduce((s, a) => s + a.pts, 0)}</span>
                <span className="pr-ach-sum-lbl">XP Earned</span>
              </div>
            </div>

            <div className="pr-ach-grid">
              {ACHIEVEMENTS.map((a, i) => (
                <div key={i} className={`pr-ach-card ${a.earned ? 'earned' : 'locked'}`}>
                  <div className="pr-ach-emoji-wrap">
                    <span className="pr-ach-emoji">{a.emoji}</span>
                    {!a.earned && <span className="pr-ach-lock">🔒</span>}
                  </div>
                  <div className="pr-ach-info">
                    <span className="pr-ach-title">{a.title}</span>
                    <span className="pr-ach-desc">{a.desc}</span>
                  </div>
                  <span className={`pr-ach-pts ${a.earned ? 'earned' : ''}`}>{a.pts} XP</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Account */}
        {tab === 'account' && (
          <div className="pr-account-card">
            {error   && <div className="pr-error"><Shield size={14} />{error}</div>}
            {saveMsg && <div className="pr-success"><CheckCircle size={14} />{saveMsg}</div>}

            <div className="pr-form-group">
              <label className="pr-label">Display Name</label>
              <input className="pr-input" value={editName} onChange={e => setEditName(e.target.value)} />
            </div>
            <div className="pr-form-group">
              <label className="pr-label">Phone Number</label>
              <input className="pr-input" value={user.phone} disabled style={{ opacity: 0.5 }} />
              <span className="pr-hint">Cannot be changed</span>
            </div>
            <button className="pr-save-btn" onClick={handleSave}>
              <CheckCircle size={16} /> Save Changes
            </button>

            <div className="pr-danger-zone">
              <h4>⚠️ Danger Zone</h4>
              <p>Once deleted, your account cannot be recovered.</p>
              <button className="pr-delete-btn">Delete Account</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;

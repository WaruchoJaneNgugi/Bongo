import React, { useState } from 'react';
import { useStore, type EducationLevel } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  User, Trophy, BarChart3, Settings, Zap, Flame, Star, CheckCircle, Shield,
} from 'lucide-react';
import '../styles/profile.css';

const LEVEL_OPTIONS: { id: EducationLevel; label: string; grades: string; emoji: string; color: string }[] = [
  { id: 'lower_primary', label: 'Lower Primary', grades: 'Grade 1–3',  emoji: '🧒', color: '#10b981' },
  { id: 'middle_school', label: 'Middle School', grades: 'Grade 4–9',  emoji: '🧠', color: '#3b82f6' },
  { id: 'senior_school', label: 'Senior School', grades: 'Grade 10–12',emoji: '🎓', color: '#a855f7' },
];

const WEEK_SCORES = [72, 85, 68, 92, 78, 88, 76];

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

  const [tab, setTab] = useState<'analytics' | 'achievements' | 'account'>('analytics');
  const [saveMsg, setSaveMsg] = useState('');
  const [error, setError] = useState('');

  if (!isLoggedIn || !user) {
    return (
      <div className="pr-guest">
        <Shield size={48} color="#a855f7" />
        <h2>Sign in to view your profile</h2>
        <button onClick={() => navigate('/')} className="pr-guest-btn">Go Home</button>
      </div>
    );
  }

  // Get the active profile
  const activeProfile = user.profiles.find(p => p.id === user.activeProfileId)
    ?? user.profiles[0];

  if (!activeProfile) return null;

  const lvl = LEVEL_OPTIONS.find(l => l.id === activeProfile.educationLevel)!;
  const xpInLevel = activeProfile.xp % 1000;
  const xpPercent = (xpInLevel / 1000) * 100;
  const earnedAch = ACHIEVEMENTS.filter(a => a.earned).length;

  const [editName, setEditName] = useState(activeProfile.username);

  const handleSave = () => {
    setError('');
    if (!editName.trim()) { setError('Name cannot be empty'); return; }
    // Update the active profile's username within the profiles array
    const updatedProfiles = user.profiles.map(p =>
      p.id === activeProfile.id ? { ...p, username: editName.trim() } : p
    );
    updateUser({ profiles: updatedProfiles });
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  return (
    <div className="pr-root">
      {/* Hero */}
      <div className="pr-hero">
        <div className="pr-hero-bg" />
        <div className="pr-hero-inner">
          <div className="pr-avatar">{activeProfile.avatar || '🧒'}</div>
          <div className="pr-hero-info">
            <h1 className="pr-name">{activeProfile.username}</h1>
            <div className="pr-hero-chips">
              <span className="pr-chip" style={{ color: lvl.color }}>{lvl.emoji} {lvl.label}</span>
              <span className="pr-chip">🎓 Level {activeProfile.level}</span>
              <span className="pr-chip pr-chip-streak">
                <Flame size={13} color="#f97316" fill="#f97316" />
                {activeProfile.streak} day streak
              </span>
              <span className="pr-chip">
                <Star size={13} color="#fbbf24" fill="#fbbf24" />
                {activeProfile.points.toLocaleString()} pts
              </span>
            </div>
            <div className="pr-xp-wrap">
              <div className="pr-xp-label">
                <Zap size={13} />
                <span>{xpInLevel} / 1000 XP to Level {activeProfile.level + 1}</span>
              </div>
              <div className="pr-xp-track">
                <div className="pr-xp-fill" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Switch profile button for multi-profile accounts */}
        {user.profiles.length > 1 && (
          <button className="pr-switch-profile-btn" onClick={() => setOverlay('profile-select')}>
            Switch Profile
          </button>
        )}

        <div className="pr-tabs">
          {[
            { id: 'analytics',    label: 'Analytics', icon: BarChart3 },
            { id: 'achievements', label: 'Badges',     icon: Trophy },
            { id: 'account',      label: 'Account',    icon: Settings },
          ].map(t => (
            <button key={t.id} className={`pr-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id as typeof tab)}>
              <t.icon size={15} />{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pr-content">
        {/* Analytics */}
        {tab === 'analytics' && (
          <>
            <div className="pr-card">
              <h3><BarChart3 size={17} /> Weekly Performance</h3>
              <div className="pr-bar-chart">
                {WEEK_SCORES.map((s, i) => (
                  <div key={i} className="pr-bar-col">
                    <span className="pr-bar-val">{s}%</span>
                    <div className="pr-bar-track">
                      <div className="pr-bar-fill" style={{ height: `${s}%` }} />
                    </div>
                    <span className="pr-bar-day">{['M','T','W','T','F','S','S'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pr-stats-2col">
              {[
                { icon: <Trophy size={20} color="#f59e0b"/>, bg:'#fffbeb', val:`${earnedAch}/${ACHIEVEMENTS.length}`, lbl:'Badges Earned' },
                { icon: <Zap    size={20} color="#a855f7"/>, bg:'#f5f3ff', val:`${activeProfile.xp} XP`,              lbl:'Total XP'     },
                { icon: <Flame  size={20} color="#f97316"/>, bg:'#fff7ed', val:`${activeProfile.streak}`,              lbl:'Day Streak'   },
                { icon: <Star   size={20} color="#f59e0b"/>, bg:'#fffbeb', val:`${activeProfile.points.toLocaleString()}`, lbl:'Points'  },
              ].map(s => (
                <div key={s.lbl} className="pr-stat-card">
                  <div className="pr-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                  <div className="pr-stat-val">{s.val}</div>
                  <div className="pr-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Achievements */}
        {tab === 'achievements' && (
          <>
            <div className="pr-ach-summary">
              <div className="pr-ach-sum-item"><span className="pr-ach-sum-val">{earnedAch}</span><span className="pr-ach-sum-lbl">Earned</span></div>
              <div className="pr-ach-sum-div" />
              <div className="pr-ach-sum-item"><span className="pr-ach-sum-val">{ACHIEVEMENTS.length - earnedAch}</span><span className="pr-ach-sum-lbl">Locked</span></div>
              <div className="pr-ach-sum-div" />
              <div className="pr-ach-sum-item"><span className="pr-ach-sum-val">{ACHIEVEMENTS.filter(a=>a.earned).reduce((acc,a)=>acc+a.pts,0)}</span><span className="pr-ach-sum-lbl">XP Earned</span></div>
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
          <div className="pr-card">
            <h3><User size={17} /> Edit Profile</h3>
            {error   && <div className="pr-error"><Shield size={14} />{error}</div>}
            {saveMsg && <div className="pr-success"><CheckCircle size={14} />{saveMsg}</div>}
            <div className="pr-form-group">
              <label className="pr-label">Display Name</label>
              <input className="pr-input" value={editName} onChange={e => setEditName(e.target.value)} />
            </div>
            <div className="pr-form-group">
              <label className="pr-label">Phone Number</label>
              <input className="pr-input" value={user.phone} disabled style={{ opacity: 0.6 }} />
              <span className="pr-hint">Phone cannot be changed</span>
            </div>
            <button className="pr-save-btn" onClick={handleSave}>
              <CheckCircle size={16} /> Save Changes
            </button>
            <div className="pr-danger-zone">
              <h4>⚠️ Danger Zone</h4>
              <p>Once you delete your account, there is no going back.</p>
              <button className="pr-delete-btn">Delete Account</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;

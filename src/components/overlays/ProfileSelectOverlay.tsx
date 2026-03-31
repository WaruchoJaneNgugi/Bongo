import React, { useState } from 'react';
import { useStore, type StudentProfile, type EducationLevel } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Plus, LogOut, ArrowLeft, User } from 'lucide-react';
import '../../styles/profile-select.css';
import {AVATARS, avatarUrl} from "../../hooks/Packages.ts";

const ROUTES: Record<EducationLevel, string> = {
  lower_primary: '/level/lower-primary',
  middle_school: '/level/middle-school',
  senior_school: '/level/senior-school',
};

const LEVEL_OPTIONS: { id: EducationLevel; label: string; grades: string; emoji: string; color: string; bg: string }[] = [
  { id: 'lower_primary', label: 'Lower Primary', grades: 'Grade 1–3', emoji: '🧒', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  { id: 'middle_school', label: 'Middle School', grades: 'Grade 4–9', emoji: '🧠', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  { id: 'senior_school', label: 'Senior School', grades: 'Grade 10–12', emoji: '🎓', color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
];


const MAX_STUDENTS: Record<string, number> = {
  solo: 1, trio: 3, quad: 4, family: 9,
};

const ProfileSelectOverlay: React.FC = () => {
  const { user, setOverlay, setActiveProfile, updateUser, logout } = useStore();
  const navigate = useNavigate();

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLevel, setNewLevel] = useState<EducationLevel | null>(null);
  const [newAvatar, setNewAvatar] = useState(AVATARS[0]);
  const [addError, setAddError] = useState('');

  if (!user) return null;

  const maxProfiles = MAX_STUDENTS[user.package] ?? 1;
  const canAddMore = user.profiles.length < maxProfiles;

  const handleSelect = (profile: StudentProfile) => {
    setActiveProfile(profile.id);
    setOverlay(null);
    navigate(ROUTES[profile.educationLevel]);
  };

  const handleAddProfile = () => {
    setAddError('');
    if (!newName.trim()) { setAddError('Please enter a name'); return; }
    if (!newLevel) { setAddError('Please select an education level'); return; }

    const newProfile: StudentProfile = {
      id: `${user.phone}-${user.profiles.length}`,
      username: newName.trim(),
      educationLevel: newLevel,
      pin: user.pin,
      avatar: newAvatar,
      xp: 0, level: 1, streak: 0, points: 0,
    };

    updateUser({ profiles: [...user.profiles, newProfile] });
    setAdding(false);
    setNewName('');
    setNewLevel(null);
    setNewAvatar(AVATARS[0]);
  };

  const levelLabel = (l: EducationLevel) =>
    l === 'lower_primary' ? 'Grade 1–3' : l === 'middle_school' ? 'Grade 4–9' : 'Grade 10–12';

  return (
    <div className="ps-backdrop">
      {/* Logo */}
      <div className="ps-logo">Bongo<span>Quiz</span></div>

      {!adding ? (
        <div className="ps-screen">
          <div className="ps-header">
            <h1 className="ps-heading">Who's learning today?</h1>
            <p className="ps-subheading">Select your profile to continue</p>
          </div>

          <div className="ps-profiles-grid">
            {user.profiles.map(profile => (
              <button key={profile.id} className="ps-profile-card" onClick={() => handleSelect(profile)}>
                <div className="ps-avatar"><img src={avatarUrl(profile.avatar)} alt={profile.username} width={40} height={40} /></div>
                <span className="ps-profile-name">{profile.username}</span>
                <span className="ps-profile-level">{levelLabel(profile.educationLevel)}</span>
              </button>
            ))}

            {canAddMore && (
              <button className="ps-profile-card ps-add-card" onClick={() => setAdding(true)}>
                <div className="ps-avatar ps-add-avatar"><Plus size={30} /></div>
                <span className="ps-profile-name">Add Profile</span>
                <span className="ps-profile-level">{user.profiles.length}/{maxProfiles} slots used</span>
              </button>
            )}
          </div>

          <button className="ps-logout-btn" onClick={() => { logout(); setOverlay(null); navigate('/'); }}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      ) : (
        <div className="ps-add-screen">
          <div className="ps-add-header">
            <div className="ps-add-icon"><User size={22} /></div>
            <h2 className="ps-heading" style={{ fontSize: '1.6rem' }}>New Profile</h2>
            <p className="ps-subheading">Customize and set up a learner profile</p>
          </div>

          {addError && <p className="ps-add-error">{addError}</p>}

          {/* Avatar picker */}
          <div className="ps-section">
            <label className="ps-section-label">Choose an avatar</label>
            <div className="ps-add-avatars">
              {AVATARS.map(a => (
                <button key={a} className={`ps-avatar-opt ${newAvatar === a ? 'selected' : ''}`}
                  onClick={() => setNewAvatar(a)}>
                  <img src={avatarUrl(a)} alt={a} width={32} height={32} />
                </button>
              ))}
            </div>
          </div>

          {/* Name input */}
          <div className="ps-section" style={{ width: '100%' }}>
            <label className="ps-section-label">Student name</label>
            <input
              className="ps-add-input"
              placeholder="e.g. Amara, Kofi, Zuri…"
              autoFocus
              value={newName}
              onChange={e => { setNewName(e.target.value); setAddError(''); }}
            />
          </div>

          {/* Level picker */}
          <div className="ps-section" style={{ width: '100%' }}>
            <label className="ps-section-label">Education level</label>
            <div className="ps-add-levels">
              {LEVEL_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  className={`ps-level-card ${newLevel === opt.id ? 'selected-card' : ''}`}
                  style={newLevel === opt.id ? { borderColor: opt.color, background: opt.bg } : {}}
                  onClick={() => { setNewLevel(opt.id); setAddError(''); }}
                >
                  <span className="ps-level-emoji">{opt.emoji}</span>
                  <div className="ps-level-info">
                    <div className="ps-level-name">{opt.label}</div>
                    <div className="ps-level-grades">{opt.grades}</div>
                  </div>
                  {newLevel === opt.id && <CheckCircle size={18} color={opt.color} style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                </button>
              ))}
            </div>
          </div>

          <button className="ps-pin-submit" onClick={handleAddProfile}>
            Create Profile
          </button>
          <button className="ps-back-link" onClick={() => { setAdding(false); setAddError(''); }}>
            <ArrowLeft size={14} /> Back to profiles
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSelectOverlay;

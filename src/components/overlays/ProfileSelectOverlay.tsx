import React, { useState } from 'react';
import { useStore, type StudentProfile, type EducationLevel } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Plus } from 'lucide-react';
import '../../styles/profile-select.css';

const ROUTES: Record<EducationLevel, string> = {
  lower_primary: '/level/lower-primary',
  middle_school: '/level/middle-school',
  senior_school: '/level/senior-school',
};

const LEVEL_OPTIONS: { id: EducationLevel; label: string; grades: string; emoji: string; color: string }[] = [
  { id: 'lower_primary', label: 'Lower Primary', grades: 'Grade 1–3', emoji: '🧒', color: '#10b981' },
  { id: 'middle_school', label: 'Middle School', grades: 'Grade 4–9', emoji: '🧠', color: '#3b82f6' },
  { id: 'senior_school', label: 'Senior School', grades: 'Grade 10–12', emoji: '🎓', color: '#a855f7' },
];

const AVATARS = ['🧒🏿','👦🏿','👧🏿','🧑🏿','🤓','😎','🦸🏿','🧙🏿','🎓','🌟','🦁','🐯'];

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
    if (!newName.trim()) { setAddError('Enter a name'); return; }
    if (!newLevel) { setAddError('Select an education level'); return; }

    const newProfile: StudentProfile = {
      id: `${user.phone}-${user.profiles.length}`,
      username: newName.trim(),
      educationLevel: newLevel,
      pin: user.pin,   // shared account PIN
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
      <div className="ps-logo">Bongo<span>Quiz</span></div>

      {!adding ? (
        <div className="ps-screen">
          <h1 className="ps-heading">Who's learning today?</h1>

          <div className="ps-profiles-grid">
            {user.profiles.map(profile => (
              <button key={profile.id} className="ps-profile-card" onClick={() => handleSelect(profile)}>
                <div className="ps-avatar">{profile.avatar}</div>
                <span className="ps-profile-name">{profile.username}</span>
                <span className="ps-profile-level">{levelLabel(profile.educationLevel)}</span>
              </button>
            ))}

            {canAddMore && (
              <button className="ps-profile-card ps-add-card" onClick={() => setAdding(true)}>
                <div className="ps-avatar ps-add-avatar"><Plus size={32} /></div>
                <span className="ps-profile-name">Add Profile</span>
                <span className="ps-profile-level">{user.profiles.length}/{maxProfiles} used</span>
              </button>
            )}
          </div>

          <button className="ps-logout-btn" onClick={() => { logout(); setOverlay(null); navigate('/'); }}>
            Sign Out
          </button>
        </div>
      ) : (
        <div className="ps-add-screen">
          <h2 className="ps-heading" style={{ fontSize: '1.5rem' }}>➕ New Profile</h2>

          {addError && <p className="ps-add-error">{addError}</p>}

          <div className="ps-add-avatars">
            {AVATARS.map(a => (
              <button key={a} className={`ps-avatar-opt ${newAvatar === a ? 'selected' : ''}`}
                onClick={() => setNewAvatar(a)}>{a}</button>
            ))}
          </div>

          <input className="ps-add-input" placeholder="Student name" autoFocus
            value={newName} onChange={e => { setNewName(e.target.value); setAddError(''); }} />

          <div className="ps-add-levels">
            {LEVEL_OPTIONS.map(opt => (
              <button key={opt.id}
                className={`ps-level-card ${newLevel === opt.id ? 'selected-card' : ''}`}
                style={newLevel === opt.id ? { borderColor: '', background: `` } : {}}
                onClick={() => { setNewLevel(opt.id); setAddError(''); }}>
                <span>{opt.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{opt.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{opt.grades}</div>
                </div>
                {newLevel === opt.id && <CheckCircle size={16} color={opt.color} style={{ marginLeft: 'auto' }} />}
              </button>
            ))}
          </div>

          <button className="ps-pin-submit" onClick={handleAddProfile}>
            Create Profile
          </button>
          <button className="ps-back-link" onClick={() => { setAdding(false); setAddError(''); }}>
            ← Back
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSelectOverlay;

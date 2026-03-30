import React, { useState } from 'react';
import { useStore, type StudentProfile, type EducationLevel } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import '../../styles/profile-select.css';

const ROUTES: Record<EducationLevel, string> = {
  lower_primary: '/level/lower-primary',
  middle_school: '/level/middle-school',
  senior_school: '/level/senior-school',
};

const PinInput: React.FC<{ value: string; onChange: (v: string) => void; hasError?: boolean }> = ({ value, onChange, hasError }) => {
  const refs = Array.from({ length: 4 }, () => React.useRef<HTMLInputElement>(null));
  const digits = value.padEnd(4, '').split('').slice(0, 4);

  const handleInput = (i: number, char: string) => {
    if (!/^\d?$/.test(char)) return;
    const d = [...digits]; d[i] = char;
    onChange(d.join('').replace(/\s/g, ''));
    if (char && i < 3) refs[i + 1].current?.focus();
  };
  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs[i - 1].current?.focus();
  };

  return (
    <div className="ps-pin-row">
      {[0,1,2,3].map(i => (
        <input key={i} ref={refs[i]} type="password" inputMode="numeric" maxLength={1}
          value={digits[i] || ''} onChange={e => handleInput(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          className={`ps-pin-box ${hasError ? 'error' : ''} ${digits[i] ? 'filled' : ''}`}
          autoComplete="off" autoFocus={i === 0} />
      ))}
    </div>
  );
};

const ProfileSelectOverlay: React.FC = () => {
  const { user, setOverlay, setActiveProfile, logout } = useStore();
  const navigate = useNavigate();

  const [selectedProfile, setSelectedProfile] = useState<StudentProfile | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!user) return null;

  const handleProfileClick = (profile: StudentProfile) => {
    setSelectedProfile(profile);
    setPin('');
    setError('');
  };

  const handlePinSubmit = () => {
    if (!selectedProfile) return;
    if (pin !== selectedProfile.pin) {
      setError('Wrong PIN, try again');
      setPin('');
      return;
    }
    setActiveProfile(selectedProfile.id);
    setOverlay(null);
    navigate(ROUTES[selectedProfile.educationLevel]);
  };

  const handleBack = () => {
    setSelectedProfile(null);
    setPin('');
    setError('');
  };

  return (
    <div className="ps-backdrop">
      <div className="ps-logo">Bongo<span>Quiz</span></div>

      {!selectedProfile ? (
        <div className="ps-screen">
          <h1 className="ps-heading">Who's learning today?</h1>
          <div className="ps-profiles-grid">
            {user.profiles.map(profile => (
              <button key={profile.id} className="ps-profile-card"
                onClick={() => handleProfileClick(profile)}>
                <div className="ps-avatar">{profile.avatar}</div>
                <span className="ps-profile-name">{profile.username}</span>
                <span className="ps-profile-level">
                  {profile.educationLevel === 'lower_primary' ? 'Grade 1–3'
                    : profile.educationLevel === 'middle_school' ? 'Grade 4–9'
                    : 'Grade 10–12'}
                </span>
              </button>
            ))}
          </div>
          <button className="ps-logout-btn" onClick={() => { logout(); setOverlay(null); navigate('/'); }}>
            Sign Out
          </button>
        </div>
      ) : (
        <div className="ps-pin-screen">
          <div className="ps-pin-avatar">{selectedProfile.avatar}</div>
          <h2 className="ps-pin-name">{selectedProfile.username}</h2>
          <p className="ps-pin-label">Enter your profile PIN</p>
          {error && <div className="ps-pin-error"><Shield size={14} />{error}</div>}
          <PinInput value={pin} onChange={v => { setPin(v); setError(''); }} hasError={!!error} />
          {pin.length === 4 && (
            <button className="ps-pin-submit" onClick={handlePinSubmit}>Enter</button>
          )}
          <button className="ps-back-link" onClick={handleBack}>← Back to profiles</button>
        </div>
      )}
    </div>
  );
};

export default ProfileSelectOverlay;

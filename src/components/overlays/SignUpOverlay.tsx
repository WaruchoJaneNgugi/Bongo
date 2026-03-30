import React, { useState, useRef } from 'react';
import { useStore, type StudentProfile, type EducationLevel, type FamilyPackage } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, ArrowLeft, CheckCircle, Shield, Users, User, Star, Crown } from 'lucide-react';
import '../../styles/overlay.css';

const LEVEL_OPTIONS: { id: EducationLevel; label: string; grades: string; emoji: string; color: string }[] = [
  { id: 'lower_primary', label: 'Lower Primary', grades: 'Grade 1–3', emoji: '🧒', color: '#10b981' },
  { id: 'middle_school', label: 'Middle School', grades: 'Grade 4–9', emoji: '🧠', color: '#3b82f6' },
  { id: 'senior_school', label: 'Senior School', grades: 'Grade 10–12', emoji: '🎓', color: '#a855f7' },
];

const AVATARS = ['🧒🏿','👦🏿','👧🏿','🧑🏿','🤓','😎','🦸🏿','🧙🏿','🎓','🌟','🦁','🐯'];

const PACKAGES: {
  id: FamilyPackage; label: string; price: string; period: string;
  students: number; icon: React.ElementType; color: string; popular?: boolean;
}[] = [
  { id: 'solo',   label: '1 Student',        price: 'KSh 140',  period: '/month', students: 1, icon: User,   color: '#10b981' },
  { id: 'trio',   label: '3 Students',       price: 'KSh 280',  period: '/month', students: 3, icon: Users,  color: '#3b82f6', popular: true },
  { id: 'quad',   label: '4 Students',       price: 'KSh 500',  period: '/month', students: 4, icon: Crown,  color: '#f59e0b' },
  { id: 'family', label: '5+ Students',      price: 'KSh 900',  period: '/month', students: 5, icon: Star,   color: '#a855f7' },
];

/* ─── PIN Input ─────────────────────────────────────────── */
const PinInput: React.FC<{ value: string; onChange: (v: string) => void; hasError?: boolean }> = ({ value, onChange, hasError }) => {
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
                useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
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
  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    onChange(text);
    refs[Math.min(text.length, 3)].current?.focus();
    e.preventDefault();
  };

  return (
    <div className="ov-pin-row">
      {[0,1,2,3].map(i => (
        <input key={i} ref={refs[i]} type="password" inputMode="numeric" maxLength={1}
          value={digits[i] || ''} onChange={e => handleInput(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)} onPaste={handlePaste}
          className={`ov-pin-box ${hasError ? 'error' : ''} ${digits[i] ? 'filled' : ''}`}
          autoComplete="off" />
      ))}
    </div>
  );
};

/* ─── Profile Builder ───────────────────────────────────── */
const ProfileBuilder: React.FC<{
  index: number; total: number;
  profile: Partial<StudentProfile>;
  onChange: (p: Partial<StudentProfile>) => void;
}> = ({ index, total, profile, onChange }) => (
  <div className="ov-profile-builder">
    <h3 className="ov-profile-builder-title">
      {total === 1 ? '👤 Your Profile' : `👤 Student ${index + 1} of ${total}`}
    </h3>
    <div className="ov-avatar-row">
      {AVATARS.map(a => (
        <button key={a} className={`ov-avatar-opt ${profile.avatar === a ? 'selected' : ''}`}
          onClick={() => onChange({ ...profile, avatar: a })}>{a}</button>
      ))}
    </div>
    <input className="ov-input" placeholder="Student name" value={profile.username ?? ''}
      onChange={e => onChange({ ...profile, username: e.target.value })} />
    <div className="ov-level-grid">
      {LEVEL_OPTIONS.map(opt => (
        <button key={opt.id}
          className={`ov-level-card ${profile.educationLevel === opt.id ? 'selected' : ''}`}
          style={profile.educationLevel === opt.id ? { borderColor: opt.color, background: `${opt.color}12` } : {}}
          onClick={() => onChange({ ...profile, educationLevel: opt.id })}>
          <span className="ov-level-emoji">{opt.emoji}</span>
          <div className="ov-level-info">
            <span className="ov-level-name">{opt.label}</span>
            <span className="ov-level-grades">{opt.grades}</span>
          </div>
          {profile.educationLevel === opt.id && <CheckCircle size={16} color={opt.color} style={{ marginLeft: 'auto' }} />}
        </button>
      ))}
    </div>
    {total > 1 && (
      <div className="ov-form-group" style={{ marginTop: '0.75rem' }}>
        <label className="ov-label">🔐 Profile PIN</label>
        <PinInput value={profile.pin ?? ''} onChange={pin => onChange({ ...profile, pin })} />
        <span className="ov-hint">Student uses this PIN to select their profile</span>
      </div>
    )}
  </div>
);

/* ─── Main ──────────────────────────────────────────────── */
const SignUpOverlay: React.FC = () => {
  const { setOverlay, registerUser, login, allUsers } = useStore();
  const navigate = useNavigate();

  // step 1=phone+pin, 2=otp, 3=package, 4=profiles
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState('');
  const [accountPin, setAccountPin] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<FamilyPackage | null>(null);

  const profileCount = selectedPackage
    ? PACKAGES.find(p => p.id === selectedPackage)!.students
    : 1;

  const emptyProfile = (): Partial<StudentProfile> => ({
    username: '', avatar: AVATARS[0], educationLevel: 'middle_school', pin: '',
  });

  const [profiles, setProfiles] = useState<Partial<StudentProfile>[]>([emptyProfile()]);

  const cleanPhone = phone.replace(/\s/g, '');

  const handleNext1 = () => {
    setError('');
    if (!cleanPhone) { setError('Enter your phone number'); return; }
    if (!/^(\+254|0)[7][0-9]{8}$/.test(cleanPhone)) {
      setError('Enter a valid Kenyan number (e.g. 0712345678)'); return;
    }
    if (accountPin.length !== 4) { setError('Set a 4-digit account PIN'); return; }
    if (allUsers.find(u => u.phone === cleanPhone)) {
      setError('This number is already registered'); return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 800);
  };

  const handleVerifyOtp = () => {
    if (otp !== '1234') { setError('Invalid OTP. Use 1234 for demo.'); return; }
    setError(''); setStep(3);
  };

  const handlePackageNext = () => {
    if (!selectedPackage) { setError('Please select a package'); return; }
    const count = PACKAGES.find(p => p.id === selectedPackage)!.students;
    setProfiles(Array.from({ length: count }, emptyProfile));
    setError(''); setStep(4);
  };

  const handleFinish = () => {
    setError('');
    for (let i = 0; i < profiles.length; i++) {
      const p = profiles[i];
      if (!p.username?.trim()) { setError(`Enter a name for Student ${i + 1}`); return; }
      if (!p.educationLevel) { setError(`Select a level for Student ${i + 1}`); return; }
      if (profiles.length > 1 && (p.pin?.length ?? 0) < 4) {
        setError(`Set a 4-digit PIN for Student ${i + 1}`); return;
      }
    }

    const builtProfiles: StudentProfile[] = profiles.map((p, i) => ({
      id: `${cleanPhone}-${i}`,
      username: p.username!.trim(),
      educationLevel: p.educationLevel!,
      pin: profiles.length === 1 ? accountPin : p.pin!,
      avatar: p.avatar ?? AVATARS[0],
      xp: 0, level: 1, streak: 0, points: 0,
    }));

    const newUser = {
      type: 'student' as const,
      phone: cleanPhone,
      pin: accountPin,
      package: selectedPackage!,
      profiles: builtProfiles,
      activeProfileId: profiles.length === 1 ? builtProfiles[0].id : null,
    };

    registerUser(newUser);
    login(newUser);
    setOverlay(null);

    if (profiles.length === 1) {
      const routes: Record<EducationLevel, string> = {
        lower_primary: '/level/lower-primary',
        middle_school: '/level/middle-school',
        senior_school: '/level/senior-school',
      };
      navigate(routes[builtProfiles[0].educationLevel]);
    } else {
      setOverlay('profile-select');
    }
  };

  const updateProfile = (i: number, p: Partial<StudentProfile>) => {
    setProfiles(prev => prev.map((old, idx) => idx === i ? p : old));
  };

  return (
    <div className="ov-backdrop" onClick={() => setOverlay(null)}>
      <div className="ov-container" onClick={e => e.stopPropagation()}>
        <div className="ov-card">
          <button className="ov-close" onClick={() => setOverlay(null)}>✕</button>
          <div className="ov-logo">Bongo<span>Quiz</span></div>

          {/* Step dots */}
          <div className="ov-steps">
            {[1,2,3,4].map(n => (
              <React.Fragment key={n}>
                <div className={`ov-step-dot ${step === n ? 'current' : step > n ? 'done' : ''}`}>
                  {step > n ? <CheckCircle size={14} /> : n}
                </div>
                {n < 4 && <div className={`ov-step-line ${step > n ? 'done' : ''}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Phone + PIN */}
          {step === 1 && (
            <div className="ov-step-body">
              <h2 className="ov-title">👋 Get Started</h2>
              <p className="ov-sub">Enter your phone number to create an account</p>
              {error && <div className="ov-error"><Shield size={14} />{error}</div>}

              <div className="ov-form-group">
                <label className="ov-label"><Phone size={15} /> Phone Number</label>
                <input className="ov-input" type="tel" placeholder="0712 345 678"
                  value={phone} onChange={e => { setPhone(e.target.value); setError(''); }} />
                <span className="ov-hint">This is your account login number</span>
              </div>

              <div className="ov-form-group">
                <label className="ov-label">🔐 Set Account PIN</label>
                <PinInput value={accountPin} onChange={setAccountPin} hasError={!!error && accountPin.length < 4} />
                <span className="ov-hint">You'll use this to log in</span>
              </div>

              <button className="ov-submit" onClick={handleNext1} disabled={loading}>
                {loading ? 'Sending OTP…' : <><span>Continue</span><ArrowRight size={18} /></>}
              </button>
              <p className="ov-footer-text">
                Already have an account?{' '}
                <button className="ov-link" onClick={() => setOverlay('login')}>Log In</button>
              </p>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="ov-step-body">
              <h2 className="ov-title">📱 Verify Number</h2>
              <p className="ov-sub">Enter the code sent to <strong>{cleanPhone}</strong></p>
              {error && <div className="ov-error"><Shield size={14} />{error}</div>}
              <div className="ov-demo-note">🧪 Demo — use code <strong>1234</strong></div>
              <div className="ov-form-group" style={{ textAlign: 'center' }}>
                <PinInput value={otp} onChange={v => { setOtp(v); setError(''); }} hasError={!!error} />
              </div>
              <button className="ov-submit" onClick={handleVerifyOtp}>
                <span>Verify</span><ArrowRight size={18} />
              </button>
              <button className="ov-back-btn" onClick={() => { setStep(1); setOtp(''); setError(''); }}>
                <ArrowLeft size={16} /> Back
              </button>
            </div>
          )}

          {/* Step 3: Package */}
          {step === 3 && (
            <div className="ov-step-body">
              <h2 className="ov-title">📦 Choose a Package</h2>
              <p className="ov-sub">How many students are in your family?</p>
              {error && <div className="ov-error"><Shield size={14} />{error}</div>}

              <div className="ov-plans-grid">
                {PACKAGES.map(pkg => {
                  const Icon = pkg.icon;
                  const isSelected = selectedPackage === pkg.id;
                  return (
                    <button key={pkg.id}
                      className={`ov-plan-card ${isSelected ? 'selected' : ''}`}
                      style={isSelected ? { borderColor: pkg.color, background: `${pkg.color}10` } : {}}
                      onClick={() => { setSelectedPackage(pkg.id); setError(''); }}>
                      {pkg.popular && (
                        <div className="ov-plan-popular" style={{ background: pkg.color }}>POPULAR</div>
                      )}
                      <div className="ov-plan-icon" style={{ background: `${pkg.color}18`, color: pkg.color }}>
                        <Icon size={22} />
                      </div>
                      <div className="ov-plan-name">{pkg.label}</div>
                      <div className="ov-plan-price">
                        <span className="ov-plan-amount">{pkg.price}</span>
                        <span className="ov-plan-period">{pkg.period}</span>
                      </div>
                      {isSelected && <CheckCircle size={18} color={pkg.color} style={{ marginTop: '0.5rem' }} />}
                    </button>
                  );
                })}
              </div>

              <button className="ov-submit" onClick={handlePackageNext} style={{ marginTop: '1rem' }}>
                <span>Continue</span><ArrowRight size={18} />
              </button>
              <button className="ov-back-btn" onClick={() => setStep(2)}>
                <ArrowLeft size={16} /> Back
              </button>
            </div>
          )}

          {/* Step 4: Build profiles */}
          {step === 4 && (
            <div className="ov-step-body">
              <h2 className="ov-title">🎓 Set Up Profiles</h2>
              <p className="ov-sub">
                {profileCount === 1
                  ? 'Tell us about yourself'
                  : `Create a profile for each of the ${profileCount} students`}
              </p>
              {error && <div className="ov-error"><Shield size={14} />{error}</div>}

              <div className="ov-profiles-scroll">
                {profiles.map((p, i) => (
                  <ProfileBuilder key={i} index={i} total={profileCount}
                    profile={p} onChange={updated => updateProfile(i, updated)} />
                ))}
              </div>

              <button className="ov-submit" onClick={handleFinish} style={{ marginTop: '1rem' }}>
                <span>🚀 Create Account</span>
              </button>
              <button className="ov-back-btn" onClick={() => setStep(3)}>
                <ArrowLeft size={16} /> Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpOverlay;

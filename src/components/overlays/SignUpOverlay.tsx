import React, { useState, useRef } from 'react';
import { useStore, type StudentUser, type ParentUser, type EducationLevel } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  Phone, User, ArrowRight, ArrowLeft, CheckCircle,
  BookOpen, Users, GraduationCap, Shield, Plus, X,
} from 'lucide-react';
import '../../styles/overlay.css';

type UserMode = 'student' | 'parent';

const LEVEL_OPTIONS: { id: EducationLevel; label: string; grades: string; emoji: string; color: string }[] = [
  { id: 'lower_primary', label: 'Lower Primary', grades: 'Grade 1–3', emoji: '🧒', color: '#10b981' },
  { id: 'middle_school', label: 'Middle School', grades: 'Grade 4–9', emoji: '🧠', color: '#3b82f6' },
  { id: 'senior_school', label: 'Senior School', grades: 'Grade 10–12', emoji: '🎓', color: '#a855f7' },
];

const AVATARS = ['🧒','👦','👧','🧑','👨','👩','🦸','🧙','🎓','🤓','😎','🌟'];

/* ─── PIN Input (4 boxes, like OTP) ──────────────────────── */
const PinInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}> = ({ value, onChange, hasError, disabled }) => {
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
                useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const digits = value.padEnd(4, '').split('').slice(0, 4);

  const handleInput = (i: number, char: string) => {
    if (!/^\d?$/.test(char)) return;
    const newDigits = [...digits];
    newDigits[i] = char;
    onChange(newDigits.join('').replace(/\s/g, ''));
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
      {[0, 1, 2, 3].map(i => (
        <input
          key={i}
          ref={refs[i]}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          onChange={e => handleInput(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`ov-pin-box ${hasError ? 'error' : ''} ${digits[i] ? 'filled' : ''}`}
          autoComplete="off"
        />
      ))}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────── */
const SignUpOverlay: React.FC = () => {
  const { setOverlay, registerUser, login, allUsers, addStudentToParent } = useStore();
  const navigate = useNavigate();

  const [mode, setMode] = useState<UserMode>('student');
  const [step, setStep] = useState(1); // 1=info, 2=otp, 3=level(student)/students(parent)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form state
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');
  const [avatar, setAvatar] = useState('🧒');
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | null>(null);

  // Parent-specific: student creation
  const [parentStudents, setParentStudents] = useState<{ name: string; level: EducationLevel; avatar: string }[]>([]);
  const [addingStudent, setAddingStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentLevel, setNewStudentLevel] = useState<EducationLevel>('middle_school');

  const cleanPhone = phone.replace(/\s/g, '');

  const validateStep1 = () => {
    setError('');
    if (!username.trim()) { setError('Please enter your name'); return false; }
    if (!cleanPhone) { setError('Please enter your phone number'); return false; }
    if (!/^(\+254|0)[7][0-9]{8}$/.test(cleanPhone)) {
      setError('Enter a valid Kenyan number (e.g. 0712345678)'); return false;
    }
    if (pin.length !== 4) { setError('Enter a 4-digit PIN'); return false; }
    if (allUsers.find(u => u.phone === cleanPhone)) {
      setError('This phone number is already registered'); return false;
    }
    return true;
  };

  const handleNext1 = () => {
    if (!validateStep1()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 800);
  };

  const handleVerifyOtp = () => {
    if (otp !== '1234') { setError('Invalid OTP. Use 1234 for demo.'); return; }
    setError('');
    setStep(3);
  };

  const handleFinish = () => {
    setError('');
    if (mode === 'student') {
      if (!selectedLevel) { setError('Please select your education level'); return; }
      const newUser: StudentUser = {
        type: 'student',
        username: username.trim(),
        phone: cleanPhone,
        pin,
        educationLevel: selectedLevel,
        avatar,
        xp: 0,
        level: 1,
        streak: 0,
        points: 0,
      };
      registerUser(newUser);
      login(newUser);
      const routes: Record<EducationLevel, string> = {
        lower_primary: '/level/lower-primary',
        middle_school: '/level/middle-school',
        senior_school: '/level/senior-school',
      };
      navigate(routes[selectedLevel]);
    } else {
      // Parent finish — create parent + any added students
      const newParent: ParentUser = {
        type: 'parent',
        username: username.trim(),
        phone: cleanPhone,
        pin,
        avatar,
        students: parentStudents.map((s, i) => ({
          type: 'student',
          username: s.name,
          phone: `${cleanPhone}-${i + 1}`,
          pin: '0000',
          educationLevel: s.level,
          parentPhone: cleanPhone,
          avatar: s.avatar,
          xp: 0,
          level: 1,
          streak: 0,
          points: 0,
        })),
      };
      registerUser(newParent);
      login(newParent);
      navigate('/');
    }
    setOverlay(null);
  };

  const addParentStudent = () => {
    if (!newStudentName.trim()) return;
    setParentStudents(prev => [...prev, { name: newStudentName.trim(), level: newStudentLevel, avatar: '🧒' }]);
    setNewStudentName('');
    setAddingStudent(false);
  };

  return (
    <div className="ov-backdrop" onClick={() => setOverlay(null)}>
      <div className="ov-container" onClick={e => e.stopPropagation()}>
        <div className="ov-card">
          <button className="ov-close" onClick={() => setOverlay(null)}><X size={18} /></button>

          {/* Logo */}
          <div className="ov-logo">Bongo<span>Quiz</span></div>

          {/* Mode toggle */}
          {step === 1 && (
            <div className="ov-mode-toggle">
              <button
                className={`ov-mode-btn ${mode === 'student' ? 'active' : ''}`}
                onClick={() => setMode('student')}
              >
                <BookOpen size={16} /> Student
              </button>
              <button
                className={`ov-mode-btn ${mode === 'parent' ? 'active' : ''}`}
                onClick={() => setMode('parent')}
              >
                <Users size={16} /> Parent
              </button>
            </div>
          )}

          {/* Step indicator */}
          <div className="ov-steps">
            {[1,2,3].map(n => (
              <React.Fragment key={n}>
                <div className={`ov-step-dot ${step === n ? 'current' : step > n ? 'done' : ''}`}>
                  {step > n ? <CheckCircle size={14} /> : n}
                </div>
                {n < 3 && <div className={`ov-step-line ${step > n ? 'done' : ''}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Info */}
          {step === 1 && (
            <div className="ov-step-body">
              <h2 className="ov-title">
                {mode === 'student' ? '👋 Create Account' : '👨‍👩‍👧 Parent Account'}
              </h2>
              <p className="ov-sub">
                {mode === 'student' ? 'Your learning journey starts here' : 'Manage your children\'s learning'}
              </p>

              {error && <div className="ov-error"><Shield size={14} />{error}</div>}

              {/* Avatar picker */}
              <div className="ov-form-group">
                <label className="ov-label">Choose avatar</label>
                <div className="ov-avatar-row">
                  {AVATARS.map(a => (
                    <button
                      key={a}
                      className={`ov-avatar-opt ${avatar === a ? 'selected' : ''}`}
                      onClick={() => setAvatar(a)}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ov-form-group">
                <label className="ov-label"><User size={15} /> {mode === 'parent' ? 'Parent Name' : 'Your Name'}</label>
                <input
                  className="ov-input"
                  placeholder={mode === 'parent' ? 'e.g. Jane Wanjiku' : 'e.g. Brian Otieno'}
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                />
              </div>

              <div className="ov-form-group">
                <label className="ov-label"><Phone size={15} /> Phone Number</label>
                <input
                  className="ov-input"
                  type="tel"
                  placeholder="0712 345 678"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setError(''); }}
                />
                <span className="ov-hint">Kenyan number (0712345678 or +254…)</span>
              </div>

              <div className="ov-form-group">
                <label className="ov-label">🔐 Set 4-Digit PIN</label>
                <PinInput value={pin} onChange={setPin} hasError={!!error && pin.length < 4} />
                <span className="ov-hint">You'll use this PIN to log in</span>
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
              <p className="ov-sub">
                Enter the 4-digit code sent to <strong>{cleanPhone}</strong>
              </p>

              {error && <div className="ov-error"><Shield size={14} />{error}</div>}

              <div className="ov-demo-note">
                🧪 Demo mode — use code <strong>1234</strong>
              </div>

              <div className="ov-form-group" style={{ textAlign: 'center' }}>
                <PinInput value={otp} onChange={v => { setOtp(v); setError(''); }} hasError={!!error} />
              </div>

              <button className="ov-submit" onClick={handleVerifyOtp}>
                <span>Verify OTP</span><ArrowRight size={18} />
              </button>

              <button className="ov-back-btn" onClick={() => { setStep(1); setOtp(''); setError(''); }}>
                <ArrowLeft size={16} /> Back
              </button>
            </div>
          )}

          {/* Step 3: Level (student) or Students (parent) */}
          {step === 3 && mode === 'student' && (
            <div className="ov-step-body">
              <h2 className="ov-title">🎓 Pick Your Level</h2>
              <p className="ov-sub">Which class are you in?</p>

              {error && <div className="ov-error"><Shield size={14} />{error}</div>}

              <div className="ov-level-grid">
                {LEVEL_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    className={`ov-level-card ${selectedLevel === opt.id ? 'selected' : ''}`}
                    style={selectedLevel === opt.id ? { borderColor: opt.color, background: `${opt.color}12` } : {}}
                    onClick={() => setSelectedLevel(opt.id)}
                  >
                    <span className="ov-level-emoji">{opt.emoji}</span>
                    <div className="ov-level-info">
                      <span className="ov-level-name">{opt.label}</span>
                      <span className="ov-level-grades">{opt.grades}</span>
                    </div>
                    {selectedLevel === opt.id && (
                      <CheckCircle size={18} color={opt.color} style={{ marginLeft: 'auto' }} />
                    )}
                  </button>
                ))}
              </div>

              <button
                className="ov-submit"
                onClick={handleFinish}
                disabled={!selectedLevel}
                style={{ marginTop: '1rem' }}
              >
                <span>🚀 Start Learning!</span>
              </button>
            </div>
          )}

          {step === 3 && mode === 'parent' && (
            <div className="ov-step-body">
              <h2 className="ov-title">👨‍👩‍👧 Add Students</h2>
              <p className="ov-sub">Add your children's accounts now or do it later</p>

              {parentStudents.length > 0 && (
                <div className="ov-student-list">
                  {parentStudents.map((s, i) => {
                    const lvl = LEVEL_OPTIONS.find(l => l.id === s.level)!;
                    return (
                      <div key={i} className="ov-added-student">
                        <span>{s.avatar}</span>
                        <div>
                          <strong>{s.name}</strong>
                          <span>{lvl.emoji} {lvl.label}</span>
                        </div>
                        <button
                          className="ov-remove-student"
                          onClick={() => setParentStudents(prev => prev.filter((_, j) => j !== i))}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {addingStudent ? (
                <div className="ov-add-student-form">
                  <input
                    className="ov-input"
                    placeholder="Child's name"
                    value={newStudentName}
                    onChange={e => setNewStudentName(e.target.value)}
                  />
                  <div className="ov-level-grid compact">
                    {LEVEL_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        className={`ov-level-card ${newStudentLevel === opt.id ? 'selected' : ''}`}
                        style={newStudentLevel === opt.id ? { borderColor: opt.color, background: `${opt.color}12` } : {}}
                        onClick={() => setNewStudentLevel(opt.id)}
                      >
                        <span>{opt.emoji}</span>
                        <span style={{ fontSize: '0.8rem' }}>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="ov-submit" style={{ flex: 1 }} onClick={addParentStudent}>
                      <Plus size={16} /> Add
                    </button>
                    <button
                      className="ov-ghost-btn"
                      onClick={() => { setAddingStudent(false); setNewStudentName(''); }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button className="ov-add-btn" onClick={() => setAddingStudent(true)}>
                  <Plus size={16} /> Add a Student
                </button>
              )}

              <div className="ov-parent-actions">
                <button className="ov-submit" onClick={handleFinish}>
                  {parentStudents.length > 0
                    ? `✅ Finish (${parentStudents.length} student${parentStudents.length > 1 ? 's' : ''})`
                    : 'Skip & Finish Later'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpOverlay;

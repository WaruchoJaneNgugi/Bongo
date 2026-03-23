import React, { useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, Shield, BookOpen, Users, X, User } from 'lucide-react';
import '../../styles/overlay.css';

type UserMode = 'student' | 'parent';
type LoginMethod = 'phone' | 'username';

/* ─── PIN Input ──────────────────────────────────────────── */
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

/* ─── Main ───────────────────────────────────────────────── */
const LoginOverlay: React.FC = () => {
  const { setOverlay, login, allUsers } = useStore();
  const navigate = useNavigate();

  const [mode, setMode] = useState<UserMode>('student');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');
  const [phone, setPhone] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cleanPhone = phone.replace(/\s/g, '');

  const handleModeSwitch = (newMode: UserMode) => {
    setMode(newMode);
    setError('');
    // Parents always log in by phone
    if (newMode === 'parent') setLoginMethod('phone');
  };

  const handleLogin = () => {
    setError('');
    if (pin.length !== 4) { setError('Enter your 4-digit PIN'); return; }

    if (loginMethod === 'phone') {
      if (!cleanPhone) { setError('Please enter your phone number'); return; }
      if (!/^(\+254|0)[7][0-9]{8}$/.test(cleanPhone)) {
        setError('Enter a valid Kenyan number (e.g. 0712345678)'); return;
      }
    } else {
      if (!usernameInput.trim()) { setError('Please enter your username'); return; }
    }

    setLoading(true);
    setTimeout(() => {
      let found;

      if (loginMethod === 'phone') {
        found = allUsers.find(u => u.phone === cleanPhone && u.type === mode);
      } else {
        // Case-insensitive username match — supports parent-created student accounts
        found = allUsers.find(
            u =>
                u.username.toLowerCase() === usernameInput.trim().toLowerCase() &&
                u.type === mode
        );
      }

      if (!found) {
        setError(
            loginMethod === 'phone'
                ? `No ${mode} account found with this number`
                : `No ${mode} account found with username "${usernameInput.trim()}"`
        );
        setLoading(false);
        return;
      }

      if (found.pin !== pin) {
        setError('Incorrect PIN');
        setLoading(false);
        return;
      }

      login(found);
      setLoading(false);

      if (found.type === 'student') {
        const routes: Record<string, string> = {
          lower_primary: '/level/lower-primary',
          middle_school: '/level/middle-school',
          senior_school: '/level/senior-school',
        };
        navigate(routes[found.educationLevel]);
      } else {
        navigate('/');
      }
    }, 700);
  };

  return (
      <div className="ov-backdrop" onClick={() => setOverlay(null)}>
        <div className="ov-container" onClick={e => e.stopPropagation()}>
          <div className="ov-card">
            <button className="ov-close" onClick={() => setOverlay(null)}><X size={18} /></button>

            <div className="ov-logo">Bongo<span>Quiz</span></div>

            {/* Account type toggle */}
            <div className="ov-mode-toggle">
              <button
                  className={`ov-mode-btn ${mode === 'student' ? 'active' : ''}`}
                  onClick={() => handleModeSwitch('student')}
              >
                <BookOpen size={16} /> Student
              </button>
              <button
                  className={`ov-mode-btn ${mode === 'parent' ? 'active' : ''}`}
                  onClick={() => handleModeSwitch('parent')}
              >
                <Users size={16} /> Parent
              </button>
            </div>

            <h2 className="ov-title">
              {mode === 'student' ? '👋 Welcome Back!' : '👨‍👩‍👧 Parent Login'}
            </h2>
            <p className="ov-sub">
              {mode === 'student' ? 'Continue your learning streak 🔥' : 'Manage your students'}
            </p>

            {/* Login method toggle — student only */}
            {mode === 'student' && (
                <div className="ov-method-toggle">
                  <button
                      className={`ov-method-btn ${loginMethod === 'phone' ? 'active' : ''}`}
                      onClick={() => { setLoginMethod('phone'); setError(''); }}
                  >
                    <Phone size={13} /> Phone
                  </button>
                  <button
                      className={`ov-method-btn ${loginMethod === 'username' ? 'active' : ''}`}
                      onClick={() => { setLoginMethod('username'); setError(''); }}
                  >
                    <User size={13} /> Username
                  </button>
                </div>
            )}

            {error && <div className="ov-error"><Shield size={14} />{error}</div>}

            {/* Identifier field */}
            {loginMethod === 'phone' ? (
                <div className="ov-form-group">
                  <label className="ov-label"><Phone size={15} /> Phone Number</label>
                  <input
                      className="ov-input"
                      type="tel"
                      placeholder="0712 345 678"
                      value={phone}
                      onChange={e => { setPhone(e.target.value); setError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      disabled={loading}
                  />
                </div>
            ) : (
                <div className="ov-form-group">
                  <label className="ov-label"><User size={15} /> Username</label>
                  <input
                      className="ov-input"
                      type="text"
                      placeholder="Enter your username"
                      value={usernameInput}
                      onChange={e => { setUsernameInput(e.target.value); setError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      disabled={loading}
                      autoComplete="username"
                  />
                  <span className="ov-hint">
                👨‍👩‍👧 Students added by a parent can log in with their name
              </span>
                </div>
            )}

            <div className="ov-form-group">
              <label className="ov-label">🔐 Enter PIN</label>
              <PinInput
                  value={pin}
                  onChange={v => { setPin(v); setError(''); }}
                  hasError={!!error && pin.length < 4}
                  disabled={loading}
              />
              {loginMethod === 'username' && (
                  <span className="ov-hint">
                💡 Default PIN for parent-created accounts is <strong>0000</strong>
              </span>
              )}
            </div>

            <button className="ov-submit" onClick={handleLogin} disabled={loading}>
              {loading
                  ? 'Logging in…'
                  : <><span>Log In</span><ArrowRight size={18} /></>
              }
            </button>

            <p className="ov-footer-text">
              Don't have an account?{' '}
              <button className="ov-link" onClick={() => setOverlay('signup')}>Sign Up Free</button>
            </p>
          </div>
        </div>
      </div>
  );
};

export default LoginOverlay;
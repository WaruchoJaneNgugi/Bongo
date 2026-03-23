import React, { useState, useRef } from 'react';
import { useStore, type EducationLevel, type StudentUser } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  User, Trophy, BarChart3, Settings, Zap, Flame,
  Star, CheckCircle, Shield, Plus, X, Users,
  BookOpen, ChevronRight, Pencil, Trash2,
} from 'lucide-react';
import '../styles/profile.css';

/* ─── Shared ─────────────────────────────────────────────── */
const LEVEL_OPTIONS: { id: EducationLevel; label: string; grades: string; emoji: string; color: string }[] = [
  { id: 'lower_primary', label: 'Lower Primary', grades: 'Grade 1–3',  emoji: '🧒', color: '#10b981' },
  { id: 'middle_school', label: 'Middle School', grades: 'Grade 4–9',  emoji: '🧠', color: '#3b82f6' },
  { id: 'senior_school', label: 'Senior School', grades: 'Grade 10–12',emoji: '🎓', color: '#a855f7' },
];

const AVATARS = ['🧒','👦','👧','🧑','👨','👩','🦸','🧙','🎓','🤓','😎','🌟','🦁','🐯','🦊','🐼'];
const WEEK_SCORES = [72, 85, 68, 92, 78, 88, 76];

const ACHIEVEMENTS = [
  { emoji: '🔥', title: 'First Streak',   desc: '7 days in a row',       pts: 50,  earned: true  },
  { emoji: '🏆', title: 'Quiz Master',    desc: 'Score 100% on 5 quizzes',pts: 200, earned: true  },
  { emoji: '🧮', title: 'Math Wizard',    desc: 'Complete all math topics',pts: 150, earned: false },
  { emoji: '⚡', title: 'Speed Demon',    desc: 'Finish a quiz < 2 min',   pts: 100, earned: true  },
  { emoji: '📚', title: 'Bookworm',       desc: 'Read 50 lessons',         pts: 120, earned: false },
  { emoji: '🌟', title: 'Top Performer',  desc: 'Rank #1 for a week',      pts: 300, earned: false },
];

/* ─── PIN input ──────────────────────────────────────────── */
const PinInput: React.FC<{
  value: string; onChange: (v: string) => void;
  hasError?: boolean; label?: string;
}> = ({ value, onChange, hasError, label }) => {
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
    <div className="pr-form-group">
      {label && <label className="pr-label">{label}</label>}
      <div className="ov-pin-row" style={{ justifyContent: 'flex-start' }}>
        {[0,1,2,3].map(i => (
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
            className={`ov-pin-box ${hasError ? 'error' : ''} ${digits[i] ? 'filled' : ''}`}
            autoComplete="off"
          />
        ))}
      </div>
    </div>
  );
};

/* ─── Add / Edit Student Modal ───────────────────────────── */
const StudentModal: React.FC<{
  parentPhone: string;
  existingStudent?: StudentUser;
  studentCount: number;
  onClose: () => void;
}> = ({ parentPhone, existingStudent, studentCount, onClose }) => {
  const { addStudentToParent, removeStudentFromParent, user } = useStore();
  const parent = user?.type === 'parent' ? user : null;

  const isEdit = !!existingStudent;
  const [name,   setName]   = useState(existingStudent?.username ?? '');
  const [level,  setLevel]  = useState<EducationLevel>(existingStudent?.educationLevel ?? 'middle_school');
  const [avatar, setAvatar] = useState(existingStudent?.avatar ?? '🧒');
  const [pin,    setPin]    = useState(existingStudent?.pin ?? '');
  const [error,  setError]  = useState('');

  const handleSave = () => {
    setError('');
    if (!name.trim())    { setError('Enter the student\'s name'); return; }
    if (pin.length !== 4){ setError('Set a 4-digit PIN for the student'); return; }

    if (isEdit && existingStudent) {
      // For edit: remove old, add updated
      removeStudentFromParent(parentPhone, existingStudent.phone);
      addStudentToParent(parentPhone, { ...existingStudent, username: name.trim(), educationLevel: level, avatar, pin });
    } else {
      // New student: phone = parentPhone-N (next slot)
      const idx = (parent?.students.length ?? studentCount) + 1;
      const studentPhone = `${parentPhone}-${idx}`;
      const newStudent: StudentUser = {
        type: 'student',
        username: name.trim(),
        phone: studentPhone,
        pin,
        educationLevel: level,
        parentPhone,
        avatar,
        xp: 0, level: 1, streak: 0, points: 0,
      };
      addStudentToParent(parentPhone, newStudent);
    }
    onClose();
  };

  return (
    <div className="pr-modal-backdrop" onClick={onClose}>
      <div className="pr-modal" onClick={e => e.stopPropagation()}>
        <div className="pr-modal-header">
          <h3>{isEdit ? '✏️ Edit Student' : '➕ Add Student'}</h3>
          <button className="pr-modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {error && <div className="pr-error"><Shield size={14} />{error}</div>}

        {/* Avatar */}
        <div className="pr-form-group">
          <label className="pr-label">Avatar</label>
          <div className="pr-avatar-grid-sm">
            {AVATARS.map(a => (
              <button
                key={a}
                className={`pr-avatar-opt ${avatar === a ? 'selected' : ''}`}
                onClick={() => setAvatar(a)}
              >{a}</button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="pr-form-group">
          <label className="pr-label">Student Name</label>
          <input
            className="pr-input"
            placeholder="e.g. Brian Otieno"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
          />
        </div>

        {/* Level */}
        <div className="pr-form-group">
          <label className="pr-label">Education Level</label>
          <div className="pr-level-grid">
            {LEVEL_OPTIONS.map(opt => (
              <button
                key={opt.id}
                className={`pr-level-card ${level === opt.id ? 'selected' : ''}`}
                style={level === opt.id ? { borderColor: opt.color, background: `${opt.color}12` } : {}}
                onClick={() => setLevel(opt.id)}
              >
                <span>{opt.emoji}</span>
                <div>
                  <span className="pr-level-name">{opt.label}</span>
                  <span className="pr-level-grades">{opt.grades}</span>
                </div>
                {level === opt.id && <CheckCircle size={16} color={opt.color} style={{ marginLeft: 'auto' }} />}
              </button>
            ))}
          </div>
        </div>

        {/* PIN */}
        <PinInput
          value={pin}
          onChange={v => { setPin(v); setError(''); }}
          hasError={!!error && pin.length < 4}
          label="🔐 Student PIN (4 digits)"
        />
        <p className="pr-hint" style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
          The student will use this PIN to log in
        </p>

        <div className="pr-modal-actions">
          <button className="pr-save-btn" onClick={handleSave}>
            <CheckCircle size={16} />
            {isEdit ? 'Save Changes' : 'Add Student'}
          </button>
          <button className="pr-cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

/* ─── Parent Profile ─────────────────────────────────────── */
const ParentProfile: React.FC = () => {
  const { user, updateUser, removeStudentFromParent } = useStore();
  const parent = user?.type === 'parent' ? user : null;
  if (!parent) return null;

  const [tab,        setTab]        = useState<'students' | 'account'>('students');
  const [showModal,  setShowModal]  = useState(false);
  const [editTarget, setEditTarget] = useState<StudentUser | undefined>(undefined);
  const [editName,   setEditName]   = useState(parent.username);
  const [saveMsg,    setSaveMsg]    = useState('');
  const [error,      setError]      = useState('');

  const openAdd  = ()  => { setEditTarget(undefined); setShowModal(true); };
  const openEdit = (s: StudentUser) => { setEditTarget(s); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditTarget(undefined); };

  const handleSaveAccount = () => {
    setError('');
    if (!editName.trim()) { setError('Name cannot be empty'); return; }
    updateUser({ username: editName.trim() });
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  return (
    <div className="pr-root">
      {/* Hero */}
      <div className="pr-hero">
        <div className="pr-hero-bg" />
        <div className="pr-hero-inner">
          <div className="pr-avatar">{parent.avatar || '👩'}</div>
          <div className="pr-hero-info">
            <h1 className="pr-name">{parent.username}</h1>
            <div className="pr-hero-chips">
              <span className="pr-chip">👨‍👩‍👧 Parent Account</span>
              <span className="pr-chip">
                <Users size={13} />
                {parent.students.length} student{parent.students.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="pr-tabs">
          {[
            { id: 'students', label: 'My Students', icon: Users },
            { id: 'account',  label: 'Account',     icon: Settings },
          ].map(t => (
            <button
              key={t.id}
              className={`pr-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id as typeof tab)}
            >
              <t.icon size={15} />{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pr-content">

        {/* ── Students tab ──────────────────────────────────── */}
        {tab === 'students' && (
          <>
            <div className="pr-students-header">
              <div>
                <h3>Student Accounts</h3>
                <p>Manage your children's learning profiles</p>
              </div>
              <button className="pr-add-student-btn" onClick={openAdd}>
                <Plus size={16} /> Add Student
              </button>
            </div>

            {parent.students.length === 0 ? (
              <div className="pr-empty-students">
                <span className="pr-empty-emoji">👨‍👩‍👧‍👦</span>
                <h4>No students yet</h4>
                <p>Add your child's account to track their learning progress.</p>
                <button className="pr-add-student-btn" onClick={openAdd}>
                  <Plus size={16} /> Add First Student
                </button>
              </div>
            ) : (
              <div className="pr-student-cards">
                {parent.students.map((student, i) => {
                  const lvl = LEVEL_OPTIONS.find(l => l.id === student.educationLevel)!;
                  return (
                    <div key={student.phone} className="pr-student-card">
                      <div className="pr-sc-left">
                        <div className="pr-sc-avatar" style={{ background: `${lvl.color}20` }}>
                          {student.avatar}
                        </div>
                        <div className="pr-sc-info">
                          <span className="pr-sc-name">{student.username}</span>
                          <span className="pr-sc-level" style={{ color: lvl.color }}>
                            {lvl.emoji} {lvl.label} · {lvl.grades}
                          </span>
                          <span className="pr-sc-phone">
                            Login: <code>{student.phone}</code>
                          </span>
                        </div>
                      </div>
                      <div className="pr-sc-stats">
                        <div className="pr-sc-stat">
                          <Zap size={13} color="#a855f7" />
                          <span>{student.xp} XP</span>
                        </div>
                        <div className="pr-sc-stat">
                          <Flame size={13} color="#f97316" />
                          <span>{student.streak}d</span>
                        </div>
                      </div>
                      <div className="pr-sc-actions">
                        <button
                          className="pr-sc-btn pr-sc-btn-edit"
                          onClick={() => openEdit(student)}
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="pr-sc-btn pr-sc-btn-delete"
                          onClick={() => {
                            if (confirm(`Remove ${student.username}?`))
                              removeStudentFromParent(parent.phone, student.phone);
                          }}
                          title="Remove"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pr-login-hint">
              <BookOpen size={15} color="#7c3aed" />
              <span>
                Students log in on the <strong>Student</strong> tab using their phone number
                (e.g. <code>{parent.phone}-1</code>) and their PIN.
              </span>
            </div>
          </>
        )}

        {/* ── Account tab ───────────────────────────────────── */}
        {tab === 'account' && (
          <div className="pr-card">
            <h3><User size={17} /> Edit Profile</h3>

            {error   && <div className="pr-error"><Shield size={14} />{error}</div>}
            {saveMsg && <div className="pr-success"><CheckCircle size={14} />{saveMsg}</div>}

            <div className="pr-form-group">
              <label className="pr-label">Display Name</label>
              <input
                className="pr-input"
                value={editName}
                onChange={e => setEditName(e.target.value)}
              />
            </div>

            <div className="pr-form-group">
              <label className="pr-label">Phone Number</label>
              <input className="pr-input" value={parent.phone} disabled style={{ opacity: 0.6 }} />
              <span className="pr-hint">Phone cannot be changed</span>
            </div>

            <button className="pr-save-btn" onClick={handleSaveAccount}>
              <CheckCircle size={16} /> Save Changes
            </button>

            <div className="pr-danger-zone">
              <h4>⚠️ Danger Zone</h4>
              <p>Deleting your account also removes all student accounts under it.</p>
              <button className="pr-delete-btn">Delete Account</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <StudentModal
          parentPhone={parent.phone}
          existingStudent={editTarget}
          studentCount={parent.students.length}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

/* ─── Student Profile ────────────────────────────────────── */
const StudentProfile_Inner: React.FC = () => {
  const { user, updateUser } = useStore();
  const student = user?.type === 'student' ? user : null;
  if (!student) return null;

  const [tab,        setTab]        = useState<'analytics'|'achievements'|'account'>('analytics');
  const [editName,   setEditName]   = useState(student.username);
  const [saveMsg,    setSaveMsg]    = useState('');
  const [error,      setError]      = useState('');

  const xpInLevel  = student.xp % 1000;
  const xpPercent  = (xpInLevel / 1000) * 100;
  const earnedAch  = ACHIEVEMENTS.filter(a => a.earned).length;

  const handleSave = () => {
    setError('');
    if (!editName.trim()) { setError('Name cannot be empty'); return; }
    updateUser({ username: editName.trim() });
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  return (
    <div className="pr-root">
      {/* Hero */}
      <div className="pr-hero">
        <div className="pr-hero-bg" />
        <div className="pr-hero-inner">
          <div className="pr-avatar">{student.avatar || '🧒'}</div>
          <div className="pr-hero-info">
            <h1 className="pr-name">{student.username}</h1>
            <div className="pr-hero-chips">
              <span className="pr-chip">🎓 Level {student.level}</span>
              <span className="pr-chip pr-chip-streak">
                <Flame size={13} color="#f97316" fill="#f97316" />
                {student.streak} day streak
              </span>
              <span className="pr-chip">
                <Star size={13} color="#fbbf24" fill="#fbbf24" />
                {student.points.toLocaleString()} pts
              </span>
            </div>
            <div className="pr-xp-wrap">
              <div className="pr-xp-label">
                <Zap size={13} />
                <span>{xpInLevel} / 1000 XP to Level {student.level + 1}</span>
              </div>
              <div className="pr-xp-track">
                <div className="pr-xp-fill" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="pr-tabs">
          {[
            { id: 'analytics',    label: 'Analytics',   icon: BarChart3 },
            { id: 'achievements', label: 'Badges',       icon: Trophy },
            { id: 'account',      label: 'Account',      icon: Settings },
          ].map(t => (
            <button
              key={t.id}
              className={`pr-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id as typeof tab)}
            >
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
                { icon: <Zap    size={20} color="#a855f7"/>, bg:'#f5f3ff', val:`${student.xp} XP`,                    lbl:'Total XP'     },
                { icon: <Flame  size={20} color="#f97316"/>, bg:'#fff7ed', val:`${student.streak}`,                    lbl:'Day Streak'   },
                { icon: <Star   size={20} color="#f59e0b"/>, bg:'#fffbeb', val:`${student.points.toLocaleString()}`,   lbl:'Points'       },
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
              <input className="pr-input" value={student.phone} disabled style={{ opacity: 0.6 }} />
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

/* ─── Root export ────────────────────────────────────────── */
const StudentProfile: React.FC = () => {
  const { isLoggedIn, user } = useStore();
  const navigate = useNavigate();

  if (!isLoggedIn || !user) {
    return (
      <div className="pr-guest">
        <Shield size={48} color="#a855f7" />
        <h2>Sign in to view your profile</h2>
        <button onClick={() => navigate('/')} className="pr-guest-btn">Go Home</button>
      </div>
    );
  }

  return user.type === 'parent' ? <ParentProfile /> : <StudentProfile_Inner />;
};

export default StudentProfile;

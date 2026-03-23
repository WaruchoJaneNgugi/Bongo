import React from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calculator, Mic, FlaskConical, Globe, History, ChevronRight, Star, Flame, Brain, BookMarked, GraduationCap } from 'lucide-react';
import '../../styles/level.css';

const subjects = [
  { id: 'math',      name: 'Mathematics', icon: Calculator,   color: '#10b981', progress: 55 },
  { id: 'english',   name: 'English',     icon: BookOpen,     color: '#3b82f6', progress: 60 },
  { id: 'kiswahili', name: 'Kiswahili',   icon: Mic,          color: '#8b5cf6', progress: 45 },
  { id: 'biology',   name: 'Biology',     icon: FlaskConical, color: '#f59e0b', progress: 30 },
  { id: 'chemistry', name: 'Chemistry',   icon: FlaskConical, color: '#ec4899', progress: 25 },
  { id: 'physics',   name: 'Physics',     icon: Brain,        color: '#ef4444', progress: 20 },
  { id: 'history',   name: 'History',     icon: History,      color: '#14b8a6', progress: 35 },
  { id: 'geography', name: 'Geography',   icon: Globe,        color: '#f97316', progress: 40 },
];

const recentPerf = [
  { name: 'Mathematics', score: '85%' },
  { name: 'English',     score: '78%' },
  { name: 'Kiswahili',   score: '82%' },
  { name: 'Biology',     score: '71%' },
];

const SeniorSchoolDashboard: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const student = user?.type === 'student' ? user : null;

  return (
    <div className="lvl-root">
      <div className="lvl-welcome">
        <div className="lvl-welcome-top">
          <div className="lvl-avatar">{student?.avatar || '🎓'}</div>
          <div className="lvl-welcome-info">
            <h1>Welcome back, {student?.username || 'Student'}! 👋</h1>
            <span className="lvl-level-badge">🎓 Senior School · Grade 10–12</span>
          </div>
        </div>
        <div className="lvl-stats-row">
          {[
            { icon: <Star size={18} color="#fbbf24" />,           val: student?.points?.toLocaleString() ?? '0', lbl: 'Points' },
            { icon: <Flame size={18} color="#f97316" />,           val: `${student?.streak ?? 0} days`, lbl: 'Streak' },
            { icon: <GraduationCap size={18} color="#fbbf24" />,   val: `Lv ${student?.level ?? 1}`, lbl: 'Level' },
          ].map(s => (
            <div key={s.lbl} className="lvl-stat-chip">
              <div className="lvl-stat-chip-icon">{s.icon}</div>
              <div><div className="lvl-stat-val">{s.val}</div><div className="lvl-stat-lbl">{s.lbl}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* KCSE countdown */}
      <div className="lvl-section">
        <div className="lvl-countdown">
          <BookMarked size={24} color="#8b5cf6" />
          <div>
            <div className="lvl-countdown-label">Days until KCSE</div>
            <div className="lvl-countdown-val">156 days</div>
          </div>
        </div>
      </div>

      <div className="lvl-section">
        <div className="lvl-section-header">
          <h2>Your Subjects</h2>
          <button className="lvl-see-all" onClick={() => navigate('/games')}>Play games <ChevronRight size={14}/></button>
        </div>
        <p className="lvl-section-sub">Track your progress across all subjects</p>
        <div className="lvl-subjects-grid">
          {subjects.map(({ id, name, icon: Icon, color, progress }) => (
            <div key={id} className="lvl-subject-card" onClick={() => navigate('/games')}>
              <div className="lvl-subject-card-top">
                <div className="lvl-subject-icon" style={{ background: `${color}20` }}>
                  <Icon size={28} color={color} />
                </div>
                <ChevronRight size={18} className="lvl-subject-arrow" />
              </div>
              <h3>{name}</h3>
              <div className="lvl-progress-bar">
                <div className="lvl-progress-fill" style={{ width: `${progress}%`, background: color }} />
              </div>
              <div className="lvl-progress-text">{progress}% complete</div>
              <button className="lvl-continue-btn" style={{ color }}>Continue Revision →</button>
            </div>
          ))}
        </div>
      </div>

      <div className="lvl-section">
        <h2 style={{ marginBottom: '1rem' }}>Recent Performance</h2>
        <div className="lvl-perf-grid">
          {recentPerf.map((p, i) => (
            <div key={i} className="lvl-perf-item">
              <span className="lvl-perf-name">{p.name}</span>
              <span className="lvl-perf-score">{p.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeniorSchoolDashboard;

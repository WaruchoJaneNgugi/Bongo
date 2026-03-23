import React from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calculator, Mic, FlaskConical, Globe, History, ChevronRight, Star, Flame, Trophy } from 'lucide-react';
import '../../styles/level.css';

const subjects = [
  { id: 'math',      name: 'Mathematics',    icon: Calculator,   color: '#10b981', progress: 65 },
  { id: 'english',   name: 'English',        icon: BookOpen,     color: '#3b82f6', progress: 70 },
  { id: 'kiswahili', name: 'Kiswahili',      icon: Mic,          color: '#8b5cf6', progress: 55 },
  { id: 'science',   name: 'Science',        icon: FlaskConical, color: '#f59e0b', progress: 40 },
  { id: 'social',    name: 'Social Studies', icon: Globe,        color: '#ec4899', progress: 35 },
  { id: 'history',   name: 'History',        icon: History,      color: '#ef4444', progress: 25 },
];

const topics = [
  { title: 'Algebra — Linear Equations',     subject: 'Mathematics', date: 'Tomorrow' },
  { title: 'Comprehension — The Lost Child', subject: 'English',     date: 'Wednesday' },
  { title: 'Ngeli za Kiswahili',             subject: 'Kiswahili',   date: 'Friday' },
];

const MiddleSchoolDashboard: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const student = user?.type === 'student' ? user : null;

  return (
    <div className="lvl-root">
      <div className="lvl-welcome">
        <div className="lvl-welcome-top">
          <div className="lvl-avatar">{student?.avatar || '🧠'}</div>
          <div className="lvl-welcome-info">
            <h1>Welcome back, {student?.username || 'Student'}! 👋</h1>
            <span className="lvl-level-badge">🧠 Middle School · Grade 4–9</span>
          </div>
        </div>
        <div className="lvl-stats-row">
          {[
            { icon: <Star size={18} color="#fbbf24" />,   val: student?.points?.toLocaleString() ?? '0', lbl: 'Points' },
            { icon: <Flame size={18} color="#f97316" />,  val: `${student?.streak ?? 0} days`, lbl: 'Streak' },
            { icon: <Trophy size={18} color="#fbbf24" />, val: `Lv ${student?.level ?? 1}`, lbl: 'Level' },
          ].map(s => (
            <div key={s.lbl} className="lvl-stat-chip">
              <div className="lvl-stat-chip-icon">{s.icon}</div>
              <div><div className="lvl-stat-val">{s.val}</div><div className="lvl-stat-lbl">{s.lbl}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div className="lvl-section">
        <div className="lvl-section-header">
          <h2>Your Subjects</h2>
          <button className="lvl-see-all" onClick={() => navigate('/games')}>Play games <ChevronRight size={14}/></button>
        </div>
        <p className="lvl-section-sub">Continue preparing for your exams</p>
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
              <button className="lvl-continue-btn" style={{ color }}>Continue Learning →</button>
            </div>
          ))}
        </div>
      </div>

      <div className="lvl-section">
        <h2 style={{ marginBottom: '1rem' }}>Upcoming Topics</h2>
        <div className="lvl-topics-list">
          {topics.map((t, i) => (
            <div key={i} className="lvl-topic-item">
              <div className="lvl-topic-info">
                <span className="lvl-topic-title">{t.title}</span>
                <span className="lvl-topic-subject">{t.subject}</span>
              </div>
              <span className="lvl-topic-date">{t.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiddleSchoolDashboard;

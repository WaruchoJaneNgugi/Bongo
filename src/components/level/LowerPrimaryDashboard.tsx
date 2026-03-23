import React from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calculator, Globe, Mic, Palette, Music, ChevronRight, Star, Flame, Trophy } from 'lucide-react';
import '../../styles/level.css';

const subjects = [
  { id: 'math',      name: 'Mathematics', icon: Calculator, color: '#10b981', progress: 75 },
  { id: 'english',   name: 'English',     icon: BookOpen,   color: '#3b82f6', progress: 60 },
  { id: 'kiswahili', name: 'Kiswahili',   icon: Mic,        color: '#8b5cf6', progress: 45 },
  { id: 'science',   name: 'Science',     icon: Globe,      color: '#f59e0b', progress: 30 },
  { id: 'art',       name: 'Art & Craft', icon: Palette,    color: '#ec4899', progress: 20 },
  { id: 'music',     name: 'Music',       icon: Music,      color: '#ef4444', progress: 15 },
];

const activities = [
  { title: 'Completed Counting Quiz',    time: '2 hours ago',  score: '10/10', color: '#10b981' },
  { title: 'Learned 5 new English words',time: 'Yesterday',    score: '5 words',color: '#3b82f6' },
  { title: 'Animals and Their Homes',    time: '2 days ago',   score: '8/10',  color: '#8b5cf6' },
];

const LowerPrimaryDashboard: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const student = user?.type === 'student' ? user : null;

  return (
    <div className="lvl-root">
      {/* Welcome */}
      <div className="lvl-welcome">
        <div className="lvl-welcome-top">
          <div className="lvl-avatar">{student?.avatar || '🧒'}</div>
          <div className="lvl-welcome-info">
            <h1>Welcome back, {student?.username || 'Student'}! 👋</h1>
            <span className="lvl-level-badge">🧒 Lower Primary · Grade 1–3</span>
          </div>
        </div>
        <div className="lvl-stats-row">
          {[
            { icon: <Star size={18} color="#fbbf24" />, val: student?.points?.toLocaleString() ?? '0', lbl: 'Points' },
            { icon: <Flame size={18} color="#f97316" />, val: `${student?.streak ?? 0} days`, lbl: 'Streak' },
            { icon: <Trophy size={18} color="#fbbf24" />, val: `Lv ${student?.level ?? 1}`, lbl: 'Level' },
          ].map(s => (
            <div key={s.lbl} className="lvl-stat-chip">
              <div className="lvl-stat-chip-icon">{s.icon}</div>
              <div>
                <div className="lvl-stat-val">{s.val}</div>
                <div className="lvl-stat-lbl">{s.lbl}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subjects */}
      <div className="lvl-section">
        <div className="lvl-section-header">
          <h2>Your Subjects</h2>
          <button className="lvl-see-all" onClick={() => navigate('/games')}>Play games <ChevronRight size={14}/></button>
        </div>
        <p className="lvl-section-sub">Continue learning where you left off</p>
        <div className="lvl-subjects-grid">
          {subjects.map(({ id, name, icon: Icon, color, progress }) => (
            <div key={id} className="lvl-subject-card" onClick={() => navigate(`/games`)}>
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

      {/* Activity */}
      <div className="lvl-section">
        <h2 style={{ marginBottom: '1rem' }}>Recent Activity</h2>
        <div className="lvl-activity-list">
          {activities.map((a, i) => (
            <div key={i} className="lvl-activity-item">
              <div className="lvl-activity-icon" style={{ background: `${a.color}18` }}>
                <BookOpen size={16} color={a.color} />
              </div>
              <div className="lvl-activity-details">
                <span className="lvl-activity-title">{a.title}</span>
                <span className="lvl-activity-time">{a.time}</span>
              </div>
              <span className="lvl-activity-score">{a.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LowerPrimaryDashboard;

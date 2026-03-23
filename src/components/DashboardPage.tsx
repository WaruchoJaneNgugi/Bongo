import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useStore } from '../store/useStore';
import { Clock, Target, Zap, CheckCircle, ArrowLeft, ChevronRight, BarChart3 } from 'lucide-react';
import '../styles/dashboard.css';

const SUBJECTS = [
  { id: 'math',     subject: 'Mathematics',    score: 85, progress: 75, color: '#10b981', emoji: '🧮', quizzes: 24, timeSpent: '8.5 hrs', lastActive: '2 hours ago' },
  { id: 'english',  subject: 'English',        score: 78, progress: 70, color: '#3b82f6', emoji: '📖', quizzes: 18, timeSpent: '6.2 hrs', lastActive: 'Yesterday' },
  { id: 'kiswahili',subject: 'Kiswahili',      score: 82, progress: 65, color: '#8b5cf6', emoji: '🗣️', quizzes: 15, timeSpent: '5.0 hrs', lastActive: '2 days ago' },
  { id: 'science',  subject: 'Science',        score: 71, progress: 60, color: '#f59e0b', emoji: '🔬', quizzes: 12, timeSpent: '4.3 hrs', lastActive: '3 days ago' },
  { id: 'social',   subject: 'Social Studies', score: 88, progress: 80, color: '#ec4899', emoji: '🌍', quizzes: 20, timeSpent: '7.0 hrs', lastActive: '1 day ago' },
  { id: 'cre',      subject: 'CRE',            score: 92, progress: 85, color: '#14b8a6', emoji: '✝️', quizzes: 16, timeSpent: '5.5 hrs', lastActive: '5 hours ago' },
];

const WEEK_BARS = [70, 85, 60, 95, 75, 80, 65];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const DashboardPage: React.FC = () => {
  // const { user } = useStore();
  const navigate = useNavigate();

  const avgScore  = Math.round(SUBJECTS.reduce((a, s) => a + s.score, 0) / SUBJECTS.length);
  const totalQ    = SUBJECTS.reduce((a, s) => a + s.quizzes, 0);

  return (
    <div className="db-root">
      {/* Header */}
      <div className="db-header">
        <button className="db-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <div>
          <h1>Your Dashboard</h1>
          <p>Track your progress across all subjects</p>
        </div>
      </div>

      {/* Overview stats */}
      <div className="db-stats-grid">
        {[
          { icon: Target,       color: '#a855f7', bg: '#f5f3ff', val: `${avgScore}%`, lbl: 'Avg Score' },
          { icon: CheckCircle,  color: '#10b981', bg: '#f0fdf4', val: totalQ,          lbl: 'Quizzes Taken' },
          { icon: Clock,        color: '#f59e0b', bg: '#fffbeb', val: '36.5 hrs',      lbl: 'Total Time' },
          { icon: Zap,          color: '#8b5cf6', bg: '#f5f3ff', val: '15 days',       lbl: 'Streak' },
        ].map(({ icon: Icon, color, bg, val, lbl }) => (
          <div key={lbl} className="db-stat-card">
            <div className="db-stat-icon" style={{ background: bg }}><Icon size={22} color={color} /></div>
            <div><span className="db-stat-val">{val}</span><span className="db-stat-lbl">{lbl}</span></div>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="db-chart-card">
        <div className="db-card-header">
          <h2><BarChart3 size={18} /> Weekly Performance</h2>
        </div>
        <div className="db-chart-bars">
          {WEEK_BARS.map((h, i) => (
            <div key={i} className="db-bar-col">
              <div className="db-bar" style={{ height: `${h}%` }} />
              <span>{DAYS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subjects */}
      <div className="db-subjects-header">
        <h2>Subject Breakdown</h2>
        <p>Detailed performance by subject</p>
      </div>
      <div className="db-subjects-grid">
        {SUBJECTS.map(s => (
          <div key={s.id} className="db-subject-card" onClick={() => navigate('/games')}>
            <div className="db-subject-top">
              <div className="db-subject-icon" style={{ background: `${s.color}18` }}>
                <span style={{ fontSize: '1.5rem' }}>{s.emoji}</span>
              </div>
              <div className="db-subject-title">
                <h3>{s.subject}</h3>
                <span className="db-subject-score" style={{ background: s.color }}>{s.score}%</span>
              </div>
            </div>

            <div className="db-subject-progress">
              <div className="db-progress-row">
                <span>Progress</span><span>{s.progress}%</span>
              </div>
              <div className="db-progress-track">
                <div className="db-progress-fill" style={{ width: `${s.progress}%`, background: s.color }} />
              </div>
            </div>

            <div className="db-subject-metrics">
              {[['Quizzes', s.quizzes], ['Time', s.timeSpent], ['Last Active', s.lastActive]].map(([k, v]) => (
                <div key={k as string} className="db-metric">
                  <span className="db-metric-lbl">{k}</span>
                  <span className="db-metric-val">{v}</span>
                </div>
              ))}
            </div>

            <button className="db-view-btn" style={{ color: s.color }}>
              View Details <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="db-recs-header"><h2>Recommended for You</h2></div>
      <div className="db-recs-grid">
        {[
          { emoji: '🧮', name: 'Algebra Fundamentals',  sub: 'Mathematics · 5 quizzes', color: '#10b981' },
          { emoji: '📖', name: 'Reading Comprehension', sub: 'English · 3 quizzes',     color: '#3b82f6' },
          { emoji: '🗣️', name: 'Ngeli za Kiswahili',     sub: 'Kiswahili · 4 quizzes',  color: '#8b5cf6' },
        ].map(r => (
          <div key={r.name} className="db-rec-card" onClick={() => navigate('/games')}>
            <div className="db-rec-icon" style={{ background: `${r.color}18` }}>
              <span style={{ fontSize: '1.5rem' }}>{r.emoji}</span>
            </div>
            <div className="db-rec-info">
              <h4>{r.name}</h4>
              <p>{r.sub}</p>
            </div>
            <button className="db-rec-btn" style={{ background: r.color }}>Start</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;

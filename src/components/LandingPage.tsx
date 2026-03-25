// LandingPage.tsx
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore'
// import heroImg from '../assets/hero-bg.png';
import LowerPrimary from '../assets/banners/LowerPrimaryb.png';
import MiddleSchool from '../assets/banners/middle-school.png';
import SeniorSchool from '../assets/banners/seniorschool.png';
import {
  ChevronLeft, ChevronRight, ArrowRight, BarChart3, Clock, Users, Star, Shield, Flame, TrendingUp, Target
} from 'lucide-react';
// import LowerPrimary from '../assets/lower-primary.jpg?url';   // adjust path as needed
// import MiddleSchool from '../assets/middle-school.jpg?url';
// import SeniorSchool from '../assets/senior-school.jpg?url';

import Footer from './Footer';
import '../styles/landing.css';
import '../styles/exambrowser.css';
import '../styles/landing-loggedin.css';
import {ExamBrowser} from "./ExamBrowser.tsx";
// import { useExamStore} from "../store/useExamStore.ts";
// const CONTINUE_CARDS = [
//   { id: 1, subject: 'Math',           progress: 65, color: '#7C3AED', emoji: '🧮', isNew: false },
//   { id: 2, subject: 'CRE',            progress: 40, color: '#EA580C', emoji: '✝️',  isNew: false },
//   { id: 3, subject: 'Science',        progress: 20, color: '#059669', emoji: '🔬', isNew: true  },
//   { id: 4, subject: 'Kiswahili',      progress: 35, color: '#D97706', emoji: '🗣️', isNew: true  },
//   { id: 5, subject: 'Social Studies', progress: 50, color: '#7C3AED', emoji: '🌍', isNew: true  },
// ];
// const STREAK = 5;
// const LEVEL  = 3;
// const POINTS = 1200;
// const LAST_QUIZ = { name: 'Science Quiz', progress: 65 };
//
// const RECOMMENDED = [
//   { id: 1, subject: 'Geography',         level: 2, xp: 650, pts: 400, emoji: '🌍', color: '#0891B2' },
//   { id: 2, subject: 'Grammar Challenge',  level: 3, xp: 800, pts: 500, emoji: '📝', color: '#D97706' },
// ];

/* ─── Level config (for ExamBrowser) ───────────────────── */
// const LEVEL_CONFIG = {
//   lower_primary: {
//     label: 'Lower Primary', grades: 'Grade 1–3', emoji: '🧒',
//     color: '#10b981', bg: 'linear-gradient(135deg,#065f46,#10b981)',
//     route: '/level/lower-primary',
//     subjects: ['Mathematics','English','Kiswahili','Science','Art & Craft','Music'],
//     subjectEmojis: ['🧮','📖','🗣️','🌿','🎨','🎵'],
//   },
//   middle_school: {
//     label: 'Middle School', grades: 'Grade 4–9', emoji: '🧠',
//     color: '#3b82f6', bg: 'linear-gradient(135deg,#1e3a8a,#3b82f6)',
//     route: '/level/middle-school',
//     subjects: ['Mathematics','English','Kiswahili','Science','Social Studies','History'],
//     subjectEmojis: ['🧮','📖','🗣️','🔬','🌍','🏛️'],
//   },
//   senior_school: {
//     label: 'Senior School', grades: 'Grade 10–12', emoji: '🎓',
//     color: '#a855f7', bg: 'linear-gradient(135deg,#4c1d95,#a855f7)',
//     route: '/level/senior-school',
//     subjects: ['Mathematics','English','Biology','Chemistry','Physics','History'],
//     subjectEmojis: ['🧮','📖','🧬','🧪','⚡','🏛️'],
//   },
// };

const FEATURES = [
  { icon: Shield,     title: 'CBC Aligned',       desc: 'Every question follows the official Kenyan CBC curriculum.',    color: '#a855f7' },
  { icon: BarChart3,  title: 'Track Progress',     desc: 'Detailed analytics show exactly where you excel.',              color: '#3b82f6' },
  { icon: Flame,      title: 'Gamified Learning',  desc: 'Earn XP, level up, climb the leaderboard — revision is fun.',  color: '#ef4444' },
  { icon: Clock,      title: 'Mock Exams',         desc: 'Real exam conditions with timers. Build speed and confidence.', color: '#f59e0b' },
  { icon: TrendingUp, title: 'Smart Insights',     desc: 'See your week-on-week improvement across every subject.',       color: '#10b981' },
  { icon: Users,      title: '50,000+ Students',   desc: 'Join Kenya\'s fastest-growing CBC revision community.',         color: '#0891b2' },
];

const SLIDES = [
  {
    id: 'lower', img: LowerPrimary, grade: 'Grade 1–3', tag: '🧒 Lower Primary',
    // bg: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 60%, #c084fc 100%)',
  },
  {
    id: 'middle', img: MiddleSchool, grade: 'Grade 4–9', tag: '🧠 Middle School',
    // bg: 'linear-gradient(135deg, #0891b2 0%, #0284c7 60%, #38bdf8 100%)',
  },
  {
    id: 'senior', img: SeniorSchool, grade: 'Grade 10–12', tag: '🎓 Senior School',
    // bg: 'linear-gradient(135deg, #dc2626 0%, #ea580c 60%, #fb923c 100%)',
  },
];
//
// const GRADE_SECTIONS: { id: string,label: string; emoji: string }[] = [
//   { id: 'grade1-3',   label: 'Grade 1–3',   emoji: '🧒' },
//   { id: 'grade4-6',   label: 'Grade 4–6',   emoji: '📗' },
//   { id: 'grade7-9',   label: 'Grade 7–9',   emoji: '🧠' },
//   { id: 'grade10-12', label: 'Grade 10–12', emoji: '🎓' },
// ];

// const GradeRow: React.FC<{
//   section: typeof GRADE_SECTIONS[number];
//   onCardClick: () => void;
// }> = ({ section, onCardClick }) => {
//   const { exams } = useExamStore();
//   const [expanded, setExpanded] = useState(false);
//   const rowRef = useRef<HTMLDivElement>(null);
//   const { setOverlay } = useStore();
//
//   const gradeExams = exams.filter(e => e.grade === section.id);
//   const PREVIEW_COUNT = 8;
//   const visible = expanded ? gradeExams : gradeExams.slice(0, PREVIEW_COUNT);
//
//   return (
//       <div className="eb-row-section">
//         <div className="eb-row-header">
//           <h3 className="eb-row-title">
//             <span className="eb-row-emoji">{section.emoji}</span>
//             {section.label}
//             <span className="eb-row-count">{gradeExams.length}</span>
//           </h3>
//           <button
//               className="eb-show-all-btn"
//               onClick={() => setOverlay("signup")}
//           >
//             {expanded ? 'Show less' : 'Show all'}
//           </button>
//         </div>
//
//         <div className="eb-card-track-wrap">
//           <div
//               className={`eb-card-track ${expanded ? 'eb-card-track--expanded' : ''}`}
//               ref={rowRef}
//           >
//             {visible.map(exam => (
//                 <div
//                     key={exam.id}
//                     className="exam-card game-card"
//                     onClick={onCardClick}
//                     role="button"
//                     tabIndex={0}
//                     onKeyDown={e => e.key === 'Enter' && onCardClick()}
//                 >
//                   <div className="exam-card-inner">
//                     <img
//                         className="exam-image"
//                         src={exam.img}
//                         alt={exam.title}
//                     />
//                     <div className="exam-overlay">
//                       <div className="overlay-content">
//                         <span className="exam-title">{exam.title}</span>
//                         <button className="cta-button try-button">
//                           Try Test
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//             ))}
//           </div>
//         </div>
//       </div>
//   );
// };
// /* ─── Exam Browser Component ─────────────────────────────── */
// const ExamBrowser: React.FC = () => {
//   const { setOverlay } = useStore();
//
//   // const navigate = useNavigate();
//   // const allSubjects = [
//   //   ...LEVEL_CONFIG.lower_primary.subjects.map((s, i) => ({
//   //     name: s,
//   //     emoji: LEVEL_CONFIG.lower_primary.subjectEmojis[i],
//   //     level: 'lower_primary'
//   //   })),
//   //   ...LEVEL_CONFIG.middle_school.subjects.map((s, i) => ({
//   //     name: s,
//   //     emoji: LEVEL_CONFIG.middle_school.subjectEmojis[i],
//   //     level: 'middle_school'
//   //   })),
//   //   ...LEVEL_CONFIG.senior_school.subjects.map((s, i) => ({
//   //     name: s,
//   //     emoji: LEVEL_CONFIG.senior_school.subjectEmojis[i],
//   //     level: 'senior_school'
//   //   })),
//   // ].slice(0, 12); // show top 12 for demo
//
//   return (
//       <section className="gh-exam-browser">
//         <div className="gh-section-header">
//           <span className="gh-section-badge">📚 Browse Exams</span>
//           <h2 className="gh-section-title">Choose your <span className="gh-text-gradient">subject</span></h2>
//           <p className="gh-section-sub">Pick a topic and start practicing with our interactive quizzes.</p>
//         </div>
//         {GRADE_SECTIONS.map(section => (
//             <GradeRow
//                 key={section.id}
//                 section={section}
//                 onCardClick={() => setOverlay('signup')}
//             />
//         ))}
//         {/*<div className="gh-subject-grid">*/}
//         {/*  {allSubjects.map((sub) => (*/}
//         {/*      <button*/}
//         {/*          key={sub.name}*/}
//         {/*          className="gh-subject-card"*/}
//         {/*          onClick={() => setOverlay('signup')}*/}
//         {/*      >*/}
//         {/*        <span className="gh-subject-emoji">{sub.emoji}</span>*/}
//         {/*        <span className="gh-subject-name">{sub.name}</span>*/}
//         {/*      </button>*/}
//         {/*  ))}*/}
//         {/*</div>*/}
//         {/*<div className="gh-exam-footer">*/}
//         {/*  <button className="gh-view-all-btn" onClick={() => setOverlay('signup')}>*/}
//         {/*    View All Subjects <ArrowRight size={16} />*/}
//         {/*  </button>*/}
//         {/*</div>*/}
//       </section>
//   );
// };


const GuestHero: React.FC = () => {
  const [slideIdx, setSlideIdx] = useState(0);
  const slide = SLIDES[slideIdx];
  const { setOverlay } = useStore();

  const goSlide = (idx: number) => setSlideIdx(idx);

  return (
      <div className="gh-guest">
        {/* Slider Section */}
        <section className="gh-slider-full">
          <div className="gh-slider-bg-image">
            <img src={slide.img} alt={slide.grade} />
            {/*<div className="gh-slider-overlay" style={{ background: slide.bg }} />*/}
          </div>
          <div className="gh-slider-content">
            <div className="gh-slider-tag">{slide.tag}</div>
            {/*<h2 className="gh-slider-title">Master {slide.grade}<br />with BongoQuiz</h2>*/}
            <button
                className="gh-slider-cta"
                onClick={() => setOverlay('signup')}
            >
              Start Learning <ArrowRight size={18} />
            </button>
          </div>
          <button
              className="gh-arrow gh-arrow-left"
              onClick={() => goSlide((slideIdx - 1 + SLIDES.length) % SLIDES.length)}
          >
            <ChevronLeft size={28} />
          </button>
          <button
              className="gh-arrow gh-arrow-right"
              onClick={() => goSlide((slideIdx + 1) % SLIDES.length)}
          >
            <ChevronRight size={28} />
          </button>
          <div className="gh-dots">
            {SLIDES.map((_, i) => (
                <button
                    key={i}
                    className={`gh-dot ${i === slideIdx ? 'gh-dot-active' : ''}`}
                    onClick={() => goSlide(i)}
                    aria-label={`Slide ${i + 1}`}
                />
            ))}
          </div>
        </section>

        {/* Stats Strip */}
        <div className="gh-stats-strip">
          <div className="gh-stat-item">
            <span className="gh-stat-num">50K+</span>
            <span className="gh-stat-label">Students</span>
          </div>
          <div className="gh-stat-item">
            <span className="gh-stat-num">1,200+</span>
            <span className="gh-stat-label">Exams</span>
          </div>
          <div className="gh-stat-item">
            <span className="gh-stat-num">CBC</span>
            <span className="gh-stat-label">Aligned</span>
          </div>
          <div className="gh-stat-item">
            <span className="gh-stat-num">Free</span>
            <span className="gh-stat-label">To Join</span>
          </div>
        </div>

        {/* Exam Browser */}
        <ExamBrowser />

        {/* Features Section */}
        <section className="gh-features-section">
          <div className="gh-section-header">
            <span className="gh-section-badge">Why Choose Us</span>
            <h2 className="gh-section-title">
              Everything you need to <span className="gh-text-gradient">succeed</span>
            </h2>
            <p className="gh-section-sub">Built specifically for Kenyan CBC students, teachers, and parents.</p>
          </div>
          <div className="gh-features-grid">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="gh-feature-card">
                  <div className="gh-feature-icon" style={{ background: `${color}15`, color }}>
                    <Icon size={26} />
                  </div>
                  <h3 className="gh-feature-title">{title}</h3>
                  <p className="gh-feature-desc">{desc}</p>
                </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div className="gh-cta-banner">
          <div className="gh-cta-orb" />
          <h2>🏆 Ready to ace your exams?</h2>
          <p>Join 50,000+ students already using BongoQuiz.</p>
          <button className="gh-cta-btn" onClick={() => setOverlay('signup')}>
            🎮 Join Free Today
          </button>
        </div>
      </div>
  );
};

const LEVEL_CONFIG = {
  lower_primary: {
    label: 'Lower Primary', grades: 'Grade 1–3', emoji: '🧒',
    color: '#10b981', bg: 'linear-gradient(135deg,#065f46,#10b981)',
    route: '/level/lower-primary',
    subjects: ['Mathematics','English','Kiswahili','Science','Art & Craft','Music'],
    subjectEmojis: ['🧮','📖','🗣️','🌿','🎨','🎵'],
  },
  middle_school: {
    label: 'Middle School', grades: 'Grade 4–9', emoji: '🧠',
    color: '#3b82f6', bg: 'linear-gradient(135deg,#1e3a8a,#3b82f6)',
    route: '/level/middle-school',
    subjects: ['Mathematics','English','Kiswahili','Science','Social Studies','History'],
    subjectEmojis: ['🧮','📖','🗣️','🔬','🌍','🏛️'],
  },
  senior_school: {
    label: 'Senior School', grades: 'Grade 10–12', emoji: '🎓',
    color: '#a855f7', bg: 'linear-gradient(135deg,#4c1d95,#a855f7)',
    route: '/level/senior-school',
    subjects: ['Mathematics','English','Biology','Chemistry','Physics','History'],
    subjectEmojis: ['🧮','📖','🧬','🧪','⚡','🏛️'],
  },
};
/* ── LoggedInHero (Refined Professional Design) ── */
const LoggedInHero: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();

  if (!user) return null;

  // Parent view with clear student names
  if (user.type === 'parent') {
    return (
        <div className="lp-parent-dashboard">
          <div className="lp-parent-welcome">
            <div className="lp-parent-avatar">{user.avatar || '👩‍👧‍👦'}</div>
            <div className="lp-parent-info">
              <h1>Welcome back, {user.username}</h1>
              <p>{user.students.length} child{user.students.length !== 1 ? 'ren' : ''} learning</p>
            </div>
          </div>

          {user.students.length === 0 ? (
              <div className="lp-empty-state">
                <div className="lp-empty-icon">📚</div>
                <h3>Add your first child</h3>
                <p>Track progress, set goals, and celebrate achievements.</p>
                <button className="lp-btn-primary lp-btn-add" onClick={() => navigate('/profile')}>
                  + Add Student
                </button>
              </div>
          ) : (
              <>
                <div className="lp-section-header">
                  <h2>Your children</h2>
                  <button className="lp-text-link" onClick={() => navigate('/profile')}>Manage</button>
                </div>
                <div className="lp-student-list">
                  {user.students.map((student, i) => {
                    const level = LEVEL_CONFIG[student.educationLevel];
                    const xpPercent = ((student.xp % 1000) / 1000) * 100;
                    return (
                        <div
                            key={i}
                            className="lp-student-item"
                            onClick={() => navigate(level.route)}
                        >
                          <div className="lp-student-avatar">{student.avatar || '🧒'}</div>
                          <div className="lp-student-details">
                            <div className="lp-student-name">{student.username}</div>
                            <div className="lp-student-meta">
                              <span className="lp-student-level">{level.emoji} {level.label}</span>
                              <span className="lp-student-xp">{student.xp % 1000}/1000 XP</span>
                            </div>
                            <div className="lp-student-progress">
                              <div className="lp-progress-bar">
                                <div className="lp-progress-fill" style={{ width: `${xpPercent}%` }}></div>
                              </div>
                            </div>
                          </div>
                          <ChevronRight size={20} className="lp-student-arrow" />
                        </div>
                    );
                  })}
                </div>
              </>
          )}
        </div>
    );
  }

  // Student view
  const level = LEVEL_CONFIG[user.educationLevel];
  const xpInLevel = user.xp % 1000;
  const xpPercent = (xpInLevel / 1000) * 100;

  return (
      <div className="lp-student-dashboard">
        {/* Header */}
        <div className="lp-student-header" style={{ background: level.bg }}>
          <div className="lp-student-header-content">
            <div className="lp-student-avatar-large">{user.avatar || '🧒'}</div>
            <div className="lp-student-header-info">
              <h1>{user.username}</h1>
              <div className="lp-student-badges">
                <span className="lp-badge">{level.emoji} {level.label}</span>
                <span className="lp-badge lp-streak-badge">
                <Flame size={12} /> {user.streak} day streak
              </span>
                <span className="lp-badge">Level {user.level}</span>
              </div>
            </div>
            <div className="lp-student-points">
              <Star size={18} /> {user.points.toLocaleString()} pts
            </div>
          </div>
          <div className="lp-xp-section">
            <div className="lp-xp-label">{xpInLevel} / 1000 XP to level {user.level + 1}</div>
            <div className="lp-xp-bar">
              <div className="lp-xp-fill" style={{ width: `${xpPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lp-stats-grid">
          <div className="lp-stat-card">
            <Target size={20} className="lp-stat-icon" />
            <div className="lp-stat-value">3/5</div>
            <div className="lp-stat-label">Today's goal</div>
          </div>
          <div className="lp-stat-card">
            <BarChart3 size={20} className="lp-stat-icon" />
            <div className="lp-stat-value">78%</div>
            <div className="lp-stat-label">Avg score</div>
          </div>
          <div className="lp-stat-card">
            <Clock size={20} className="lp-stat-icon" />
            <div className="lp-stat-value">2h 15m</div>
            <div className="lp-stat-label">Study time</div>
          </div>
        </div>

        {/* Subjects */}
        <div className="lp-section-header">
          <h2>Your subjects</h2>
          <button className="lp-text-link" onClick={() => navigate(level.route)}>See all</button>
        </div>
        <div className="lp-subjects-grid">
          {level.subjects.map((sub, i) => (
              <button
                  key={sub}
                  className="lp-subject-card"
                  onClick={() => navigate(level.route)}
              >
                <span className="lp-subject-emoji">{level.subjectEmojis[i]}</span>
                <span className="lp-subject-name">{sub}</span>
              </button>
          ))}
        </div>

        {/* Continue Learning */}
        <div className="lp-section-header">
          <h2>Continue learning</h2>
          <button className="lp-text-link" onClick={() => navigate(level.route)}>View all</button>
        </div>
        <div className="lp-continue-list">
          {[
            { subject: 'Mathematics', progress: 65, emoji: '🧮' },
            { subject: 'Science', progress: 40, emoji: '🔬' },
            { subject: 'Kiswahili', progress: 80, emoji: '🗣️' },
          ].map((quiz) => (
              <div key={quiz.subject} className="lp-continue-item" onClick={() => navigate(level.route)}>
                <div className="lp-continue-emoji">{quiz.emoji}</div>
                <div className="lp-continue-details">
                  <div className="lp-continue-name">{quiz.subject}</div>
                  <div className="lp-continue-progress">
                    <div className="lp-progress-bar">
                      <div className="lp-progress-fill" style={{ width: `${quiz.progress}%` }}></div>
                    </div>
                    <span>{quiz.progress}%</span>
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Full Dashboard Button */}
        <button className="lp-dashboard-btn" onClick={() => navigate('/dashboard')}>
          <BarChart3 size={20} />
          Go to full dashboard
          <ChevronRight size={18} />
        </button>
      </div>
  );
};


const LandingPage: React.FC = () => {
  const { isLoggedIn } = useStore();
  return (
      <main>
        {isLoggedIn ? <LoggedInHero /> : <GuestHero />}
        <Footer />
      </main>
  );
};

export default LandingPage;
import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import heroImg from '/hero.jpg';
import "../styles/hero-loggedin.css"

const levelLabel: Record<string, string> = {
  lower_primary: 'Lower Primary',
  middle_school: 'Middle School',
  senior_school: 'Senior School',
};

const levelGrade: Record<string, string> = {
  lower_primary: 'Grade 1 – 3',
  middle_school: 'Grade 4 – 9',
  senior_school: 'Grade 10 – 12',
};

const MOTIVATIONAL_QUOTES = [
  'Every question you answer makes you stronger. Keep going!',
  'Great students aren\'t born — they\'re made through practice!',
  'One quiz at a time, you\'re building a brilliant future.',
  'Champions revise. You\'re already a champion!',
  'Progress, not perfection. You\'ve got this! 🇰🇪',
];

const LoggedInHero: React.FC = () => {
  const { setOverlay, user, results } = useStore();

  const quote = useMemo(() => {
    const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[idx];
  }, []);

  const totalQuizzes = results.length;
  const avgScore =
    results.length > 0
      ? Math.round(
          (results.reduce((acc, r) => acc + r.score / r.total, 0) /
            results.length) *
            100
        )
      : null;

  const level = user?.educationLevel ?? '';

  return (
    <section className="hero hero--loggedin">
      <div className="hero-left">
        {/* Greeting */}
        <div className="hero-greeting-badge">
          👋 Welcome back
        </div>
        <h1 className="hero-title hero-title--user">
          Hey, {user?.username}!<br />
          <span className="hero-title-accent">Ready to revise?</span>
        </h1>

        {/* Level pill */}
        <div className="hero-level-row">
          <span className="hero-level-pill">
            🎓 {levelLabel[level]} &nbsp;·&nbsp; {levelGrade[level]}
          </span>
        </div>

        {/* Motivational quote */}
        <p className="hero-quote">"{quote}"</p>

        {/* Mini stats (only if they have history) */}
        {totalQuizzes > 0 && (
          <div className="hero-stats-row">
            <div className="hero-stat-chip">
              <span className="hero-stat-num">{totalQuizzes}</span>
              <span className="hero-stat-label">Quizzes Done</span>
            </div>
            {avgScore !== null && (
              <div className="hero-stat-chip">
                <span
                  className="hero-stat-num"
                  style={{
                    color:
                      avgScore >= 70
                        ? '#16A34A'
                        : avgScore >= 50
                        ? '#D97706'
                        : '#DC2626',
                  }}
                >
                  {avgScore}%
                </span>
                <span className="hero-stat-label">Avg Score</span>
              </div>
            )}
            {results.length > 0 && (
              <div className="hero-stat-chip">
                <span className="hero-stat-num">
                  {results[results.length - 1].score}/{results[results.length - 1].total}
                </span>
                <span className="hero-stat-label">Last Quiz</span>
              </div>
            )}
          </div>
        )}

        {/* CTAs */}
        <div className="hero-cta">
          <button
            className="btn-hero-primary"
            onClick={() => setOverlay('dashboard')}
          >
            Start Revising 🚀
          </button>
          <button
            className="btn-hero-outline"
            onClick={() => setOverlay('dashboard')}
          >
            View Dashboard
          </button>
        </div>
      </div>

      <div className="hero-right">
        <img
          src={heroImg}
          alt="Students studying with BongoQuiz"
          className="hero-img"
        />
      </div>
    </section>
  );
};

const GuestHero: React.FC = () => {
  const { setOverlay } = useStore();

  return (
    <section className="hero">
      <div className="hero-left">
        <h1 className="hero-title">
          Ace Your Exams<br />with Confidence!
        </h1>
        <p className="hero-subtitle">
          The best revision platform for Kenyan<br />
          primary and secondary students.
        </p>
        <div className="hero-cta">
          <button
            className="btn-hero-primary"
            onClick={() => setOverlay('signup')}
          >
            Get Started
          </button>
          <button className="btn-hero-outline" onClick={() => {}}>
            Learn More
          </button>
        </div>
      </div>

      <div className="hero-right">
        <img
          src={heroImg}
          alt="Students studying with BongoQuiz"
          className="hero-img"
        />
      </div>
    </section>
  );
};

const LandingPage: React.FC = () => {
  const { isLoggedIn } = useStore();

  return (
    <main>
      {/* ── HERO ── */}
      {isLoggedIn ? <LoggedInHero /> : <GuestHero />}

      {/* ── FEATURES ── */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                <rect x="8" y="4" width="30" height="38" rx="4" fill="#EDE9FE" stroke="#5B21B6" strokeWidth="2"/>
                <line x1="14" y1="14" x2="32" y2="14" stroke="#5B21B6" strokeWidth="2" strokeLinecap="round"/>
                <line x1="14" y1="20" x2="32" y2="20" stroke="#5B21B6" strokeWidth="2" strokeLinecap="round"/>
                <line x1="14" y1="26" x2="24" y2="26" stroke="#5B21B6" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="37" cy="37" r="10" fill="#5B21B6"/>
                <path d="M32 37l3.5 3.5 5.5-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="feature-title">Fun &amp; Interactive</h3>
              <p className="feature-desc">Engaging quizzes and lessons</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                <rect x="10" y="30" width="32" height="14" rx="4" fill="#EDE9FE"/>
                <path d="M26 6L44 30H8L26 6Z" fill="#5B21B6"/>
                <rect x="19" y="8" width="14" height="2" rx="1" fill="white"/>
                <circle cx="26" cy="15" r="3" fill="white"/>
                <rect x="18" y="38" width="16" height="3" rx="1.5" fill="#5B21B6"/>
                <rect x="22" y="34" width="8" height="4" rx="1" fill="#5B21B6"/>
              </svg>
            </div>
            <div>
              <h3 className="feature-title">All Grades Covered</h3>
              <p className="feature-desc">From Grade 1 to Form 4</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                <path d="M26 6L30.5 17.5H43L33 24.5L37 36L26 29.5L15 36L19 24.5L9 17.5H21.5L26 6Z" fill="#EDE9FE" stroke="#5B21B6" strokeWidth="1.5"/>
                <rect x="18" y="40" width="16" height="4" rx="2" fill="#5B21B6"/>
                <rect x="21" y="36" width="10" height="5" rx="1" fill="#7C3AED"/>
              </svg>
            </div>
            <div>
              <h3 className="feature-title">Improve Your Skills</h3>
              <p className="feature-desc">Practice and track your progress</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;

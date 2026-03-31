// LandingPage.tsx
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore'
// import heroImg from '../assets/hero-bg.png';
import LowerPrimary from '../assets/banners/LowerPrimaryb.png';
import MiddleSchool from '../assets/banners/middle-school.png';
import SeniorSchool from '../assets/banners/seniorschool.png';
import {
  ChevronRight, ArrowRight, BarChart3, Clock, Users, Star, Shield, TrendingUp, Flame
} from 'lucide-react';
import Footer from './Footer';
import '../styles/landing.css';
import '../styles/exambrowser.css';
import '../styles/landing-loggedin.css';
import {ExamBrowser} from "./ExamBrowser.tsx";
import {LEVEL_CONFIG} from "../hooks/LevelConfigs.ts";
import {PACKAGES, avatarUrl} from "../hooks/Packages.ts";


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
    id: 'lower', img: LowerPrimary, grade: 'Grade 1–3', tag: '🧒',
    // bg: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 60%, #c084fc 100%)',
  },
  {
    id: 'middle', img: MiddleSchool, grade: 'Grade 4–9', tag: '🧠',
    // bg: 'linear-gradient(135deg, #0891b2 0%, #0284c7 60%, #38bdf8 100%)',
  },
  {
    id: 'senior', img: SeniorSchool, grade: 'Grade 10–12', tag: '🎓',
    // bg: 'linear-gradient(135deg, #dc2626 0%, #ea580c 60%, #fb923c 100%)',
  },
];

const GuestHero: React.FC = () => {
  const [slideIdx, setSlideIdx] = useState(0);
  const slide = SLIDES[slideIdx];
  const { setOverlay } = useStore();

  const goSlide = (idx: number) => setSlideIdx(idx);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx(i => (i + 1) % SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
      <div className="gh-guest">
        {/* Slider Section */}
        <div className="slider-section-cta">
          <section className="gh-slider-full">
            <div className="gh-slider-bg-image">
              <img key={slideIdx} src={slide.img} alt={slide.grade} />
            </div>
            <div className="gh-slider-content">

              <button
                  className="gh-slider-cta"
                  onClick={() => setOverlay('signup')}
              >
                Start Learning <ArrowRight size={18} />
              </button>
            </div>

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
          <div>
            <div className="gh-stats-strip reveal">
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
          </div>


          {/* Exam Browser */}
          <ExamBrowser />

          {/* Pricing Section */}
          <section className="gh-pricing-section reveal">
            <div className="gh-section-header">
              <span className="gh-section-badge">💳 Simple Pricing</span>
              <h2 className="gh-section-title">Pick your <span className="gh-text-gradient">plan</span></h2>
              <p className="gh-section-sub">One subscription covers the whole family. Cancel anytime.</p>
            </div>
            <div className="gh-pricing-grid">
              {PACKAGES.map(pkg => {
                const Icon = pkg.icon;
                return (
                    <button
                        key={pkg.id}
                        className={`gh-pricing-card${pkg.popular ? ' gh-pricing-card--popular' : ''}`}
                        onClick={() => setOverlay('signup', pkg.id)}
                    >
                      {pkg.popular && <div className="gh-pricing-badge" style={{ background: pkg.color }}>POPULAR</div>}
                      <div className="gh-pricing-icon" style={{ background: `${pkg.color}18`, color: pkg.color }}>
                        <Icon size={26} />
                      </div>
                      <div className="gh-pricing-label">{pkg.label}</div>
                      <div className="gh-pricing-price">
                        <span className="gh-pricing-amount">{pkg.price}</span>
                        <span className="gh-pricing-period">{pkg.period}</span>
                      </div>
                      <div className="gh-pricing-cta" style={{ background: pkg.color }}>Get Started</div>
                    </button>
                );
              })}
            </div>
          </section>

          {/* Features Section */}
          <section className="gh-features-section reveal">
            <div className="gh-section-header">
              <span className="gh-section-badge">Why Choose Us</span>
              <h2 className="gh-section-title">
                Everything you need to <span className="gh-text-gradient">succeed</span>
              </h2>
              <p className="gh-section-sub">Built specifically for Kenyan CBC students, teachers, and parents.</p>
            </div>
            <div className="gh-features-grid">
              {FEATURES.map(({ icon: Icon, title, desc, color }) => (
                  <div key={title} className="gh-feature-card reveal">
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
          <div className="gh-cta-banner reveal">
            <div className="gh-cta-orb" />
            <h2>🏆 Ready to ace your exams?</h2>
            <p>Join 50,000+ students already using BongoQuiz.</p>
            <button className="gh-cta-btn" onClick={() => setOverlay('signup')}>
              🎮 Join Free Today
            </button>
          </div>

        </div>

      </div>
  );
};

const TIPS = [
  '📌 Revise one topic daily — consistency beats cramming!',
  '🧠 Teaching others is the best way to remember what you learned.',
  '⏱️ Take a 5-minute break every 25 minutes of study.',
  '🎯 Set a small goal before each session — it keeps you focused.',
  '🌟 Mistakes are proof you are trying. Keep going!',
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* ── LoggedInHero ── */
const LoggedInHero: React.FC = () => {
  const { user, setOverlay } = useStore();
  const navigate = useNavigate();

  const tip = TIPS[new Date().getDay() % TIPS.length];
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  if (!user) return null;
  const activeProfile = user.profiles.find(p => p.id === user.activeProfileId) ?? user.profiles[0];
  if (!activeProfile) return null;

  const level = LEVEL_CONFIG[activeProfile.educationLevel];
  const xpPercent = Math.min((activeProfile.xp % 1000) / 10, 100);
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="lp-home">
      {/* ── Hero greeting card ── */}
      <div className="lp-home-hero" style={{ background: level.bg }}>
        <div className="lp-home-hero-orb" />
        <div className="lp-home-hero-top">
          <div className="lp-home-avatar"><img src={avatarUrl(activeProfile.avatar || 'Zara')} alt="avatar" width={48} height={48} style={{borderRadius:'50%'}} /></div>
          <div className="lp-home-hero-info">
            <p className="lp-home-greeting">{greeting} 👋</p>
            <h1 className="lp-home-name">{activeProfile.username}</h1>
            <div className="lp-home-badges">
              <span className="lp-home-badge">{level.emoji} {level.label}</span>
              <span className="lp-home-badge lp-home-badge-fire">🔥 {activeProfile.streak}d streak</span>
              <span className="lp-home-badge">Lv {activeProfile.level}</span>
            </div>
          </div>
          <div className="lp-home-pts">
            <Star size={14} />
            {activeProfile.points.toLocaleString()}
            <span>pts</span>
          </div>
        </div>
        {/* XP bar */}
        <div className="lp-home-xp">
          <div className="lp-home-xp-label">
            <span>XP to Level {activeProfile.level + 1}</span>
            <span>{activeProfile.xp % 1000} / 1000</span>
          </div>
          <div className="lp-home-xp-track">
            <div className="lp-home-xp-fill" style={{ width: `${xpPercent}%` }} />
          </div>
        </div>
        {user.profiles.length > 1 && (
          <button className="lp-home-switch" onClick={() => setOverlay('profile-select')}>
            Switch Profile
          </button>
        )}
      </div>

      {/* ── Quick actions ── */}
      <div className="lp-home-section">
        <div className="lp-home-section-hd"><h3>Quick actions</h3></div>
        <div className="lp-home-actions">
          <button className="lp-home-action lp-action-quiz" onClick={() => navigate(level.route)}>
            <span className="lp-action-icon">📝</span>
            <span>Start Quiz</span>
          </button>
          <button className="lp-home-action lp-action-exam" onClick={() => navigate(level.route)}>
            <span className="lp-action-icon">📋</span>
            <span>Mock Exam</span>
          </button>
          <button className="lp-home-action lp-action-games" onClick={() => navigate('/games')}>
            <span className="lp-action-icon">🎮</span>
            <span>Games</span>
          </button>
          <button className="lp-home-action lp-action-dash" onClick={() => navigate('/dashboard')}>
            <span className="lp-action-icon">📊</span>
            <span>Progress</span>
          </button>
        </div>
      </div>

      {/* ── Weekly streak ── */}
      <div className="lp-home-section">
        <div className="lp-home-section-hd"><h3>This week</h3></div>
        <div className="lp-home-week">
          {WEEK_DAYS.map((day, i) => (
            <div key={day} className="lp-home-day">
              <div className={`lp-home-day-dot ${i < todayIdx ? 'done' : i === todayIdx ? 'today' : 'future'}`}>
                {i < todayIdx ? '✓' : i === todayIdx ? '⚡' : ''}
              </div>
              <span className="lp-home-day-label">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Continue learning ── */}
      <div className="lp-home-section">
        <div className="lp-home-section-hd">
          <h3>Continue learning</h3>
          <button className="lp-home-see-all" onClick={() => navigate(level.route)}>See all</button>
        </div>
        <div className="lp-home-continue">
          {level.subjects.slice(0, 3).map((sub, i) => (
            <button key={sub} className="lp-home-continue-item" onClick={() => navigate(level.route)}>
              <span className="lp-home-ci-emoji">{level.subjectEmojis[i]}</span>
              <div className="lp-home-ci-info">
                <span className="lp-home-ci-name">{sub}</span>
                <div className="lp-home-ci-bar">
                  <div className="lp-home-ci-fill" style={{ width: `${[65, 40, 80][i]}%`, background: level.bg }} />
                </div>
              </div>
              <span className="lp-home-ci-pct">{[65, 40, 80][i]}%</span>
              <ChevronRight size={14} color="#9ca3af" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Subjects ── */}
      <div className="lp-home-section">
        <div className="lp-home-section-hd">
          <h3>Your subjects</h3>
          <button className="lp-home-see-all" onClick={() => navigate(level.route)}>See all</button>
        </div>
        <div className="lp-home-subjects">
          {level.subjects.map((sub, i) => (
            <button key={sub} className="lp-home-subject-chip" onClick={() => navigate(level.route)}>
              <span>{level.subjectEmojis[i]}</span> {sub}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tip of the day ── */}
      <div className="lp-home-tip">
        <span className="lp-home-tip-label">Tip of the day</span>
        <p>{tip}</p>
      </div>

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
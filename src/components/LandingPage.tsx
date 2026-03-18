import React from 'react';
import { useStore } from '../store/useStore';
import heroImg from '/hero.png';
import {
    ArrowRight,
    BookOpen,
    BarChart3,
    Users,
    Award,
    Sparkles,
    // Target,
    // TrendingUp,
    // CheckCircle,
    // Clock, Zap, ChevronRight
} from 'lucide-react';
import '../styles/hero-loggedin.css';
import {useNavigate} from "react-router-dom";
//
// const mockSubjectPerformance = [
//     { subject: 'Mathematics', score: 85, progress: 75, color: '#10B981', icon: BookOpen },
//     { subject: 'English', score: 78, progress: 70, color: '#3B82F6', icon: BookOpen },
//     { subject: 'Kiswahili', score: 82, progress: 65, color: '#8B5CF6', icon: BookOpen },
//     { subject: 'Science', score: 71, progress: 60, color: '#F59E0B', icon: BookOpen },
//     { subject: 'Social Studies', score: 88, progress: 80, color: '#EC4899', icon: BookOpen },
//     { subject: 'CRE', score: 92, progress: 85, color: '#14B8A6', icon: BookOpen }
// ];
const LoggedInHero: React.FC = () => {
    const { user } = useStore();
    const navigate = useNavigate();

    // Calculate overall stats
    // const totalSubjects = mockSubjectPerformance.length;
    // const averageScore = Math.round(
    //     mockSubjectPerformance.reduce((acc, curr) => acc + curr.score, 0) / totalSubjects
    // );
    // const completedTopics = 24;
    // const totalTopics = 36;
    // const studyTime = '12.5 hrs';
    // const streak = 15;

    return (
        <>
            <section className="hero-loggedin">
                <div className="container">
                    <div className="hero-grid">
                        <div className="hero-content">
                            <div className="welcome-badge">
                                <Sparkles size={16} />
                                <span>Welcome back, {user?.username}! 👋🏿</span>
                            </div>
                            <h1 className="hero-title">
                                Ready to continue your
                                <span className="text-gradient"> learning journey?</span>
                            </h1>
                            <p className="hero-subtitle">
                                Pick up where you left off and track your progress
                            </p>
                            <div className="hero-actions">
                                <button className="btn btn-primary-hero btn-lg">
                                    <BookOpen size={20} />
                                    Continue Learning
                                    <ArrowRight size={20} />
                                </button>
                                <button
                                    className="btn btn-outline-hero btn-lg"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    <BarChart3 size={20} />
                                    View Progress
                                </button>
                            </div>
                        </div>
                        <div className="hero-image">
                            <img className="hero-img" src={heroImg} alt="Students studying" />
                        </div>
                    </div>
                </div>
            </section>
            {/*<section className="subject-performance-section">*/}
            {/*    <div className="container">*/}
            {/*        <div className="section-header">*/}
            {/*            <span className="section-badge">Subject Breakdown</span>*/}
            {/*            <h2 className="section-title">*/}
            {/*                Performance by <span className="text-gradient">Subject</span>*/}
            {/*            </h2>*/}
            {/*            <p className="section-subtitle">*/}
            {/*                See how you're performing in each subject area*/}
            {/*            </p>*/}
            {/*        </div>*/}

            {/*        <div className="subjects-performance-grid">*/}
            {/*            {mockSubjectPerformance.map((subject, index) => {*/}
            {/*                const Icon = subject.icon;*/}
            {/*                return (*/}
            {/*                    <div key={index} className="subject-performance-card">*/}
            {/*                        <div className="subject-card-header">*/}
            {/*                            <div*/}
            {/*                                className="subject-icon"*/}
            {/*                                style={{ background: `${subject.color}20` }}*/}
            {/*                            >*/}
            {/*                                <Icon size={24} color={subject.color} />*/}
            {/*                            </div>*/}
            {/*                            <div className="subject-info">*/}
            {/*                                <h4>{subject.subject}</h4>*/}
            {/*                                <div className="subject-score-badge" style={{ background: subject.color }}>*/}
            {/*                                    {subject.score}%*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}

            {/*                        <div className="subject-progress">*/}
            {/*                            <div className="progress-label">*/}
            {/*                                <span>Progress</span>*/}
            {/*                                <span>{subject.progress}%</span>*/}
            {/*                            </div>*/}
            {/*                            <div className="progress-bar-track">*/}
            {/*                                <div*/}
            {/*                                    className="progress-bar-fill"*/}
            {/*                                    style={{*/}
            {/*                                        width: `${subject.progress}%`,*/}
            {/*                                        background: subject.color*/}
            {/*                                    }}*/}
            {/*                                />*/}
            {/*                            </div>*/}
            {/*                        </div>*/}

            {/*                        <div className="subject-stats">*/}
            {/*                            <div className="stat-row">*/}
            {/*                                <span>Quizzes Taken</span>*/}
            {/*                                <span className="stat-value">12</span>*/}
            {/*                            </div>*/}
            {/*                            <div className="stat-row">*/}
            {/*                                <span>Accuracy</span>*/}
            {/*                                <span className="stat-value">{subject.score}%</span>*/}
            {/*                            </div>*/}
            {/*                            <div className="stat-row">*/}
            {/*                                <span>Time Spent</span>*/}
            {/*                                <span className="stat-value">2.5 hrs</span>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}

            {/*                        <button*/}
            {/*                            className="subject-continue-btn"*/}
            {/*                            style={{ color: subject.color }}*/}
            {/*                            onClick={() => navigate(`/subject/${subject.subject.toLowerCase()}`)}*/}
            {/*                        >*/}
            {/*                            Continue Learning*/}
            {/*                            <ChevronRight size={18} />*/}
            {/*                        </button>*/}
            {/*                    </div>*/}
            {/*                );*/}
            {/*            })}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}
            {/* Performance Overview Section */}

        </>
    );
};
const GuestHero: React.FC = () => {
    const { setOverlay } = useStore();
    const navigate = useNavigate();

    return (
        <>
            <section className="hero-guest">
                <div className="container">
                    <div className="hero-grid">
                        <div className="hero-content">
                            <div className="hero-badge">
                                <Award size={16} />
                                <span>Kenya's #1 CBC Revision Platform</span>
                            </div>
                            <h1 className="hero-title">
                                Ace Your Exams
                                <span className="text-gradient"> with Confidence!</span>
                            </h1>
                            <p className="hero-subtitle">
                                The smart way to prepare for CBC exams. Interactive quizzes,
                                detailed analytics, and personalized learning paths.
                            </p>
                            <div className="hero-actions">
                                <button
                                    className="btn btn-primary-hero btn-lg"
                                    onClick={() => setOverlay('signup')}
                                >
                                    Get Started Free
                                    <ArrowRight size={20} />
                                </button>
                                <button className="btn btn-outline-hero btn-lg"
                                        onClick={() => navigate('/about')}
                                >
                                    Learn More
                                </button>
                            </div>
                            <div className="hero-stats">
                                <div className="stat-item">
                                    <Users size={20} />
                                    <span>50K+ Students</span>
                                </div>
                                <div className="stat-divider" />
                                <div className="stat-item">
                                    <BookOpen size={20} />
                                    <span>10K+ Quizzes</span>
                                </div>
                                <div className="stat-divider" />
                                <div className="stat-item">
                                    <BarChart3 size={20} />
                                    <span>98% Success Rate</span>
                                </div>
                            </div>
                        </div>
                        <div className="hero-image">
                            <img src={heroImg} alt="Students studying with BongoQuiz" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Why Choose Us</span>
                        <h2 className="section-title">
                            Everything you need to
                            <span className="text-gradient"> succeed</span>
                        </h2>
                        <p className="section-subtitle">
                            Our platform is designed to make learning engaging, effective, and fun
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card card card-interactive">
                            <div className="feature-icon-wrapper" style={{ background: 'var(--primary-50)' }}>
                                <BookOpen size={32} style={{ color: 'var(--primary-600)' }} />
                            </div>
                            <h3>Curriculum Aligned</h3>
                            <p>All content follows the Kenyan CBC curriculum perfectly, from Grade 1 to Form 4.</p>
                        </div>

                        <div className="feature-card card card-interactive">
                            <div className="feature-icon-wrapper" style={{ background: 'var(--primary-50)' }}>
                                <BarChart3 size={32} style={{ color: 'var(--primary-600)' }} />
                            </div>
                            <h3>Track Progress</h3>
                            <p>Monitor your improvement with detailed analytics and performance insights.</p>
                        </div>

                        <div className="feature-card card card-interactive">
                            <div className="feature-icon-wrapper" style={{ background: 'var(--primary-50)' }}>
                                <Users size={32} style={{ color: 'var(--primary-600)' }} />
                            </div>
                            <h3>Interactive Learning</h3>
                            <p>Engaging quizzes with instant feedback to boost understanding and retention.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

const LandingPage: React.FC = () => {
    const { isLoggedIn } = useStore();

    return (
        <main>
            {isLoggedIn ? <LoggedInHero /> : <GuestHero />}
        </main>
    );
};

export default LandingPage;
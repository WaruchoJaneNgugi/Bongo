import React from 'react';
// import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    // BarChart3,
    // TrendingUp,
    Clock,
    Target,
    ChevronRight,
    // Award,
    Zap,
    CheckCircle,
    ArrowLeft
} from 'lucide-react';
import '../../styles/dashboard.css';

// Mock data - in a real app, this would come from your store/API
const mockSubjectPerformance = [
    { id: 'math', subject: 'Mathematics', score: 85, progress: 75, color: '#10B981', icon: BookOpen, quizzes: 24, timeSpent: '8.5 hrs', lastActive: '2 hours ago' },
    { id: 'english', subject: 'English', score: 78, progress: 70, color: '#3B82F6', icon: BookOpen, quizzes: 18, timeSpent: '6.2 hrs', lastActive: 'Yesterday' },
    { id: 'kiswahili', subject: 'Kiswahili', score: 82, progress: 65, color: '#8B5CF6', icon: BookOpen, quizzes: 15, timeSpent: '5.0 hrs', lastActive: '2 days ago' },
    { id: 'science', subject: 'Science', score: 71, progress: 60, color: '#F59E0B', icon: BookOpen, quizzes: 12, timeSpent: '4.3 hrs', lastActive: '3 days ago' },
    { id: 'social', subject: 'Social Studies', score: 88, progress: 80, color: '#EC4899', icon: BookOpen, quizzes: 20, timeSpent: '7.0 hrs', lastActive: '1 day ago' },
    { id: 'cre', subject: 'CRE', score: 92, progress: 85, color: '#14B8A6', icon: BookOpen, quizzes: 16, timeSpent: '5.5 hrs', lastActive: '5 hours ago' }
];

const DashboardPage: React.FC = () => {
    // const { user } = useStore();
    const navigate = useNavigate();

    // Calculate overall stats
    const totalSubjects = mockSubjectPerformance.length;
    const averageScore = Math.round(
        mockSubjectPerformance.reduce((acc, curr) => acc + curr.score, 0) / totalSubjects
    );
    const totalQuizzes = mockSubjectPerformance.reduce((acc, curr) => acc + curr.quizzes, 0);
    const totalTimeSpent = '36.5 hrs';
    const streak = 15;

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <button className="back-button" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} />
                    Back to Home
                </button>
                <div className="header-content">
                    <h1>Your Learning Dashboard</h1>
                    <p>Track your progress across all subjects</p>
                </div>
            </div>

            {/* Overall Stats */}
            <div className="dashboard-stats-grid">
                <div className="dashboard-stat-card">
                    <div className="stat-icon" style={{ background: 'var(--primary-50)' }}>
                        <Target size={24} style={{ color: 'var(--primary-600)' }} />
                    </div>
                    <div className="stat-details">
                        <span className="stat-value">{averageScore}%</span>
                        <span className="stat-label">Average Score</span>
                    </div>
                </div>

                <div className="dashboard-stat-card">
                    <div className="stat-icon" style={{ background: 'var(--success-50)' }}>
                        <CheckCircle size={24} style={{ color: 'var(--success-600)' }} />
                    </div>
                    <div className="stat-details">
                        <span className="stat-value">{totalQuizzes}</span>
                        <span className="stat-label">Quizzes Taken</span>
                    </div>
                </div>

                <div className="dashboard-stat-card">
                    <div className="stat-icon" style={{ background: 'var(--warning-50)' }}>
                        <Clock size={24} style={{ color: 'var(--warning-600)' }} />
                    </div>
                    <div className="stat-details">
                        <span className="stat-value">{totalTimeSpent}</span>
                        <span className="stat-label">Total Time</span>
                    </div>
                </div>

                <div className="dashboard-stat-card">
                    <div className="stat-icon" style={{ background: 'var(--purple-50)' }}>
                        <Zap size={24} style={{ color: 'var(--purple-600)' }} />
                    </div>
                    <div className="stat-details">
                        <span className="stat-value">{streak} days</span>
                        <span className="stat-label">Current Streak</span>
                    </div>
                </div>
            </div>

            {/* Subject Progress Section */}
            <div className="dashboard-subjects-section">
                <h2>Subject Progress</h2>
                <p className="section-subtitle">Detailed performance breakdown by subject</p>

                <div className="dashboard-subjects-grid">
                    {mockSubjectPerformance.map((subject) => {
                        const Icon = subject.icon;
                        return (
                            <div
                                key={subject.id}
                                className="dashboard-subject-card"
                                onClick={() => navigate(`/subject/${subject.id}`)}
                            >
                                <div className="subject-card-header">
                                    <div
                                        className="subject-icon-large"
                                        style={{ background: `${subject.color}20` }}
                                    >
                                        <Icon size={32} color={subject.color} />
                                    </div>
                                    <div className="subject-title-section">
                                        <h3>{subject.subject}</h3>
                                        <div className="subject-score-large" style={{ background: subject.color }}>
                                            {subject.score}%
                                        </div>
                                    </div>
                                </div>

                                <div className="subject-progress-detailed">
                                    <div className="progress-row">
                                        <span>Overall Progress</span>
                                        <span className="progress-percent">{subject.progress}%</span>
                                    </div>
                                    <div className="progress-track">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${subject.progress}%`,
                                                background: subject.color
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="subject-metrics">
                                    <div className="metric">
                                        <span className="metric-label">Quizzes</span>
                                        <span className="metric-value">{subject.quizzes}</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-label">Time Spent</span>
                                        <span className="metric-value">{subject.timeSpent}</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-label">Last Active</span>
                                        <span className="metric-value">{subject.lastActive}</span>
                                    </div>
                                </div>

                                <button
                                    className="view-subject-btn"
                                    style={{ color: subject.color }}
                                >
                                    View Details
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Performance Chart Section */}
            <div className="dashboard-chart-section">
                <h2>Weekly Performance Trend</h2>
                <div className="chart-container">
                    <div className="chart-bars">
                        {[70, 85, 60, 95, 75, 80, 65].map((height, index) => (
                            <div key={index} className="chart-bar-wrapper">
                                <div
                                    className="chart-bar"
                                    style={{
                                        height: `${height}%`,
                                        background: 'linear-gradient(to top, var(--primary-600), var(--primary-400))'
                                    }}
                                />
                                <span className="chart-label">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recommendations Section */}
            <div className="dashboard-recommendations">
                <h2>Recommended for You</h2>
                <div className="recommendations-grid">
                    <div className="recommendation-card">
                        <div className="rec-icon" style={{ background: '#10B98120' }}>
                            <BookOpen size={24} color="#10B981" />
                        </div>
                        <div className="rec-content">
                            <h4>Algebra Fundamentals</h4>
                            <p>Mathematics • 5 quizzes remaining</p>
                        </div>
                        <button className="rec-btn">Start</button>
                    </div>

                    <div className="recommendation-card">
                        <div className="rec-icon" style={{ background: '#3B82F620' }}>
                            <BookOpen size={24} color="#3B82F6" />
                        </div>
                        <div className="rec-content">
                            <h4>Reading Comprehension</h4>
                            <p>English • 3 quizzes remaining</p>
                        </div>
                        <button className="rec-btn">Start</button>
                    </div>

                    <div className="recommendation-card">
                        <div className="rec-icon" style={{ background: '#8B5CF620' }}>
                            <BookOpen size={24} color="#8B5CF6" />
                        </div>
                        <div className="rec-content">
                            <h4>Ngeli za Kiswahili</h4>
                            <p>Kiswahili • 4 quizzes remaining</p>
                        </div>
                        <button className="rec-btn">Start</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
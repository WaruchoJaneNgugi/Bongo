import React from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    Calculator,
    Globe,
    Mic,
    FlaskConical,
    History,
    ChevronRight,
    // Award,
    Clock,
    Star,
    TrendingUp,
    GraduationCap,
    Brain,
    BookMarked
} from 'lucide-react';
import '../../styles/Level.css';

const SeniorSchoolDashboard: React.FC = () => {
    const { user } = useStore();
    const navigate = useNavigate();

    const subjects = [
        { id: 'math', name: 'Mathematics', icon: Calculator, color: '#10B981', progress: 55 },
        { id: 'english', name: 'English', icon: BookOpen, color: '#3B82F6', progress: 60 },
        { id: 'kiswahili', name: 'Kiswahili', icon: Mic, color: '#8B5CF6', progress: 45 },
        { id: 'biology', name: 'Biology', icon: FlaskConical, color: '#F59E0B', progress: 30 },
        { id: 'chemistry', name: 'Chemistry', icon: FlaskConical, color: '#EC4899', progress: 25 },
        { id: 'physics', name: 'Physics', icon: Brain, color: '#EF4444', progress: 20 },
        { id: 'history', name: 'History', icon: History, color: '#14B8A6', progress: 35 },
        { id: 'geography', name: 'Geography', icon: Globe, color: '#F97316', progress: 40 }
    ];

    // const getGradeLabel = (grade: string) => {
    //     const gradeMap: Record<string, string> = {
    //         grade10: 'Grade 10',
    //         grade11: 'Grade 11',
    //         grade12: 'Grade 12'
    //     };
    //     return gradeMap[grade] || grade;
    // };

    return (
        <div className="level-dashboard">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <h1>Welcome back, {user?.username}! 👋</h1>
                    <p className="grade-info">
                        <GraduationCap size={20} />
                        {/*{getGradeLabel(user?.grade || '')} */}
                        • Senior School
                    </p>
                </div>
                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#10B98120' }}>
                            <Star size={24} color="#10B981" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">3,850</span>
                            <span className="stat-label">Points</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#3B82F620' }}>
                            <Clock size={24} color="#3B82F6" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">25</span>
                            <span className="stat-label">Days Streak</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#8B5CF620' }}>
                            <TrendingUp size={24} color="#8B5CF6" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">72%</span>
                            <span className="stat-label">Average</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* KCSE Countdown */}
            <div className="countdown-section">
                <div className="countdown-card">
                    <BookMarked size={24} color="#8B5CF6" />
                    <div className="countdown-info">
                        <span className="countdown-label">Days until KCSE</span>
                        <span className="countdown-value">156 days</span>
                    </div>
                </div>
            </div>

            {/* Subjects Grid */}
            <div className="subjects-section">
                <h2>Your Subjects</h2>
                <p className="section-subtitle">Track your progress across all subjects</p>

                <div className="subjects-grid">
                    {subjects.map((subject) => {
                        const Icon = subject.icon;
                        return (
                            <div
                                key={subject.id}
                                className="subject-card"
                                onClick={() => navigate(`/subject/${subject.id}`)}
                            >
                                <div className="subject-header">
                                    <div className="subject-icon" style={{ background: `${subject.color}20` }}>
                                        <Icon size={32} color={subject.color} />
                                    </div>
                                    <ChevronRight size={20} className="subject-arrow" />
                                </div>
                                <h3>{subject.name}</h3>
                                <div className="progress-section">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${subject.progress}%`, background: subject.color }}
                                        />
                                    </div>
                                    <span className="progress-text">{subject.progress}% complete</span>
                                </div>
                                <button className="continue-btn" style={{ color: subject.color }}>
                                    Continue Revision
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Performance Chart (simplified) */}
            <div className="performance-section">
                <h2>Recent Performance</h2>
                <div className="performance-grid">
                    <div className="subject-performance">
                        <span className="subject-name">Mathematics</span>
                        <span className="subject-score">85%</span>
                    </div>
                    <div className="subject-performance">
                        <span className="subject-name">English</span>
                        <span className="subject-score">78%</span>
                    </div>
                    <div className="subject-performance">
                        <span className="subject-name">Kiswahili</span>
                        <span className="subject-score">82%</span>
                    </div>
                    <div className="subject-performance">
                        <span className="subject-name">Biology</span>
                        <span className="subject-score">71%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeniorSchoolDashboard;
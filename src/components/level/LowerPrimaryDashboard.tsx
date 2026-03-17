import React from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    Calculator,
    Globe,
    Mic,
    Palette,
    Music,
    ChevronRight,
    Award,
    Clock,
    Star,
    TrendingUp
} from 'lucide-react';
import '../../styles/LevelDashboard.css';

const LowerPrimaryDashboard: React.FC = () => {
    const { user } = useStore();
    const navigate = useNavigate();

    const subjects = [
        { id: 'math', name: 'Mathematics', icon: Calculator, color: '#10B981', progress: 75 },
        { id: 'english', name: 'English', icon: BookOpen, color: '#3B82F6', progress: 60 },
        { id: 'kiswahili', name: 'Kiswahili', icon: Mic, color: '#8B5CF6', progress: 45 },
        { id: 'science', name: 'Science', icon: Globe, color: '#F59E0B', progress: 30 },
        { id: 'art', name: 'Art & Craft', icon: Palette, color: '#EC4899', progress: 20 },
        { id: 'music', name: 'Music', icon: Music, color: '#EF4444', progress: 15 }
    ];

    const getGradeLabel = (grade: string) => {
        const gradeMap: Record<string, string> = {
            grade1: 'Grade 1',
            grade2: 'Grade 2',
            grade3: 'Grade 3'
        };
        return gradeMap[grade] || grade;
    };

    return (
        <div className="level-dashboard">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <h1>Welcome back, {user?.username}! 👋</h1>
                    <p className="grade-info">
                        <Award size={20} />
                        {getGradeLabel(user?.grade || '')} • Lower Primary
                    </p>
                </div>
                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#10B98120' }}>
                            <Star size={24} color="#10B981" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">150</span>
                            <span className="stat-label">Points</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#3B82F620' }}>
                            <Clock size={24} color="#3B82F6" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">12</span>
                            <span className="stat-label">Days Streak</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#8B5CF620' }}>
                            <TrendingUp size={24} color="#8B5CF6" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">85%</span>
                            <span className="stat-label">Average</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subjects Grid */}
            <div className="subjects-section">
                <h2>Your Subjects</h2>
                <p className="section-subtitle">Continue learning where you left off</p>

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
                                    Continue Learning
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="activity-section">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                    <div className="activity-item">
                        <div className="activity-icon" style={{ background: '#10B98120' }}>
                            <BookOpen size={18} color="#10B981" />
                        </div>
                        <div className="activity-details">
                            <span className="activity-title">Completed Counting Quiz</span>
                            <span className="activity-time">2 hours ago</span>
                        </div>
                        <span className="activity-score">10/10</span>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon" style={{ background: '#3B82F620' }}>
                            <Mic size={18} color="#3B82F6" />
                        </div>
                        <div className="activity-details">
                            <span className="activity-title">Learned 5 new words</span>
                            <span className="activity-time">Yesterday</span>
                        </div>
                        <span className="activity-score">5 words</span>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon" style={{ background: '#8B5CF620' }}>
                            <Globe size={18} color="#8B5CF6" />
                        </div>
                        <div className="activity-details">
                            <span className="activity-title">Animals and Their Homes</span>
                            <span className="activity-time">2 days ago</span>
                        </div>
                        <span className="activity-score">8/10</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LowerPrimaryDashboard;
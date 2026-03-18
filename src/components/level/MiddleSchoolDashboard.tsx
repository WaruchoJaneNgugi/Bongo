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
    Users
} from 'lucide-react';
import '../../styles/Level.css';

const MiddleSchoolDashboard: React.FC = () => {
    const { user } = useStore();
    const navigate = useNavigate();

    const subjects = [
        { id: 'math', name: 'Mathematics', icon: Calculator, color: '#10B981', progress: 65 },
        { id: 'english', name: 'English', icon: BookOpen, color: '#3B82F6', progress: 70 },
        { id: 'kiswahili', name: 'Kiswahili', icon: Mic, color: '#8B5CF6', progress: 55 },
        { id: 'science', name: 'Science', icon: FlaskConical, color: '#F59E0B', progress: 40 },
        { id: 'social', name: 'Social Studies', icon: Globe, color: '#EC4899', progress: 35 },
        { id: 'history', name: 'History', icon: History, color: '#EF4444', progress: 25 }
    ];

    // const getGradeLabel = (grade: string) => {
    //     const gradeMap: Record<string, string> = {
    //         grade4: 'Grade 4',
    //         grade5: 'Grade 5',
    //         grade6: 'Grade 6',
    //         grade7: 'Grade 7',
    //         grade8: 'Grade 8',
    //         grade9: 'Grade 9'
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
                        <Users size={20} />
                        {/*{getGradeLabel(user?.grade || '')} */}
                        • Middle School
                    </p>
                </div>
                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#10B98120' }}>
                            <Star size={24} color="#10B981" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">2,450</span>
                            <span className="stat-label">Points</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#3B82F620' }}>
                            <Clock size={24} color="#3B82F6" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">18</span>
                            <span className="stat-label">Days Streak</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#8B5CF620' }}>
                            <TrendingUp size={24} color="#8B5CF6" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">78%</span>
                            <span className="stat-label">Average</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subjects Grid */}
            <div className="subjects-section">
                <h2>Your Subjects</h2>
                <p className="section-subtitle">Continue preparing for your exams</p>

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

            {/* Upcoming Exams */}
            <div className="exams-section">
                <h2>Upcoming Topics</h2>
                <div className="exams-list">
                    <div className="exam-item">
                        <div className="exam-info">
                            <span className="exam-title">Algebra - Linear Equations</span>
                            <span className="exam-subject">Mathematics</span>
                        </div>
                        <span className="exam-date">Tomorrow</span>
                    </div>
                    <div className="exam-item">
                        <div className="exam-info">
                            <span className="exam-title">Comprehension - The Lost Child</span>
                            <span className="exam-subject">English</span>
                        </div>
                        <span className="exam-date">Wednesday</span>
                    </div>
                    <div className="exam-item">
                        <div className="exam-info">
                            <span className="exam-title">Ngeli za Kiswahili</span>
                            <span className="exam-subject">Kiswahili</span>
                        </div>
                        <span className="exam-date">Friday</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiddleSchoolDashboard;
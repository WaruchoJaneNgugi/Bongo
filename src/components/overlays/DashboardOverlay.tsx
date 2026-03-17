import React from 'react';
import { useStore } from '../../store/useStore';
import heroImg from '/hero.png';

const levelLabel: Record<string, string> = {
    lower_primary: 'Lower Primary',
    middle_school: 'Middle School',
    senior_school: 'Senior School',
};

const gradeLabel: Record<string, string> = {
    grade1: 'Grade 1',
    grade2: 'Grade 2',
    grade3: 'Grade 3',
    grade4: 'Grade 4',
    grade5: 'Grade 5',
    grade6: 'Grade 6',
    grade7: 'Grade 7',
    grade8: 'Grade 8',
    grade9: 'Grade 9',
    grade10: 'Grade 10',
    grade11: 'Grade 11',
    grade12: 'Grade 12',
};

const DashboardOverlay: React.FC = () => {
    const { user } = useStore();

    const getGradeDescription = (grade: string) => {
        const descriptions: Record<string, string> = {
            grade1: 'Beginning your learning journey',
            grade2: 'Building strong foundations',
            grade3: 'Developing key skills',
            grade4: 'Upper primary start',
            grade5: 'Intermediate level',
            grade6: 'KCPE preparation',
            grade7: 'Junior secondary',
            grade8: 'Junior secondary',
            grade9: 'Junior secondary',
            grade10: 'Senior school start',
            grade11: 'Advanced learning',
            grade12: 'KCSE preparation',
        };
        return descriptions[grade] || 'Continue your learning journey';
    };

    const getNextMilestone = (grade: string) => {
        const milestones: Record<string, string> = {
            grade1: 'Next: Grade 2',
            grade2: 'Next: Grade 3',
            grade3: 'Next: Middle School',
            grade4: 'Next: Grade 5',
            grade5: 'Next: Grade 6',
            grade6: 'Next: Grade 7',
            grade7: 'Next: Grade 8',
            grade8: 'Next: Grade 9',
            grade9: 'Next: Senior School',
            grade10: 'Next: Grade 11',
            grade11: 'Next: Grade 12',
            grade12: 'KCSE Ready!',
        };
        return milestones[grade] || 'Keep up the great work!';
    };

    const getLevelColor = (level: string) => {
        const colors: Record<string, string> = {
            lower_primary: '#10B981',
            middle_school: '#3B82F6',
            senior_school: '#8B5CF6',
        };
        return colors[level] || '#7C3AED';
    };

    if (!user) return null;

    const levelColor = getLevelColor(user.educationLevel);
    const userGrade = gradeLabel[user.grade] || user.grade;
    const gradeDescription = getGradeDescription(user.grade);
    const nextMilestone = getNextMilestone(user.grade);

    return (
        <div className="dashboard-main-container">
            <div className="dash-header">
                <div className="dash-header-left">
                    <div className="dash-welcome">
                        Welcome back, {user.username}
                    </div>
                    <div className="dash-greeting">
                        Ready to continue your learning journey?
                    </div>

                    {/* Grade and Level Information */}
                    <div className="dash-grade-info">
                        <div className="dash-level-container">
                            <div
                                className="dash-level-badge"
                                style={{ backgroundColor: `${levelColor}20`, color: levelColor }}
                            >
                                {levelLabel[user.educationLevel]}
                            </div>
                            <div
                                className="dash-grade-badge"
                                style={{ backgroundColor: levelColor }}
                            >
                                {userGrade}
                            </div>
                        </div>

                        <p className="dash-grade-description">
                            {gradeDescription}
                        </p>

                        <div className="dash-progress-indicator">
                            <div className="dash-milestone">
                                <span className="milestone-label">Current Milestone:</span>
                                <span className="milestone-value">{nextMilestone}</span>
                            </div>

                            <div className="dash-progress-bar">
                                <div
                                    className="dash-progress-fill"
                                    style={{
                                        width: user.educationLevel === 'lower_primary'
                                            ? `${(parseInt(user.grade.replace('grade', '')) / 3) * 100}%`
                                            : user.educationLevel === 'middle_school'
                                                ? `${((parseInt(user.grade.replace('grade', '')) - 3) / 6) * 100}%`
                                                : `${((parseInt(user.grade.replace('grade', '')) - 9) / 3) * 100}%`,
                                        backgroundColor: levelColor
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hero-right">
                    <img
                        src={heroImg}
                        alt="Students studying"
                        className="hero-img"
                    />
                </div>
            </div>

            {/* Quick Actions */}
            {/*<div className="dash-quick-actions">*/}
            {/*    <h3 className="dash-section-title">Quick Actions</h3>*/}
            {/*    <div className="quick-actions-grid">*/}
            {/*        <div className="quick-action-card">*/}
            {/*            <div className="quick-action-icon" style={{ background: `${levelColor}20` }}>*/}
            {/*                📚*/}
            {/*            </div>*/}
            {/*            <div className="quick-action-content">*/}
            {/*                <h4>Continue Learning</h4>*/}
            {/*                <p>Pick up where you left off</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        <div className="quick-action-card">*/}
            {/*            <div className="quick-action-icon" style={{ background: `${levelColor}20` }}>*/}
            {/*                📝*/}
            {/*            </div>*/}
            {/*            <div className="quick-action-content">*/}
            {/*                <h4>Take a Quiz</h4>*/}
            {/*                <p>Test your knowledge</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        <div className="quick-action-card">*/}
            {/*            <div className="quick-action-icon" style={{ background: `${levelColor}20` }}>*/}
            {/*                📊*/}
            {/*            </div>*/}
            {/*            <div className="quick-action-content">*/}
            {/*                <h4>View Progress</h4>*/}
            {/*                <p>See your improvement</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Subject Recommendations */}
            {/*<div className="dash-recommendations">*/}
            {/*    <h3 className="dash-section-title">Recommended for {userGrade}</h3>*/}
            {/*    <div className="recommendations-list">*/}
            {/*        <div className="recommendation-item">*/}
            {/*            <span className="rec-subject">Mathematics</span>*/}
            {/*            <span className="rec-topic">Numbers & Operations</span>*/}
            {/*            <button className="rec-btn">Start</button>*/}
            {/*        </div>*/}
            {/*        <div className="recommendation-item">*/}
            {/*            <span className="rec-subject">English</span>*/}
            {/*            <span className="rec-topic">Reading Comprehension</span>*/}
            {/*            <button className="rec-btn">Start</button>*/}
            {/*        </div>*/}
            {/*        <div className="recommendation-item">*/}
            {/*            <span className="rec-subject">Kiswahili</span>*/}
            {/*            <span className="rec-topic">Msamiati</span>*/}
            {/*            <button className="rec-btn">Start</button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Weekly Goal */}
            {/*<div className="dash-weekly-goal">*/}
            {/*    <div className="goal-header">*/}
            {/*        <h4>Weekly Goal</h4>*/}
            {/*        <span className="goal-progress">3/5 completed</span>*/}
            {/*    </div>*/}
            {/*    <div className="goal-progress-bar">*/}
            {/*        <div className="goal-progress-fill" style={{ width: '60%', backgroundColor: levelColor }} />*/}
            {/*    </div>*/}
            {/*    <p className="goal-message">Complete 2 more quizzes to reach your goal!</p>*/}
            {/*</div>*/}
        </div>
    );
};

export default DashboardOverlay;
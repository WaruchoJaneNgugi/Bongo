// components/layouts/LevelLayout.tsx
import React from 'react';
// import { Outlet, NavLink } from 'react-router-dom';
// import { useStore } from '../../store/useStore';
// import {
//     BookOpen,
//     GraduationCap,
//     BookMarked,
//     Users,
//     Target,
//     Award,
//     Sparkles,
//     ChevronRight,
//     // BookCheck,
//     // TrendingUp,
//     Clock
// } from 'lucide-react';
import '../../styles/LevelLayout.css'; // Create this CSS file
import heroImg from '/hero.png';
import {useStore} from "../../store/useStore.ts";
//
// const levelConfig = {
//     lower_primary: {
//         path: '/level/lower-primary',
//         label: 'Lower Primary',
//         shortLabel: 'Lower Prim',
//         grades: 'Grade 1–3',
//         icon: BookOpen,
//         color: '#10B981',
//         lightColor: '#D1FAE5',
//         ultraLight: '#ECFDF5',
//         description: 'Building strong foundations',
//         features: ['Basic numeracy', 'Early literacy', 'Fun activities']
//     },
//     middle_school: {
//         path: '/level/middle-school',
//         label: 'Middle School',
//         shortLabel: 'Middle',
//         grades: 'Grade 4–9',
//         icon: Users,
//         color: '#3B82F6',
//         lightColor: '#DBEAFE',
//         ultraLight: '#EFF6FF',
//         description: 'Expanding knowledge',
//         features: ['Core subjects', 'Critical thinking', 'Exam prep']
//     },
//     senior_school: {
//         path: '/level/senior-school',
//         label: 'Senior School',
//         shortLabel: 'Senior',
//         grades: 'Grade 10–12',
//         icon: GraduationCap,
//         color: '#8B5CF6',
//         lightColor: '#EDE9FE',
//         ultraLight: '#F5F3FF',
//         description: 'Preparing for the future',
//         features: ['Advanced topics', 'KCSE revision', 'Career guidance']
//     }
// };
const levelLabel: Record<string, string> = {
    lower_primary: 'Lower Primary',
    middle_school: 'Middle School',
    senior_school: 'Senior School',
};
const LevelLayout: React.FC = () => {
    const {user} = useStore();

    // const { user } = useStore();
    // const userLevel = user?.educationLevel || 'middle_school';
    // const currentLevel = levelConfig[userLevel];
    // const CurrentIcon = currentLevel.icon;

    // Get user's first name from username
    // const firstName = user?.username?.split(' ')[0] || 'Student';

    return (
        <div className="level-layout">
            <div className="header-content-about">
                <div className="dash-welcome">
                    {user?.username}
                </div>
                <div className="dash-level-badge">
                    {levelLabel[user?.educationLevel ?? '']}
                </div>
            </div>

            <div className="hero-right">
                <img
                    src={heroImg}
                    alt="Students studying"
                    className="hero-img"
                />
            </div>
            {/* Hero Header with Purple Gradient */}
            {/*<div className="level-hero">*/}
            {/*    <div className="hero-pattern"></div>*/}
            {/*    <div className="container">*/}
            {/*        <div className="hero-content">*/}
            {/*            /!* Welcome Badge *!/*/}
            {/*            <div className="welcome-badge">*/}
            {/*                <Sparkles size={16} />*/}
            {/*                <span>Welcome back, {firstName}! 👋</span>*/}
            {/*            </div>*/}

            {/*            /!* Level Info *!/*/}
            {/*            <div className="level-info">*/}
            {/*                <div className="level-icon-wrapper" style={{*/}
            {/*                    background: `linear-gradient(135deg, ${currentLevel.color}, ${currentLevel.color}dd)`*/}
            {/*                }}>*/}
            {/*                    <CurrentIcon size={48} color="white" />*/}
            {/*                </div>*/}
            {/*                <div className="level-text">*/}
            {/*                    <h1 className="level-title">*/}
            {/*                        {currentLevel.label}*/}
            {/*                        <span className="level-grades-badge">{currentLevel.grades}</span>*/}
            {/*                    </h1>*/}
            {/*                    <p className="level-description">{currentLevel.description}</p>*/}

            {/*                    /!* Feature Chips *!/*/}
            {/*                    <div className="feature-chips">*/}
            {/*                        {currentLevel.features.map((feature, index) => (*/}
            {/*                            <span key={index} className="feature-chip" style={{*/}
            {/*                                background: currentLevel.ultraLight,*/}
            {/*                                color: currentLevel.color*/}
            {/*                            }}>*/}
            {/*                                {feature}*/}
            {/*                            </span>*/}
            {/*                        ))}*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}

            {/*            /!* Quick Stats Cards *!/*/}
            {/*            <div className="quick-stats-grid">*/}
            {/*                <div className="quick-stat-card" style={{ borderColor: currentLevel.lightColor }}>*/}
            {/*                    <div className="stat-icon" style={{ background: currentLevel.ultraLight }}>*/}
            {/*                        <Target size={20} color={currentLevel.color} />*/}
            {/*                    </div>*/}
            {/*                    <div className="stat-info">*/}
            {/*                        <span className="stat-value">12</span>*/}
            {/*                        <span className="stat-label">Topics</span>*/}
            {/*                    </div>*/}
            {/*                </div>*/}

            {/*                <div className="quick-stat-card" style={{ borderColor: currentLevel.lightColor }}>*/}
            {/*                    <div className="stat-icon" style={{ background: currentLevel.ultraLight }}>*/}
            {/*                        <BookMarked size={20} color={currentLevel.color} />*/}
            {/*                    </div>*/}
            {/*                    <div className="stat-info">*/}
            {/*                        <span className="stat-value">48</span>*/}
            {/*                        <span className="stat-label">Quizzes</span>*/}
            {/*                    </div>*/}
            {/*                </div>*/}

            {/*                <div className="quick-stat-card" style={{ borderColor: currentLevel.lightColor }}>*/}
            {/*                    <div className="stat-icon" style={{ background: currentLevel.ultraLight }}>*/}
            {/*                        <Award size={20} color={currentLevel.color} />*/}
            {/*                    </div>*/}
            {/*                    <div className="stat-info">*/}
            {/*                        <span className="stat-value">85%</span>*/}
            {/*                        <span className="stat-label">Avg Score</span>*/}
            {/*                    </div>*/}
            {/*                </div>*/}

            {/*                <div className="quick-stat-card" style={{ borderColor: currentLevel.lightColor }}>*/}
            {/*                    <div className="stat-icon" style={{ background: currentLevel.ultraLight }}>*/}
            {/*                        <Clock size={20} color={currentLevel.color} />*/}
            {/*                    </div>*/}
            {/*                    <div className="stat-info">*/}
            {/*                        <span className="stat-value">2h</span>*/}
            {/*                        <span className="stat-label">Today</span>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    /!* Curved Bottom Edge *!/*/}
            {/*    <div className="hero-curve">*/}
            {/*        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
            {/*            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>*/}
            {/*        </svg>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Level Tabs Navigation */}
            {/*<div className="level-tabs-container">*/}
            {/*    <div className="container">*/}
            {/*        <div className="level-tabs">*/}
            {/*            {Object.entries(levelConfig).map(([key, level]) => {*/}
            {/*                const Icon = level.icon;*/}
            {/*                const isActive = location.pathname === level.path;*/}

            {/*                return (*/}
            {/*                    <NavLink*/}
            {/*                        key={key}*/}
            {/*                        to={level.path}*/}
            {/*                        className={({ isActive }) =>*/}
            {/*                            `level-tab ${isActive ? 'active' : ''}`*/}
            {/*                        }*/}
            {/*                        style={({ isActive }) => ({*/}
            {/*                            background: isActive ? `linear-gradient(135deg, ${level.color}15, ${level.color}05)` : 'transparent',*/}
            {/*                            borderColor: isActive ? level.color : 'transparent'*/}
            {/*                        })}*/}
            {/*                    >*/}
            {/*                        <div className="tab-icon" style={{*/}
            {/*                            background: isActive ? level.color : level.lightColor,*/}
            {/*                            color: isActive ? 'white' : level.color*/}
            {/*                        }}>*/}
            {/*                            <Icon size={18} />*/}
            {/*                        </div>*/}
            {/*                        <span className="tab-label">{level.shortLabel}</span>*/}
            {/*                        {isActive && <ChevronRight size={16} className="tab-arrow" />}*/}
            {/*                    </NavLink>*/}
            {/*                );*/}
            {/*            })}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Level Content Area */}
            {/*<div className="level-content-area">*/}
            {/*    <div className="container">*/}
            {/*        /!* Breadcrumb *!/*/}
            {/*        <div className="breadcrumb">*/}
            {/*            <span className="breadcrumb-item" onClick={() => /!* navigate to dashboard *!/}>*/}
            {/*                Dashboard*/}
            {/*            </span>*/}
            {/*            <ChevronRight size={14} />*/}
            {/*            <span className="breadcrumb-item active">*/}
            {/*                {currentLevel.label}*/}
            {/*            </span>*/}
            {/*        </div>*/}

            {/*        /!* Main Content *!/*/}
            {/*        <div className="content-wrapper">*/}
            {/*            <Outlet />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
};

export default LevelLayout;
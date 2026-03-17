import React from 'react';
import {
    Target,
    BookOpen,
    TrendingUp,
    CheckCircle,
    Users,

} from 'lucide-react';
import '../styles/about.css';
import {useStore} from "../store/useStore.ts";

const AboutPage: React.FC = () => {
    const {user} = useStore();

    const { isLoggedIn } = useStore();

    const features = [
        {
            icon: Target,
            title: "Curriculum Aligned",
            description: "All content follows the Kenyan CBC curriculum perfectly",
            color: "#10B981",
            gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)"
        },
        {
            icon: BookOpen,
            title: "Interactive Learning",
            description: "Engaging quizzes with instant feedback to boost understanding",
            color: "#3B82F6",
            gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
        },
        {
            icon: TrendingUp,
            title: "Track Progress",
            description: "Monitor your improvement with detailed analytics",
            color: "#8B5CF6",
            gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
        },
        {
            icon: Users,
            title: "All Grades Covered",
            description: "From Grade 1 through Form 4, we've got you covered",
            color: "#F59E0B",
            gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
        }
    ];

    return (
        <div className="about-page">
            <div className="header-content-about">
                <div className="dash-welcome">
                     {user?.username}
                </div>
                <div className="dash-level-badge">
                    About Us
                </div>
            </div>


            {!isLoggedIn ?(
                <section className="steps-section">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-badge">Simple Process</span>
                            <h2 className="section-title">
                                Start Learning in
                                <span className="gradient-text"> 3 Easy Steps</span>
                            </h2>
                        </div>

                        <div className="steps-grid">
                            <div className="step-card" data-aos="fade-right">
                                <div className="step-number">1</div>
                                <div className="step-content">
                                    <CheckCircle size={32} className="step-icon" />
                                    <h3>Choose Your Level</h3>
                                    <p>Select your class and subject area you want to focus on</p>
                                </div>
                            </div>

                            <div className="step-connector">
                                <div className="connector-line"></div>
                            </div>

                            <div className="step-card" data-aos="fade-up">
                                <div className="step-number">2</div>
                                <div className="step-content">
                                    <BookOpen size={32} className="step-icon" />
                                    <h3>Take Quizzes</h3>
                                    <p>Answer interactive questions with instant feedback</p>
                                </div>
                            </div>

                            <div className="step-connector">
                                <div className="connector-line"></div>
                            </div>

                            <div className="step-card" data-aos="fade-left">
                                <div className="step-number">3</div>
                                <div className="step-content">
                                    <TrendingUp size={32} className="step-icon" />
                                    <h3>Track Progress</h3>
                                    <p>Monitor your improvement with detailed analytics</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ):(
                <>
                    {/*/!* Features Section *!/*/}
                    <section className="features-section">
                        <div className="container">
                            <div className="section-header">
                                <span className="section-badge">Why Choose Us</span>
                                <h2 className="section-title">
                                    Everything You Need to
                                    <span className="gradient-text"> Succeed</span>
                                </h2>
                                <p className="section-subtitle">
                                    Our platform is designed to make learning engaging, effective, and fun
                                </p>
                            </div>

                            <div className="features-grid">
                                {features.map((feature, index) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="feature-card"
                                            data-aos="fade-up"
                                            data-aos-delay={index * 100}
                                        >
                                            <div className="feature-icon-wrapper" style={{ background: feature.gradient }}>
                                                <Icon size={32} color="white" />
                                            </div>
                                            <h3 className="feature-title">{feature.title}</h3>
                                            <p className="feature-description">{feature.description}</p>
                                            <div className="feature-hover-effect"></div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </section>
                </>

            )}

        </div>
    );
};

export default AboutPage;
// components/pages/AboutPage.tsx
import React from 'react';
// import {
//     Target,
//     BookOpen,
//     TrendingUp,
//     CheckCircle,
//     // Heart,
//     // Star,
//     Users,
//     // Sparkles,
//     // Award,
//     // Zap,
//     // Shield,
//     // Globe
// } from 'lucide-react';
// import { useStore } from "../store/useStore";
import '../styles/about.css';
import heroImg from '/hero.png';
import {useStore} from "../store/useStore.ts";

const AboutPage: React.FC = () => {
    const {user} = useStore();

    // const { isLoggedIn, setOverlay } = useStore();

    // const features = [
    //     {
    //         icon: Target,
    //         title: "Curriculum Aligned",
    //         description: "All content follows the Kenyan CBC curriculum perfectly",
    //         color: "#10B981",
    //         gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)"
    //     },
    //     {
    //         icon: BookOpen,
    //         title: "Interactive Learning",
    //         description: "Engaging quizzes with instant feedback to boost understanding",
    //         color: "#3B82F6",
    //         gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
    //     },
    //     {
    //         icon: TrendingUp,
    //         title: "Track Progress",
    //         description: "Monitor your improvement with detailed analytics",
    //         color: "#8B5CF6",
    //         gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
    //     },
    //     {
    //         icon: Users,
    //         title: "All Grades Covered",
    //         description: "From Grade 1 through Form 4, we've got you covered",
    //         color: "#F59E0B",
    //         gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
    //     }
    // ];

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

            <div className="hero-right">
                <img
                    src={heroImg}
                    alt="Students studying"
                    className="hero-img"
                />
            </div>
            {/*/!* Features Section *!/*/}
            {/*<section className="features-section">*/}
            {/*    <div className="container">*/}
            {/*        <div className="section-header">*/}
            {/*            <span className="section-badge">Why Choose Us</span>*/}
            {/*            <h2 className="section-title">*/}
            {/*                Everything You Need to*/}
            {/*                <span className="gradient-text"> Succeed</span>*/}
            {/*            </h2>*/}
            {/*            <p className="section-subtitle">*/}
            {/*                Our platform is designed to make learning engaging, effective, and fun*/}
            {/*            </p>*/}
            {/*        </div>*/}

            {/*        <div className="features-grid">*/}
            {/*            {features.map((feature, index) => {*/}
            {/*                const Icon = feature.icon;*/}
            {/*                return (*/}
            {/*                    <div*/}
            {/*                        key={index}*/}
            {/*                        className="feature-card"*/}
            {/*                        data-aos="fade-up"*/}
            {/*                        data-aos-delay={index * 100}*/}
            {/*                    >*/}
            {/*                        <div className="feature-icon-wrapper" style={{ background: feature.gradient }}>*/}
            {/*                            <Icon size={32} color="white" />*/}
            {/*                        </div>*/}
            {/*                        <h3 className="feature-title">{feature.title}</h3>*/}
            {/*                        <p className="feature-description">{feature.description}</p>*/}
            {/*                        <div className="feature-hover-effect"></div>*/}
            {/*                    </div>*/}
            {/*                );*/}
            {/*            })}*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*</section>*/}
            {/*<section className="steps-section">*/}
            {/*    <div className="container">*/}
            {/*        <div className="section-header">*/}
            {/*            <span className="section-badge">Simple Process</span>*/}
            {/*            <h2 className="section-title">*/}
            {/*                Start Learning in*/}
            {/*                <span className="gradient-text"> 3 Easy Steps</span>*/}
            {/*            </h2>*/}
            {/*        </div>*/}

            {/*        <div className="steps-grid">*/}
            {/*            <div className="step-card" data-aos="fade-right">*/}
            {/*                <div className="step-number">1</div>*/}
            {/*                <div className="step-content">*/}
            {/*                    <CheckCircle size={32} className="step-icon" />*/}
            {/*                    <h3>Choose Your Level</h3>*/}
            {/*                    <p>Select your class and subject area you want to focus on</p>*/}
            {/*                </div>*/}
            {/*            </div>*/}

            {/*            <div className="step-connector">*/}
            {/*                <div className="connector-line"></div>*/}
            {/*            </div>*/}

            {/*            <div className="step-card" data-aos="fade-up">*/}
            {/*                <div className="step-number">2</div>*/}
            {/*                <div className="step-content">*/}
            {/*                    <BookOpen size={32} className="step-icon" />*/}
            {/*                    <h3>Take Quizzes</h3>*/}
            {/*                    <p>Answer interactive questions with instant feedback</p>*/}
            {/*                </div>*/}
            {/*            </div>*/}

            {/*            <div className="step-connector">*/}
            {/*                <div className="connector-line"></div>*/}
            {/*            </div>*/}

            {/*            <div className="step-card" data-aos="fade-left">*/}
            {/*                <div className="step-number">3</div>*/}
            {/*                <div className="step-content">*/}
            {/*                    <TrendingUp size={32} className="step-icon" />*/}
            {/*                    <h3>Track Progress</h3>*/}
            {/*                    <p>Monitor your improvement with detailed analytics</p>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}
            {/*/!* Benefits Section *!/*/}
            {/*<section className="benefits-section">*/}
            {/*    <div className="container">*/}
            {/*        <div className="benefits-grid">*/}
            {/*            {benefits.map((benefit, index) => {*/}
            {/*                const Icon = benefit.icon;*/}
            {/*                return (*/}
            {/*                    <div key={index} className="benefit-card" data-aos="zoom-in" data-aos-delay={index * 100}>*/}
            {/*                        <div className="benefit-icon">*/}
            {/*                            <Icon size={28} color="#7C3AED" />*/}
            {/*                        </div>*/}
            {/*                        <h4 className="benefit-title">{benefit.title}</h4>*/}
            {/*                        <p className="benefit-description">{benefit.description}</p>*/}
            {/*                    </div>*/}
            {/*                );*/}
            {/*            })}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/*/!* How It Works *!/*/}


            {/*/!* Testimonials *!/*/}
            {/*<section className="testimonials-section">*/}
            {/*    <div className="container">*/}
            {/*        <div className="section-header">*/}
            {/*            <span className="section-badge">Testimonials</span>*/}
            {/*            <h2 className="section-title">*/}
            {/*                What Our*/}
            {/*                <span className="gradient-text"> Students Say</span>*/}
            {/*            </h2>*/}
            {/*        </div>*/}

            {/*        <div className="testimonials-grid">*/}
            {/*            {testimonials.map((testimonial, index) => (*/}
            {/*                <div key={index} className="testimonial-card" data-aos="flip-up" data-aos-delay={index * 100}>*/}
            {/*                    <div className="testimonial-quote">"</div>*/}
            {/*                    <p className="testimonial-content">{testimonial.content}</p>*/}
            {/*                    <div className="testimonial-author">*/}
            {/*                        <div className="author-avatar">{testimonial.avatar}</div>*/}
            {/*                        <div className="author-info">*/}
            {/*                            <h4>{testimonial.name}</h4>*/}
            {/*                            <p>{testimonial.role}</p>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/*/!* CTA Section *!/*/}
            {/*{!isLoggedIn && (*/}
            {/*    <section className="cta-section">*/}
            {/*        <div className="container">*/}
            {/*            <div className="cta-card">*/}
            {/*                <Heart size={64} className="cta-icon" />*/}
            {/*                <h2 className="cta-title">Ready to start your revision journey?</h2>*/}
            {/*                <p className="cta-description">*/}
            {/*                    Join thousands of Kenyan students already learning with BongoQuiz*/}
            {/*                </p>*/}
            {/*                <div className="cta-buttons">*/}
            {/*                    <button*/}
            {/*                        className="btn-primary btn-large"*/}
            {/*                        onClick={() => setOverlay('signup')}*/}
            {/*                    >*/}
            {/*                        Get Started Free*/}
            {/*                        <Zap size={20} />*/}
            {/*                    </button>*/}
            {/*                    <button className="btn-outline btn-large">*/}
            {/*                        Contact Sales*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*                <div className="cta-stats">*/}
            {/*                    <span>✨ No credit card required</span>*/}
            {/*                    <span>🚀 Instant access</span>*/}
            {/*                    <span>🎯 Cancel anytime</span>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </section>*/}
            {/*)}*/}
        </div>
    );
};

export default AboutPage;
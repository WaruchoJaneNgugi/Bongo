// components/pages/ContactPage.tsx
import React from 'react';
// import {
//     Mail,
//     Phone,
//     // MapPin,
//     // Send,
//     // Facebook,
//     // Twitter,
//     // Instagram,
//     // Youtube,
//     Clock,
//     // CheckCircle,
//     // AlertCircle,
//     // MessageCircle,
//     // Headphones,
//     // Map,
//     // Globe,
//     // Award,
//     // Users
// } from 'lucide-react';
// import '../styles/contact.css';
import '../styles/about.css';
import heroImg from '/hero.png';
import {useStore} from "../store/useStore.ts";


const ContactPage: React.FC = () => {
    const {user} = useStore();

    return (
        <div className="contact-page">
            <div className="header-content-about">
                <div className="dash-welcome">
                    {user?.username}
                </div>
                <div className="dash-level-badge">
                    Contact Us
                </div>
            </div>

            <div className="hero-right">
                <img
                    src={heroImg}
                    alt="Students studying"
                    className="hero-img"
                />
            </div>
            {/* Hero Section */}
            {/*<section className="contact-hero">*/}
            {/*    <div className="hero-pattern"></div>*/}
            {/*    <div className="container">*/}
            {/*        <div className="hero-content">*/}
            {/*            <span className="hero-badge">📞 Get in Touch</span>*/}
            {/*            <h1 className="hero-title">*/}
            {/*                We're Here to*/}
            {/*                <span className="gradient-text"> Help</span>*/}
            {/*            </h1>*/}
            {/*            <p className="hero-subtitle">*/}
            {/*                Have questions about BongoQuiz? Our team is ready to assist you with*/}
            {/*                anything from technical support to partnership inquiries.*/}
            {/*            </p>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="hero-wave">*/}
            {/*        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
            {/*            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>*/}
            {/*        </svg>*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/* Support Stats */}
            {/*<section className="stats-section">*/}
            {/*    <div className="container">*/}
            {/*        <div className="stats-grid">*/}
            {/*            {supportStats.map((stat, index) => {*/}
            {/*                const Icon = stat.icon;*/}
            {/*                return (*/}
            {/*                    <div key={index} className="stat-card" data-aos="fade-up" data-aos-delay={index * 100}>*/}
            {/*                        <div className="stat-icon-wrapper">*/}
            {/*                            <Icon size={28} color="#7C3AED" />*/}
            {/*                        </div>*/}
            {/*                        <div className="stat-content">*/}
            {/*                            <div className="stat-value">{stat.value}</div>*/}
            {/*                            <div className="stat-label">{stat.label}</div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                );*/}
            {/*            })}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/* Contact Cards Grid */}
            {/*<section className="contact-cards-section">*/}
            {/*    <div className="container">*/}
            {/*        <div className="section-header">*/}
            {/*            <h2 className="section-title">*/}
            {/*                Ways to <span className="gradient-text">Connect</span>*/}
            {/*            </h2>*/}
            {/*            <p className="section-subtitle">*/}
            {/*                Choose the method that works best for you*/}
            {/*            </p>*/}
            {/*        </div>*/}

            {/*        <div className="contact-cards-grid">*/}
            {/*            {contactInfo.map((item, index) => {*/}
            {/*                const Icon = item.icon;*/}
            {/*                return (*/}
            {/*                    <div*/}
            {/*                        key={index}*/}
            {/*                        className="contact-card"*/}
            {/*                        data-aos="flip-up"*/}
            {/*                        data-aos-delay={index * 100}*/}
            {/*                    >*/}
            {/*                        <div className="card-inner">*/}
            {/*                            <div className="card-front">*/}
            {/*                                <div className="card-icon-wrapper" style={{ background: item.gradient }}>*/}
            {/*                                    <Icon size={32} color="white" />*/}
            {/*                                </div>*/}
            {/*                                <h3 className="card-title">{item.title}</h3>*/}
            {/*                                <div className="card-details">*/}
            {/*                                    {item.details.map((detail, i) => (*/}
            {/*                                        <p key={i}>{detail}</p>*/}
            {/*                                    ))}*/}
            {/*                                </div>*/}
            {/*                                {item.action && (*/}
            {/*                                    <a href={item.action} className="card-action">*/}
            {/*                                        Contact Now*/}
            {/*                                        <span className="arrow">→</span>*/}
            {/*                                    </a>*/}
            {/*                                )}*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                );*/}
            {/*            })}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/* Main Contact Section */}
            {/*<section className="main-contact-section">*/}
            {/*    <div className="container">*/}
            {/*        <div className="contact-grid">*/}
            {/*            /!* Left Column - Info & Social *!/*/}
            {/*            <div className="contact-info-column" data-aos="fade-right">*/}
            {/*                <div className="info-card">*/}
            {/*                    <h3 className="info-title">Let's Start a Conversation</h3>*/}
            {/*                    <p className="info-description">*/}
            {/*                        Whether you're a student, parent, or school administrator,*/}
            {/*                        we're here to help you make the most of BongoQuiz.*/}
            {/*                    </p>*/}

            {/*                    <div className="info-features">*/}
            {/*                        <div className="info-feature">*/}
            {/*                            <div className="feature-icon">*/}
            {/*                                <MessageCircle size={20} color="#7C3AED" />*/}
            {/*                            </div>*/}
            {/*                            <div>*/}
            {/*                                <h4>Live Chat Available</h4>*/}
            {/*                                <p>Chat with our support team during business hours</p>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                        <div className="info-feature">*/}
            {/*                            <div className="feature-icon">*/}
            {/*                                <Globe size={20} color="#7C3AED" />*/}
            {/*                            </div>*/}
            {/*                            <div>*/}
            {/*                                <h4>Multi-language Support</h4>*/}
            {/*                                <p>English and Swahili support available</p>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                        <div className="info-feature">*/}
            {/*                            <div className="feature-icon">*/}
            {/*                                <Map size={20} color="#7C3AED" />*/}
            {/*                            </div>*/}
            {/*                            <div>*/}
            {/*                                <h4>Visit Our Office</h4>*/}
            {/*                                <p>Schedule a meeting with our team</p>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}

            {/*                    /!* Social Section *!/*/}
            {/*                    <div className="social-section">*/}
            {/*                        <h4>Connect With Us</h4>*/}
            {/*                        <div className="social-grid">*/}
            {/*                            {socialLinks.map((social, index) => {*/}
            {/*                                const Icon = social.icon;*/}
            {/*                                return (*/}
            {/*                                    <a*/}
            {/*                                        key={index}*/}
            {/*                                        href={social.href}*/}
            {/*                                        className="social-card"*/}
            {/*                                        style={{ backgroundColor: `${social.color}10` }}*/}
            {/*                                        target="_blank"*/}
            {/*                                        rel="noopener noreferrer"*/}
            {/*                                    >*/}
            {/*                                        <Icon size={24} color={social.color} />*/}
            {/*                                        <span className="social-label">{social.label}</span>*/}
            {/*                                        <span className="social-followers">{social.followers}</span>*/}
            {/*                                    </a>*/}
            {/*                                );*/}
            {/*                            })}*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}

            {/*            /!* Right Column - Form *!/*/}
            {/*            <div className="contact-form-column" data-aos="fade-left">*/}
            {/*                <div className="form-card">*/}
            {/*                    <div className="form-header">*/}
            {/*                        <h3>Send us a Message</h3>*/}
            {/*                        <p>We'll get back to you within 24 hours</p>*/}
            {/*                    </div>*/}

            {/*                    {submitted ? (*/}
            {/*                        <div className="success-state">*/}
            {/*                            <div className="success-animation">*/}
            {/*                                <CheckCircle size={80} color="#10B981" />*/}
            {/*                            </div>*/}
            {/*                            <h4>Message Sent Successfully!</h4>*/}
            {/*                            <p>Thank you for reaching out. Our team will review your message and get back to you shortly.</p>*/}
            {/*                            <div className="success-actions">*/}
            {/*                                <button*/}
            {/*                                    className="btn-primary"*/}
            {/*                                    onClick={() => {*/}
            {/*                                        setSubmitted(false);*/}
            {/*                                        setFormData({ name: '', email: '', subject: '', message: '' });*/}
            {/*                                    }}*/}
            {/*                                >*/}
            {/*                                    Send Another Message*/}
            {/*                                </button>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    ) : (*/}
            {/*                        <form className="contact-form" onSubmit={handleSubmit}>*/}
            {/*                            <div className="form-row">*/}
            {/*                                <div className="form-group floating-label">*/}
            {/*                                    <input*/}
            {/*                                        type="text"*/}
            {/*                                        id="name"*/}
            {/*                                        name="name"*/}
            {/*                                        value={formData.name}*/}
            {/*                                        onChange={handleChange}*/}
            {/*                                        onFocus={() => setFocusedField('name')}*/}
            {/*                                        onBlur={() => setFocusedField(null)}*/}
            {/*                                        className={errors.name ? 'error' : ''}*/}
            {/*                                        placeholder=" "*/}
            {/*                                    />*/}
            {/*                                    <label htmlFor="name" className={focusedField === 'name' || formData.name ? 'focused' : ''}>*/}
            {/*                                        Full Name <span className="required">*</span>*/}
            {/*                                    </label>*/}
            {/*                                    {errors.name && (*/}
            {/*                                        <span className="error-message">*/}
            {/*                                            <AlertCircle size={14} /> {errors.name}*/}
            {/*                                        </span>*/}
            {/*                                    )}*/}
            {/*                                </div>*/}

            {/*                                <div className="form-group floating-label">*/}
            {/*                                    <input*/}
            {/*                                        type="email"*/}
            {/*                                        id="email"*/}
            {/*                                        name="email"*/}
            {/*                                        value={formData.email}*/}
            {/*                                        onChange={handleChange}*/}
            {/*                                        onFocus={() => setFocusedField('email')}*/}
            {/*                                        onBlur={() => setFocusedField(null)}*/}
            {/*                                        className={errors.email ? 'error' : ''}*/}
            {/*                                        placeholder=" "*/}
            {/*                                    />*/}
            {/*                                    <label htmlFor="email" className={focusedField === 'email' || formData.email ? 'focused' : ''}>*/}
            {/*                                        Email Address <span className="required">*</span>*/}
            {/*                                    </label>*/}
            {/*                                    {errors.email && (*/}
            {/*                                        <span className="error-message">*/}
            {/*                                            <AlertCircle size={14} /> {errors.email}*/}
            {/*                                        </span>*/}
            {/*                                    )}*/}
            {/*                                </div>*/}
            {/*                            </div>*/}

            {/*                            <div className="form-group floating-label">*/}
            {/*                                <select*/}
            {/*                                    id="subject"*/}
            {/*                                    name="subject"*/}
            {/*                                    value={formData.subject}*/}
            {/*                                    onChange={handleChange}*/}
            {/*                                    onFocus={() => setFocusedField('subject')}*/}
            {/*                                    onBlur={() => setFocusedField(null)}*/}
            {/*                                    className={errors.subject ? 'error' : ''}*/}
            {/*                                >*/}
            {/*                                    <option value=""></option>*/}
            {/*                                    <option value="general">General Inquiry</option>*/}
            {/*                                    <option value="support">Technical Support</option>*/}
            {/*                                    <option value="feedback">Feedback</option>*/}
            {/*                                    <option value="partnership">Partnership</option>*/}
            {/*                                    <option value="school">School Registration</option>*/}
            {/*                                </select>*/}
            {/*                                <label htmlFor="subject" className={focusedField === 'subject' || formData.subject ? 'focused' : ''}>*/}
            {/*                                    Subject <span className="required">*</span>*/}
            {/*                                </label>*/}
            {/*                                {errors.subject && (*/}
            {/*                                    <span className="error-message">*/}
            {/*                                        <AlertCircle size={14} /> {errors.subject}*/}
            {/*                                    </span>*/}
            {/*                                )}*/}
            {/*                            </div>*/}

            {/*                            <div className="form-group floating-label">*/}
            {/*                                <textarea*/}
            {/*                                    id="message"*/}
            {/*                                    name="message"*/}
            {/*                                    rows={5}*/}
            {/*                                    value={formData.message}*/}
            {/*                                    onChange={handleChange}*/}
            {/*                                    onFocus={() => setFocusedField('message')}*/}
            {/*                                    onBlur={() => setFocusedField(null)}*/}
            {/*                                    className={errors.message ? 'error' : ''}*/}
            {/*                                    placeholder=" "*/}
            {/*                                />*/}
            {/*                                <label htmlFor="message" className={focusedField === 'message' || formData.message ? 'focused' : ''}>*/}
            {/*                                    Message <span className="required">*</span>*/}
            {/*                                </label>*/}
            {/*                                {errors.message && (*/}
            {/*                                    <span className="error-message">*/}
            {/*                                        <AlertCircle size={14} /> {errors.message}*/}
            {/*                                    </span>*/}
            {/*                                )}*/}
            {/*                            </div>*/}

            {/*                            <button type="submit" className="btn-primary btn-large submit-btn">*/}
            {/*                                <Send size={18} />*/}
            {/*                                Send Message*/}
            {/*                            </button>*/}

            {/*                            <p className="form-note">*/}
            {/*                                By submitting this form, you agree to our*/}
            {/*                                <a href="/privacy"> Privacy Policy</a> and*/}
            {/*                                <a href="/terms"> Terms of Service</a>.*/}
            {/*                            </p>*/}
            {/*                        </form>*/}
            {/*                    )}*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/* FAQ Section */}
            {/*<section className="faq-section">*/}
            {/*    <div className="container">*/}
            {/*        <div className="section-header">*/}
            {/*            <span className="section-badge">FAQ</span>*/}
            {/*            <h2 className="section-title">*/}
            {/*                Frequently Asked <span className="gradient-text">Questions</span>*/}
            {/*            </h2>*/}
            {/*        </div>*/}

            {/*        <div className="faq-grid">*/}
            {/*            {faqs.map((faq, index) => (*/}
            {/*                <div key={index} className="faq-card" data-aos="fade-up" data-aos-delay={index * 100}>*/}
            {/*                    <div className="faq-question">*/}
            {/*                        <span className="question-icon">?</span>*/}
            {/*                        <h3>{faq.question}</h3>*/}
            {/*                    </div>*/}
            {/*                    <p className="faq-answer">{faq.answer}</p>*/}
            {/*                </div>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/* Map Section */}
            {/*<section className="map-section">*/}
            {/*    <div className="container">*/}
            {/*        <div className="map-card">*/}
            {/*            <div className="map-placeholder">*/}
            {/*                <div className="map-overlay">*/}
            {/*                    <MapPin size={48} color="#7C3AED" />*/}
            {/*                    <h3>Visit Our Office</h3>*/}
            {/*                    <p>Westlands Business Park, Nairobi, Kenya</p>*/}
            {/*                    <a*/}
            {/*                        href="https://maps.google.com/?q=Nairobi,Kenya"*/}
            {/*                        className="btn-outline"*/}
            {/*                        target="_blank"*/}
            {/*                        rel="noopener noreferrer"*/}
            {/*                    >*/}
            {/*                        Open in Google Maps*/}
            {/*                    </a>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}
        </div>
    );
};

export default ContactPage;
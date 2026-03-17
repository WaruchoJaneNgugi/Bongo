// components/overlays/SignUpOverlay.tsx
import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import {
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  Smartphone,
  Key,
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  Users,
  Award
} from 'lucide-react';
import type { EducationLevel } from '../../data/quizData';
import '../../styles/SignUpOverlay.css';
import {useNavigate} from "react-router-dom";

type Step = 'account' | 'otp' | 'password' | 'education';

interface FormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  educationLevel: EducationLevel | '';
  otp: string;
}

const SignUpOverlay: React.FC = () => {
  const { setOverlay, login } = useStore();
  const [currentStep, setCurrentStep] = useState<Step>('account');
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    educationLevel: '',
    otp: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
const navigate = useNavigate();
  // Generate random OTP when step becomes 'otp'
  useEffect(() => {
    if (currentStep === 'otp') {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      console.log('📱 Your OTP is:', otp); // In production, this would be sent via SMS
      startOtpTimer();
    }
  }, [currentStep]);

  // OTP Timer
  useEffect(() => {
    // @ts-ignore
    let interval: NodeJS.Timeout;
    if (otpTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [otpTimer, canResend]);

  const startOtpTimer = () => {
    setOtpTimer(60);
    setCanResend(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleEducationSelect = (level: EducationLevel) => {
    setFormData({
      ...formData,
      educationLevel: level
    });
    if (errors.educationLevel) {
      setErrors({ ...errors, educationLevel: '' });
    }
  };

  const validateAccount = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+254|0)[7][0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Enter a valid Kenyan phone number';
    }

    return newErrors;
  };

  const validateOtp = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp !== generatedOtp) {
      newErrors.otp = 'Invalid OTP code';
    }
    return newErrors;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const validateEducation = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.educationLevel) {
      newErrors.educationLevel = 'Please select your education level';
    }
    return newErrors;
  };

  const handleNext = () => {
    let validationErrors = {};

    switch (currentStep) {
      case 'account':
        validationErrors = validateAccount();
        break;
      case 'otp':
        validationErrors = validateOtp();
        break;
      case 'password':
        validationErrors = validatePassword();
        break;
      case 'education':
        validationErrors = validateEducation();
        break;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (currentStep === 'education') {
      // Final submission
      login({
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        educationLevel: formData.educationLevel as EducationLevel
      });
      navigate('/dashboard');
    } else {
      // Move to next step
      const steps: Step[] = ['account', 'otp', 'password', 'education'];
      const currentIndex = steps.indexOf(currentStep);
      setCurrentStep(steps[currentIndex + 1]);
      setErrors({});
    }
  };

  const handleBack = () => {
    const steps: Step[] = ['account', 'otp', 'password', 'education'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      setErrors({});
    }
  };

  const handleResendOtp = () => {
    if (canResend) {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      console.log('📱 New OTP:', newOtp);
      startOtpTimer();
      setFormData({ ...formData, otp: '' });
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: 'Enter password', color: '#9CA3AF' };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/(?=.*[a-z])/.test(password)) score += 1;
    if (/(?=.*[A-Z])/.test(password)) score += 1;
    if(/(?=.*\d)/.test(password)) score += 1;

    const strengths = [
      { score: 0, label: 'Weak', color: '#EF4444' },
      { score: 1, label: 'Fair', color: '#F59E0B' },
      { score: 2, label: 'Good', color: '#3B82F6' },
      { score: 3, label: 'Strong', color: '#10B981' },
      { score: 4, label: 'Very Strong', color: '#10B981' }
    ];

    return strengths[score] || strengths[0];
  };

  const strength = getPasswordStrength(formData.password);

  const educationLevels = [
    {
      id: 'lower_primary',
      label: 'Lower Primary',
      grades: 'Grade 1–3',
      icon: BookOpen,
      color: '#10B981',
      description: 'Building strong foundations'
    },
    {
      id: 'middle_school',
      label: 'Middle School',
      grades: 'Grade 4–9',
      icon: Users,
      color: '#3B82F6',
      description: 'Expanding knowledge'
    },
    {
      id: 'senior_school',
      label: 'Senior School',
      grades: 'Grade 10–12',
      icon: GraduationCap,
      color: '#8B5CF6',
      description: 'Preparing for the future'
    }
  ];

  const renderStepIndicator = () => {
    const steps = [
      { key: 'account', label: 'Account', icon: User },
      { key: 'otp', label: 'Verify', icon: Smartphone },
      { key: 'password', label: 'Security', icon: Lock },
      { key: 'education', label: 'Level', icon: GraduationCap }
    ];

    return (
        <div className="step-indicator">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.key;
            const isCompleted = steps.findIndex(s => s.key === currentStep) > index;

            return (
                <React.Fragment key={step.key}>
                  {index > 0 && <div className={`step-connector ${isCompleted ? 'completed' : ''}`} />}
                  <div className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                    <div className="step-circle">
                      {isCompleted ? <CheckCircle size={16} /> : <Icon size={16} />}
                    </div>
                    <span className="step-label">{step.label}</span>
                  </div>
                </React.Fragment>
            );
          })}
        </div>
    );
  };

  return (
      <div className="overlay-backdrop" onClick={() => setOverlay(null)}>
        <div className="overlay-card signup-overlay" onClick={(e) => e.stopPropagation()}>
          <button className="overlay-close" onClick={() => setOverlay(null)}>✕</button>

          <div className="overlay-logo">BongoQuiz</div>
          <h2 className="overlay-title">Create Account</h2>
          <p className="overlay-subtitle">Start revising for free today!</p>

          {renderStepIndicator()}

          {/* Account Setup Step */}
          {currentStep === 'account' && (
              <div className="step-content">
                <div className="form-group">
                  <div className="form-label">
                    <User size={16} />
                    Username
                  </div>
                  <input
                      className={`form-input ${errors.username ? 'error' : ''}`}
                      name="username"
                      placeholder="e.g. brian_254"
                      value={formData.username}
                      onChange={handleChange}
                  />
                  {errors.username && <span className="error-message">{errors.username}</span>}
                </div>

                <div className="form-group">
                  <div className="form-label">
                    <Mail size={16} />
                    Email Address
                  </div>
                  <input
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      name="email"
                      type="email"
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={handleChange}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <div className="form-label">
                    <Phone size={16} />
                    Phone Number
                  </div>
                  <input
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      name="phone"
                      placeholder="+254 7XX XXX XXX"
                      value={formData.phone}
                      onChange={handleChange}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-info">
                  <Shield size={14} />
                  <span>Your information is secure and encrypted</span>
                </div>
              </div>
          )}

          {/* OTP Verification Step */}
          {currentStep === 'otp' && (
              <div className="step-content">
                <div className="otp-header">
                  <Smartphone size={32} className="otp-icon" />
                  <h3>Verify Your Phone</h3>
                  <p>We've sent a 6-digit code to {formData.phone}</p>
                </div>

                <div className="form-group">
                  <div className="form-label">Enter OTP Code</div>
                  <input
                      className={`form-input otp-input ${errors.otp ? 'error' : ''}`}
                      name="otp"
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={formData.otp}
                      onChange={handleChange}
                  />
                  {errors.otp && <span className="error-message">{errors.otp}</span>}
                </div>

                <div className="otp-timer">
                  {canResend ? (
                      <button className="resend-btn" onClick={handleResendOtp}>
                        Resend Code
                      </button>
                  ) : (
                      <span>Resend in {otpTimer}s</span>
                  )}
                </div>

                <div className="otp-demo-note">
                  <Key size={14} />
                  <span>Demo OTP: {generatedOtp}</span>
                </div>
              </div>
          )}

          {/* Password Setup Step */}
          {currentStep === 'password' && (
              <div className="step-content">
                <div className="form-group">
                  <div className="form-label">Password</div>
                  <div className="password-input-wrapper">
                    <input
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <span className="error-message">{errors.password}</span>}

                  {/* Password Strength Meter */}
                  {formData.password && (
                      <div className="password-strength">
                        <div className="strength-bars">
                          {[1, 2, 3, 4].map((bar) => (
                              <div
                                  key={bar}
                                  className="strength-bar"
                                  style={{
                                    backgroundColor: bar <= strength.score ? strength.color : '#E5E7EB'
                                  }}
                              />
                          ))}
                        </div>
                        <span className="strength-label" style={{ color: strength.color }}>
                                        {strength.label}
                                    </span>
                      </div>
                  )}
                </div>

                <div className="form-group">
                  <div className="form-label">Confirm Password</div>
                  <div className="password-input-wrapper">
                    <input
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>

                <div className="password-requirements">
                  <p>Password must contain:</p>
                  <ul>
                    <li className={formData.password.length >= 8 ? 'met' : ''}>
                      <CheckCircle size={12} /> At least 8 characters
                    </li>
                    <li className={/(?=.*[a-z])/.test(formData.password) ? 'met' : ''}>
                      <CheckCircle size={12} /> One lowercase letter
                    </li>
                    <li className={/(?=.*[A-Z])/.test(formData.password) ? 'met' : ''}>
                      <CheckCircle size={12} /> One uppercase letter
                    </li>
                    <li className={/(?=.*\d)/.test(formData.password) ? 'met' : ''}>
                      <CheckCircle size={12} /> One number
                    </li>
                  </ul>
                </div>
              </div>
          )}

          {/* Education Level Step */}
          {currentStep === 'education' && (
              <div className="step-content">
                <div className="education-header">
                  <GraduationCap size={32} className="education-icon" />
                  <h3>What's your education level?</h3>
                  <p>Select your current class to get personalized content</p>
                </div>

                <div className="education-grid">
                  {educationLevels.map((level) => {
                    const Icon = level.icon;
                    const isSelected = formData.educationLevel === level.id;

                    return (
                        <button
                            key={level.id}
                            className={`education-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleEducationSelect(level.id as EducationLevel)}
                            style={{
                              borderColor: isSelected ? level.color : '#E5E7EB',
                              background: isSelected ? `${level.color}10` : 'white'
                            }}
                        >
                          <div className="card-icon" style={{ background: `${level.color}20` }}>
                            <Icon size={24} color={level.color} />
                          </div>
                          <div className="card-content">
                            <h4>{level.label}</h4>
                            <p className="card-grades">{level.grades}</p>
                            <p className="card-description">{level.description}</p>
                          </div>
                          {isSelected && (
                              <div className="selected-check">
                                <CheckCircle size={20} color={level.color} />
                              </div>
                          )}
                        </button>
                    );
                  })}
                </div>
                {errors.educationLevel && (
                    <span className="error-message center">{errors.educationLevel}</span>
                )}

                <div className="education-features">
                  <div className="feature-item">
                    <Award size={16} color="#8B5CF6" />
                    <span>Curriculum aligned content</span>
                  </div>
                  <div className="feature-item">
                    <BookOpen size={16} color="#8B5CF6" />
                    <span>Personalized learning path</span>
                  </div>
                </div>
              </div>
          )}

          {/* Navigation Buttons */}
          <div className="step-navigation">
            {currentStep !== 'account' && (
                <button className="nav-btn back" onClick={handleBack}>
                  <ArrowLeft size={18} />
                  Back
                </button>
            )}
            <button className="nav-btn next" onClick={handleNext}>
              {currentStep === 'education' ? 'Create Account' : 'Continue'}
              <ArrowRight size={18} />
            </button>
          </div>

          <p className="form-footer">
            Already have an account?{' '}
            <button className="form-link" onClick={() => setOverlay('login')}>
              Log In
            </button>
          </p>
        </div>
      </div>
  );
};

export default SignUpOverlay;
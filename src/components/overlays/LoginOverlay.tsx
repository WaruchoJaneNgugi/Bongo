import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import type { EducationLevel } from '../../data/quizData';
import { useNavigate } from "react-router-dom";
import { Phone, Lock, ArrowRight, Shield } from 'lucide-react';

const LoginOverlay: React.FC = () => {
  const { setOverlay, login } = useStore();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validatePhoneNumber = (phone: string) => {
    // Kenyan phone number validation
    const cleaned = phone.replace(/\s/g, '');
    return /^(\+254|0)[7][0-9]{8}$/.test(cleaned);
  };

  const handleSubmit = async () => {
    if (!form.phone || !form.password) {
      setError('Please enter your phone number and password.');
      return;
    }

    if (!validatePhoneNumber(form.phone)) {
      setError('Please enter a valid Kenyan phone number (e.g., 0712345678 or +254712345678)');
      return;
    }

    if (form.password.length < 6) {
      setError('Invalid phone number or password.');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Demo login — in production this would call an API
      const cleanedPhone = form.phone.replace(/\s/g, '');
      login({
        username: cleanedPhone.slice(-9), // Use last 9 digits as username for demo
        phone: cleanedPhone,
        educationLevel: 'middle_school' as EducationLevel, // Default level
      });
      setIsLoading(false);
      navigate('/');
      setOverlay(null);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
      <div className="overlay-backdrop" onClick={() => setOverlay(null)}>
        <div className="overlay-card login-overlay" onClick={(e) => e.stopPropagation()}>
          <button className="overlay-close" onClick={() => setOverlay(null)}>✕</button>

          <div className="overlay-logo">
            <span className="logo-text">Bongo<span>Quiz</span></span>
          </div>

          <h2 className="overlay-title">Welcome Back! 👋</h2>
          <p className="overlay-subtitle">Continue your learning journey</p>

          {error && (
              <div className="error-message show">
                <Shield size={16} />
                <span>{error}</span>
              </div>
          )}

          <div className="form-group">
            <div className="form-label">
              <Phone size={18} />
              <span>Phone Number</span>
            </div>
            <input
                className={`form-input ${error && !form.phone ? 'error' : ''}`}
                name="phone"
                type="tel"
                placeholder="0712 345 678"
                value={form.phone}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
            />
            <small className="input-hint">Enter Kenyan phone number (e.g., 0712345678)</small>
          </div>

          <div className="form-group">
            <div className="form-label">
              <Lock size={18} />
              <span>Password</span>
            </div>
            <input
                className={`form-input ${error && !form.password ? 'error' : ''}`}
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
            />
          </div>

          <button
              className={`form-submit ${isLoading ? 'loading' : ''}`}
              onClick={handleSubmit}
              disabled={isLoading}
          >
            {isLoading ? (
                <span>Logging in...</span>
            ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight size={20} />
                </>
            )}
          </button>

          <div className="form-footer">
            <p>
              Don't have an account?{' '}
              <button className="form-link" onClick={() => setOverlay('signup')}>
                Sign Up Free
              </button>
            </p>
          </div>


        </div>
      </div>
  );
};

export default LoginOverlay;
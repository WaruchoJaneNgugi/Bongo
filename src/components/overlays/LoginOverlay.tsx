import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import type { EducationLevel } from '../../data/quizData';
import {useNavigate} from "react-router-dom";

const LoginOverlay: React.FC = () => {
  const { setOverlay, login } = useStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = () => {
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    if (form.password.length < 6) {
      setError('Invalid email or password.');
      return;
    }
    // Demo login — in production this would call an API
    const username = form.email.split('@')[0];
    login({
      username,
      email: form.email,
      phone: '',
      educationLevel: 'middle_school' as EducationLevel,
    });
    navigate('/dashboard');
  };

  return (
    <div className="overlay-backdrop" onClick={() => setOverlay(null)}>
      <div className="overlay-card" onClick={(e) => e.stopPropagation()}>
        <button className="overlay-close" onClick={() => setOverlay(null)}>✕</button>

        <div className="overlay-logo">BongoQuiz</div>
        <h2 className="overlay-title">Welcome Back!</h2>
        <p className="overlay-subtitle">Continue your revision journey</p>

        {error && <div className="error-msg">{error}</div>}

        <div className="form-group">
          <div className="form-label">Email Address</div>
          <input
            className="form-input"
            name="email"
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <div className="form-label">Password</div>
          <input
            className="form-input"
            name="password"
            type="password"
            placeholder="Your password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button className="form-submit" onClick={handleSubmit}>
          Log In
        </button>

        <p className="form-footer">
          Don't have an account?{' '}
          <button className="form-link" onClick={() => setOverlay('signup')}>
            Sign Up Free
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginOverlay;

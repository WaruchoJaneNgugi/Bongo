import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import type { EducationLevel } from '../../data/quizData';

const SignUpOverlay: React.FC = () => {
  const { setOverlay, login } = useStore();
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    educationLevel: '' as EducationLevel | '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = () => {
    const { username, email, phone, password, educationLevel } = form;
    if (!username || !email || !phone || !password || !educationLevel) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    login({ username, email, phone, educationLevel: educationLevel as EducationLevel });
    setOverlay('dashboard');
  };

  return (
    <div className="overlay-backdrop" onClick={() => setOverlay(null)}>
      <div className="overlay-card" onClick={(e) => e.stopPropagation()}>
        <button className="overlay-close" onClick={() => setOverlay(null)}>✕</button>

        <div className="overlay-logo">BongoQuiz</div>
        <h2 className="overlay-title">Create Account</h2>
        <p className="overlay-subtitle">Start revising for free today!</p>

        {error && <div className="error-msg">{error}</div>}

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            className="form-input"
            name="username"
            placeholder="e.g. brian_254"
            value={form.username}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
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
          <label className="form-label">Phone Number</label>
          <input
            className="form-input"
            name="phone"
            placeholder="+254 7XX XXX XXX"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            name="password"
            type="password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Education Level</label>
          <select
            className="form-select"
            name="educationLevel"
            value={form.educationLevel}
            onChange={handleChange}
          >
            <option value="">Select your level...</option>
            <option value="lower_primary">Lower Primary (Grade 1–3)</option>
            <option value="middle_school">Middle School (Grade 4–9)</option>
            <option value="senior_school">Senior School (Grade 10–12)</option>
          </select>
        </div>

        <button className="form-submit" onClick={handleSubmit}>
          Create Account
        </button>

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

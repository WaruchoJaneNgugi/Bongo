import React, {useState} from 'react';
import {useStore} from '../../store/useStore';
import {useNavigate} from "react-router-dom";
import {Phone, Lock, ArrowRight, Shield} from 'lucide-react';

const LoginOverlay: React.FC = () => {
    const {setOverlay, login, users} = useStore(); // Get users from store
    const [form, setForm] = useState({phone: '', password: ''});
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
        setError('');
    };

    const validatePhoneNumber = (phone: string) => {
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

        setIsLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            const cleanedPhone = form.phone.replace(/\s/g, '');

            // Find user in the stored users array
            const foundUser = users.find(u => u.phone === cleanedPhone);

            if (foundUser) {
                // Check password (in real app, you'd compare hashed passwords)
                if (foundUser.password === form.password) {
                    // Login successful - remove password before storing in user state
                    const {password, ...userWithoutPassword} = foundUser;

                    login(userWithoutPassword);

                    setIsLoading(false);

                    // Navigate based on education level
                    const levelRoutes = {
                        lower_primary: '/level/lower-primary',
                        middle_school: '/level/middle-school',
                        senior_school: '/level/senior-school'
                    };

                    navigate(levelRoutes[foundUser.educationLevel]);
                    setOverlay(null);
                } else {
                    setError('Invalid password.');
                    setIsLoading(false);
                }
            } else {
                setError('No account found with this phone number. Please sign up first.');
                setIsLoading(false);
            }
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    // Optional: Show demo users that have been registered
    // const getDemoUsers = () => {
    //     if (users.length > 0) {
    //         return users.slice(0, 3); // Show first 3 registered users
    //     }
    //     return [];
    // };

    // const demoUsers = getDemoUsers();

    return (
        <div className="overlay-backdrop" onClick={() => setOverlay(null)}>
            <div className="overlay-card login-overlay" onClick={(e) => e.stopPropagation()}>
                <button className="overlay-close" onClick={() => setOverlay(null)}>✕</button>

                <div className="overlay-logo">
                    <span className="logo-text">Bongo<span>Quiz</span></span>
                </div>

                <h2 className="overlay-title">Welcome Back! 👋🏾</h2>
                <p className="overlay-subtitle">Continue your learning journey</p>

                {error && (
                    <div className="error-message show">
                        <Shield size={16}/>
                        <span>{error}</span>
                    </div>
                )}

                <div className="form-group">
                    <div className="form-label">
                        <Phone size={18}/>
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
                        <Lock size={18}/>
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
                            <ArrowRight size={20}/>
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
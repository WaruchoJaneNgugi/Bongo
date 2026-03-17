import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/globals.css';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import SignUpOverlay from './components/overlays/SignUpOverlay';
import LoginOverlay from './components/overlays/LoginOverlay';
import ContactPage from "./components/ContactPage";
import AboutPage from "./components/AboutPage";
import LowerPrimaryDashboard from './components/level/LowerPrimaryDashboard';
import MiddleSchoolDashboard from './components/level/MiddleSchoolDashboard';
import SeniorSchoolDashboard from './components/level/SeniorSchoolDashboard';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoggedIn } = useStore();
    return isLoggedIn ? <>{children}</> : <Navigate to="/" />;
};

const AppContent: React.FC = () => {
    const { overlay, user } = useStore();

    return (
        <div>
            <Navbar />

            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Protected level routes - only accessible if logged in */}
                <Route
                    path="/level/lower-primary"
                    element={
                        <ProtectedRoute>
                            <LowerPrimaryDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/level/middle-school"
                    element={
                        <ProtectedRoute>
                            <MiddleSchoolDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/level/senior-school"
                    element={
                        <ProtectedRoute>
                            <SeniorSchoolDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Redirect /level to appropriate dashboard based on user's level */}
                <Route
                    path="/level"
                    element={
                        <ProtectedRoute>
                            {user?.educationLevel === 'lower_primary' && <Navigate to="/level/lower-primary" />}
                            {user?.educationLevel === 'middle_school' && <Navigate to="/level/middle-school" />}
                            {user?.educationLevel === 'senior_school' && <Navigate to="/level/senior-school" />}
                            <Navigate to="/" />
                        </ProtectedRoute>
                    }
                />

                {/* Subject routes (to be implemented) */}
                <Route path="/subject/:subjectId" element={
                    <ProtectedRoute>
                        <div>Subject Content Coming Soon</div>
                    </ProtectedRoute>
                } />
            </Routes>

            {/* Overlays */}
            {overlay === 'signup' && <SignUpOverlay />}
            {overlay === 'login' && <LoginOverlay />}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
};

export default App;
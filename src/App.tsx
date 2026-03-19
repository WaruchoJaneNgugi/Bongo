import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/globals.css';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import SignUpOverlay from './components/overlays/SignUpOverlay';
import LoginOverlay from './components/overlays/LoginOverlay';
import ContactPage from "./components/ContactPage";
import LowerPrimaryDashboard from './components/level/LowerPrimaryDashboard';
import MiddleSchoolDashboard from './components/level/MiddleSchoolDashboard';
import SeniorSchoolDashboard from './components/level/SeniorSchoolDashboard';
import AboutPage from "./components/AboutPage.tsx";
import StudentProfile from "./components/StudentProfile.tsx";
import NotFound from "./components/404/NotFound.tsx";


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
                <Route path="/"        element={<LandingPage />}    />
                <Route path="/about"   element={<AboutPage />}      />
                <Route path="/contact" element={<ContactPage />}    />
                <Route path="/profile" element={<StudentProfile />} />

                {/* Protected level routes */}
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

                {/* Redirect /level to the appropriate dashboard */}
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

                {/* 404 – catches every unmatched path */}
                <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Overlays */}
            {overlay === 'signup' && <SignUpOverlay />}
            {overlay === 'login'  && <LoginOverlay  />}
        </div>
    );
};

const App: React.FC = () => (
    <BrowserRouter>
        <AppContent />
    </BrowserRouter>
);

export default App;
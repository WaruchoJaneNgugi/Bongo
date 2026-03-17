// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/globals.css';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import SignUpOverlay from './components/overlays/SignUpOverlay';
import LoginOverlay from './components/overlays/LoginOverlay';
import DashboardOverlay from './components/overlays/DashboardOverlay';
import SubjectsOverlay from './components/overlays/SubjectsOverlay';
import QuizOverlay from './components/overlays/QuizOverlay';
import ResultsOverlay from './components/overlays/ResultsOverlay';
import ContactPage from "./components/ContactPage.tsx";
import LevelLayout from "./components/overlays/LevelLayout.tsx";
import AboutPage from "./components/AboutPage.tsx";

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
                <Route path="/subjects" element={<SubjectsOverlay />} />

                {/* Protected level routes - only accessible if logged in */}
                <Route
                    path="/level"
                    element={user ? <LevelLayout /> : <Navigate to="/" />}
                >
                    <Route path="lower-primary" element={<div>Lower Primary Content (Coming Soon)</div>} />
                    <Route path="middle-school" element={<div>Middle School Content (Coming Soon)</div>} />
                    <Route path="senior-school" element={<div>Senior School Content (Coming Soon)</div>} />
                </Route>
            </Routes>

            {/* Overlays remain the same */}
            {overlay === 'signup' && <SignUpOverlay />}
            {overlay === 'login' && <LoginOverlay />}
            {overlay === 'dashboard' && <DashboardOverlay />}
            {/*{overlay === 'subjects' && <SubjectsOverlay />}*/}
            {overlay === 'quiz' && <QuizOverlay />}
            {overlay === 'results' && <ResultsOverlay />}
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
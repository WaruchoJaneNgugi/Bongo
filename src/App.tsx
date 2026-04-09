import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles/globals.css';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import { SplashScreen } from './components/SplashScreen';
import LandingPage from './components/LandingPage';
import SignUpOverlay from './components/overlays/SignUpOverlay';
import LoginOverlay from './components/overlays/LoginOverlay';
import ProfileSelectOverlay from './components/overlays/ProfileSelectOverlay';
import GamesPage from './components/GamesPage';
import AboutPage from './components/AboutPage';
import StudentProfile from './components/StudentProfile';
import DashboardPage from './components/DashboardPage';
import NotFound from './components/404/NotFound';
import {MiddleSchoolDashboard} from "./components/level/MiddleSchoolDashboard.tsx";
import {LowerPrimaryDashboard} from "./components/level/LowerPrimaryDashboard.tsx";
import {SeniorSchoolDashboard} from "./components/level/SeniorSchoolDashboard.tsx";
import {MainLevelEntry} from "./components/level/MainlevelEntry.tsx";
import {ZenMain} from "./components/games/Mahjong/components/ZenMain.tsx";

const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      o: Math.random(),
      speed: Math.random() * 0.004 + 0.002,
    }));
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.o += s.speed;
        if (s.o > 1) s.o = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.abs(Math.sin(s.o * Math.PI))})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useStore();
  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
};

const AppContent: React.FC = () => {
  const { overlay, isLoggedIn } = useStore();
  const location = useLocation();
  const isGames = location.pathname === '/games';

  useEffect(() => {
    document.body.classList.toggle('games-bg', isGames);
    return () => document.body.classList.remove('games-bg');
  }, [isGames]);

  return (
    <div className={`main-body-container${isGames ? ' games-mode' : ''}`}>
      {isGames && <StarField />}
      <Navbar />

      <Routes>
        <Route path="/"        element={isLoggedIn ? <Navigate to="/home" replace /> : <LandingPage />} />
        <Route path="/about"   element={<AboutPage />} />
        <Route path="/games"   element={<GamesPage />} />
        <Route path="/profile" element={<StudentProfile />} />

        <Route path="/games/mahjong" element={<ZenMain />} />

        <Route path="/profile-select"      element={<ProtectedRoute><ProfileSelectOverlay /></ProtectedRoute>} />
        <Route path="/home"               element={<ProtectedRoute><MainLevelEntry /></ProtectedRoute>} />
        <Route path="/dashboard"          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/level/lower-primary" element={<ProtectedRoute><LowerPrimaryDashboard /></ProtectedRoute>} />
        <Route path="/level/middle-school" element={<ProtectedRoute><MiddleSchoolDashboard /></ProtectedRoute>} />
        <Route path="/level/senior-school" element={<ProtectedRoute><SeniorSchoolDashboard /></ProtectedRoute>} />

        <Route path="/level" element={<ProtectedRoute><Navigate to="/home" replace /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {overlay === 'signup' && <SignUpOverlay />}
      {overlay === 'login'  && <LoginOverlay />}
      {overlay === 'profile-select' && <ProfileSelectOverlay />}
    </div>
  );
};

const App: React.FC = () => {
  const [ready, setReady] = useState(false);
  return (
    <BrowserRouter>
      {!ready && <SplashScreen onDone={() => setReady(true)} />}
      <AppContent />
    </BrowserRouter>
  );
};

export default App;

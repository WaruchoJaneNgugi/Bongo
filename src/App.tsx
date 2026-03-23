import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/globals.css';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import SignUpOverlay from './components/overlays/SignUpOverlay';
import LoginOverlay from './components/overlays/LoginOverlay';
import GamesPage from './components/GamesPage';
import LowerPrimaryDashboard from './components/level/LowerPrimaryDashboard';
import MiddleSchoolDashboard from './components/level/MiddleSchoolDashboard';
import SeniorSchoolDashboard from './components/level/SeniorSchoolDashboard';
import AboutPage from './components/AboutPage';
import StudentProfile from './components/StudentProfile';
import DashboardPage from './components/DashboardPage';
import NotFound from './components/404/NotFound';
// import {ZenMain} from "./components/games/zen-mahjong/src/components/ZenMain.tsx";
// import {BongoMain} from "./components/games/BongoQuiz/component/BongoMain.tsx";
// import {SudokuMain} from "./components/games/Sudoku/SudokuMain.tsx";
// import {MathQuiz} from "./components/games/MathQuiz/MathQuiz.tsx";
// import {KiswahiliQuiz} from "./components/games/KiswahiliQuiz/Kiswahili.tsx";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useStore();
  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
};

const AppContent: React.FC = () => {
  const { overlay, user } = useStore();

  const levelRoute = () => {
    if (user?.type !== 'student') return '/';
    const routes = {
      lower_primary: '/level/lower-primary',
      middle_school: '/level/middle-school',
      senior_school: '/level/senior-school',
    };
    return routes[user.educationLevel] ?? '/';
  };

  return (
    <div className="main-body-container">
      <Navbar />

      <Routes>
        <Route path="/"        element={<LandingPage />} />
        <Route path="/about"   element={<AboutPage />} />
        <Route path="/games"   element={<GamesPage />} />
        <Route path="/profile" element={<StudentProfile />} />

        {/*<Route path="/games/mahjong" element={<ZenMain />} />*/}
        {/*<Route path="/games/bongo-quiz" element={<BongoMain />} />*/}
        {/*<Route path="/games/sudoku" element={<SudokuMain />} />*/}
        {/*<Route path="/games/math-quiz" element={<MathQuiz />} />*/}
        {/*<Route path="/games/kiswahili-quiz" element={<KiswahiliQuiz />} />*/}

        <Route path="/dashboard"          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/level/lower-primary" element={<ProtectedRoute><LowerPrimaryDashboard /></ProtectedRoute>} />
        <Route path="/level/middle-school" element={<ProtectedRoute><MiddleSchoolDashboard /></ProtectedRoute>} />
        <Route path="/level/senior-school" element={<ProtectedRoute><SeniorSchoolDashboard /></ProtectedRoute>} />

        <Route path="/level" element={<ProtectedRoute><Navigate to={levelRoute()} replace /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {overlay === 'signup' && <SignUpOverlay />}
      {overlay === 'login'  && <LoginOverlay />}
    </div>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;

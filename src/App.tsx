import React from 'react';
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

const App: React.FC = () => {
  const { overlay } = useStore();

  return (
    <div>
      <Navbar />
      <LandingPage />

      {overlay === 'signup'    && <SignUpOverlay />}
      {overlay === 'login'     && <LoginOverlay />}
      {overlay === 'dashboard' && <DashboardOverlay />}
      {overlay === 'subjects'  && <SubjectsOverlay />}
      {overlay === 'quiz'      && <QuizOverlay />}
      {overlay === 'results'   && <ResultsOverlay />}
    </div>
  );
};

export default App;

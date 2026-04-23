/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { subjects } from './utils/content';
import type { Subject, Topic } from './types/types';
import { useProgress } from './utils/progress';
import LevelSelect from './components/LevelSelect';
import GradeSelect from './components/GradeSelect';
import SubjectList from './components/SubjectList';
import TopicList from './components/TopicList';
import TopicDetail from './components/TopicDetail';
import Quiz from './components/Quiz';
import { ArrowLeft, BookOpen } from 'lucide-react';

type AppState = 'level' | 'grade' | 'subjects' | 'topics' | 'learning' | 'quiz';

export default function App() {
  const [appState, setAppState] = useState<AppState>('level');
  const [selectedLevel, setSelectedLevel] = useState<'upper_primary' | 'junior_secondary' | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const { progress, updateProgress, getSubjectProgress } = useProgress();

  const handleSelectLevel = (level: 'upper_primary' | 'junior_secondary') => {
    setSelectedLevel(level);
    setAppState('grade');
  };

  const handleSelectGrade = (grade: number) => {
    setSelectedGrade(grade);
    setAppState('subjects');
  };

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setAppState('topics');
  };

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setAppState('learning');
    if (progress[topic.id]?.status !== 'completed') {
      updateProgress(topic.id, 'in_progress');
    }
  };

  const handleStartQuiz = () => {
    setAppState('quiz');
  };

  const handleQuizComplete = (score: number, total: number) => {
    if (selectedTopic) {
      updateProgress(selectedTopic.id, 'completed', score, total);
    }
  };

  const handleBack = () => {
    switch (appState) {
      case 'grade': setAppState('level'); break;
      case 'subjects': setAppState('grade'); break;
      case 'topics': setAppState('subjects'); break;
    }
  };

  const getBackText = () => {
    switch (appState) {
      case 'grade': return 'Levels';
      case 'subjects': return `Grade ${selectedGrade}`;
      case 'topics': return 'Subjects';
      default: return 'Back';
    }
  };

  const getHeaderTitle = () => {
    if (appState === 'topics' && selectedSubject) {
      return selectedSubject.title;
    }
    return 'Elimu App';
  };

  const HeaderIcon = (appState === 'topics' && selectedSubject) ? selectedSubject.icon : BookOpen;

  return (
      <div className="mlearn-app-wrapper">
        <div className="mlearn-app-container">
          {['level', 'grade', 'subjects', 'topics'].includes(appState) && (
              <header className="mlearn-app-header">
                <div className="mlearn-app-header-content" style={{ position: 'relative' }}>
                  {appState !== 'level' && (
                      <button
                          onClick={handleBack}
                          className="mlearn-btn-back"
                          style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', marginBottom: 0 }}
                      >
                        <ArrowLeft size={20} />
                        <span className="mlearn-back-text">Back to {getBackText()}</span>
                      </button>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <HeaderIcon size={appState === 'topics' ? 24 : 28} />
                    <h1 className="mlearn-app-title">{getHeaderTitle()}</h1>
                  </div>
                </div>
              </header>
          )}

          <main className="mlearn-app-main">
            {appState === 'level' && (
                <LevelSelect onSelect={handleSelectLevel} />
            )}

            {appState === 'grade' && selectedLevel && (
                <GradeSelect
                    level={selectedLevel}
                    onSelect={handleSelectGrade}
                    onBack={() => setAppState('level')}
                />
            )}

            {appState === 'subjects' && selectedGrade && (
                <SubjectList
                    subjects={subjects}
                    selectedGrade={selectedGrade}
                    onSelectSubject={handleSelectSubject}
                    getSubjectProgress={getSubjectProgress}
                    onBack={() => setAppState('grade')}
                />
            )}

            {appState === 'topics' && selectedSubject && selectedGrade && (
                <TopicList
                    subject={selectedSubject}
                    selectedGrade={selectedGrade}
                    progress={progress}
                    onBack={() => setAppState('subjects')}
                    onSelectTopic={handleSelectTopic}
                />
            )}

            {appState === 'learning' && selectedTopic && (
                <TopicDetail
                    topic={selectedTopic}
                    onBack={() => setAppState('topics')}
                    onStartQuiz={handleStartQuiz}
                />
            )}

            {appState === 'quiz' && selectedTopic && (
                <Quiz
                    topic={selectedTopic}
                    onBack={() => setAppState('topics')}
                    onComplete={handleQuizComplete}
                />
            )}
          </main>
        </div>
      </div>
  );
}


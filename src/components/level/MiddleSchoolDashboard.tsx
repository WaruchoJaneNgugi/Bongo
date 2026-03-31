import { useState, useCallback } from 'react';
import type {SchoolLevel, ClassName, Term, Subject, Question} from './MiddleSchool/types';
import { getQuestions } from './MiddleSchool/data/questions';
import LevelSelector from './MiddleSchool/components/LevelSelector';
import ClassSelector from './MiddleSchool/components/ClassSelector';
import TermSelector from './MiddleSchool/components/TermSelector';
import SubjectList from './MiddleSchool/components/SubjectList';
import PreExam from './MiddleSchool/components/PreExam';
import Timer from './MiddleSchool/components/Timer';
import ExamManager from './MiddleSchool/components/ExamManager';
import ResultsView from './MiddleSchool/components/ResultsView';
import './MiddleSchool/styles/styles.css';
import { BookOpen, ChevronLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';

type AppState = 'level' | 'class' | 'term' | 'subject' | 'timer' | 'exam' | 'results';

const SUBJECT_DURATIONS: Record<string, number> = {
  'Mathematics': 3,
  'English': 2,
  'Science': 2,
  'Social Studies': 2,
  'CRE': 1,
};

export const MiddleSchoolDashboard=()=> {
  const { levelSelections, setLevelSelection } = useStore();
  const saved = levelSelections.middle_school;

  // If level saved → skip level selector, land on class picker
  // If both level + className saved → skip both, land on term picker
  const initialState: AppState = saved?.className ? 'term' : saved?.level ? 'class' : 'level';

  const [appState, setAppState] = useState<AppState>(initialState);
  const [level, setLevel] = useState<SchoolLevel>((saved?.level as SchoolLevel) || null);
  const [className, setClassName] = useState<ClassName>((saved?.className as ClassName) || null);
  const [term, setTerm] = useState<Term>(null);
  const [subject, setSubject] = useState<Subject>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [forceSubmit, setForceSubmit] = useState(false);

  const navigate = (
      newState: AppState,
      updates: {
        level?: SchoolLevel | null,
        className?: ClassName | null,
        term?: Term | null,
        subject?: Subject | null,
        questions?: Question[],
        answers?: Record<number, string>
      } = {}
  ) => {
    setAppState(newState);
    if ('level' in updates) setLevel(updates.level!);
    if ('className' in updates) setClassName(updates.className!);
    if ('term' in updates) setTerm(updates.term!);
    if ('subject' in updates) setSubject(updates.subject!);
    if ('questions' in updates) setQuestions(updates.questions!);
    if ('answers' in updates) setAnswers(updates.answers!);
  };

  const handleSelectLevel = (selectedLevel: SchoolLevel) => {
    setLevelSelection('middle_school', { level: selectedLevel, className: '' });
    navigate('class', { level: selectedLevel });
  };

  const handleSelectClass = (selectedClass: ClassName) => {
    setLevelSelection('middle_school', { level: level as string, className: selectedClass });
    navigate('term', { className: selectedClass });
  };

  const handleSelectTerm = (selectedTerm: Term) => {
    navigate('subject', { term: selectedTerm });
  };

  const handleSelectSubject = (selectedSubject: Subject) => {
    let newQuestions = questions;
    if (className && term && selectedSubject) {
      newQuestions = getQuestions(className, term, selectedSubject);
    }
    navigate('timer', { subject: selectedSubject, questions: newQuestions });
  };

  const handleStartExam = () => {
    setForceSubmit(false);
    navigate('exam');
  };

  const handleTimeUp = useCallback(() => {
    setForceSubmit(true);
  }, []);

  const handleExamSubmit = (submittedAnswers: Record<number, string>) => {
    navigate('results', { answers: submittedAnswers });
  };

  const handleRestart = () => {
    setForceSubmit(false);
    setLevelSelection('middle_school', undefined as any);
    navigate('level', { level: null, className: null, term: null, subject: null, questions: [], answers: {} });
  };

  const handleTakeAnotherExam = () => {
    setForceSubmit(false);
    navigate('subject', { subject: null, questions: [], answers: {} });
  };

  const handleBack = () => {
    const backMap: Partial<Record<AppState, AppState>> = {
      class: 'level', term: 'class', subject: 'term', timer: 'subject', exam: 'timer',
    };
    const prev = backMap[appState];
    if (prev === 'level') {
      setLevelSelection('middle_school', undefined as any);
      navigate('level', { level: null, className: null });
    } else if (prev === 'class') {
      setLevelSelection('middle_school', { level: level as string, className: '' });
      navigate('class', { className: null });
    } else if (prev) {
      navigate(prev);
    }
  };

  return (
      <div className={`app-container ${appState === 'level' ? 'landing-mode-bg' : ''} ${appState === 'exam' ? 'exam-mode-container' : ''}`}>
        <header className="header">
          <div className="header-content">
            {appState !== 'level' && appState !== 'results' && appState !== 'exam' ? (
                <button onClick={handleBack} className="btn-back-mobile" style={{ color: '#4f7396', padding: 0 }}>
                  <ChevronLeft size={24} />
                  <span>Back</span>
                </button>
            ) : (
                <div className="logo" onClick={appState === 'exam' ? undefined : handleRestart} style={{ cursor: appState === 'exam' ? 'default' : 'pointer' }}>
                  <div className="logo-icon">
                    <BookOpen size={24} />
                  </div>
                  <h1 className={`text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600 font-bold animate-gradient-x ${appState === 'exam' ? 'hidden-on-mobile' : ''}`}>Middle School</h1>
                </div>
            )}

            {appState === 'exam' && subject && (
                <Timer
                    durationMinutes={SUBJECT_DURATIONS[subject] || 20}
                    onTimeUp={handleTimeUp}
                />
            )}

            {appState === 'exam' && subject && (
                <div className="header-subject">{subject}</div>
            )}
          </div>
        </header>

        <main className={`main-content ${appState === 'exam' ? 'exam-mode' : ''} ${appState === 'level' ? 'landing-mode' : ''} ${appState === 'timer' ? 'timer-mode' : ''}`}>
          {appState === 'level' && <LevelSelector onSelect={handleSelectLevel} />}
          {appState === 'class' && level && (
              <ClassSelector
                  level={level}
                  onSelect={handleSelectClass}
                  onBack={() => setAppState('level')}
              />
          )}
          {appState === 'term' && className && (
              <TermSelector
                  className={className}
                  onSelect={handleSelectTerm}
                  onBack={() => setAppState('class')}
              />
          )}
          {appState === 'subject' && className && term && (
              <SubjectList
                  className={className}
                  term={term}
                  onSelect={handleSelectSubject}
                  onBack={() => setAppState('term')}
              />
          )}
          {appState === 'timer' && subject && (
              <PreExam
                  subject={subject}
                  durationMinutes={SUBJECT_DURATIONS[subject] || 20}
                  questionCount={questions.length}
                  onStart={handleStartExam}
                  onBack={handleBack}
              />
          )}
          {appState === 'exam' && questions.length > 0 && (
              <ExamManager
                  questions={questions}
                  subject={subject!}
                  forceSubmit={forceSubmit}
                  onSubmit={handleExamSubmit}
                  onBack={() => setAppState('timer')}
              />
          )}
          {appState === 'results' && (
              <ResultsView
                  questions={questions}
                  answers={answers}
                  onRestart={handleTakeAnotherExam}
              />
          )}
        </main>
      </div>
  );
}

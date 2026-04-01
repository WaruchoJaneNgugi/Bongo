import { useState, useCallback } from 'react';
import type {ClassName, Term, Subject, Question} from './MiddleSchool/types';
import { getQuestions } from './MiddleSchool/data/questions';
import TermSelector from './MiddleSchool/components/TermSelector';
import SubjectList from './MiddleSchool/components/SubjectList';
import PreExam from './MiddleSchool/components/PreExam';
import Timer from './MiddleSchool/components/Timer';
import ExamManager from './MiddleSchool/components/ExamManager';
import ResultsView from './MiddleSchool/components/ResultsView';
import './MiddleSchool/styles/styles.css';
import { BookOpen, ChevronLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';

type AppState = 'term' | 'subject' | 'timer' | 'exam' | 'results';

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

  const [appState, setAppState] = useState<AppState>('term');
  const [className, setClassName] = useState<ClassName>((saved?.className as ClassName) || null);
  const [term, setTerm] = useState<Term>(null);
  const [subject, setSubject] = useState<Subject>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [forceSubmit, setForceSubmit] = useState(false);

  const navigate = (
      newState: AppState,
      updates: {
        className?: ClassName | null,
        term?: Term | null,
        subject?: Subject | null,
        questions?: Question[],
        answers?: Record<number, string>
      } = {}
  ) => {
    setAppState(newState);
    if ('className' in updates) setClassName(updates.className!);
    if ('term' in updates) setTerm(updates.term!);
    if ('subject' in updates) setSubject(updates.subject!);
    if ('questions' in updates) setQuestions(updates.questions!);
    if ('answers' in updates) setAnswers(updates.answers!);
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
  };

  const handleTakeAnotherExam = () => {
    setForceSubmit(false);
    navigate('subject', { subject: null, questions: [], answers: {} });
  };

  const handleBack = () => {
    const backMap: Partial<Record<AppState, AppState>> = {
      subject: 'term', timer: 'subject', exam: 'timer',
    };
    const prev = backMap[appState];
    if (prev) navigate(prev);
  };

  return (
      <div className={`app-container ${appState === 'exam' ? 'exam-mode-container' : ''}`}>
        <header className="header">
          <div className="header-content">
            {appState !== 'results' && appState !== 'exam' && appState !== 'term' ? (
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

        <main className={`main-content ${appState === 'exam' ? 'exam-mode' : ''} ${appState === 'timer' ? 'timer-mode' : ''}`}>
          {appState === 'term' && className && (
              <TermSelector
                  className={className}
                  onSelect={handleSelectTerm}
                  onBack={() => {}}
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

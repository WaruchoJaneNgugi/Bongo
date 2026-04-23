import { useState } from 'react';
import { subjects } from './utils/content';
import type { Subject, Topic } from './types/types';
import { useProgress } from './utils/progress';
import SubjectList from './components/SubjectList';
import TopicList from './components/TopicList';
import TopicDetail from './components/TopicDetail';
import Quiz from './components/Quiz';
import { ArrowLeft } from 'lucide-react';
import './styles/styles.css';

type ViewState = 'subjects' | 'topics' | 'learning' | 'quiz';

interface Props {
    grade: number;
    initialSubjectTitle?: string;
    onBack: () => void;
}

export default function Lvl4to9SubjectsView({ grade, initialSubjectTitle, onBack }: Props) {
    const matchedSubject = initialSubjectTitle
        ? subjects.find(s => s.title.toLowerCase() === initialSubjectTitle.toLowerCase()) ?? null
        : null;

    const [viewState, setViewState] = useState<ViewState>(matchedSubject ? 'topics' : 'subjects');
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(matchedSubject);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    const { progress, updateProgress, getSubjectProgress } = useProgress();

    const handleSelectSubject = (subject: Subject) => {
        setSelectedSubject(subject);
        setViewState('topics');
    };

    const handleSelectTopic = (topic: Topic) => {
        setSelectedTopic(topic);
        setViewState('learning');
        if (progress[topic.id]?.status !== 'completed') {
            updateProgress(topic.id, 'in_progress');
        }
    };

    const handleQuizComplete = (score: number, total: number) => {
        if (selectedTopic) updateProgress(selectedTopic.id, 'completed', score, total);
    };

    const handleBack = () => {
        if (viewState === 'quiz') { setViewState('learning'); return; }
        if (viewState === 'learning') { setViewState('topics'); return; }
        if (viewState === 'topics') {
            if (matchedSubject) { onBack(); return; }
            setViewState('subjects');
            return;
        }
        onBack();
    };

    return (
        <div className="mlearn-app-wrapper">
            <div className="mlearn-app-container">
                {viewState !== 'quiz' && viewState !== 'learning' && (
                    <header className="mlearn-app-header">
                        <div className="mlearn-app-header-content" style={{ position: 'relative' }}>
                            <button onClick={handleBack} className="mlearn-btn-back"
                                style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}>
                                <ArrowLeft size={20} />
                                <span className="mlearn-back-text">Back</span>
                            </button>
                            <h1 className="mlearn-app-title">
                                {viewState === 'topics' && selectedSubject ? selectedSubject.title : 'Subjects'}
                            </h1>
                        </div>
                    </header>
                )}

                <main className="mlearn-app-main">
                    {viewState === 'subjects' && (
                        <SubjectList
                            subjects={subjects}
                            selectedGrade={grade}
                            onSelectSubject={handleSelectSubject}
                            getSubjectProgress={getSubjectProgress}
                            onBack={onBack}
                        />
                    )}
                    {viewState === 'topics' && selectedSubject && (
                        <TopicList
                            subject={selectedSubject}
                            selectedGrade={grade}
                            progress={progress}
                            onBack={handleBack}
                            onSelectTopic={handleSelectTopic}
                        />
                    )}
                    {viewState === 'learning' && selectedTopic && (
                        <TopicDetail
                            topic={selectedTopic}
                            onBack={handleBack}
                            onStartQuiz={() => setViewState('quiz')}
                        />
                    )}
                    {viewState === 'quiz' && selectedTopic && (
                        <Quiz
                            topic={selectedTopic}
                            onBack={() => setViewState('topics')}
                            onComplete={handleQuizComplete}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}

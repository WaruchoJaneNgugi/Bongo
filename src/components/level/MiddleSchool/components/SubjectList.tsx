import React, { useEffect } from 'react';
import type {ClassName, Subject, Term} from '../types';
import { Calculator, BookOpen, FlaskConical, Globe, BookHeart } from 'lucide-react';

interface Props {
    className: ClassName;
    term: Term;
    onSelect: (subject: Subject) => void;
    onBack: () => void;
}

const subjects: { name: Subject; icon: React.ReactNode; color: string; cardColor: string; titleColor: string }[] = [
    { name: 'Mathematics', icon: <Calculator size={24} />, color: 'text-indigo-600 bg-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300', cardColor: 'border-indigo-200 bg-white/90 shadow-md hover:shadow-xl hover:shadow-indigo-500/30 hover:border-indigo-400 backdrop-blur-md', titleColor: 'group-hover:text-indigo-700' },
    { name: 'English', icon: <BookOpen size={24} />, color: 'text-fuchsia-600 bg-fuchsia-100 group-hover:bg-fuchsia-600 group-hover:text-white transition-colors duration-300', cardColor: 'border-fuchsia-200 bg-white/90 shadow-md hover:shadow-xl hover:shadow-fuchsia-500/30 hover:border-fuchsia-400 backdrop-blur-md', titleColor: 'group-hover:text-fuchsia-700' },
    { name: 'Science', icon: <FlaskConical size={24} />, color: 'text-violet-600 bg-violet-100 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300', cardColor: 'border-violet-200 bg-white/90 shadow-md hover:shadow-xl hover:shadow-violet-500/30 hover:border-violet-400 backdrop-blur-md', titleColor: 'group-hover:text-violet-700' },
    { name: 'Social Studies', icon: <Globe size={24} />, color: 'text-purple-600 bg-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300', cardColor: 'border-purple-200 bg-white/90 shadow-md hover:shadow-xl hover:shadow-purple-500/30 hover:border-purple-400 backdrop-blur-md', titleColor: 'group-hover:text-purple-700' },
    { name: 'CRE', icon: <BookHeart size={24} />, color: 'text-pink-600 bg-pink-100 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300', cardColor: 'border-pink-200 bg-white/90 shadow-md hover:shadow-xl hover:shadow-pink-500/30 hover:border-pink-400 backdrop-blur-md', titleColor: 'group-hover:text-pink-700' },
];

export default function SubjectList({ className, term, onSelect}: Props) {
    useEffect(() => {
        document.body.classList.add('subject-mode-body');
        return () => {
            document.body.classList.remove('subject-mode-body');
        };
    }, []);

    return (
        <div className="mobile-page">
            <div className="mobile-title-section text-center">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="badge bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 text-slate-800 font-bold">{className}</div>
                    <div className="badge bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 text-slate-800 font-bold">{term}</div>
                </div>
                <h2 className="mobile-title text-slate-900 drop-shadow-sm">Choose a Subject</h2>
                <p className="mobile-subtitle text-slate-700 font-medium drop-shadow-sm">Select a subject to start your practice exam.</p>
            </div>

            <div className="subject-grid-mobile">
                {subjects.map((sub) => (
                    <button
                        key={sub.name}
                        onClick={() => onSelect(sub.name)}
                        className={`group subject-card-mobile ${sub.cardColor}`}
                    >
                        <div className={`subject-icon-wrapper ${sub.color}`}>
                            {sub.icon}
                        </div>
                        <span className={`subject-title-mobile text-slate-800 transition-colors duration-200 ${sub.titleColor}`}>{sub.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

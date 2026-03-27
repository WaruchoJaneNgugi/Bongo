import type {SchoolLevel, ClassName} from '../types';
import { BookOpen, ChevronRight } from 'lucide-react';

interface Props {
    level: SchoolLevel;
    onSelect: (className: ClassName) => void;
    onBack: () => void;
}

export default function ClassSelector({ level, onSelect}: Props) {
    const classes: ClassName[] = level === 'Upper Primary'
        ? ['Grade 4', 'Grade 5', 'Grade 6']
        : ['Grade 7', 'Grade 8', 'Grade 9'];

    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.85)), url(/betterImg1.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: -1,
            }} />
            <div className="mobile-page">
                <div className="level-buttons-wrapper">
                    <div style={{ marginBottom: '28px' }}>
                        <h2 className="mobile-title text-center">Select Your Grade Level</h2>
                        <p className="mobile-subtitle text-center">Please select your current grade level.</p>
                    </div>

                    <div className="list-container">
                        {classes.map((cls) => (
                            <button
                                key={cls}
                                onClick={() => onSelect(cls)}
                                className="list-item"
                            >
                                <div className="list-item-icon-leading">
                                    <BookOpen size={20} />
                                </div>
                                <div className="list-item-content">
                                    <span className="list-item-text">{cls}</span>
                                </div>
                                <ChevronRight size={20} className="list-item-arrow" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
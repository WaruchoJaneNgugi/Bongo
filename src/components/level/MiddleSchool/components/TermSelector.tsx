import { Calendar, ChevronRight } from 'lucide-react';
import type { Term } from '../types';

interface TermSelectorProps {
    className: string;
    onSelect: (term: Term) => void;
    onBack: () => void;
}

export default function TermSelector({ className, onSelect }: TermSelectorProps) {
    const terms: Term[] = ['Term 1', 'Term 2', 'Term 3'];

    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.85)), url(/newbackground.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: -1,
            }} />
            <div className="mobile-page">
                {/* Grade badge stays at the top */}
                <div className="mobile-title-section text-center" style={{ marginTop: '3rem' }}>
                    <div className="badge" style={{ marginBottom: '0.75rem', marginLeft: 'auto', marginRight: 'auto' }}>{className}</div>
                </div>

                {/* Title + subtitle grouped with buttons */}
                <div className="level-buttons-wrapper">
                    <div style={{ marginBottom: '48px' }} className="text-center">
                        <h2 className="mobile-title">Select Your Term</h2>
                        <p className="mobile-subtitle">Please select the academic term.</p>
                    </div>

                    <div className="list-container">
                        {terms.map((term) => (
                            <button
                                key={term}
                                onClick={() => onSelect(term)}
                                className="list-item"
                            >
                                <div className="list-item-icon-leading">
                                    <Calendar size={20} />
                                </div>
                                <div className="list-item-content">
                                    <span className="list-item-text">{term}</span>
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
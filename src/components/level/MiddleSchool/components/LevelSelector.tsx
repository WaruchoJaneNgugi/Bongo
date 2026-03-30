import type { SchoolLevel } from '../types';
import { ChevronRight, Backpack, GraduationCap } from 'lucide-react';

interface Props {
    onSelect: (level: SchoolLevel) => void;
}

export default function LevelSelector({ onSelect }: Props) {
    return (
        <div className="landing-container">
            <div className="landing-content">

                {/* Image hero — top of page */}
                <div className="landing-image-section">
                    <img
                        src="/lvl2.jpg"
                        alt="Student"
                        className="landing-image"
                        fetchPriority="high"
                    />
                </div>

                {/* Text + buttons below */}
                <div className="landing-text-section">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-center" style={{ lineHeight: 1.1 }}>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600">
                            Welcome to
                        </span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-pink-600">
                            Middle School
                        </span>
                    </h1>
                    <p className="landing-subtitle">Choose your current school level to find the right practice exams for you.</p>

                    <div className="landing-buttons">
                        <button onClick={() => onSelect('Upper Primary')} className="landing-btn">
                            <div className="landing-btn-icon"><Backpack size={22} /></div>
                            <div className="landing-btn-text">
                                <span className="landing-btn-title">Upper Primary</span>
                                <span className="landing-btn-desc">Grades 4–6</span>
                            </div>
                            <ChevronRight size={18} className="landing-btn-arrow" />
                        </button>

                        <button onClick={() => onSelect('Junior Secondary School')} className="landing-btn">
                            <div className="landing-btn-icon"><GraduationCap size={22} /></div>
                            <div className="landing-btn-text">
                                <span className="landing-btn-title">Junior Secondary</span>
                                <span className="landing-btn-desc">Grades 7–9</span>
                            </div>
                            <ChevronRight size={18} className="landing-btn-arrow" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
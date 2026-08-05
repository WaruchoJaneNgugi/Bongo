import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';

export function SplashScreen({ onDone }: { onDone: () => void }) {
    const [hiding, setHiding] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setHiding(true), 1800);
        const t2 = setTimeout(onDone, 2300);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [onDone]);

    return (
        <div
            className={`splash-root ${hiding ? 'splash-hide' : ''}`}
            role="status"
            aria-label="Loading High Scores"
        >
            <div className="splash-loader" aria-hidden="true">
                <span className="splash-ring" />
                <span className="splash-ring splash-ring--inner" />
                <GraduationCap size={26} className="splash-cap" />
            </div>
            <div className="splash-word">
                High<strong>Scores</strong><span className="splash-word-dot">.</span>
            </div>
            <div className="splash-sub">Learning, elevated</div>
            <div className="splash-bar"><div className="splash-bar-fill" /></div>
        </div>
    );
}

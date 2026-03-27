import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
    durationMinutes: number;
    onTimeUp: () => void;
}

export default function Timer({ durationMinutes, onTimeUp }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
        }
    }, [timeLeft, onTimeUp]);

    useEffect(() => {
        const timerId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const isWarning = timeLeft <= 60; // Less than 1 minute

    return (
        <div className={`timer-display ${isWarning ? 'timer-warning' : ''}`}>
            <Clock size={18} />
            <span className="timer-text">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
        </div>
    );
}

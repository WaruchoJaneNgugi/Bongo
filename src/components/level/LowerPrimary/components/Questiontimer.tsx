// components/QuestionTimer.tsx
// Circular ring timer that counts down per question.
// Fires onTimeUp() when it hits 0. Resets on `questionKey` change.

import { useState, useEffect, useRef } from "react";
import "../styles/timer.css";

export interface QuestionTimerProps {
    /** Total seconds allowed per question */
    seconds: number;
    /** Change this value (e.g. question index) to reset the timer */
    questionKey: number;
    /** Called when the countdown reaches zero */
    onTimeUp: () => void;
    /** If true, timer is paused (after answering) */
    paused: boolean;
}

const RADIUS     = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const URGENT_THRESHOLD = 5; // seconds remaining to turn urgent

export function QuestionTimer({
                                  seconds,
                                  questionKey,
                                  onTimeUp,
                                  paused,
                              }: QuestionTimerProps) {
    const [remaining, setRemaining] = useState<number>(seconds);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Reset when question changes
    useEffect(() => {
        setRemaining(seconds);
    }, [questionKey, seconds]);

    // Tick
    useEffect(() => {
        if (paused) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(() => {
            setRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [paused, questionKey, onTimeUp]);

    const pct         = remaining / seconds;
    const dashOffset  = CIRCUMFERENCE * (1 - pct);
    const isUrgent    = remaining <= URGENT_THRESHOLD;
    const size        = 36; // svg viewBox size

    return (
        <div className="lower-timer-wrap" aria-label={`${remaining} seconds remaining`}>
            <svg
                className="lower-timer-ring-svg"
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
            >
                {/* Background track */}
                <circle
                    className="lower-timer-track"
                    cx={size / 2}
                    cy={size / 2}
                    r={RADIUS}
                />
                {/* Animated fill */}
                <circle
                    className={`lower-timer-fill${isUrgent ? " urgent" : ""}`}
                    cx={size / 2}
                    cy={size / 2}
                    r={RADIUS}
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={dashOffset}
                />
            </svg>

            <span className={`lower-timer-count${isUrgent ? " urgent" : ""}`}>
        {remaining}s
      </span>
        </div>
    );
}
export default QuestionTimer;
// components/ProgressBar.tsx
// Reusable animated progress bar used across quiz and results screens.

export interface ProgressBarProps {
    /** 0–100 */
    value: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
}

export function ProgressBar({
                                value,
                                height = 14,
                                className = "",
                                style,
                            }: ProgressBarProps) {
    const clamped = Math.min(100, Math.max(0, value));

    return (
        <div
            className={`progress-wrap ${className}`}
            style={{ height, ...style }}
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            <div
                className="progress-fill"
                style={{ width: `${clamped}%` }}
            />
        </div>
    );
}
export default ProgressBar;
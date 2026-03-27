// components/ResultsScreen.tsx
import type { Grade, Subject, QuizResult } from "../types";
import Confetti from "./Confetti";
import ProgressBar from "../components/Progressbar.tsx";
import { QUESTIONS } from "../data";
import { getBadge } from "../data";
import "../styles/results.css";

export interface ResultsScreenProps {
    grade: Grade;
    subject: Subject;
    result: QuizResult;
    onRetry: () => void;
    onChangeSubject: () => void;
    onChangeGrade: () => void;
}

export function ResultsScreen({
                                  grade,
                                  subject,
                                  result,
                                  onRetry,
                                  onChangeSubject,
                              }: ResultsScreenProps) {
    const { finalScore, total, answers } = result;
    const pct   = Math.round((finalScore / total) * 100);
    const badge = getBadge(pct);

    return (
        <div className="screen bg-checker results-screen">
            <Confetti active={pct >= 80} />

            <div className="results-inner">

                {/* Hero Card */}
                <div className="card results-hero-card">
                    <span className="results-badge-emoji">{badge.emoji}</span>
                    <h2 className="display results-badge-title">{badge.label}</h2>
                    <p className="results-context">
                        Grade {grade} · {subject.icon} {subject.label}
                    </p>

                    <hr className="divider" />

                    {/* Score + Tally */}
                    <div className="results-score-row">
                        <div className="results-ring">
                            <span className="display results-pct">{pct}%</span>
                            <span className="results-pct-label">score</span>
                        </div>

                        <div className="results-tally">
                            <div className="tally-row">
                                <span className="tally-tag-correct">✓ {finalScore}</span>
                                <span>Correct</span>
                            </div>
                            <div className="tally-row">
                                <span className="tally-tag-wrong">✗ {total - finalScore}</span>
                                <span>Incorrect</span>
                            </div>
                            <div>
                                <span className="chip">{total} questions</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <ProgressBar value={pct} height={18} style={{ marginBottom: "1rem" }} />

                    {/* Action Buttons */}
                    <div className="results-actions">
                        <button className="btn btn-primary" onClick={onRetry}>
                            🔁 Try Again
                        </button>
                        <button className="btn btn-outline" onClick={onChangeSubject}>
                            📚 New Subject
                        </button>
                        {/*<button*/}
                        {/*    className="btn btn-outline btn-full"*/}
                        {/*    onClick={onChangeGrade}*/}
                        {/*>*/}
                        {/*    🏠 Change Grade*/}
                        {/*</button>*/}
                    </div>
                </div>

                {/* Question Review */}
                <div className="card results-review-card">
                    <div className="review-title">
                        <span>📋</span>
                        <span className="display">Question Review</span>
                    </div>

                    <div className="review-list">
                        {answers.map((answer, i) => {
                            const questionData = QUESTIONS[grade][subject.id][i];
                            return (
                                <div
                                    key={i}
                                    className={`review-item ${answer.isCorrect ? "review-correct" : ""}`}
                                >
                  <span className="review-item-icon">
                    {answer.isCorrect ? "✅" : "❌"}
                  </span>
                                    <div>
                                        <p className="review-item-q">
                                            Q{i + 1}: {answer.q}
                                        </p>
                                        {!answer.isCorrect && questionData && (
                                            <p className="review-item-ans">
                                                Correct answer:{" "}
                                                <span className="review-ans-pill">
                          {questionData.opts[answer.correct]}
                        </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ResultsScreen;
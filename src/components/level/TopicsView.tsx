import type { SubjectTopics, Topic } from './data/topicsData';

interface Props {
    subjectData: SubjectTopics;
    onBack: () => void;
}

export function TopicsView({ subjectData, onBack }: Props) {
    return (
        <div className="topics-view">
            <button className="mle-back-btn" onClick={onBack}>← Back</button>
            <div className="topics-header">
                <h2 className="topics-title">{subjectData.subject}</h2>
                <p className="topics-subtitle">{subjectData.topics.length} topics</p>
            </div>
            <div className="topics-list">
                {subjectData.topics.map((t: Topic, i: number) => (
                    <div key={i} className="topic-card">
                        <div className="topic-emoji-box">{t.emoji}</div>
                        <div className="topic-text">
                            <span className="topic-title">{t.title}</span>
                            <span className="topic-desc">{t.desc}</span>
                        </div>
                        <span className="topic-arrow">›</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

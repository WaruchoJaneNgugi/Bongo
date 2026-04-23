import type { Subject, Topic, ProgressState } from '../types/types';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, PlayCircle } from 'lucide-react';

type Props = {
    subject: Subject;
    selectedGrade: number;
    progress: ProgressState;
    onBack: () => void;
    onSelectTopic: (topic: Topic) => void;
};

export default function TopicList({ subject, selectedGrade, progress, onSelectTopic }: Props) {
    const filteredTopics = subject.topics.filter(t => t.grade === selectedGrade);

    return (
        <div className="mlearn-page-container mlearn-topic-list-container">
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: 500, backgroundColor: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '9999px', display: 'inline-block' }}>
          Grade {selectedGrade}
        </span>
            </div>

            <div className="mlearn-textbook-list">
                <div className="mlearn-textbook-header">Table of Contents</div>

                {filteredTopics.map((topic, index) => {
                    const topicProgress = progress[topic.id];
                    const status = topicProgress?.status || 'not_started';

                    return (
                        <motion.button
                            key={topic.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onSelectTopic(topic)}
                            className="mlearn-textbook-item"
                        >
                            <div className="mlearn-textbook-chapter">
                                {index + 1}.
                            </div>

                            <div className="mlearn-textbook-title-container">
                                <div className="mlearn-textbook-title-row">
                                    <span className="mlearn-textbook-title">{topic.title}</span>
                                    <div className="mlearn-textbook-leader"></div>
                                    <div className="mlearn-textbook-status">
                                        {status === 'completed' && topicProgress?.score !== undefined && (
                                            <span style={{color: '#166534', fontWeight: 600}}>
                        {topicProgress.score}/{topicProgress.totalQuestions}
                      </span>
                                        )}
                                        {status === 'completed' ? (
                                            <CheckCircle2 color="#22c55e" size={20} />
                                        ) : status === 'in_progress' ? (
                                            <PlayCircle color="#3b82f6" size={20} />
                                        ) : (
                                            <Circle color="#d1d5db" size={20} />
                                        )}
                                    </div>
                                </div>
                                <div className="mlearn-textbook-desc">{topic.description}</div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import type { Topic } from '../types/types';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, BrainCircuit, Volume2, Pause } from 'lucide-react';

type Props = {
    topic: Topic;
    onBack: () => void;
    onStartQuiz: () => void;
};

const extractText = (node: React.ReactNode): string => {
    if (node == null) return '';
    if (typeof node === 'string' || typeof node === 'number') {
        return String(node);
    }
    if (Array.isArray(node)) {
        return node.map(extractText).join(' ');
    }
    if (React.isValidElement(node)) {
        const props = node.props as { children?: React.ReactNode };
        return extractText(props.children);
    }
    return '';
};

export default function TopicDetail({ topic, onBack, onStartQuiz }: Props) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        // Cleanup speech synthesis when component unmounts
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const handlePlayPause = () => {
        if (topic.id.startsWith('kiswahili')) return;

        if (isPlaying) {
            if (isPaused) {
                window.speechSynthesis.resume();
                setIsPaused(false);
            } else {
                window.speechSynthesis.pause();
                setIsPaused(true);
            }
        } else {
            window.speechSynthesis.cancel(); // Clear any stuck speech

            const contentText = extractText(topic.content);
            const textParts = [topic.title];
            if (topic.description) {
                textParts.push(topic.description);
            }
            if (contentText.trim()) {
                textParts.push(contentText);
            }
            const text = textParts.join('. ');

            if (!text.trim()) return;

            const utterance = new SpeechSynthesisUtterance(text);

            // Try to find a good English voice if available
            const voices = window.speechSynthesis.getVoices();
            const englishVoice = voices.find(v => v.lang.startsWith('en-') && !v.localService);
            if (englishVoice) {
                utterance.voice = englishVoice;
            }

            utterance.onend = () => {
                setIsPlaying(false);
                setIsPaused(false);
            };
            utterance.onerror = (e) => {
                console.error("Speech synthesis error", e);
                setIsPlaying(false);
                setIsPaused(false);
            };

            window.speechSynthesis.speak(utterance);
            setIsPlaying(true);
            setIsPaused(false);
        }
    };

    const handleBack = () => {
        window.speechSynthesis.cancel();
        onBack();
    };

    return (
        <div className="mlearn-detail-container">
            <div className="mlearn-detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    onClick={handleBack}
                    className="mlearn-btn-back"
                    style={{marginBottom: 0}}
                >
                    <ArrowLeft size={20} />
                    <span className="mlearn-back-text">Back to Topics</span>
                </button>
                <div className="mlearn-detail-tag" style={{ marginBottom: 0, fontSize: '0.75rem' }}>
                    <BookOpen size={18} />
                    <span>Learning Material</span>
                </div>
            </div>

            <div className="mlearn-detail-content">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mlearn-detail-content-inner"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1.5rem', gap: '0.5rem' }}>
                        <h1 className="mlearn-detail-title" style={{ marginBottom: 0 }}>{topic.title}</h1>
                        {topic.description && (
                            <p className="text-gray-600 text-lg">{topic.description}</p>
                        )}
                    </div>

                    <div className="mlearn-detail-prose">
                        {topic.content}
                    </div>
                </motion.div>
            </div>

            <div className="mlearn-detail-footer">
                <div className="mlearn-detail-footer-inner">
                    <button
                        onClick={onStartQuiz}
                        className="mlearn-btn-primary"
                    >
                        <BrainCircuit size={20} />
                        <span>Take Revision Quiz</span>
                    </button>
                </div>
            </div>

            {/* Floating Audio Button */}
            {!topic.id.startsWith('kiswahili') && (
                <button
                    onClick={handlePlayPause}
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        width: '3.5rem',
                        height: '3.5rem',
                        borderRadius: '50%',
                        backgroundColor: isPlaying && !isPaused ? '#2563eb' : '#ffffff',
                        color: isPlaying && !isPaused ? '#ffffff' : '#2563eb',
                        border: isPlaying && !isPaused ? 'none' : '1px solid #e5e7eb',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 50,
                        transition: 'all 0.2s'
                    }}
                    title={isPlaying && !isPaused ? 'Pause Audio' : isPaused ? 'Resume Audio' : 'Play Audio'}
                >
                    {isPlaying && !isPaused ? <Pause size={24} /> : <Volume2 size={24} />}
                </button>
            )}
        </div>
    );
}

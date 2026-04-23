import { useState, useEffect } from 'react';
import type { TopicProgress, ProgressState } from '../types/types';

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => {
    const saved = localStorage.getItem('elimu_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse progress', e);
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('elimu_progress', JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (topicId: string, status: TopicProgress, score?: number, totalQuestions?: number) => {
    setProgress((prev) => ({
      ...prev,
      [topicId]: {
        status,
        score: score !== undefined ? score : prev[topicId]?.score,
        totalQuestions: totalQuestions !== undefined ? totalQuestions : prev[topicId]?.totalQuestions,
      },
    }));
  };

  const getSubjectProgress = (_subjectId: string, topics: { id: string }[]) => {
    if (topics.length === 0) return 0;

    const completedCount = topics.filter(t => progress[t.id]?.status === 'completed').length;
    return Math.round((completedCount / topics.length) * 100);
  };

  return { progress, updateProgress, getSubjectProgress };
}

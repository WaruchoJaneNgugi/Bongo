import React from 'react';

export type Question = {
    id: string;
    text: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
};

export type Topic = {
    id: string;
    title: string;
    description: string;
    content: React.ReactNode;
    quiz: Question[];
    grade: number;
    term: number;
};

export type Subject = {
    id: string;
    title: string;
    icon: React.ElementType;
    color: string;
    topics: Topic[];
};

export type TopicProgress = 'not_started' | 'in_progress' | 'completed';

export type ProgressState = {
    [topicId: string]: {
        status: TopicProgress;
        score?: number;
        totalQuestions?: number;
    };
};

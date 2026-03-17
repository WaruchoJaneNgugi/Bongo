import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EducationLevel } from '../data/quizData';

export type Overlay =
    | null
    | 'signup'
    | 'login';

export interface User {
    username: string;
    phone: string;
    educationLevel: EducationLevel;
}

export interface QuizResult {
    topicId: string;
    topicName: string;
    subjectName: string;
    score: number;
    total: number;
    date: string;
}

interface AppState {
    overlay: Overlay;
    user: User | null;
    isLoggedIn: boolean;
    currentSubjectId: string | null;
    currentTopicId: string | null;
    lastResult: QuizResult | null;
    results: QuizResult[];

    setOverlay: (overlay: Overlay) => void;
    login: (user: User) => void;
    logout: () => void;
    setCurrentSubject: (id: string) => void;
    setCurrentTopic: (id: string) => void;
    saveResult: (result: QuizResult) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            overlay: null,
            user: null,
            isLoggedIn: false,
            currentSubjectId: null,
            currentTopicId: null,
            lastResult: null,
            results: [],

            setOverlay: (overlay) => set({ overlay }),

            login: (user) => set({ user, isLoggedIn: true }),

            logout: () =>
                set({
                    user: null,
                    isLoggedIn: false,
                    overlay: null,
                    currentSubjectId: null,
                    currentTopicId: null,
                }),

            setCurrentSubject: (id) => set({ currentSubjectId: id }),

            setCurrentTopic: (id) => set({ currentTopicId: id }),

            saveResult: (result) =>
                set((state) => ({
                    lastResult: result,
                    results: [result, ...state.results].slice(0, 50),
                })),
        }),
        {
            name: 'bongo-quiz-storage',
            partialize: (state) => ({
                user: state.user,
                isLoggedIn: state.isLoggedIn,
                results: state.results,
            }),
        }
    )
);
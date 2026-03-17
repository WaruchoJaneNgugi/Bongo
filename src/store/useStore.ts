import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EducationLevel = 'lower_primary' | 'middle_school' | 'senior_school';
export type Grade =
    | 'grade1' | 'grade2' | 'grade3'
    | 'grade4' | 'grade5' | 'grade6' | 'grade7' | 'grade8' | 'grade9'
    | 'grade10' | 'grade11' | 'grade12';

export type Overlay =
    | null
    | 'signup'
    | 'login';

export interface User {
    username: string;
    phone: string;
    educationLevel: EducationLevel;
    grade: Grade;  // Add grade to user
}

interface AppState {
    overlay: Overlay;
    user: User | null;
    isLoggedIn: boolean;
    currentSubjectId: string | null;
    currentTopicId: string | null;

    setOverlay: (overlay: Overlay) => void;
    login: (user: User) => void;
    logout: () => void;
    setCurrentSubject: (id: string) => void;
    setCurrentTopic: (id: string) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            overlay: null,
            user: null,
            isLoggedIn: false,
            currentSubjectId: null,
            currentTopicId: null,

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
        }),
        {
            name: 'bongo-quiz-storage',
            partialize: (state) => ({
                user: state.user,
                isLoggedIn: state.isLoggedIn,
            }),
        }
    )
);
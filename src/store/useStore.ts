import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type EducationLevel = 'lower_primary' | 'middle_school' | 'senior_school';
// export type Grade =
//     | 'grade1' | 'grade2' | 'grade3'
//     | 'grade4' | 'grade5' | 'grade6' | 'grade7' | 'grade8' | 'grade9'
//     | 'grade10' | 'grade11' | 'grade12';



export interface User {
    username: string;
    phone: string;
    educationLevel: EducationLevel;
    // grade: Grade;
    password?: string;
}

export type Overlay =
    | null
    | 'signup'
    | 'login';
interface AppState {
    overlay: Overlay;
    user: User | null;
    users: User[]; // Store all registered users
    isLoggedIn: boolean;
    currentSubjectId: string | null;
    currentTopicId: string | null;

    setOverlay: (overlay: Overlay) => void;
    login: (user: User) => void;
    logout: () => void;
    registerUser: (user: User) => void; // New function to register users
    setCurrentSubject: (id: string) => void;
    setCurrentTopic: (id: string) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            overlay: null,
            user: null,
            users: [], // Initialize empty users array
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

            registerUser: (newUser) =>
                set((state) => ({
                    users: [...state.users, newUser]
                })),

            setCurrentSubject: (id) => set({ currentSubjectId: id }),

            setCurrentTopic: (id) => set({ currentTopicId: id }),
        }),
        {
            name: 'bongo-quiz-storage',
            partialize: (state) => ({
                user: state.user,
                users: state.users,
                isLoggedIn: state.isLoggedIn,
            }),
        }
    )
);
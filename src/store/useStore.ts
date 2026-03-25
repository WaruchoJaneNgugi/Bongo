import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EducationLevel = 'lower_primary' | 'middle_school' | 'senior_school';

export interface StudentUser {
  type: 'student';
  username: string;
  phone: string;       // own phone OR "parentPhone-N" for child accounts
  pin: string;         // 4-digit PIN
  educationLevel: EducationLevel;
  parentPhone?: string;
  xp: number;
  level: number;
  streak: number;
  points: number;
  avatar: string;
}

export interface ParentUser {
  type: 'parent';
  username: string;
  phone: string;
  pin: string;
  students: StudentUser[];
  avatar: string;
}

export type AppUser = StudentUser | ParentUser;
export type Overlay = null | 'signup' | 'login';

interface AppState {
  overlay: Overlay;
  user: AppUser | null;
  allUsers: AppUser[];
  isLoggedIn: boolean;

  setOverlay: (overlay: Overlay) => void;
  login: (user: AppUser) => void;
  logout: () => void;
  // registers a user (and their child students) into allUsers
  registerUser: (user: AppUser) => void;
  updateUser: (updates: Partial<AppUser>) => void;
  // adds a student to a parent AND registers the student in allUsers
  addStudentToParent: (parentPhone: string, student: StudentUser) => void;
  // removes a student from a parent AND from allUsers
  removeStudentFromParent: (parentPhone: string, studentPhone: string) => void;
  findUserByPhone: (phone: string) => AppUser | undefined;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      overlay: null,
      user: null,
      allUsers: [],
      isLoggedIn: false,

      setOverlay: (overlay) => set({ overlay }),

      login: (user) => set({ user, isLoggedIn: true, overlay: null }),

      logout: () => set({ user: null, isLoggedIn: false, overlay: null }),

      // so children can log in independently with their phone (parentPhone-N)
      registerUser: (newUser) =>
        set((state) => {
          const extras: AppUser[] =
            newUser.type === 'parent' ? newUser.students : [];
          return { allUsers: [...state.allUsers, newUser, ...extras] };
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } as AppUser : null,
          allUsers: state.allUsers.map((u) =>
            state.user && u.phone === state.user.phone
              ? { ...u, ...updates } as AppUser
              : u
          ),
        })),

      addStudentToParent: (parentPhone, student) =>
        set((state) => {
          // 1. Update the parent's students array (in allUsers + current user)
          const updatedAllUsers = state.allUsers.map((u) =>
            u.type === 'parent' && u.phone === parentPhone
              ? { ...u, students: [...u.students, student] }
              : u
          );

          //    so they can log in with their "parentPhone-N" phone
          const alreadyExists = updatedAllUsers.some(
            (u) => u.phone === student.phone
          );
          const finalAllUsers = alreadyExists
            ? updatedAllUsers
            : [...updatedAllUsers, student];

          const updatedCurrentUser =
            state.user?.type === 'parent' && state.user.phone === parentPhone
              ? { ...state.user, students: [...state.user.students, student] }
              : state.user;

          return { allUsers: finalAllUsers, user: updatedCurrentUser };
        }),

      removeStudentFromParent: (parentPhone, studentPhone) =>
        set((state) => {
          // Remove from parent's students array
          const updatedAllUsers = state.allUsers
            .map((u) =>
              u.type === 'parent' && u.phone === parentPhone
                ? {
                    ...u,
                    students: u.students.filter(
                      (s) => s.phone !== studentPhone
                    ),
                  }
                : u
            )
            // Remove the student's standalone allUsers entry
            .filter((u) => u.phone !== studentPhone);

          const updatedCurrentUser =
            state.user?.type === 'parent' && state.user.phone === parentPhone
              ? {
                  ...state.user,
                  students: state.user.students.filter(
                    (s) => s.phone !== studentPhone
                  ),
                }
              : state.user;

          return { allUsers: updatedAllUsers, user: updatedCurrentUser };
        }),

      findUserByPhone: (phone) =>
        get().allUsers.find((u) => u.phone === phone),
    }),
    {
      name: 'bongoquiz-v2',
      partialize: (state) => ({
        user: state.user,
        allUsers: state.allUsers,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

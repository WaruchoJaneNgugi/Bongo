import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EducationLevel = 'lower_primary' | 'middle_school' | 'senior_school';
export type FamilyPackage = 'solo' | 'trio' | 'quad' | 'family';

export interface LevelSelections {
  lower_primary?: { grade: number };
  middle_school?: { level: string | null; className: string | null };
  senior_school?: { grade: string };
}

export interface StudentProfile {
  id: string;           // unique id within the account
  username: string;
  educationLevel: EducationLevel;
  grade: number;        // 1–12
  pin: string;          // 4-digit profile PIN
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  points: number;
}

export interface StudentUser {
  type: 'student';
  phone: string;        // account phone number (parent's or student's own)
  pin: string;          // account-level PIN used at login
  package: FamilyPackage;
  profiles: StudentProfile[];  // 1 profile for solo, up to N for others
  activeProfileId: string | null;
}

export type AppUser = StudentUser;
export type Overlay = null | 'signup' | 'login' | 'profile-select';

interface AppState {
  overlay: Overlay;
  signupPackage: FamilyPackage | null;
  user: AppUser | null;
  allUsers: AppUser[];
  isLoggedIn: boolean;
  levelSelections: LevelSelections;

  setOverlay: (overlay: Overlay, pkg?: FamilyPackage | null) => void;
  login: (user: AppUser) => void;
  logout: () => void;
  registerUser: (user: AppUser) => void;
  setActiveProfile: (profileId: string) => void;
  updateUser: (updates: Partial<AppUser>) => void;
  findUserByPhone: (phone: string) => AppUser | undefined;
  setLevelSelection: (level: keyof LevelSelections, value: LevelSelections[keyof LevelSelections]) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      overlay: null,
      signupPackage: null,
      user: null,
      allUsers: [],
      isLoggedIn: false,
      levelSelections: {},

      setOverlay: (overlay, pkg = null) => set({ overlay, signupPackage: pkg }),

      login: (user) => set({ user, isLoggedIn: true, overlay: null }),

      logout: () => set({ user: null, isLoggedIn: false, overlay: null }),

      registerUser: (newUser) =>
        set((state) => ({ allUsers: [...state.allUsers, newUser] })),

      setActiveProfile: (profileId) =>
        set((state) => {
          if (!state.user) return {};
          const updated = { ...state.user, activeProfileId: profileId };
          return {
            user: updated,
            allUsers: state.allUsers.map((u) =>
              u.phone === state.user!.phone ? updated : u
            ),
          };
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

      findUserByPhone: (phone) =>
        get().allUsers.find((u) => u.phone === phone),

      setLevelSelection: (level, value) =>
        set((state) => ({
          levelSelections: { ...state.levelSelections, [level]: value },
        })),
    }),
    {
      name: 'bongoquiz-v3',
      partialize: (state) => ({
        user: state.user,
        allUsers: state.allUsers,
        isLoggedIn: state.isLoggedIn,
        levelSelections: state.levelSelections,
      }),
    }
  )
);

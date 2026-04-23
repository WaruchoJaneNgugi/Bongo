import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* ── Theme store ─────────────────────────────────────────── */
interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        set({ theme: next });
      },
    }),
    { name: 'gradeup-theme' }
  )
);

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

// { [phone]: { attempts: number; lockoutUntil: number | null } }
export type LoginAttempts = Record<string, { attempts: number; lockoutUntil: number | null }>;

interface AppState {
  overlay: Overlay;
  signupPackage: FamilyPackage | null;
  user: AppUser | null;
  allUsers: AppUser[];
  isLoggedIn: boolean;
  sessionToken: string | null;   // runtime-only, not persisted
  levelSelections: LevelSelections;
  loginAttempts: LoginAttempts;

  setOverlay: (overlay: Overlay, pkg?: FamilyPackage | null) => void;
  login: (user: AppUser) => void;
  logout: () => void;
  registerUser: (user: AppUser) => void;
  setActiveProfile: (profileId: string) => void;
  updateUser: (updates: Partial<AppUser>) => void;
  findUserByPhone: (phone: string) => AppUser | undefined;
  setLevelSelection: (level: keyof LevelSelections, value: LevelSelections[keyof LevelSelections]) => void;
  recordFailedAttempt: (phone: string) => void;
  clearAttempts: (phone: string) => void;
  getAttemptInfo: (phone: string) => { attempts: number; lockoutUntil: number | null };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      overlay: null,
      signupPackage: null,
      user: null,
      allUsers: [],
      isLoggedIn: false,
      sessionToken: null,
      levelSelections: {},
      loginAttempts: {},

      setOverlay: (overlay, pkg = null) => set({ overlay, signupPackage: pkg }),

      login: (user) => set({ user, isLoggedIn: true, sessionToken: crypto.randomUUID() }),

      logout: () => set({ user: null, isLoggedIn: false, overlay: null, sessionToken: null }),

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

      recordFailedAttempt: (phone) =>
        set((state) => {
          const prev = state.loginAttempts[phone] ?? { attempts: 0, lockoutUntil: null };
          const attempts = prev.attempts + 1;
          const lockoutUntil = attempts >= 5 ? Date.now() + 5 * 60 * 1000 : null; // 5 min lockout after 5 fails
          return { loginAttempts: { ...state.loginAttempts, [phone]: { attempts, lockoutUntil } } };
        }),

      clearAttempts: (phone) =>
        set((state) => {
          const { [phone]: _, ...rest } = state.loginAttempts;
          return { loginAttempts: rest };
        }),

      getAttemptInfo: (phone) => {
        const info = get().loginAttempts[phone];
        return info ?? { attempts: 0, lockoutUntil: null };
      },
    }),
    {
      name: 'gradeup-v3',
      partialize: (state) => ({
        user: state.user,
        allUsers: state.allUsers,
        isLoggedIn: state.isLoggedIn,
        levelSelections: state.levelSelections,
        loginAttempts: state.loginAttempts,
        // sessionToken intentionally excluded — not persisted
      }),
    }
  )
);

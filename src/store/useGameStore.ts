import { create } from 'zustand';

export type GameTag = 'new' | 'popular' | 'hot' | 'coming_soon' | 'math' | 'english' | 'science' | 'puzzle' | 'kiswahili' | 'quiz';
export type FilterTag = 'all' | 'new' | 'popular' | 'hot' | 'coming_soon';

export interface Game {
  id: string;           // unique game ID e.g. "bq-math-001"
  name: string;
  description: string;
  tags: GameTag[];
  image: string;        // image path / emoji placeholder
  emoji: string;        // fallback display emoji
  bgColor: string;      // card background gradient
  component?: string;   // route path when implemented e.g. "/games/math-blitz"
  minLevel?: number;
  xpReward: number;
  coinReward: number;
  players: number;      // how many students played
  rating: number;       // out of 5
  duration: string;     // e.g. "5–10 min"
  subject: string;
}

type GameState = {
  activeFilter: FilterTag;
  games: Game[];
  setFilter: (f: FilterTag) => void;
  filteredGames: () => Game[];
  getGameById: (id: string) => Game | undefined;
};

const ALL_GAMES: Game[] = [
  {
    id: 'bq-math-001',
    name: 'Math Blitz',
    description: 'Race against the clock solving arithmetic challenges!',
    tags: ['hot', 'popular', 'math'],
    image: '',
    emoji: '🧮',
    bgColor: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    component: '/games/math-blitz',
    xpReward: 120,
    coinReward: 50,
    players: 24300,
    rating: 4.8,
    duration: '3–5 min',
    subject: 'Mathematics',
  },
  {
    id: 'bq-eng-001',
    name: 'Word Wizard',
    description: 'Build vocabulary and master spelling with fun word puzzles.',
    tags: ['popular', 'english', 'puzzle'],
    image: '',
    emoji: '📝',
    bgColor: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)',
    component: '/games/word-wizard',
    xpReward: 100,
    coinReward: 40,
    players: 19800,
    rating: 4.7,
    duration: '5–8 min',
    subject: 'English',
  },
  {
    id: 'bq-sci-001',
    name: 'Lab Escape',
    description: 'Solve science riddles to escape the virtual laboratory!',
    tags: ['new', 'science', 'puzzle'],
    image: '',
    emoji: '🔬',
    bgColor: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
    component: '/games/lab-escape',
    xpReward: 150,
    coinReward: 60,
    players: 8400,
    rating: 4.9,
    duration: '8–12 min',
    subject: 'Science',
  },
  {
    id: 'bq-kiswahili-001',
    name: 'Maneno Moto',
    description: 'Master Kiswahili vocabulary in fast-paced word battles.',
    tags: ['hot', 'kiswahili'],
    image: '',
    emoji: '🗣️',
    bgColor: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
    component: '/games/maneno-moto',
    xpReward: 110,
    coinReward: 45,
    players: 15200,
    rating: 4.6,
    duration: '4–6 min',
    subject: 'Kiswahili',
  },
  {
    id: 'bq-math-002',
    name: 'Fraction Wars',
    description: 'Battle other students in fraction and decimal showdowns.',
    tags: ['popular', 'math'],
    image: '',
    emoji: '⚔️',
    bgColor: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    component: '/games/fraction-wars',
    xpReward: 130,
    coinReward: 55,
    players: 12100,
    rating: 4.5,
    duration: '5–10 min',
    subject: 'Mathematics',
  },
  {
    id: 'bq-quiz-001',
    name: 'Grand Quiz',
    description: 'The ultimate all-subjects knowledge challenge.',
    tags: ['popular', 'quiz', 'hot'],
    image: '',
    emoji: '🏆',
    bgColor: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
    component: '/games/grand-quiz',
    xpReward: 200,
    coinReward: 80,
    players: 31000,
    rating: 4.9,
    duration: '10–15 min',
    subject: 'All Subjects',
  },
  {
    id: 'bq-eng-002',
    name: 'Grammar Gauntlet',
    description: 'Test your grammar skills through a series of epic challenges.',
    tags: ['new', 'english'],
    image: '',
    emoji: '📚',
    bgColor: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)',
    component: '/games/grammar-gauntlet',
    xpReward: 90,
    coinReward: 35,
    players: 6700,
    rating: 4.4,
    duration: '6–9 min',
    subject: 'English',
  },
  {
    id: 'bq-sci-002',
    name: 'Planet Quest',
    description: 'Explore the solar system and answer space science questions.',
    tags: ['new', 'science'],
    image: '',
    emoji: '🚀',
    bgColor: 'linear-gradient(135deg, #111827 0%, #1e40af 100%)',
    component: '/games/planet-quest',
    xpReward: 140,
    coinReward: 60,
    players: 9200,
    rating: 4.8,
    duration: '7–10 min',
    subject: 'Science',
  },
  {
    id: 'bq-math-003',
    name: 'Geometry Hero',
    description: 'Identify shapes, angles and solve geometry puzzles.',
    tags: ['math', 'puzzle'],
    image: '',
    emoji: '📐',
    bgColor: 'linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)',
    component: '/games/geometry-hero',
    xpReward: 110,
    coinReward: 45,
    players: 10500,
    rating: 4.3,
    duration: '5–8 min',
    subject: 'Mathematics',
  },
  {
    id: 'bq-cs-001',
    name: 'Code Breaker',
    description: 'Decode messages and learn basic programming logic.',
    tags: ['coming_soon', 'puzzle'],
    image: '',
    emoji: '💻',
    bgColor: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
    component: '/games/code-breaker',
    xpReward: 180,
    coinReward: 75,
    players: 0,
    rating: 0,
    duration: '10–15 min',
    subject: 'Computer Science',
  },
  {
    id: 'bq-history-001',
    name: 'Kenya Chronicles',
    description: 'Travel through Kenyan history and answer trivia questions.',
    tags: ['coming_soon'],
    image: '',
    emoji: '🗺️',
    bgColor: 'linear-gradient(135deg, #78350f 0%, #b45309 100%)',
    component: '/games/kenya-chronicles',
    xpReward: 130,
    coinReward: 55,
    players: 0,
    rating: 0,
    duration: '8–12 min',
    subject: 'Social Studies',
  },
  {
    id: 'bq-puzzle-001',
    name: 'Brain Buster',
    description: 'Mixed puzzle challenges that test all subjects at once.',
    tags: ['hot', 'puzzle', 'quiz'],
    image: '',
    emoji: '🧠',
    bgColor: 'linear-gradient(135deg, #dc2626 0%, #9333ea 100%)',
    component: '/games/brain-buster',
    xpReward: 160,
    coinReward: 65,
    players: 17800,
    rating: 4.7,
    duration: '8–12 min',
    subject: 'Mixed',
  },
];

export const useGameStore = create<GameState>((set, get) => ({
  activeFilter: 'all',
  games: ALL_GAMES,

  setFilter: (f) => set({ activeFilter: f }),

  filteredGames: () => {
    const { activeFilter, games } = get();
    if (activeFilter === 'all') return games;
    return games.filter(g => g.tags.includes(activeFilter as GameTag));
  },

  getGameById: (id) => get().games.find(g => g.id === id),
}));

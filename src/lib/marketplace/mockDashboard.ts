// Placeholder dashboard data for the seller portal UI.
// Every value here becomes real as later plans land:
//   listings  → Plan 2 (My Resources, Published Resources, Top Resources)
//   orders    → Plan 4 (Recent Sales, Total Sales)
//   ledger    → Plan 5–6 (Total Earnings, Earnings Trend, Withdraw)
// Keep this shape stable so wiring real data is a drop-in replacement.

export const dashboardStats = {
  totalEarningsKsh: 12450,
  earningsDeltaPct: 18,
  totalSales: 245,
  salesDeltaPct: 24,
  publishedResources: 18,
  newResourcesThisMonth: 3,
  averageRating: 4.9,
  ratingReviews: 186,
};

export interface RecentSale {
  id: string;
  title: string;
  kind: string;
  buyer: string;
  amountKsh: number;
  earningsKsh: number;
  status: 'Completed' | 'Pending' | 'Refunded';
  when: string;
}

export const recentSales: RecentSale[] = [
  { id: 's1', title: 'KCSE Biology 2026 Revision', kind: 'Revision Notes', buyer: 'Student', amountKsh: 250, earningsKsh: 225, status: 'Completed', when: 'Today 10:24 AM' },
  { id: 's2', title: 'Form 2 Mathematics Notes', kind: 'Class Notes', buyer: 'Student', amountKsh: 150, earningsKsh: 135, status: 'Completed', when: 'Today 08:15 AM' },
  { id: 's3', title: 'Chemistry Practical Guide', kind: 'Study Guide', buyer: 'Student', amountKsh: 200, earningsKsh: 180, status: 'Completed', when: 'Yesterday' },
  { id: 's4', title: 'English Essays Bundle', kind: 'Revision Notes', buyer: 'Student', amountKsh: 100, earningsKsh: 90, status: 'Completed', when: 'Yesterday' },
];

export interface TopResource {
  id: string;
  title: string;
  subject: string;
  accent: string;      // gradient for the cover
  rating: number;
  reviews: number;
  views: string;
  sales: number;
  priceKsh: number;
  bestSeller?: boolean;
}

export const topResources: TopResource[] = [
  { id: 'r1', title: 'KCSE Biology 2026 Revision', subject: 'KCSE BIOLOGY', accent: 'from-[#14532d] to-[#22a558]', rating: 5.0, reviews: 120, views: '4,320', sales: 186, priceKsh: 250, bestSeller: true },
  { id: 'r2', title: 'Form 2 Mathematics Notes', subject: 'MATHEMATICS · FORM 2', accent: 'from-[#0f766e] to-[#14b8a6]', rating: 5.0, reviews: 98, views: '2,840', sales: 142, priceKsh: 150 },
  { id: 'r3', title: 'Chemistry Practical Guide', subject: 'CHEMISTRY', accent: 'from-[#1e3a8a] to-[#3b82f6]', rating: 4.9, reviews: 75, views: '2,100', sales: 105, priceKsh: 200 },
  { id: 'r4', title: 'English Essays Bundle', subject: 'ENGLISH ESSAYS', accent: 'from-[#6b21a8] to-[#a855f7]', rating: 4.9, reviews: 64, views: '1,980', sales: 96, priceKsh: 100 },
];

// 30 daily points for the Earnings Trend sparkline (placeholder upward trend).
export const earningsTrend: number[] = [
  120, 160, 140, 200, 180, 240, 220, 300, 280, 260,
  340, 320, 400, 380, 360, 300, 420, 460, 440, 520,
  500, 480, 560, 600, 580, 640, 620, 700, 760, 820,
];

export const teacherLevel = {
  name: 'Gold Teacher',
  points: 720,
  nextPoints: 1000,
  perks: [
    'Lower commission rate (10%)',
    'Priority in search results',
    'Featured in marketplace',
    'Access to advanced analytics',
  ],
};

export const teachingTips = [
  'Check grammar & formatting',
  'Generate quizzes from your notes',
  'Create summaries',
  'Improve your lesson plans',
];

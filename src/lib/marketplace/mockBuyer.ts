// Buyer-side marketplace mock data. Shapes mirror the intended Firestore schema so
// later plans (storefront/library/orders/payments) can swap these for live data with
// no component changes. Same convention as mockDashboard.ts.

export type ResourceKind = 'Notes' | 'Revision' | 'Past Papers' | 'Live Class' | 'AI Resource';

export interface Resource {
  id: string;
  title: string;
  subject: string;          // e.g. "Biology"
  kind: ResourceKind;
  sellerName: string;
  sellerType: 'Teacher' | 'Tutor' | 'School' | 'AI';
  accent: string;           // tailwind gradient for the cover, e.g. "from-[#14532d] to-[#22a558]"
  rating: number;
  reviews: number;
  priceKsh: number;
  cta: 'Buy Now' | 'Book Now';
  latest?: boolean;
  featured?: boolean;
}

export const resources: Resource[] = [
  { id: 'r1', title: 'KCSE Biology 2026 Revision', subject: 'Biology', kind: 'Revision', sellerName: 'Teacher Jane', sellerType: 'Teacher', accent: 'from-[#14532d] to-[#22a558]', rating: 5.0, reviews: 120, priceKsh: 250, cta: 'Buy Now', featured: true },
  { id: 'r2', title: 'Form 2 Mathematics Notes', subject: 'Mathematics', kind: 'Notes', sellerName: 'Teacher Peter', sellerType: 'Teacher', accent: 'from-[#0f766e] to-[#14b8a6]', rating: 5.0, reviews: 98, priceKsh: 150, cta: 'Buy Now', featured: true },
  { id: 'r3', title: 'Physics Live Classes (Weekly)', subject: 'Physics', kind: 'Live Class', sellerName: 'Tutor Brian', sellerType: 'Tutor', accent: 'from-[#1e3a8a] to-[#3b82f6]', rating: 5.0, reviews: 75, priceKsh: 500, cta: 'Book Now', featured: true },
  { id: 'r4', title: 'AI Generated Chemistry Notes', subject: 'Chemistry', kind: 'AI Resource', sellerName: 'HighScores AI', sellerType: 'AI', accent: 'from-[#6b21a8] to-[#a855f7]', rating: 4.9, reviews: 60, priceKsh: 200, cta: 'Buy Now', featured: true },
  { id: 'r5', title: 'English Essays Bundle', subject: 'English', kind: 'Notes', sellerName: 'Teacher Aisha', sellerType: 'Teacher', accent: 'from-[#9a3412] to-[#f97316]', rating: 4.8, reviews: 54, priceKsh: 100, cta: 'Buy Now', latest: true },
  { id: 'r6', title: 'KCSE History Past Papers 2020-2025', subject: 'History', kind: 'Past Papers', sellerName: 'Elite School', sellerType: 'School', accent: 'from-[#334155] to-[#64748b]', rating: 4.9, reviews: 88, priceKsh: 180, cta: 'Buy Now', latest: true },
  { id: 'r7', title: 'Geography Map Work Masterclass', subject: 'Geography', kind: 'Live Class', sellerName: 'Tutor Njeri', sellerType: 'Tutor', accent: 'from-[#047857] to-[#34d399]', rating: 4.7, reviews: 41, priceKsh: 350, cta: 'Book Now', latest: true },
  { id: 'r8', title: 'CRE Form 3 Complete Notes', subject: 'CRE', kind: 'Notes', sellerName: 'Teacher Otieno', sellerType: 'Teacher', accent: 'from-[#7c2d12] to-[#ea580c]', rating: 4.8, reviews: 37, priceKsh: 120, cta: 'Buy Now' },
  { id: 'r9', title: 'Business Studies Revision Kit', subject: 'Business', kind: 'Revision', sellerName: 'Teacher Wanjiru', sellerType: 'Teacher', accent: 'from-[#164e63] to-[#06b6d4]', rating: 4.9, reviews: 66, priceKsh: 220, cta: 'Buy Now' },
  { id: 'r10', title: 'Kiswahili Insha na Ufupisho', subject: 'Kiswahili', kind: 'Notes', sellerName: 'Mwalimu Hassan', sellerType: 'Teacher', accent: 'from-[#3f6212] to-[#84cc16]', rating: 4.6, reviews: 29, priceKsh: 90, cta: 'Buy Now' },
];

export interface Category { key: string; label: string; sub: string; }
export const categories: Category[] = [
  { key: 'teachers', label: 'Teachers', sub: 'Notes, Exams & Lesson Plans' },
  { key: 'tutors', label: 'Tutors', sub: 'Courses & Live Classes' },
  { key: 'schools', label: 'Schools', sub: 'Uniforms & Admission' },
  { key: 'students', label: 'Students', sub: 'Study Materials & Revision' },
  { key: 'ai', label: 'AI Resources', sub: 'AI Books & Quizzes' },
  { key: 'all', label: 'All Subjects', sub: 'Explore All Subjects' },
];

export interface PopularSubject { subject: string; count: string; }
export const popularSubjects: PopularSubject[] = [
  { subject: 'Mathematics', count: '2,450 resources' },
  { subject: 'English', count: '1,890 resources' },
  { subject: 'Biology', count: '1,560 resources' },
  { subject: 'Chemistry', count: '1,230 resources' },
  { subject: 'Physics', count: '1,100 resources' },
  { subject: 'History', count: '980 resources' },
];

export const stats = [
  { value: '10K+', label: 'Resources' },
  { value: '5K+', label: 'Teachers' },
  { value: '50K+', label: 'Students' },
  { value: '100+', label: 'Schools' },
];

export interface Order {
  id: string;
  resourceId: string;
  title: string;
  date: string;
  amountKsh: number;
  status: 'Completed' | 'Pending' | 'Refunded';
}
export const orders: Order[] = [
  { id: 'o1', resourceId: 'r1', title: 'KCSE Biology 2026 Revision', date: 'Aug 5, 2026', amountKsh: 250, status: 'Completed' },
  { id: 'o2', resourceId: 'r2', title: 'Form 2 Mathematics Notes', date: 'Aug 3, 2026', amountKsh: 150, status: 'Completed' },
  { id: 'o3', resourceId: 'r4', title: 'AI Generated Chemistry Notes', date: 'Aug 1, 2026', amountKsh: 200, status: 'Pending' },
];

export interface LibraryItem { resourceId: string; purchasedOn: string; progressPct: number; }
export const library: LibraryItem[] = [
  { resourceId: 'r1', purchasedOn: 'Aug 5, 2026', progressPct: 40 },
  { resourceId: 'r2', purchasedOn: 'Aug 3, 2026', progressPct: 100 },
];

export const wishlistSeed: string[] = ['r3', 'r6'];

export interface SubPlan { key: string; name: string; priceKsh: number; period: string; perks: string[]; current?: boolean; }
export const subscriptions = {
  plans: [
    { key: 'free', name: 'Free', priceKsh: 0, period: 'forever', perks: ['Browse marketplace', 'Buy single resources', 'Community access'], current: true },
    { key: 'plus', name: 'Student Plus', priceKsh: 499, period: 'month', perks: ['10 resources / month', 'AI summaries & quizzes', 'Priority support'] },
    { key: 'family', name: 'Family', priceKsh: 999, period: 'month', perks: ['Up to 4 learners', 'Unlimited AI tools', 'Shared library'] },
  ] as SubPlan[],
};

export interface Transaction { id: string; label: string; date: string; amountKsh: number; direction: 'in' | 'out'; }
export const payments = {
  methods: [{ key: 'mpesa', label: 'M-Pesa', detail: '•••• 0712', primary: true }],
  transactions: [
    { id: 't1', label: 'Top-up via M-Pesa', date: 'Aug 5, 2026', amountKsh: 1000, direction: 'in' },
    { id: 't2', label: 'KCSE Biology 2026 Revision', date: 'Aug 5, 2026', amountKsh: 250, direction: 'out' },
    { id: 't3', label: 'Form 2 Mathematics Notes', date: 'Aug 3, 2026', amountKsh: 150, direction: 'out' },
  ] as Transaction[],
};

export const wallet = { balanceKsh: 1250 };

export interface Conversation { id: string; from: string; role: string; preview: string; when: string; unread: boolean; messages: { me: boolean; text: string }[]; }
export const conversations: Conversation[] = [
  { id: 'c1', from: 'Teacher Jane', role: 'Teacher', preview: 'The revision notes are updated for 2026…', when: '10:24 AM', unread: true,
    messages: [ { me: false, text: 'Hi! Thanks for buying the Biology revision.' }, { me: false, text: 'The revision notes are updated for 2026.' }, { me: true, text: 'Great, thank you!' } ] },
  { id: 'c2', from: 'Tutor Brian', role: 'Tutor', preview: 'Live class starts Saturday 10am.', when: 'Yesterday', unread: false,
    messages: [ { me: false, text: 'Live class starts Saturday 10am.' } ] },
];

export function findResource(id: string): Resource | undefined {
  return resources.find(r => r.id === id);
}

export type SellerType = 'teacher' | 'tutor' | 'school';

export type SellerStatus = 'active' | 'pending' | 'suspended' | 'rejected';

export interface Seller {
  displayName: string;
  phone: string;
  type: SellerType;
  status: SellerStatus;
  /** Type-specific registration number used for admin verification:
   *  teacher → TSC, school → MoE/NEMIS code, tutor → National ID. */
  regNumber?: string | null;
  /** Location (town / county) — captured for schools and tutors. */
  location?: string | null;
  /** School the teacher operates in — teachers only. */
  schoolName?: string | null;
  payoutBalancePending: number;
  payoutBalancePaid: number;
}

export type ResourceStatus = 'draft' | 'published';

/** LEVEL_CONFIG keys (src/hooks/LevelConfigs.ts). */
export type ResourceLevel = 'lower_primary' | 'middle_school' | 'senior_school';

export interface ResourceFile {
  name: string;
  url: string;
  path: string;
  size: number;
  contentType: string;
}

export type ResourceKind = 'document' | 'video' | 'audio';

/** A quiz question as shown to the student — NO correct answer is included. */
export interface QuizQuestionPublic {
  prompt: string;
  options: string[];            // 2–4 options
}

/** The gradable half of a question, stored in resources/{id}/private/quiz. */
export interface QuizAnswer {
  correctIndex: number;
  explanation?: string;
}

export interface MarketResource {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  level: ResourceLevel;
  grade: string;
  subject: string;
  priceKsh: number;
  files: ResourceFile[];
  thumbnailUrl: string | null;
  thumbnailPath: string | null;
  kind: ResourceKind;
  media: ResourceFile | null;
  durationSec: number | null;
  hasQuiz: boolean;
  quiz: QuizQuestionPublic[];
  status: ResourceStatus;
  sales: number;
  views: number;
  createdAt: unknown;   // Firestore Timestamp
  updatedAt: unknown;   // Firestore Timestamp
}

export type PaymentMethod = 'wallet' | 'mpesa';
export type PurchaseStatus = 'paid' | 'pending' | 'failed';

/** An order record — one per resource bought. Written only by Cloud Functions.
 *  My Library is derived from these (owned = status 'paid'). */
export interface Purchase {
  id: string;
  resourceId: string;
  sellerId: string;
  buyerAccountId: string;
  title: string;
  priceKsh: number;
  method: PaymentMethod;
  status: PurchaseStatus;
  createdAt: unknown;   // Firestore Timestamp
  paidAt?: unknown;     // Firestore Timestamp
}

/** A wallet ledger row on the account. Written only by Cloud Functions. */
export interface WalletTx {
  id: string;
  type: 'topup' | 'purchase';
  amountKsh: number;    // positive for topups, negative for purchases
  ref?: string;         // purchaseId for purchases
  createdAt: unknown;   // Firestore Timestamp
}

/** Editable metadata supplied by the form (files handled separately). */
export interface ResourceInput {
  title: string;
  description: string;
  level: ResourceLevel;
  grade: string;
  subject: string;
  priceKsh: number;
  status: ResourceStatus;
  kind: ResourceKind;
}

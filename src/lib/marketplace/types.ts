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

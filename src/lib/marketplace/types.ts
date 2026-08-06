export type SellerType = 'teacher' | 'tutor' | 'school';

export type SellerStatus = 'active' | 'pending' | 'suspended' | 'rejected';

export interface Seller {
  displayName: string;
  phone: string;
  type: SellerType;
  status: SellerStatus;
  /** Kenyan TSC number — present for teachers, used for admin verification. */
  tscNumber?: string | null;
  payoutBalancePending: number;
  payoutBalancePaid: number;
}

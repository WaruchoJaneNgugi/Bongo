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
  payoutBalancePending: number;
  payoutBalancePaid: number;
}

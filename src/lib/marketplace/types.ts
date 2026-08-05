export type SellerType = 'teacher' | 'tutor' | 'school';

export interface Seller {
  displayName: string;
  phone: string;
  type: SellerType;
  status: 'active' | 'suspended';
  payoutBalancePending: number;
  payoutBalancePaid: number;
}

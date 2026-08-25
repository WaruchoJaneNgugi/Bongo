// Pure commission math, unit-tested independently of Firestore.
// The platform takes `commissionPercent` of the price (rounded); the seller
// receives the remainder, so the two shares always sum back to the price with
// no rounding drift.
export function splitPayment(
  priceKsh: number,
  commissionPercent: number,
): { sellerShareKsh: number; commissionKsh: number } {
  const commissionKsh = Math.round((priceKsh * commissionPercent) / 100);
  return { sellerShareKsh: priceKsh - commissionKsh, commissionKsh };
}

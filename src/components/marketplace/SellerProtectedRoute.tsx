import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSellerStore } from '../../store/useSellerStore';

export default function SellerProtectedRoute({ children }: { children: React.ReactNode }) {
  const sellerId = useSellerStore(s => s.sellerId);
  const authReady = useSellerStore(s => s.authReady);
  // Wait for Firebase to restore the session on refresh before deciding —
  // otherwise a signed-in seller is bounced to sign-in on every reload.
  if (!authReady) return null;
  if (!sellerId) return <Navigate to="/seller" replace />;
  return <>{children}</>;
}

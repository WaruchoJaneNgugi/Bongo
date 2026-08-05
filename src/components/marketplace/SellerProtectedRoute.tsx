import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSellerStore } from '../../store/useSellerStore';

export default function SellerProtectedRoute({ children }: { children: React.ReactNode }) {
  const sellerId = useSellerStore(s => s.sellerId);
  if (!sellerId) return <Navigate to="/seller" replace />;
  return <>{children}</>;
}

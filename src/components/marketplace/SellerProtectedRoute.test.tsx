import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SellerProtectedRoute from './SellerProtectedRoute';

let state: { sellerId: string | null; authReady: boolean };

vi.mock('../../store/useSellerStore', () => ({
  useSellerStore: (sel: (s: unknown) => unknown) => sel(state),
}));

function renderGuarded() {
  return render(
    <MemoryRouter initialEntries={['/seller/dashboard']}>
      <Routes>
        <Route path="/seller" element={<div>SIGNIN</div>} />
        <Route path="/seller/dashboard" element={
          <SellerProtectedRoute><div>DASH</div></SellerProtectedRoute>
        } />
      </Routes>
    </MemoryRouter>,
  );
}

describe('SellerProtectedRoute', () => {
  it('waits (no redirect) while auth is still resolving on refresh', () => {
    state = { sellerId: null, authReady: false };
    renderGuarded();
    expect(screen.queryByText('SIGNIN')).toBeNull();
    expect(screen.queryByText('DASH')).toBeNull();
  });

  it('redirects to sign-in once resolved with no seller', () => {
    state = { sellerId: null, authReady: true };
    renderGuarded();
    expect(screen.getByText('SIGNIN')).toBeInTheDocument();
  });

  it('renders the protected page for a restored seller session', () => {
    state = { sellerId: 'seller1', authReady: true };
    renderGuarded();
    expect(screen.getByText('DASH')).toBeInTheDocument();
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MarketLayout from './MarketLayout';
import { useStore } from '../../../store/useStore';

// Minimal logged-in account so the shell (not the auth gate) renders.
const login = () =>
  useStore.setState({
    authReady: true,
    isLoggedIn: true,
    user: { profiles: [{ id: 'p1', username: 'Jane', grade: 1 }], activeProfileId: 'p1' } as never,
  });
const logout = () =>
  useStore.setState({ authReady: true, isLoggedIn: false, user: null });

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<MarketLayout />}>
          <Route path="/market" element={<div>HOME PAGE</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('MarketLayout', () => {
  beforeEach(login);

  it('renders all 8 sidebar items and the outlet when logged in', () => {
    renderAt('/market');
    for (const label of ['Home', 'Marketplace', 'My Library', 'Messages', 'Wishlist', 'Orders', 'Subscriptions', 'Payments']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.getByText('HOME PAGE')).toBeInTheDocument();
    expect(screen.getByText('Become a Seller')).toBeInTheDocument();
  });

  it('shows the auth gate (Log In / Sign Up) when logged out', () => {
    logout();
    renderAt('/market');
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    // The marketplace shell / outlet must NOT render for a signed-out visitor.
    expect(screen.queryByText('HOME PAGE')).toBeNull();
  });
});

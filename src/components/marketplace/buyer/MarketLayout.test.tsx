import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MarketLayout from './MarketLayout';

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
  it('renders all 8 sidebar items and the outlet', () => {
    renderAt('/market');
    for (const label of ['Home', 'Marketplace', 'My Library', 'Messages', 'Wishlist', 'Orders', 'Subscriptions', 'Payments']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.getByText('HOME PAGE')).toBeInTheDocument();
    expect(screen.getByText('Become a Seller')).toBeInTheDocument();
  });
});

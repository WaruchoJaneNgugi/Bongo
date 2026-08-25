import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { MarketResource } from '../../../../lib/marketplace/types';
import Checkout from './Checkout';
import { useMarketStore } from '../../../../store/useMarketStore';

const resource: MarketResource = {
  id: 'r1', sellerId: 's1', sellerName: 'Teacher Jane',
  title: 'KCSE Biology 2026 Revision', description: 'x',
  level: 'senior_school', grade: 'Grade 11', subject: 'Biology',
  priceKsh: 250, files: [], thumbnailUrl: null, thumbnailPath: null,
  status: 'published', sales: 0, views: 0, createdAt: 0, updatedAt: 0,
};

const h = vi.hoisted(() => ({ balance: 1000, walletCheckout: vi.fn(), navigate: vi.fn() }));

vi.mock('../../../../lib/marketplace/catalog', () => ({
  getPublishedResource: (id: string) => Promise.resolve(id === 'r1' ? resource : null),
}));

vi.mock('../../../../lib/marketplace/wallet', () => ({
  subscribeWallet: (_id: string, cb: (b: number) => void) => { cb(h.balance); return () => undefined; },
  walletCheckout: h.walletCheckout,
}));

vi.mock('../../../../store/useStore', () => ({
  useStore: (sel: (s: unknown) => unknown) => sel({ accountId: 'acc1', user: { phone: '0712000111' } }),
}));

vi.mock('react-router-dom', async (orig) => {
  const actual = await (orig as () => Promise<Record<string, unknown>>)();
  return { ...actual, useNavigate: () => h.navigate };
});

describe('Checkout', () => {
  beforeEach(() => {
    h.balance = 1000;
    h.walletCheckout.mockReset();
    h.navigate.mockReset();
    useMarketStore.setState({ cart: ['r1'], wishlist: [] });
  });

  it('lists cart items with the total', async () => {
    render(<MemoryRouter><Checkout /></MemoryRouter>);
    expect(await screen.findByText('KCSE Biology 2026 Revision')).toBeInTheDocument();
    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.getAllByText(/KSh 250/).length).toBeGreaterThan(0);
  });

  it('shows the empty state when the cart is empty', async () => {
    useMarketStore.setState({ cart: [], wishlist: [] });
    render(<MemoryRouter><Checkout /></MemoryRouter>);
    expect(await screen.findByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('pays from the wallet, clears the cart, and goes to the library on success', async () => {
    h.walletCheckout.mockResolvedValue({ purchased: ['r1'], skipped: [], newBalanceKsh: 750 });
    render(<MemoryRouter><Checkout /></MemoryRouter>);

    const payBtn = await screen.findByRole('button', { name: /pay from wallet/i });
    expect(payBtn).toBeEnabled();
    fireEvent.click(payBtn);

    await waitFor(() => expect(h.walletCheckout).toHaveBeenCalledWith(['r1']));
    await waitFor(() => expect(useMarketStore.getState().cart).toEqual([]));
    expect(h.navigate).toHaveBeenCalledWith('/market/library', expect.objectContaining({ state: expect.anything() }));
  });

  it('disables paying from the wallet when the balance is below the total', async () => {
    h.balance = 100; // total is 250
    render(<MemoryRouter><Checkout /></MemoryRouter>);
    const payBtn = await screen.findByRole('button', { name: /pay from wallet/i });
    expect(payBtn).toBeDisabled();
    expect(screen.getByText(/top up to continue/i)).toBeInTheDocument();
  });
});

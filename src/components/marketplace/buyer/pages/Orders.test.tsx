import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Orders from './Orders';

vi.mock('../../../../lib/marketplace/orders', () => ({
  subscribePurchases: (_id: string, cb: (rows: unknown[]) => void) => {
    cb([
      { id: 'p1', title: 'KCSE Biology 2026 Revision', priceKsh: 250, status: 'paid', createdAt: new Date('2026-08-10T00:00:00Z') },
      { id: 'p2', title: 'Form 2 Maths Notes', priceKsh: 100, status: 'pending', createdAt: new Date('2026-08-11T00:00:00Z') },
    ]);
    return () => undefined;
  },
}));

vi.mock('../../../../store/useStore', () => ({
  useStore: (sel: (s: unknown) => unknown) => sel({ accountId: 'acc1' }),
}));

describe('Orders', () => {
  it('renders order history rows from real purchases', () => {
    render(<Orders />);
    expect(screen.getByText('Order History')).toBeInTheDocument();
    expect(screen.getByText('KCSE Biology 2026 Revision')).toBeInTheDocument();
    expect(screen.getByText(/KSh 250/)).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });
});

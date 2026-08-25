import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Payments from './Payments';

vi.mock('../../../../lib/marketplace/wallet', () => ({
  subscribeWallet: (_id: string, cb: (b: number) => void) => { cb(750); return () => undefined; },
  subscribeWalletTx: (_id: string, cb: (rows: unknown[]) => void) => {
    cb([
      { id: 't1', type: 'topup', amountKsh: 1000, createdAt: new Date('2026-08-09T00:00:00Z') },
      { id: 't2', type: 'purchase', amountKsh: -250, ref: 'p1', createdAt: new Date('2026-08-10T00:00:00Z') },
    ]);
    return () => undefined;
  },
}));

vi.mock('../../../../store/useStore', () => ({
  useStore: (sel: (s: unknown) => unknown) => sel({ accountId: 'acc1' }),
}));

describe('Payments', () => {
  it('shows the real wallet balance and transaction history', () => {
    render(<Payments />);
    expect(screen.getByText(/KSh 750/)).toBeInTheDocument();
    // topup credit and purchase debit both appear
    expect(screen.getByText(/\+KSh 1,000/)).toBeInTheDocument();
    expect(screen.getByText(/−KSh 250/)).toBeInTheDocument();
  });

  it('shows top-up as unavailable until M-Pesa is set up', () => {
    render(<Payments />);
    const topUp = screen.getByRole('button', { name: /top up/i });
    expect(topUp).toBeDisabled();
  });
});

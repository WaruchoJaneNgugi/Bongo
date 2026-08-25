import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WalletsSection from './WalletsSection';

const h = vi.hoisted(() => ({ creditWallet: vi.fn() }));
vi.mock('../../lib/marketplace/wallet', () => ({ creditWallet: h.creditWallet }));

beforeEach(() => h.creditWallet.mockReset());

describe('WalletsSection', () => {
  it('credits a wallet with the entered account id and amount', async () => {
    h.creditWallet.mockResolvedValue(undefined);
    render(<WalletsSection />);

    fireEvent.change(screen.getByLabelText(/account id/i), { target: { value: 'acc1' } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '500' } });
    fireEvent.click(screen.getByRole('button', { name: /credit wallet/i }));

    await waitFor(() => expect(h.creditWallet).toHaveBeenCalledWith('acc1', 500));
    expect(await screen.findByText(/credited/i)).toBeInTheDocument();
  });

  it('does not submit without an account id and a positive amount', () => {
    render(<WalletsSection />);
    fireEvent.click(screen.getByRole('button', { name: /credit wallet/i }));
    expect(h.creditWallet).not.toHaveBeenCalled();
  });
});

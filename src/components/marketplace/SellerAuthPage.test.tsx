import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SellerAuthPage from './SellerAuthPage';

// Each seller type has its own registration-number field (only on signup).
describe('SellerAuthPage — registration number', () => {
  it('shows a type-specific registration field on signup', async () => {
    render(<MemoryRouter><SellerAuthPage /></MemoryRouter>);

    // Default view is login — no registration field.
    expect(screen.queryByPlaceholderText('TSC number')).toBeNull();

    // Switch to signup; teacher is the default account type → TSC number.
    await userEvent.click(screen.getByRole('button', { name: /Create a seller account/i }));
    expect(screen.getByPlaceholderText('TSC number')).toBeInTheDocument();

    // Tutor → National ID number.
    await userEvent.click(screen.getByRole('button', { name: /^tutor$/i }));
    expect(screen.getByPlaceholderText('National ID number')).toBeInTheDocument();

    // School → School registration code.
    await userEvent.click(screen.getByRole('button', { name: /^school$/i }));
    expect(screen.getByPlaceholderText('School registration code')).toBeInTheDocument();
  });
});

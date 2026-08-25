import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SellerAuthPage from './SellerAuthPage';

// TEACHERS ONLY: teachers are currently the only seller type, so signup always
// asks for a TSC number. The tutor / school assertions are kept commented below
// for when those seller types are re-enabled.
describe('SellerAuthPage — registration number', () => {
  it('shows the teacher TSC registration field on signup', async () => {
    render(<MemoryRouter><SellerAuthPage /></MemoryRouter>);

    // Default view is login — no registration field.
    expect(screen.queryByPlaceholderText('TSC number')).toBeNull();

    // Switch to signup; teacher is the only account type → TSC number.
    await userEvent.click(screen.getByRole('button', { name: /Create a seller account/i }));
    expect(screen.getByPlaceholderText('TSC number')).toBeInTheDocument();

    // Tutor and school seller types are disabled — no type selector is shown.
    expect(screen.queryByRole('button', { name: /^tutor$/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /^school$/i })).toBeNull();

    // // Tutor → National ID number.
    // await userEvent.click(screen.getByRole('button', { name: /^tutor$/i }));
    // expect(screen.getByPlaceholderText('National ID number')).toBeInTheDocument();

    // // School → School registration code.
    // await userEvent.click(screen.getByRole('button', { name: /^school$/i }));
    // expect(screen.getByPlaceholderText('School registration code')).toBeInTheDocument();
  });
});

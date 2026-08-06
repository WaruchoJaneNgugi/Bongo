import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SellerAuthPage from './SellerAuthPage';

// The TSC number input is teacher-only and only on the signup view.
describe('SellerAuthPage — TSC number', () => {
  it('shows the TSC input for a teacher signup and hides it for tutors', async () => {
    render(<MemoryRouter><SellerAuthPage /></MemoryRouter>);

    // Default view is login — no TSC field.
    expect(screen.queryByPlaceholderText('TSC number')).toBeNull();

    // Switch to signup; teacher is the default account type.
    await userEvent.click(screen.getByRole('button', { name: /Create a seller account/i }));
    expect(screen.getByPlaceholderText('TSC number')).toBeInTheDocument();

    // Switching to Tutor hides it.
    await userEvent.click(screen.getByRole('button', { name: /^tutor$/i }));
    expect(screen.queryByPlaceholderText('TSC number')).toBeNull();
  });
});

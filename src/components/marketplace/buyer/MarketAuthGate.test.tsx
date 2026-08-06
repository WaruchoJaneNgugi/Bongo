import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import MarketAuthGate from './MarketAuthGate';
import { useStore } from '../../../store/useStore';

describe('MarketAuthGate', () => {
  beforeEach(() => useStore.setState({ overlay: null }));

  it('opens the login overlay when Log In is clicked', async () => {
    const spy = vi.spyOn(useStore.getState(), 'setOverlay');
    render(<MemoryRouter><MarketAuthGate /></MemoryRouter>);
    await userEvent.click(screen.getByRole('button', { name: /^Log In$/i }));
    expect(spy).toHaveBeenCalledWith('login');
  });

  it('opens the signup overlay when Sign Up is clicked', async () => {
    const spy = vi.spyOn(useStore.getState(), 'setOverlay');
    render(<MemoryRouter><MarketAuthGate /></MemoryRouter>);
    await userEvent.click(screen.getByRole('button', { name: /^Sign Up$/i }));
    expect(spy).toHaveBeenCalledWith('signup');
  });

  it('offers a seller log in / sign up path', () => {
    render(<MemoryRouter><MarketAuthGate /></MemoryRouter>);
    expect(screen.getByRole('button', { name: /Seller Log In/i })).toBeInTheDocument();
  });
});

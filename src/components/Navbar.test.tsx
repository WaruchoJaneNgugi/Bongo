import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('links to the marketplace and not the seller page', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    const market = screen.getByRole('link', { name: /Market/i });
    expect(market).toHaveAttribute('href', '/market');
    expect(screen.queryByRole('link', { name: /^Sell$/i })).toBeNull();
  });
});

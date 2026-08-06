import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MarketHome from './MarketHome';

describe('MarketHome', () => {
  it('renders hero, stats and a resource', () => {
    render(<MemoryRouter><MarketHome /></MemoryRouter>);
    expect(screen.getByText(/Learn\. Teach\. Earn\./i)).toBeInTheDocument();
    expect(screen.getByText('Browse by Category')).toBeInTheDocument();
    expect(screen.getByText('KCSE Biology 2026 Revision')).toBeInTheDocument();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MarketBrowse from './MarketBrowse';

describe('MarketBrowse', () => {
  it('renders the storefront grid without any layout wrapper', () => {
    render(<MemoryRouter><MarketBrowse /></MemoryRouter>);
    expect(screen.getByText('KCSE Biology 2026 Revision')).toBeInTheDocument();
    expect(screen.getByText('All Subjects')).toBeInTheDocument();
  });
});

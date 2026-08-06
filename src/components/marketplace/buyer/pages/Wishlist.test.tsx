import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Wishlist from './Wishlist';
import { useMarketStore } from '../../../../store/useMarketStore';

describe('Wishlist', () => {
  beforeEach(() => useMarketStore.setState({ cart: [], wishlist: ['r3'] }));

  it('shows wishlisted resources', () => {
    render(<MemoryRouter><Wishlist /></MemoryRouter>);
    expect(screen.getByText('Physics Live Classes (Weekly)')).toBeInTheDocument();
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { MarketResource } from '../../../../lib/marketplace/types';
import Wishlist from './Wishlist';
import { useMarketStore } from '../../../../store/useMarketStore';

const rows: MarketResource[] = [{
  id: 'r1', sellerId: 's1', sellerName: 'Tutor Brian',
  title: 'Physics Live Classes', description: 'x',
  level: 'senior_school', grade: 'Grade 11', subject: 'Physics',
  priceKsh: 500, files: [], thumbnailUrl: null, thumbnailPath: null,
  kind: 'document', media: null, durationSec: null, hasQuiz: false, quiz: [],
  status: 'published', sales: 0, views: 0, createdAt: 0, updatedAt: 0,
}];

vi.mock('../../../../lib/marketplace/catalog', () => ({
  listPublishedResources: () => Promise.resolve(rows),
}));

describe('Wishlist', () => {
  beforeEach(() => useMarketStore.setState({ cart: [], wishlist: ['r1'] }));

  it('shows wishlisted resources fetched from the catalog', async () => {
    render(<MemoryRouter><Wishlist /></MemoryRouter>);
    expect(await screen.findByText('Physics Live Classes')).toBeInTheDocument();
  });

  it('shows the empty state when nothing is saved', async () => {
    useMarketStore.setState({ cart: [], wishlist: [] });
    render(<MemoryRouter><Wishlist /></MemoryRouter>);
    expect(await screen.findByText(/nothing saved yet/i)).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { MarketResource } from '../../../../lib/marketplace/types';
import MarketHome from './MarketHome';

const rows: MarketResource[] = [{
  id: 'r1', sellerId: 's1', sellerName: 'Teacher Jane',
  title: 'KCSE Biology 2026 Revision', description: 'x',
  level: 'senior_school', grade: 'Grade 11', subject: 'Biology',
  priceKsh: 250, files: [], thumbnailUrl: null, thumbnailPath: null,
  status: 'published', sales: 0, views: 0, createdAt: 0, updatedAt: 0,
}];

vi.mock('../../../../lib/marketplace/catalog', () => ({
  listPublishedResources: () => Promise.resolve(rows),
}));

describe('MarketHome', () => {
  it('renders hero, category section and a real published resource', async () => {
    render(<MemoryRouter><MarketHome /></MemoryRouter>);
    expect(screen.getByText(/Learn\. Teach\. Earn\./i)).toBeInTheDocument();
    expect(screen.getByText('Browse by Category')).toBeInTheDocument();
    expect(await screen.findByText('KCSE Biology 2026 Revision')).toBeInTheDocument();
  });
});

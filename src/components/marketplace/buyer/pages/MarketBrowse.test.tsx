import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { MarketResource } from '../../../../lib/marketplace/types';
import MarketBrowse from './MarketBrowse';

const rows: MarketResource[] = [{
  id: 'r1', sellerId: 's1', sellerName: 'Teacher Jane',
  title: 'KCSE Biology 2026 Revision', description: 'x',
  level: 'senior_school', grade: 'Grade 11', subject: 'Biology',
  priceKsh: 250, files: [], thumbnailUrl: null, thumbnailPath: null,
  kind: 'document', media: null, durationSec: null, hasQuiz: false, quiz: [],
  status: 'published', sales: 0, views: 0, createdAt: 0, updatedAt: 0,
}];

vi.mock('../../../../lib/marketplace/catalog', () => ({
  listPublishedResources: () => Promise.resolve(rows),
}));

describe('MarketBrowse', () => {
  it('renders published resources fetched from the catalog', async () => {
    render(<MemoryRouter><MarketBrowse /></MemoryRouter>);
    expect(await screen.findByText('KCSE Biology 2026 Revision')).toBeInTheDocument();
    expect(screen.getByText('All Subjects')).toBeInTheDocument();
  });
});

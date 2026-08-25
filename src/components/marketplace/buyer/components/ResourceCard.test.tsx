import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResourceCard from './ResourceCard';
import type { MarketResource } from '../../../../lib/marketplace/types';

const resource: MarketResource = {
  id: 'r1', sellerId: 's1', sellerName: 'Teacher Jane',
  title: 'KCSE Biology 2026 Revision', description: 'x',
  level: 'senior_school', grade: 'Grade 11', subject: 'Biology',
  priceKsh: 250, files: [], thumbnailUrl: null, thumbnailPath: null,
  status: 'published', sales: 0, views: 0, createdAt: 0, updatedAt: 0,
};

describe('ResourceCard', () => {
  it('shows title, price and a Buy Now CTA', () => {
    render(<MemoryRouter><ResourceCard resource={resource} /></MemoryRouter>);
    expect(screen.getByText('KCSE Biology 2026 Revision')).toBeInTheDocument();
    expect(screen.getByText(/KSh 250/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buy now/i })).toBeInTheDocument();
  });

  it('links the title to the resource detail page', () => {
    render(<MemoryRouter><ResourceCard resource={resource} /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /KCSE Biology 2026 Revision/i }))
      .toHaveAttribute('href', '/market/resource/r1');
  });
});

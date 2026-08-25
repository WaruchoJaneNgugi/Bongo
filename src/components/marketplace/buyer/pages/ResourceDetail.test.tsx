import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import type { MarketResource } from '../../../../lib/marketplace/types';
import ResourceDetail from './ResourceDetail';

let result: MarketResource | null = null;

vi.mock('../../../../lib/marketplace/catalog', () => ({
  getPublishedResource: () => Promise.resolve(result),
}));

const resource: MarketResource = {
  id: 'r1', sellerId: 's1', sellerName: 'Teacher Jane',
  title: 'KCSE Biology 2026 Revision', description: 'Full revision.',
  level: 'senior_school', grade: 'Grade 11', subject: 'Biology',
  priceKsh: 250,
  files: [{ name: 'notes.pdf', url: 'https://secret/notes.pdf', path: 'p', size: 1, contentType: 'application/pdf' }],
  thumbnailUrl: null, thumbnailPath: null,
  status: 'published', sales: 0, views: 0, createdAt: 0, updatedAt: 0,
};

function renderAt(id = 'r1') {
  return render(
    <MemoryRouter initialEntries={[`/market/resource/${id}`]}>
      <Routes>
        <Route path="/market/resource/:id" element={<ResourceDetail />} />
        <Route path="/market/browse" element={<div>BROWSE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ResourceDetail', () => {
  it('shows the resource with a locked file list and no download URL exposed', async () => {
    result = resource;
    renderAt();
    expect(await screen.findByText('KCSE Biology 2026 Revision')).toBeInTheDocument();
    expect(screen.getByText('notes.pdf')).toBeInTheDocument();
    // The file name is shown, but the actual download URL is never rendered.
    const hrefs = screen.getAllByRole('link').map(l => l.getAttribute('href'));
    expect(hrefs).not.toContain('https://secret/notes.pdf');
  });

  it('shows a not-found state for an unavailable resource', async () => {
    result = null;
    renderAt('missing');
    expect(await screen.findByText(/isn.t available/i)).toBeInTheDocument();
  });
});

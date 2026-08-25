import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { MarketResource } from '../../lib/marketplace/types';
import MyResources from './MyResources';

const { setStatus, del } = vi.hoisted(() => ({
  setStatus: vi.fn<(id: string, status: string) => Promise<void>>(),
  del: vi.fn<(r: unknown) => Promise<void>>(),
}));
let rows: MarketResource[] = [];

vi.mock('../../lib/marketplace/resources', () => ({
  subscribeSellerResources: (_id: string, cb: (r: MarketResource[]) => void) => {
    cb(rows);
    return () => undefined;
  },
  setResourceStatus: setStatus,
  deleteResource: del,
}));

vi.mock('../../store/useSellerStore', () => ({
  useSellerStore: (sel: (s: unknown) => unknown) =>
    sel({ sellerId: 'seller1', seller: { displayName: 'Ms Jane' } }),
}));

function makeRow(over: Partial<MarketResource> = {}): MarketResource {
  return {
    id: 'r1', sellerId: 'seller1', sellerName: 'Ms Jane',
    title: 'Fractions Pack', description: 'x',
    level: 'middle_school', grade: 'Grade 5', subject: 'Mathematics',
    priceKsh: 150, files: [], thumbnailUrl: null, thumbnailPath: null,
    status: 'draft', sales: 0, views: 0, createdAt: 0, updatedAt: 0, ...over,
  };
}

beforeEach(() => { rows = []; setStatus.mockClear(); del.mockClear(); });

describe('MyResources', () => {
  it('shows an empty state with a create link when there are no resources', () => {
    render(<MemoryRouter><MyResources /></MemoryRouter>);
    expect(screen.getByText(/no resources yet/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create.*resource/i }))
      .toHaveAttribute('href', '/seller/resources/new');
  });

  it('lists resources with title and status', () => {
    rows = [makeRow({ status: 'published' })];
    render(<MemoryRouter><MyResources /></MemoryRouter>);
    expect(screen.getByText('Fractions Pack')).toBeInTheDocument();
    expect(screen.getByText(/published/i)).toBeInTheDocument();
  });

  it('publishes a draft via the toggle', async () => {
    rows = [makeRow({ status: 'draft' })];
    render(<MemoryRouter><MyResources /></MemoryRouter>);
    await userEvent.click(screen.getByRole('button', { name: /publish/i }));
    expect(setStatus).toHaveBeenCalledWith('r1', 'published');
  });

  it('deletes after confirm', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    rows = [makeRow()];
    render(<MemoryRouter><MyResources /></MemoryRouter>);
    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(del).toHaveBeenCalledTimes(1);
  });
});

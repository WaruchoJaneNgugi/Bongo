import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { MarketResource } from '../../lib/marketplace/types';
import SellerDashboard from './SellerDashboard';

let rows: MarketResource[] = [];
const seller = {
  displayName: 'Nancy Wanjiru', status: 'active' as const,
  payoutBalancePaid: 0, payoutBalancePending: 0,
};

vi.mock('../../lib/marketplace/resources', () => ({
  subscribeSellerResources: (_id: string, cb: (r: MarketResource[]) => void) => {
    cb(rows);
    return () => undefined;
  },
}));

vi.mock('../../store/useSellerStore', () => ({
  useSellerStore: (sel: (s: unknown) => unknown) =>
    sel({ sellerId: 'seller1', seller }),
}));

function makeRow(over: Partial<MarketResource> = {}): MarketResource {
  return {
    id: 'r1', sellerId: 'seller1', sellerName: 'Nancy Wanjiru',
    title: 'Fractions Pack', description: 'x',
    level: 'middle_school', grade: 'Grade 5', subject: 'Mathematics',
    priceKsh: 150, files: [], thumbnailUrl: null, thumbnailPath: null,
    status: 'published', sales: 0, views: 0, createdAt: 0, updatedAt: 0, ...over,
  };
}

beforeEach(() => { rows = []; });

function renderDash() {
  return render(<MemoryRouter><SellerDashboard /></MemoryRouter>);
}

describe('SellerDashboard (honest data)', () => {
  it('shows the real published-resource count', () => {
    rows = [makeRow({ id: 'a', status: 'published' }), makeRow({ id: 'b', status: 'draft' })];
    renderDash();
    const card = screen.getByText('Published Resources').parentElement!;
    expect(within(card).getByText('1')).toBeInTheDocument();      // one published
    expect(within(card).getByText(/1 draft/i)).toBeInTheDocument(); // one draft
  });

  it('shows KSh 0 earnings and no fabricated figures', () => {
    rows = [makeRow()];
    renderDash();
    expect(screen.getAllByText('KSh 0').length).toBeGreaterThan(0);
    expect(screen.queryByText(/12,450/)).toBeNull();
    expect(screen.queryByText(/245/)).toBeNull();
  });

  it('shows the "no sales yet" empty state instead of a fake table', () => {
    rows = [makeRow()];
    renderDash();
    expect(screen.getByText(/no sales yet/i)).toBeInTheDocument();
    expect(screen.queryByText('KCSE Biology 2026 Revision')).toBeNull();
  });

  it('shows the no-reviews rating state', () => {
    rows = [makeRow()];
    renderDash();
    const card = screen.getByText('Average Rating').parentElement!;
    expect(within(card).getByText('—')).toBeInTheDocument();
    expect(within(card).getByText(/no reviews yet/i)).toBeInTheDocument();
  });

  it('lists the seller\'s real resources under My Top Resources', () => {
    rows = [makeRow({ title: 'My Real Worksheet' })];
    renderDash();
    expect(screen.getByText('My Real Worksheet')).toBeInTheDocument();
  });

  it('prompts to create when there are no resources', () => {
    rows = [];
    renderDash();
    expect(screen.getByText(/haven't created any resources/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create a resource/i }))
      .toHaveAttribute('href', '/seller/resources/new');
  });

  it('wires every "Upload New Resource" link to the create route', () => {
    rows = [makeRow()];
    renderDash();
    const links = screen.getAllByRole('link', { name: /upload new resource/i });
    expect(links.length).toBeGreaterThan(0);
    links.forEach(l => expect(l).toHaveAttribute('href', '/seller/resources/new'));
  });
});

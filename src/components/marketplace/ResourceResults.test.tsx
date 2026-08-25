import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { QuizResultRow } from '../../lib/marketplace/resources';
import ResourceResults from './ResourceResults';

let rows: QuizResultRow[] = [];

vi.mock('../../lib/marketplace/resources', () => ({
  subscribeQuizResults: (_id: string, cb: (r: QuizResultRow[]) => void) => {
    cb(rows);
    return () => undefined;
  },
}));

vi.mock('../../store/useSellerStore', () => ({
  useSellerStore: (sel: (s: unknown) => unknown) =>
    sel({ sellerId: 'seller1', seller: { displayName: 'Ms Jane' } }),
}));

beforeEach(() => { rows = []; });

describe('ResourceResults', () => {
  it('shows a friendly empty state when there are no results', () => {
    render(<ResourceResults />);
    expect(screen.getByText(/no quiz results yet/i)).toBeInTheDocument();
  });

  it('renders a result row with resource, student and score', () => {
    rows = [{
      id: 'res1_buyer1', resourceId: 'res1', buyerAccountId: 'buyer1',
      resourceTitle: 'Fractions Video', score: 4, total: 5,
    }];
    render(<ResourceResults />);
    expect(screen.getByText('Fractions Video')).toBeInTheDocument();
    expect(screen.getByText('buyer1')).toBeInTheDocument();
    expect(screen.getByText('4 / 5')).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyLibrary from './MyLibrary';

vi.mock('../../../../lib/marketplace/orders', () => ({
  subscribePurchases: (_id: string, cb: (rows: unknown[]) => void) => {
    cb([
      { id: 'p1', resourceId: 'r1', title: 'Form 2 Mathematics Notes', priceKsh: 150, status: 'paid', createdAt: new Date('2026-08-10T00:00:00Z') },
      // A failed order must not appear in the library (owned = paid only).
      { id: 'p2', resourceId: 'r2', title: 'Unpaid Thing', priceKsh: 100, status: 'failed', createdAt: new Date('2026-08-11T00:00:00Z') },
    ]);
    return () => undefined;
  },
}));

vi.mock('../../../../lib/marketplace/catalog', () => ({
  getPublishedResource: (id: string) =>
    Promise.resolve(
      id === 'r1'
        ? { id: 'r1', subject: 'Mathematics', files: [{ name: 'notes.pdf', url: 'https://dl/notes.pdf', path: 'p', size: 1, contentType: 'application/pdf' }] }
        : null,
    ),
}));

vi.mock('../../../../store/useStore', () => ({
  useStore: (sel: (s: unknown) => unknown) => sel({ accountId: 'acc1' }),
}));

describe('MyLibrary', () => {
  it('lists only paid purchases and offers a download link', async () => {
    render(<MyLibrary />);
    expect(screen.getByText('My Library')).toBeInTheDocument();
    expect(screen.getByText('Form 2 Mathematics Notes')).toBeInTheDocument();
    expect(screen.queryByText('Unpaid Thing')).not.toBeInTheDocument();

    const dl = await screen.findByRole('link', { name: /download/i });
    expect(dl).toHaveAttribute('href', 'https://dl/notes.pdf');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SellerLayout from './SellerLayout';

vi.mock('../../store/useSellerStore', () => ({
  useSellerStore: () => ({ seller: { displayName: 'Ms Jane', type: 'teacher' }, logout: vi.fn() }),
}));

describe('SellerLayout nav', () => {
  it('links My Resources to the resources route', () => {
    render(<MemoryRouter><SellerLayout /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /my resources/i }))
      .toHaveAttribute('href', '/seller/resources');
  });

  it('links Upload Resource to the create route', () => {
    render(<MemoryRouter><SellerLayout /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /upload resource/i }))
      .toHaveAttribute('href', '/seller/resources/new');
  });

  it('shows a mobile bottom-nav Dashboard tab', () => {
    render(<MemoryRouter><SellerLayout /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /^dashboard$/i }))
      .toHaveAttribute('href', '/seller/dashboard');
  });

  it('opens the mobile menu drawer from the hamburger', async () => {
    render(<MemoryRouter><SellerLayout /></MemoryRouter>);
    // At rest only the desktop sidebar renders "My Resources".
    expect(screen.getAllByRole('link', { name: /my resources/i })).toHaveLength(1);
    await userEvent.click(screen.getByRole('button', { name: /^menu$/i }));
    // Opening the drawer duplicates the sidebar nav.
    expect(screen.getAllByRole('link', { name: /my resources/i })).toHaveLength(2);
  });
});

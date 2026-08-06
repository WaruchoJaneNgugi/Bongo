import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Orders from './Orders';

describe('Orders', () => {
  it('renders order history rows', () => {
    render(<Orders />);
    expect(screen.getByText('Order History')).toBeInTheDocument();
    expect(screen.getByText('KCSE Biology 2026 Revision')).toBeInTheDocument();
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
  });
});

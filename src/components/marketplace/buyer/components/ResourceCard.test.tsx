import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResourceCard from './ResourceCard';
import { resources } from '../../../../lib/marketplace/mockBuyer';

describe('ResourceCard', () => {
  it('shows title, price and CTA', () => {
    render(<ResourceCard resource={resources[0]} />);
    expect(screen.getByText(resources[0].title)).toBeInTheDocument();
    expect(screen.getByText(/KSh 250/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: resources[0].cta })).toBeInTheDocument();
  });
});

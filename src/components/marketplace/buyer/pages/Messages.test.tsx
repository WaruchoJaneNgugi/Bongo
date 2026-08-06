import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Messages from './Messages';

describe('Messages', () => {
  it('shows conversation list and opens the first thread', () => {
    render(<Messages />);
    expect(screen.getByText('Teacher Jane')).toBeInTheDocument();
    expect(screen.getByText('Great, thank you!')).toBeInTheDocument();
  });
});

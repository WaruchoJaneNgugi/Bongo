import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyLibrary from './MyLibrary';

describe('MyLibrary', () => {
  it('lists purchased resources', () => {
    render(<MyLibrary />);
    expect(screen.getByText('My Library')).toBeInTheDocument();
    expect(screen.getByText('Form 2 Mathematics Notes')).toBeInTheDocument();
  });
});

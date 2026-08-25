import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('../../lib/marketplace/media', () => ({ fetchMediaUrl: vi.fn(async () => ({ url: 'blob:signed' })) }));
import MediaPlayer from './MediaPlayer';

describe('MediaPlayer', () => {
  it('renders a video element for kind=video with the signed src', async () => {
    render(<MediaPlayer resourceId="r1" kind="video" onEnded={() => {}} />);
    await waitFor(() => expect(screen.getByTestId('media-el').tagName).toBe('VIDEO'));
    expect(screen.getByTestId('media-el')).toHaveAttribute('src', 'blob:signed');
  });
  it('renders an audio element for kind=audio', async () => {
    render(<MediaPlayer resourceId="r2" kind="audio" onEnded={() => {}} />);
    await waitFor(() => expect(screen.getByTestId('media-el').tagName).toBe('AUDIO'));
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { submitQuiz } = vi.hoisted(() => ({
  submitQuiz: vi.fn(async () => ({
    score: 1, total: 1,
    perQuestion: [{ correctIndex: 0, chosen: 0, correct: true, explanation: 'yes' }],
  })),
}));
vi.mock('../../lib/marketplace/media', () => ({ submitQuiz }));
import QuizRunner from './QuizRunner';

const quiz = [{ prompt: '2+2?', options: ['4', '5'] }];

describe('QuizRunner', () => {
  it('submits chosen answers and shows the score', async () => {
    render(<QuizRunner resourceId="r1" quiz={quiz} />);
    await userEvent.click(screen.getByLabelText('4'));
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(submitQuiz).toHaveBeenCalledWith('r1', [0]);
    expect(await screen.findByText(/1 \/ 1/)).toBeInTheDocument();
  });
});

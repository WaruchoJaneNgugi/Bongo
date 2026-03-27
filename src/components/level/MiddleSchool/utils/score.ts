export const calculatePercentage = (correct: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

export const getGradeFeedback = (percentage: number): string => {
  if (percentage === 100) return 'Perfect Score!';
  if (percentage >= 80) return 'Excellent Work!';
  if (percentage >= 60) return 'Good Job!';
  if (percentage >= 40) return 'Keep Practicing!';
  return 'Needs Review';
};

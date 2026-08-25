import { useState } from 'react';
import { submitQuiz } from '../../lib/marketplace/media';
import type { QuizQuestionPublic, GradeResult } from '../../lib/marketplace/types';

interface Props { resourceId: string; quiz: QuizQuestionPublic[] }

export default function QuizRunner({ resourceId, quiz }: Props) {
  const [chosen, setChosen] = useState<number[]>(() => quiz.map(() => -1));
  const [result, setResult] = useState<GradeResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    setBusy(true); setError('');
    try {
      setResult(await submitQuiz(resourceId, chosen.map(c => (c < 0 ? -1 : c))));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not submit.');
    } finally { setBusy(false); }
  }

  if (result) {
    return (
      <div className="space-y-3">
        <p className="font-bold text-[#0f172a]">You scored {result.score} / {result.total}</p>
        {quiz.map((q, i) => {
          const d = result.perQuestion[i];
          return (
            <div key={i} className="rounded-xl border border-[#eceff3] p-3">
              <p className="font-semibold">{q.prompt}</p>
              <p className={`text-sm ${d.correct ? 'text-[#16a34a]' : 'text-[#b91c1c]'}`}>
                {d.correct ? 'Correct' : `Correct answer: ${q.options[d.correctIndex]}`}
              </p>
              {d.explanation && <p className="text-sm text-[#64748b] mt-1">{d.explanation}</p>}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quiz.map((q, i) => (
        <fieldset key={i} className="rounded-xl border border-[#eceff3] p-3">
          <legend className="font-semibold px-1">{q.prompt}</legend>
          {q.options.map((opt, j) => (
            <label key={j} className="flex items-center gap-2 py-1 text-sm">
              <input type="radio" name={`q${i}`} aria-label={opt}
                checked={chosen[i] === j}
                onChange={() => setChosen(c => c.map((v, k) => (k === i ? j : v)))} />
              {opt}
            </label>
          ))}
        </fieldset>
      ))}
      {error && <p className="text-sm text-[#b91c1c]">{error}</p>}
      <button type="button" disabled={busy} onClick={submit}
        className="bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl px-4 py-2 font-semibold disabled:opacity-60">
        {busy ? 'Submitting…' : 'Submit answers'}
      </button>
    </div>
  );
}

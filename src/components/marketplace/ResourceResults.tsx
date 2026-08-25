import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';
import { subscribeQuizResults } from '../../lib/marketplace/resources';
import type { QuizResultRow } from '../../lib/marketplace/resources';

export default function ResourceResults() {
  const sellerId = useSellerStore(s => s.sellerId);
  const [rows, setRows] = useState<QuizResultRow[]>([]);

  useEffect(() => {
    if (!sellerId) return;
    return subscribeQuizResults(sellerId, setRows);
  }, [sellerId]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <ClipboardList className="text-[#16a34a]" size={22} />
        <h1 className="text-xl font-extrabold text-[#1f2937]">Quiz Results</h1>
      </div>

      {rows.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-20">
          <ClipboardList className="mx-auto text-[#9aa39a]" size={48} />
          <h2 className="mt-4 text-lg font-bold text-[#1f2937]">No quiz results yet.</h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            When students take quizzes on your video resources, their scores will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#e8ece8] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[12px] font-bold text-[#6b7280] border-b border-[#e8ece8]">
                <th className="px-4 py-3">Resource</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-b border-[#f0f2f0] last:border-0">
                  <td className="px-4 py-3 font-bold text-[#1f2937]">{r.resourceTitle}</td>
                  <td className="px-4 py-3 text-[#6b7280]">{r.buyerAccountId}</td>
                  <td className="px-4 py-3 tabular-nums font-bold text-[#1f2937]">
                    {r.score} / {r.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

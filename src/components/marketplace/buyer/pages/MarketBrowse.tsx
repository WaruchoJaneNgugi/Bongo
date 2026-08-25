import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import ResourceCard from '../components/ResourceCard';
import { usePublishedResources } from '../usePublishedResources';
import { ui } from '../ui';

type Sort = 'Newest' | 'Price ↑' | 'Price ↓' | 'Top Rated';

export default function MarketBrowse() {
  const { resources: all, loading, error, reload } = usePublishedResources();
  const [q, setQ] = useState('');
  const [subject, setSubject] = useState('All Subjects');
  const [sort, setSort] = useState<Sort>('Newest');

  const subjects = useMemo(
    () => ['All Subjects', ...Array.from(new Set((all ?? []).map(r => r.subject)))],
    [all],
  );

  const list = useMemo(() => {
    let out = (all ?? []).filter(r =>
      (subject === 'All Subjects' || r.subject === subject) &&
      (q === '' ||
        r.title.toLowerCase().includes(q.toLowerCase()) ||
        r.sellerName.toLowerCase().includes(q.toLowerCase())),
    );
    // 'Newest' keeps the createdAt-desc order from the query.
    out = [...out].sort((a, b) =>
      sort === 'Price ↑' ? a.priceKsh - b.priceKsh :
      sort === 'Price ↓' ? b.priceKsh - a.priceKsh :
      sort === 'Top Rated' ? b.sales - a.sales : 0,
    );
    return out;
  }, [all, q, subject, sort]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className={`text-xl ${ui.h1}`}>Marketplace</h1>
        <p className={`text-sm mt-0.5 ${ui.muted}`}>Browse resources from teachers, tutors and schools.</p>
      </div>

      {/* Row 1: search. Row 2 (mobile): subject + sort side by side.
          On sm+ the wrapper dissolves (sm:contents) so all three sit inline. */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative sm:flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search resources…"
            className={`w-full ${ui.input} pl-10 pr-4 py-2.5 text-sm`} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:contents">
          <select value={subject} onChange={e => setSubject(e.target.value)}
            className={`w-full ${ui.input} px-4 py-2.5 text-sm sm:w-44`}>
            {subjects.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value as Sort)}
            className={`w-full ${ui.input} px-4 py-2.5 text-sm sm:w-44`}>
            {(['Newest', 'Price ↑', 'Price ↓', 'Top Rated'] as Sort[]).map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className={`text-center ${ui.muted} py-16`}>Loading resources…</div>
      ) : error ? (
        <div className="text-center py-16 space-y-3">
          <p className={ui.muted}>Couldn’t load the marketplace right now.</p>
          <button onClick={reload} className={`${ui.btnGhost} px-4 py-2 text-sm`}>Try again</button>
        </div>
      ) : list.length === 0 ? (
        <div className={`text-center ${ui.muted} py-16`}>
          {(all ?? []).length === 0 ? 'No resources have been published yet.' : 'No resources match your search.'}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {list.map(r => <ResourceCard key={r.id} resource={r} />)}
        </div>
      )}
    </div>
  );
}

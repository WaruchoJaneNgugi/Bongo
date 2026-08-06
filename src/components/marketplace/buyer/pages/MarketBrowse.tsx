import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { resources } from '../../../../lib/marketplace/mockBuyer';
import ResourceCard from '../components/ResourceCard';

const SUBJECTS = ['All Subjects', ...Array.from(new Set(resources.map(r => r.subject)))];
type Sort = 'Top Rated' | 'Price ↑' | 'Price ↓';

export default function MarketBrowse() {
  const [q, setQ] = useState('');
  const [subject, setSubject] = useState('All Subjects');
  const [sort, setSort] = useState<Sort>('Top Rated');

  const list = useMemo(() => {
    let out = resources.filter(r =>
      (subject === 'All Subjects' || r.subject === subject) &&
      (q === '' || r.title.toLowerCase().includes(q.toLowerCase()) || r.sellerName.toLowerCase().includes(q.toLowerCase())),
    );
    out = [...out].sort((a, b) =>
      sort === 'Price ↑' ? a.priceKsh - b.priceKsh :
      sort === 'Price ↓' ? b.priceKsh - a.priceKsh :
      b.rating - a.rating,
    );
    return out;
  }, [q, subject, sort]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-[#1f2937]">Marketplace</h1>
        <p className="text-sm text-[#8a938a]">Browse resources from teachers, tutors and schools.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa39a]" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search resources…"
            className="w-full bg-white border border-[#e8ece8] rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#16a34a]/30" />
        </div>
        <select value={subject} onChange={e => setSubject(e.target.value)}
          className="bg-white border border-[#e8ece8] rounded-full px-4 py-2.5 text-sm outline-none">
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value as Sort)}
          className="bg-white border border-[#e8ece8] rounded-full px-4 py-2.5 text-sm outline-none">
          {(['Top Rated', 'Price ↑', 'Price ↓'] as Sort[]).map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {list.length === 0 ? (
        <div className="text-center text-[#8a938a] py-16">No resources match your search.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map(r => <ResourceCard key={r.id} resource={r} />)}
        </div>
      )}
    </div>
  );
}

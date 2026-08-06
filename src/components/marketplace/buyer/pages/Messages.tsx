import { useState } from 'react';
import { Send } from 'lucide-react';
import { ui } from '../ui';
import { conversations } from '../../../../lib/marketplace/mockBuyer';

export default function Messages() {
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? '');
  const [draft, setDraft] = useState('');
  const active = conversations.find((c) => c.id === activeId) ?? null;

  return (
    <div className={`${ui.card} overflow-hidden grid grid-cols-1 md:grid-cols-[280px_1fr] h-[calc(100vh-8rem)]`}>
      {/* Left pane — conversation list */}
      <div className="flex flex-col border-r border-[#eceff3] overflow-y-auto">
        <div className="px-4 py-3 border-b border-[#eceff3]">
          <span className="text-[#0f172a] font-semibold text-sm">Messages</span>
        </div>
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={`w-full text-left px-4 py-3 border-b border-[#eceff3] transition-colors ${
              c.id === activeId ? 'bg-[#f0fdf4]' : 'hover:bg-[#f8fafc]'
            }`}
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[#0f172a] font-semibold text-sm">{c.from}</span>
              <span className="text-[11px] text-[#94a3b8]">{c.when}</span>
            </div>
            <p className="text-xs text-[#64748b] truncate">{c.preview}</p>
          </button>
        ))}
      </div>

      {/* Right pane — thread */}
      <div className="flex flex-col min-h-0">
        {/* Thread header — name and role rendered as single text node to avoid duplicate getByText matches */}
        {active && (
          <div className="px-4 py-3 border-b border-[#eceff3] shrink-0">
            <div className="text-[#0f172a] font-semibold text-sm">
              {`${active.from} · `}
              <span className="text-[#64748b] font-normal">{active.role}</span>
            </div>
          </div>
        )}

        {/* Scrollable message area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#f8fafc]">
          {active?.messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.me ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                  m.me
                    ? 'ml-auto bg-[#16a34a] text-white'
                    : 'bg-white border border-[#eceff3] text-[#0f172a]'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Composer footer */}
        <div className="px-4 py-3 border-t border-[#eceff3] flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message…"
            className={`${ui.input} flex-1 px-4 py-2 text-sm rounded-full`}
          />
          <button
            aria-label="Send"
            className="w-9 h-9 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white flex items-center justify-center transition-colors shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

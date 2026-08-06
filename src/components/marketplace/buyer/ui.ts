// "Clean & airy" SaaS design language for the buyer marketplace (Stripe/Linear-light).
//
// Cool-neutral surfaces, hairline borders, soft layered shadows, generous whitespace,
// crisp Plus Jakarta Sans type, and green (#16a34a) reserved for primary actions only.
// Import these class strings so the look stays consistent across every page and is
// tunable in one place. The `market` font + `shadow-card`/`shadow-pop` utilities are
// defined in tailwind.config.js.

// Palette (kept here as reference for arbitrary-value classes used below):
//   surface bg   #f8fafc      card bg      #ffffff
//   hairline     #eceff3      border-2     #e5e9f0 / #e2e8f0
//   ink          #0f172a      muted        #64748b     faint  #94a3b8
//   brand        #16a34a      brand-hover  #15803d     brand-tint #f0fdf4

export const ui = {
  /** Root shell background + base text + font. */
  page: 'bg-[#f8fafc] text-[#0f172a] font-market',

  /** Static surface card. */
  card: 'bg-white rounded-2xl border border-[#eceff3] shadow-card',
  /** Card that responds to hover (use for clickable tiles / resource cards). */
  cardInteractive:
    'bg-white rounded-2xl border border-[#eceff3] shadow-card transition-all duration-200 hover:shadow-pop hover:border-[#e2e8f0]',

  /** Hairline divider/border color. */
  hairline: 'border-[#eceff3]',

  /** Headings — crisp, tight tracking. */
  h1: 'text-[#0f172a] font-bold tracking-tight',
  h2: 'text-[#0f172a] font-semibold tracking-tight',

  /** Secondary + tertiary text. */
  muted: 'text-[#64748b]',
  faint: 'text-[#94a3b8]',
  brand: 'text-[#16a34a]',

  /** Buttons. */
  btnPrimary:
    'inline-flex items-center justify-center gap-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold rounded-xl transition-colors',
  btnGhost:
    'inline-flex items-center justify-center gap-1.5 bg-white border border-[#e5e9f0] text-[#334155] hover:bg-[#f1f5f9] font-semibold rounded-xl transition-colors',

  /** Neutral pill/chip. */
  chip: 'bg-[#f1f5f9] text-[#475569] rounded-full',

  /** Text input / select. */
  input:
    'bg-white border border-[#e5e9f0] rounded-xl outline-none focus:ring-4 focus:ring-[#16a34a]/10 focus:border-[#16a34a]/40 transition',

  /** Status badge palettes (buyer orders/payments). */
  status: {
    green: 'bg-[#f0fdf4] text-[#15803d] border border-[#dcfce7]',
    amber: 'bg-[#fffbeb] text-[#b45309] border border-[#fef3c7]',
    red: 'bg-[#fef2f2] text-[#b91c1c] border border-[#fee2e2]',
  },
} as const;

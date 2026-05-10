import GlassButton from './GlassButton';

const SORT_OPTIONS = [
  { value: 'price:ASC', label: 'Price: Low to High' },
  { value: 'price:DESC', label: 'Price: High to Low' },
  { value: 'duration:ASC', label: 'Duration: Short first' },
  { value: 'duration:DESC', label: 'Duration: Long first' },
  { value: 'popularity:DESC', label: 'Popularity' },
];

export default function PackageFilters({ filters, onChange, onSearch }) {
  const { search, maxBudget, minDuration, maxDuration, adventureLevel, sort } = filters;

  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Search</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5"
            placeholder="Package name..."
            value={search}
            onChange={(e) => set('search', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Max budget (₹)</label>
          <input
            type="number"
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5"
            placeholder="e.g. 15000"
            value={maxBudget}
            onChange={(e) => set('maxBudget', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Duration (days)</label>
          <div className="mt-1 flex gap-2">
            <input
              type="number"
              min={1}
              className="w-full rounded-xl border border-slate-200/80 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5"
              placeholder="Min"
              value={minDuration}
              onChange={(e) => set('minDuration', e.target.value)}
            />
            <input
              type="number"
              min={1}
              className="w-full rounded-xl border border-slate-200/80 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5"
              placeholder="Max"
              value={maxDuration}
              onChange={(e) => set('maxDuration', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Adventure level</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5"
            value={adventureLevel}
            onChange={(e) => set('adventureLevel', e.target.value)}
          >
            <option value="">Any</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="sm:w-64">
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Sort</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5"
            value={sort}
            onChange={(e) => set('sort', e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <GlassButton type="button" variant="primary" onClick={onSearch}>
          Apply filters
        </GlassButton>
      </div>
    </div>
  );
}

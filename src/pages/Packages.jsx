import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import PackageCard from '../components/PackageCard';
import PackageFilters from '../components/PackageFilters';
import { listDestinationsWithStats, searchPackages } from '../services/supabaseDb';

function parseSort(sortStr) {
  const [sortBy, direction] = (sortStr || 'price:ASC').split(':');
  return { sortBy, direction };
}

export default function Packages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const destFromUrl = searchParams.get('destinationId') || '';

  const [filters, setFilters] = useState({
    search: '',
    maxBudget: '',
    minDuration: '',
    maxDuration: '',
    adventureLevel: '',
    sort: 'price:ASC',
  });

  const [destinationId, setDestinationId] = useState(destFromUrl);
  const [destOptions, setDestOptions] = useState([]);
  const [page, setPage] = useState(0);
  const [filterApplyKey, setFilterApplyKey] = useState(0);
  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDestinationId(destFromUrl);
  }, [destFromUrl]);

  useEffect(() => {
    listDestinationsWithStats()
      .then(setDestOptions)
      .catch(() => setDestOptions([]));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const { sortBy, direction } = parseSort(filters.sort);
    try {
      const params = {
        page,
        size: 12,
        sortBy,
        direction,
        search: filters.search || undefined,
        maxBudget: filters.maxBudget ? Number(filters.maxBudget) : undefined,
        minDuration: filters.minDuration ? Number(filters.minDuration) : undefined,
        maxDuration: filters.maxDuration ? Number(filters.maxDuration) : undefined,
        adventureLevel: filters.adventureLevel || undefined,
        destinationId: destinationId ? Number(destinationId) : undefined,
      };
      const res = await searchPackages(params);
      setData(res);
    } catch {
      setData({ content: [], totalPages: 0, totalElements: 0 });
    } finally {
      setLoading(false);
    }
  }, [filters, page, destinationId, filterApplyKey]);

  useEffect(() => {
    load();
  }, [load]);

  const apply = () => {
    setPage(0);
    setFilterApplyKey((k) => k + 1);
    if (destinationId) setSearchParams({ destinationId });
    else setSearchParams({});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <SectionTitle
        eyebrow="Packages"
        title="Find your perfect trek"
        subtitle="Filter by budget, duration, and adventure level — then book with secure Supabase sign-in."
      />

      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Destination</label>
          <select
            className="mt-1 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5"
            value={destinationId}
            onChange={(e) => {
              setDestinationId(e.target.value);
              setPage(0);
            }}
          >
            <option value="">All destinations</option>
            {destOptions.map((d) => (
              <option key={d.id} value={String(d.id)}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <PackageFilters filters={filters} onChange={setFilters} onSearch={apply} />

      {loading ? (
        <p className="mt-10 text-center text-slate-500">Loading packages…</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
            {data.totalElements} package{data.totalElements !== 1 ? 's' : ''} found
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.content?.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </div>
          {data.totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              <button
                type="button"
                disabled={page <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= data.totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

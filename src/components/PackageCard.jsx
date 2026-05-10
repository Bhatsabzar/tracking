import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const levelColors = {
  EASY: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
  MEDIUM: 'bg-amber-500/20 text-amber-800 dark:text-amber-200',
  HIGH: 'bg-rose-500/20 text-rose-800 dark:text-rose-200',
};

export default function PackageCard({ pkg, index = 0 }) {
  const { id, title, duration, price, adventureLevel, destinationName, popularityScore } = pkg;
  const fmt = price != null ? `₹${Number(price).toLocaleString('en-IN')}` : '—';
  const level = adventureLevel || 'MEDIUM';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="glass-panel flex flex-col overflow-hidden rounded-2xl border border-white/40 dark:border-white/10"
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-glacier-600 dark:text-glacier-400">
              {destinationName}
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${levelColors[level] || levelColors.MEDIUM}`}>
            {level}
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{duration} days · Popularity {popularityScore ?? '—'}</p>
        <p className="mt-4 font-display text-2xl font-bold text-pine-800 dark:text-glacier-300">{fmt}</p>
        <Link
          to={`/packages/${id}`}
          className="mt-auto pt-6 text-sm font-semibold text-glacier-600 hover:text-glacier-500 dark:text-glacier-400"
        >
          View itinerary →
        </Link>
      </div>
    </motion.div>
  );
}

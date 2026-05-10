import { motion } from 'framer-motion';

const REVIEWS = [
  { name: 'Aditya K.', rating: 5, text: 'Flawless coordination and breathtaking camps. The real-time tracking kept our family at ease.' },
  { name: 'Sarah M.', rating: 5, text: 'Warwan felt otherworldly. Guides were professional and the itinerary matched the site perfectly.' },
  { name: 'Imran H.', rating: 4, text: 'Sheshnag trek was challenging but rewarding. Would book again for Amarnath season.' },
];

export default function PackageReviews() {
  return (
    <div className="mt-12">
      <h3 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Traveler reviews</h3>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <motion.blockquote
            key={r.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-panel rounded-2xl p-5"
          >
            <p className="text-amber-500">{'★'.repeat(r.rating)}</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{r.text}</p>
            <footer className="mt-3 text-xs font-semibold text-slate-500">— {r.name}</footer>
          </motion.blockquote>
        ))}
      </div>
    </div>
  );
}

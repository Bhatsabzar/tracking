import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPackageById } from '../services/supabaseDb';
import BookingForm from '../components/BookingForm';
import PackageReviews from '../components/PackageReviews';
import GlassButton from '../components/GlassButton';

export default function PackageDetail() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [travelers, setTravelers] = useState(2);
  const [err, setErr] = useState('');

  useEffect(() => {
    getPackageById(Number(id))
      .then(setPkg)
      .catch(() => setErr('Package not found'));
  }, [id]);

  if (err || !pkg) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-slate-600 dark:text-slate-300">{err || 'Loading…'}</p>
        <Link to="/packages" className="mt-4 inline-block text-glacier-600">
          ← Back to packages
        </Link>
      </div>
    );
  }

  const base = Number(pkg.price) || 0;
  const dynamicTotal = base * travelers;
  const banner = pkg.bannerImageUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600';

  return (
    <div>
      <div className="relative h-[42vh] min-h-[280px] w-full overflow-hidden">
        <img src={banner} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl px-4 pb-10">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-semibold text-white md:text-5xl"
          >
            {pkg.title}
          </motion.h1>
          <p className="mt-2 text-glacier-200">
            {pkg.destinationName} · {pkg.duration} days · {pkg.adventureLevel}
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <section className="glass-panel rounded-2xl p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Itinerary</h2>
            <p className="mt-4 whitespace-pre-line text-slate-700 dark:text-slate-200">{pkg.itinerary || 'Detailed day-by-day plan shared after booking confirmation.'}</p>
          </section>

          <section className="glass-panel rounded-2xl p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Included activities</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {(pkg.activities || []).map((a) => (
                <li key={a} className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <span className="text-glacier-500">✦</span> {a}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-panel rounded-2xl p-6 md:p-8 overflow-hidden">
            <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Trek map</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Approximate route overview for planning — final paths depend on weather and local permits.
            </p>
            <div className="mt-4 aspect-[16/9] overflow-hidden rounded-xl bg-slate-200 dark:bg-pine-800">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80"
                alt="Topographic style map placeholder"
                className="h-full w-full object-cover opacity-90"
              />
            </div>
          </section>

          <PackageReviews />
        </div>

        <div className="space-y-6">
          <div className="glass-panel sticky top-28 rounded-2xl p-6">
            <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Dynamic pricing</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Base rate × travelers (estimate)</p>
            <div className="mt-4 flex items-center gap-3">
              <label className="text-sm font-medium">Travelers</label>
              <input
                type="number"
                min={1}
                max={20}
                value={travelers}
                onChange={(e) => setTravelers(Math.max(1, Number(e.target.value) || 1))}
                className="w-20 rounded-lg border border-slate-200 bg-white/80 px-2 py-1 dark:border-white/10 dark:bg-white/5"
              />
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-pine-800 dark:text-glacier-300">
              ₹{dynamicTotal.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-500">Base ₹{base.toLocaleString('en-IN')} per traveler</p>
            <Link to={`/tracking`} className="mt-4 block">
              <GlassButton variant="outline" className="w-full !text-slate-800 dark:!text-white">
                Track an existing booking
              </GlassButton>
            </Link>
          </div>

          <BookingForm packageId={pkg.id} packageTitle={pkg.title} />
        </div>
      </div>
    </div>
  );
}

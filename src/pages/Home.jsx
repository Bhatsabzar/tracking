import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import DestinationCard from '../components/DestinationCard';
import PackageCard from '../components/PackageCard';
import { useEffect, useState } from 'react';
import { listDestinationsWithStats, searchPackages } from '../services/supabaseDb';
import { Link } from 'react-router-dom';
import GlassButton from '../components/GlassButton';

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [d, p] = await Promise.all([
          listDestinationsWithStats(),
          searchPackages({ page: 0, size: 4, sortBy: 'popularity', direction: 'DESC' }),
        ]);
        if (!cancelled) {
          setDestinations(d);
          setPackages(p.content || []);
        }
      } catch {
        if (!cancelled) {
          setDestinations([]);
          setPackages([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle
          eyebrow="Destinations"
          title="Curated Kashmir escapes"
          subtitle="Pahalgam, Warwan, Sheshnag, and Aru — each with its own rhythm and altitude."
        />
        {loading ? (
          <p className="text-center text-slate-500">Loading destinations…</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {destinations.map((dest, i) => (
              <DestinationCard key={dest.id} destination={dest} index={i} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link to="/destinations">
            <GlassButton variant="primary">All destinations</GlassButton>
          </Link>
        </div>
      </section>

      <section className="border-y border-white/20 bg-gradient-to-b from-glacier-50/50 to-transparent py-20 dark:from-pine-800/40 dark:to-transparent">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle
            eyebrow="Packages"
            title="Signature treks & getaways"
            subtitle="Hand-picked itineraries with transparent pricing and live journey tracking."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/packages">
              <GlassButton variant="outline" className="!text-slate-800 dark:!text-white border-slate-300">
                Browse all packages
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

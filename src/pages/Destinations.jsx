import { useEffect, useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import DestinationCard from '../components/DestinationCard';
import { listDestinationsWithStats } from '../services/supabaseDb';

export default function Destinations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listDestinationsWithStats()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <SectionTitle
        eyebrow="Explore"
        title="Kashmir destinations"
        subtitle="Glacial rivers, alpine lakes, and trails that have welcomed pilgrims and adventurers for centuries."
      />
      {loading ? (
        <p className="text-center text-slate-500">Loading…</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {items.map((dest, i) => (
            <DestinationCard key={dest.id} destination={dest} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

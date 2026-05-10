import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import TrackingTimeline from '../components/TrackingTimeline';
import GlassButton from '../components/GlassButton';
import { useTrackingRealtime } from '../hooks/useTrackingRealtime';
import { getTrackingByBookingId } from '../services/supabaseDb';
import { useAuth } from '../context/AuthContext';

export default function Tracking() {
  const { user } = useAuth();
  const [bookingIdInput, setBookingIdInput] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState('');

  const { status, updatedTime } = useTrackingRealtime(
    bookingId,
    apiData?.currentStatus,
    apiData?.updatedTime
  );

  const lookup = async (e) => {
    e?.preventDefault();
    setError('');
    if (!user) {
      setError('Please login to view your trip tracking.');
      return;
    }
    const id = Number(bookingIdInput);
    if (!id) {
      setError('Enter a valid booking ID');
      return;
    }
    try {
      const data = await getTrackingByBookingId(id);
      setApiData(data);
      setBookingId(id);
    } catch {
      setError('No tracking found, or you do not have access to this booking.');
      setBookingId(null);
      setApiData(null);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionTitle
        eyebrow="Live updates"
        title="Trip tracking"
        subtitle="Enter your booking reference to see your journey timeline. Status changes sync in real time via Supabase when your trip is updated."
      />

      <form onSubmit={lookup} className="glass-panel mb-10 flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="text-xs font-semibold uppercase text-slate-500">Booking ID</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
            placeholder="e.g. 1"
            value={bookingIdInput}
            onChange={(e) => setBookingIdInput(e.target.value)}
          />
        </div>
        <GlassButton type="submit" variant="primary">
          Load status
        </GlassButton>
      </form>
      {!user && (
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
          You’re not logged in.{' '}
          <Link className="font-semibold text-glacier-600 dark:text-glacier-400" to="/login">
            Login
          </Link>{' '}
          to view your booking timeline.
        </p>
      )}

      {error && <p className="mb-6 text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      {bookingId && apiData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-2xl p-6 md:p-8">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Booking <strong>#{bookingId}</strong>
            {updatedTime && (
              <>
                {' '}
                · Last update: {new Date(updatedTime).toLocaleString()}
              </>
            )}
          </p>
          <p className="mt-2 font-display text-xl text-slate-900 dark:text-white">
            Current: <span className="text-glacier-600 dark:text-glacier-400">{status?.replace(/_/g, ' ')}</span>
          </p>
          <div className="mt-8">
            <TrackingTimeline currentStatus={status} />
          </div>
        </motion.div>
      )}
    </div>
  );
}

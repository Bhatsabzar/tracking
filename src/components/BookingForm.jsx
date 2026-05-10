import { useState } from 'react';
import GlassButton from './GlassButton';
import { createBookingAndTracking } from '../services/supabaseDb';

export default function BookingForm({ packageId, packageTitle, onBooked }) {
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    travelers: 2,
    travelDate: '',
    specialRequest: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await createBookingAndTracking({
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        travelers: Number(form.travelers),
        travelDate: form.travelDate,
        specialRequest: form.specialRequest || undefined,
        packageId: Number(packageId),
      });
      setSuccess(res);
      onBooked?.(res);
    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="glass-panel space-y-4 rounded-2xl p-6">
      <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Book {packageTitle}</h3>
      {success && (
        <p className="rounded-xl bg-emerald-500/15 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200">
          Booking confirmed! Reference ID: <strong>{success.id}</strong>. Use this ID on the Tracking page.
        </p>
      )}
      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase text-slate-500">Full name</label>
          <input
            required
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">Email</label>
          <input
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">Phone</label>
          <input
            required
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">Travelers</label>
          <input
            type="number"
            min={1}
            max={50}
            required
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
            value={form.travelers}
            onChange={(e) => setForm({ ...form, travelers: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">Travel date</label>
          <input
            type="date"
            required
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
            value={form.travelDate}
            onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase text-slate-500">Special requests</label>
          <textarea
            rows={3}
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
            value={form.specialRequest}
            onChange={(e) => setForm({ ...form, specialRequest: e.target.value })}
          />
        </div>
      </div>
      <GlassButton type="submit" variant="primary" disabled={loading} className="w-full sm:w-auto">
        {loading ? 'Booking…' : 'Book Now'}
      </GlassButton>
    </form>
  );
}

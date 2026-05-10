import { useEffect, useState, useCallback } from 'react';
import GlassButton from '../components/GlassButton';
import {
  getPackageById,
  listDestinationsWithStats,
  searchPackages,
  adminListBookings,
  adminUpdateTrackingStatus,
  adminUpsertDestination,
  adminDeleteDestination as sbDeleteDestination,
  adminUpsertPackage,
  adminDeletePackage as sbDeletePackage,
} from '../services/supabaseDb';
import { uploadDestinationImage } from '../services/supabaseStorage';
import { TRACKING_STEPS } from '../utils/trackingStatuses';
import { isSupabaseConfigured } from '../supabase/client';

const emptyDest = { name: '', description: '', imageUrl: '', location: '' };
const emptyPkg = {
  title: '',
  duration: 3,
  price: '',
  adventureLevel: 'MEDIUM',
  activities: '',
  popularityScore: 80,
  bannerImageUrl: '',
  itinerary: '',
  destinationId: '',
};

export default function AdminDashboard() {
  const [destinations, setDestinations] = useState([]);
  const [bookings, setBookings] = useState({ content: [] });
  const [tab, setTab] = useState('destinations');

  const [destForm, setDestForm] = useState(emptyDest);
  const [editingDestId, setEditingDestId] = useState(null);

  const [pkgForm, setPkgForm] = useState(emptyPkg);
  const [editingPkgId, setEditingPkgId] = useState(null);
  const [allPackages, setAllPackages] = useState([]);

  const [trackBookingId, setTrackBookingId] = useState('');
  const [trackStatus, setTrackStatus] = useState('BOOKING_CONFIRMED');
  const [uploading, setUploading] = useState(false);

  const loadDest = useCallback(() => {
    listDestinationsWithStats().then(setDestinations).catch(() => setDestinations([]));
  }, []);

  const loadBookings = useCallback(() => {
    adminListBookings({ page: 0, size: 50 }).then(setBookings).catch(() => setBookings({ content: [] }));
  }, []);

  const loadPackages = useCallback(() => {
    searchPackages({ page: 0, size: 100, sortBy: 'price', direction: 'ASC' })
      .then((res) => setAllPackages(res.content || []))
      .catch(() => setAllPackages([]));
  }, []);

  useEffect(() => {
    loadDest();
    loadBookings();
  }, [loadDest, loadBookings]);

  useEffect(() => {
    if (tab === 'packages') loadPackages();
  }, [tab, loadPackages]);

  const saveDestination = async (e) => {
    e.preventDefault();
    try {
      await adminUpsertDestination({
        id: editingDestId || undefined,
        name: destForm.name,
        description: destForm.description,
        imageUrl: destForm.imageUrl,
        location: destForm.location,
      });
      setDestForm(emptyDest);
      setEditingDestId(null);
      loadDest();
    } catch (err) {
      alert(err.message);
    }
  };

  const editDestination = (d) => {
    setEditingDestId(d.id);
    setDestForm({
      name: d.name,
      description: d.description,
      imageUrl: d.imageUrl || '',
      location: d.location || '',
    });
  };

  const removeDestination = async (id) => {
    if (!confirm('Delete destination and related packages?')) return;
    try {
      await sbDeleteDestination(id);
      loadDest();
    } catch (err) {
      alert(err.message);
    }
  };

  const onImagePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isSupabaseConfigured()) {
      alert('Configure Supabase for image upload, or paste an image URL manually.');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadDestinationImage(file);
      setDestForm((f) => ({ ...f, imageUrl: url }));
    } catch (err) {
      alert(err.message || 'Upload failed — ensure bucket "destinations" exists and policies allow upload.');
    } finally {
      setUploading(false);
    }
  };

  const savePackage = async (e) => {
    e.preventDefault();
    try {
      await adminUpsertPackage({
        id: editingPkgId || undefined,
        title: pkgForm.title,
        duration: Number(pkgForm.duration),
        price: Number(pkgForm.price),
        adventureLevel: pkgForm.adventureLevel,
        activities: String(pkgForm.activities || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        popularityScore: Number(pkgForm.popularityScore) || 0,
        bannerImageUrl: pkgForm.bannerImageUrl,
        itinerary: pkgForm.itinerary,
        destinationId: Number(pkgForm.destinationId),
      });
      setPkgForm(emptyPkg);
      setEditingPkgId(null);
      loadDest();
      loadPackages();
      alert('Package saved.');
    } catch (err) {
      alert(err.message);
    }
  };

  const removePackage = async (id) => {
    if (!confirm('Delete this package?')) return;
    try {
      await sbDeletePackage(id);
      loadDest();
      loadPackages();
    } catch (err) {
      alert(err.message);
    }
  };

  const editPackageById = async (id) => {
    try {
      const p = await getPackageById(id);
      setEditingPkgId(id);
      setPkgForm({
        title: p.title,
        duration: p.duration,
        price: String(p.price),
        adventureLevel: p.adventureLevel,
        activities: (p.activities || []).join(', '),
        popularityScore: p.popularityScore ?? 0,
        bannerImageUrl: p.bannerImageUrl || '',
        itinerary: p.itinerary || '',
        destinationId: String(p.destinationId),
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      alert('Could not load package');
    }
  };

  const pushTracking = async (e) => {
    e.preventDefault();
    const bid = Number(trackBookingId);
    if (!bid) return;
    try {
      await adminUpdateTrackingStatus(bid, trackStatus);
      loadBookings();
      alert('Status updated (Supabase Realtime will update clients).');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2">
        {['destinations', 'packages', 'bookings', 'tracking'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize ${
              tab === t
                ? 'bg-glacier-600 text-white'
                : 'bg-white/70 text-slate-700 dark:bg-white/5 dark:text-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'destinations' && (
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={saveDestination} className="glass-panel space-y-3 rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
              {editingDestId ? 'Edit destination' : 'Add destination'}
            </h2>
            <input
              required
              placeholder="Name"
              className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
              value={destForm.name}
              onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
            />
            <textarea
              required
              placeholder="Description"
              rows={3}
              className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
              value={destForm.description}
              onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
            />
            <input
              placeholder="Image URL"
              className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
              value={destForm.imageUrl}
              onChange={(e) => setDestForm({ ...destForm, imageUrl: e.target.value })}
            />
            <div>
              <label className="text-xs text-slate-500">Upload to Supabase Storage (optional)</label>
              <input type="file" accept="image/*" className="mt-1 block w-full text-sm" onChange={onImagePick} disabled={uploading} />
            </div>
            <input
              placeholder="Location"
              className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
              value={destForm.location}
              onChange={(e) => setDestForm({ ...destForm, location: e.target.value })}
            />
            <div className="flex gap-2">
              <GlassButton type="submit" variant="primary">
                Save
              </GlassButton>
              {editingDestId && (
                <GlassButton
                  type="button"
                  variant="outline"
                  className="!text-slate-800 dark:!text-white"
                  onClick={() => {
                    setEditingDestId(null);
                    setDestForm(emptyDest);
                  }}
                >
                  Cancel
                </GlassButton>
              )}
            </div>
          </form>
          <ul className="space-y-3">
            {destinations.map((d) => (
              <li key={d.id} className="glass-panel flex flex-wrap items-center justify-between gap-2 rounded-xl p-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{d.name}</p>
                  <p className="text-xs text-slate-500">ID {d.id} · {d.packageCount} packages</p>
                </div>
                <div className="flex gap-2">
                  <GlassButton type="button" variant="outline" className="!px-3 !py-1 !text-xs" onClick={() => editDestination(d)}>
                    Edit
                  </GlassButton>
                  <GlassButton type="button" variant="ghost" className="!px-3 !py-1 !text-xs text-rose-600" onClick={() => removeDestination(d.id)}>
                    Delete
                  </GlassButton>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'packages' && (
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={savePackage} className="glass-panel space-y-3 rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
              {editingPkgId ? 'Edit package' : 'Add package'}
            </h2>
            <input
              required
              placeholder="Title"
              className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
              value={pkgForm.title}
              onChange={(e) => setPkgForm({ ...pkgForm, title: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Duration days"
                className="rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
                value={pkgForm.duration}
                onChange={(e) => setPkgForm({ ...pkgForm, duration: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price"
                className="rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
                value={pkgForm.price}
                onChange={(e) => setPkgForm({ ...pkgForm, price: e.target.value })}
              />
            </div>
            <select
              className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
              value={pkgForm.adventureLevel}
              onChange={(e) => setPkgForm({ ...pkgForm, adventureLevel: e.target.value })}
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            <select
              required
              className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
              value={pkgForm.destinationId}
              onChange={(e) => setPkgForm({ ...pkgForm, destinationId: e.target.value })}
            >
              <option value="">Destination</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Activities (comma separated)"
              className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
              value={pkgForm.activities}
              onChange={(e) => setPkgForm({ ...pkgForm, activities: e.target.value })}
            />
            <textarea
              placeholder="Itinerary"
              rows={3}
              className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
              value={pkgForm.itinerary}
              onChange={(e) => setPkgForm({ ...pkgForm, itinerary: e.target.value })}
            />
            <input
              placeholder="Banner image URL"
              className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
              value={pkgForm.bannerImageUrl}
              onChange={(e) => setPkgForm({ ...pkgForm, bannerImageUrl: e.target.value })}
            />
            <input
              type="number"
              placeholder="Popularity score"
              className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
              value={pkgForm.popularityScore}
              onChange={(e) => setPkgForm({ ...pkgForm, popularityScore: e.target.value })}
            />
            <div className="flex gap-2">
              <GlassButton type="submit" variant="primary">
                Save package
              </GlassButton>
              {editingPkgId && (
                <GlassButton
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingPkgId(null);
                    setPkgForm(emptyPkg);
                  }}
                >
                  Cancel
                </GlassButton>
              )}
            </div>
          </form>
          <div>
            <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">All packages (paginated fetch, up to 100).</p>
            <ul className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
              {allPackages.map((p) => (
                <li key={p.id} className="glass-panel flex flex-wrap items-center justify-between gap-2 rounded-xl p-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{p.title}</p>
                    <p className="text-xs text-slate-500">
                      ID {p.id} · {p.destinationName} · ₹{Number(p.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <GlassButton type="button" variant="outline" className="!px-3 !py-1 !text-xs" onClick={() => editPackageById(p.id)}>
                      Edit
                    </GlassButton>
                    <GlassButton type="button" variant="ghost" className="!px-3 !py-1 !text-xs text-rose-600" onClick={() => removePackage(p.id)}>
                      Delete
                    </GlassButton>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === 'bookings' && (
        <div className="glass-panel rounded-2xl p-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Package</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.content?.map((b) => (
                <tr key={b.id} className="border-b border-slate-100 dark:border-white/5">
                  <td className="py-2 pr-4 font-mono">{b.id}</td>
                  <td className="py-2 pr-4">{b.customerName}</td>
                  <td className="py-2 pr-4">{b.packageTitle}</td>
                  <td className="py-2 pr-4">{b.travelDate}</td>
                  <td className="py-2 pr-4">{b.bookingStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'tracking' && (
        <form onSubmit={pushTracking} className="glass-panel max-w-lg space-y-4 rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Update trip status</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Updates Spring Boot tracking and mirrors to Supabase for realtime clients.
          </p>
          <input
            required
            type="number"
            placeholder="Booking ID"
            className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
            value={trackBookingId}
            onChange={(e) => setTrackBookingId(e.target.value)}
          />
          <select
            className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
            value={trackStatus}
            onChange={(e) => setTrackStatus(e.target.value)}
          >
            {TRACKING_STEPS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
          <GlassButton type="submit" variant="primary">
            Push status
          </GlassButton>
        </form>
      )}
    </div>
  );
}

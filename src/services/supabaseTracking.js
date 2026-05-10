import { supabase, isSupabaseConfigured } from '../supabase/client';

const TABLE = 'trip_tracking';

export async function upsertTripTrackingRow(bookingId, currentStatus) {
  if (!isSupabaseConfigured() || !supabase) return;
  const payload = {
    booking_id: bookingId,
    current_status: currentStatus,
    updated_time: new Date().toISOString(),
  };
  const { error } = await supabase.from(TABLE).upsert(payload, { onConflict: 'booking_id' });
  if (error) console.error('[trip_tracking upsert]', error.message);
}

// Note: ensureTrackingRowFromApi was used when Spring Boot was the source of truth.
// In the React + Supabase-only stack, tracking rows are created directly in Supabase.

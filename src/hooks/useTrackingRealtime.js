import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase/client';

/**
 * Subscribes to Supabase Realtime updates for trip_tracking.booking_id
 */
export function useTrackingRealtime(bookingId, initialStatus, initialUpdatedTime) {
  const [status, setStatus] = useState(initialStatus);
  const [updatedTime, setUpdatedTime] = useState(initialUpdatedTime);

  useEffect(() => {
    setStatus(initialStatus);
    setUpdatedTime(initialUpdatedTime);
  }, [initialStatus, initialUpdatedTime, bookingId]);

  const applyPayload = useCallback((row) => {
    if (!row) return;
    if (Number(row.booking_id) !== Number(bookingId)) return;
    setStatus(row.current_status);
    setUpdatedTime(row.updated_time);
  }, [bookingId]);

  useEffect(() => {
    if (!bookingId || !isSupabaseConfigured() || !supabase) return;

    const channel = supabase
      .channel(`trip_tracking:${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trip_tracking',
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          const row = payload.new;
          applyPayload(row);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId, applyPayload]);

  return { status, updatedTime, setStatus, setUpdatedTime };
}

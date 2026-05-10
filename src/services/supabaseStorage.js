import { supabase, isSupabaseConfigured } from '../supabase/client';

const BUCKET = import.meta.env.VITE_SUPABASE_DESTINATIONS_BUCKET || 'destinations';

export async function uploadDestinationImage(file, pathPrefix = 'admin') {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase not configured');
  }
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${pathPrefix}/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return pub.publicUrl;
}

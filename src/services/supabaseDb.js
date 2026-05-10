import { supabase, isSupabaseConfigured } from '../supabase/client';

function requireSupabase() {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
}

export async function listDestinationsWithStats() {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('destinations_with_stats')
    .select('id,name,description,image_url,location,package_count,starting_price')
    .order('id', { ascending: true });
  if (error) throw error;
  return (data || []).map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
    imageUrl: d.image_url,
    location: d.location,
    packageCount: d.package_count,
    startingPrice: d.starting_price,
  }));
}

export async function searchPackages({
  destinationId,
  maxBudget,
  minDuration,
  maxDuration,
  adventureLevel,
  search,
  sortBy = 'price',
  direction = 'ASC',
  page = 0,
  size = 12,
} = {}) {
  const sb = requireSupabase();
  const from = page * size;
  const to = from + size - 1;

  let q = sb
    .from('travel_packages')
    .select(
      'id,title,duration_days,price,adventure_level,activities,popularity_score,banner_image_url,itinerary,destination_id,destinations(name)',
      { count: 'exact' }
    );

  if (destinationId) q = q.eq('destination_id', destinationId);
  if (typeof maxBudget === 'number') q = q.lte('price', maxBudget);
  if (typeof minDuration === 'number') q = q.gte('duration_days', minDuration);
  if (typeof maxDuration === 'number') q = q.lte('duration_days', maxDuration);
  if (adventureLevel) q = q.eq('adventure_level', adventureLevel);
  if (search) q = q.ilike('title', `%${search}%`);

  const sortColumn =
    sortBy?.toLowerCase() === 'duration'
      ? 'duration_days'
      : sortBy?.toLowerCase() === 'popularity'
        ? 'popularity_score'
        : 'price';

  q = q.order(sortColumn, { ascending: String(direction).toUpperCase() !== 'DESC' }).range(from, to);

  const { data, error, count } = await q;
  if (error) throw error;

  const content = (data || []).map((p) => ({
    id: p.id,
    title: p.title,
    duration: p.duration_days,
    price: p.price,
    adventureLevel: p.adventure_level,
    activities: p.activities || [],
    popularityScore: p.popularity_score,
    bannerImageUrl: p.banner_image_url,
    itinerary: p.itinerary,
    destinationId: p.destination_id,
    destinationName: p.destinations?.name,
  }));

  const totalElements = count || 0;
  const totalPages = Math.ceil(totalElements / size);
  return { content, page, size, totalElements, totalPages, last: page >= totalPages - 1 };
}

export async function getPackageById(id) {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('travel_packages')
    .select(
      'id,title,duration_days,price,adventure_level,activities,popularity_score,banner_image_url,itinerary,destination_id,destinations(name,description)',
      { count: 'none' }
    )
    .eq('id', id)
    .single();
  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    duration: data.duration_days,
    price: data.price,
    adventureLevel: data.adventure_level,
    activities: data.activities || [],
    popularityScore: data.popularity_score,
    bannerImageUrl: data.banner_image_url,
    itinerary: data.itinerary,
    destinationId: data.destination_id,
    destinationName: data.destinations?.name,
    destinationDescription: data.destinations?.description,
  };
}

export async function createBookingAndTracking({
  packageId,
  customerName,
  email,
  phone,
  travelers,
  travelDate,
  specialRequest,
}) {
  const sb = requireSupabase();
  const {
    data: { user },
    error: userErr,
  } = await sb.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error('Please login to book a package.');

  const { data: booking, error } = await sb
    .from('bookings')
    .insert({
      user_id: user.id,
      package_id: packageId,
      customer_name: customerName,
      email,
      phone,
      travelers,
      travel_date: travelDate,
      special_request: specialRequest || null,
      booking_status: 'CONFIRMED',
    })
    .select('id,customer_name,email,phone,travelers,travel_date,special_request,booking_status,package_id')
    .single();
  if (error) throw error;

  // Initialize tracking row (owner insert allowed by RLS).
  const { error: trErr } = await sb.from('trip_tracking').insert({
    booking_id: booking.id,
    current_status: 'BOOKING_CONFIRMED',
    updated_time: new Date().toISOString(),
  });
  if (trErr) throw trErr;

  return {
    id: booking.id,
    customerName: booking.customer_name,
    email: booking.email,
    phone: booking.phone,
    travelers: booking.travelers,
    travelDate: booking.travel_date,
    specialRequest: booking.special_request,
    bookingStatus: booking.booking_status,
    packageId: booking.package_id,
  };
}

export async function getTrackingByBookingId(bookingId) {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('trip_tracking')
    .select('id,booking_id,current_status,updated_time')
    .eq('booking_id', bookingId)
    .single();
  if (error) throw error;
  return {
    id: data.id,
    bookingId: data.booking_id,
    currentStatus: data.current_status,
    updatedTime: data.updated_time,
  };
}

export async function adminUpdateTrackingStatus(bookingId, status) {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('trip_tracking')
    .update({ current_status: status, updated_time: new Date().toISOString() })
    .eq('booking_id', bookingId)
    .select('id,booking_id,current_status,updated_time')
    .single();
  if (error) throw error;
  return {
    id: data.id,
    bookingId: data.booking_id,
    currentStatus: data.current_status,
    updatedTime: data.updated_time,
  };
}

export async function adminListBookings({ page = 0, size = 50 } = {}) {
  const sb = requireSupabase();
  const from = page * size;
  const to = from + size - 1;
  const { data, error, count } = await sb
    .from('bookings')
    .select(
      'id,customer_name,email,phone,travelers,travel_date,special_request,booking_status,package_id,travel_packages(title,destinations(name))',
      { count: 'exact' }
    )
    .order('id', { ascending: false })
    .range(from, to);
  if (error) throw error;

  const content = (data || []).map((b) => ({
    id: b.id,
    customerName: b.customer_name,
    email: b.email,
    phone: b.phone,
    travelers: b.travelers,
    travelDate: b.travel_date,
    specialRequest: b.special_request,
    bookingStatus: b.booking_status,
    packageId: b.package_id,
    packageTitle: b.travel_packages?.title,
    destinationName: b.travel_packages?.destinations?.name,
  }));

  const totalElements = count || 0;
  const totalPages = Math.ceil(totalElements / size);
  return { content, page, size, totalElements, totalPages, last: page >= totalPages - 1 };
}

export async function adminUpsertDestination({ id, name, description, imageUrl, location }) {
  const sb = requireSupabase();
  const payload = {
    ...(id ? { id } : {}),
    name,
    description,
    image_url: imageUrl || null,
    location: location || null,
  };
  const { data, error } = await sb.from('destinations').upsert(payload).select('*').single();
  if (error) throw error;
  return data;
}

export async function adminDeleteDestination(id) {
  const sb = requireSupabase();
  const { error } = await sb.from('destinations').delete().eq('id', id);
  if (error) throw error;
}

export async function adminUpsertPackage({
  id,
  destinationId,
  title,
  duration,
  price,
  adventureLevel,
  activities,
  popularityScore,
  bannerImageUrl,
  itinerary,
}) {
  const sb = requireSupabase();
  const payload = {
    ...(id ? { id } : {}),
    destination_id: destinationId,
    title,
    duration_days: duration,
    price,
    adventure_level: adventureLevel,
    activities: (activities || [])
      .map((s) => String(s).trim())
      .filter(Boolean),
    popularity_score: popularityScore ?? 0,
    banner_image_url: bannerImageUrl || null,
    itinerary: itinerary || null,
  };
  const { data, error } = await sb.from('travel_packages').upsert(payload).select('*').single();
  if (error) throw error;
  return data;
}

export async function adminDeletePackage(id) {
  const sb = requireSupabase();
  const { error } = await sb.from('travel_packages').delete().eq('id', id);
  if (error) throw error;
}


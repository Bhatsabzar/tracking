/** Matches backend TrackingStatus enum */
export const TRACKING_STEPS = [
  { key: 'BOOKING_CONFIRMED', label: 'Booking Confirmed' },
  { key: 'PAYMENT_SUCCESSFUL', label: 'Payment Successful' },
  { key: 'TRIP_STARTED', label: 'Trip Started' },
  { key: 'REACHED_DESTINATION', label: 'Reached Destination' },
  { key: 'TREK_IN_PROGRESS', label: 'Trek In Progress' },
  { key: 'TREK_COMPLETED', label: 'Trek Completed' },
];

export function stepIndex(status) {
  const i = TRACKING_STEPS.findIndex((s) => s.key === status);
  return i < 0 ? 0 : i;
}

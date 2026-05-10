import SectionTitle from '../components/SectionTitle';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionTitle
        eyebrow="Our story"
        title="Kashmir Trek & Travel Tracker"
        subtitle="We blend enterprise-grade booking infrastructure with the warmth of Kashmiri hospitality."
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel space-y-4 rounded-2xl p-8 text-slate-700 dark:text-slate-200"
      >
        <p>
          From the Lidder waters of Pahalgam to the remote folds of Warwan, our platform helps you discover, book, and
          follow every step of your Himalayan journey.
        </p>
        <p>
          Spring Boot powers reliable reservations and tracking records, while Supabase keeps your identity safe and
          delivers live status updates the moment your trek advances.
        </p>
      </motion.div>
    </div>
  );
}

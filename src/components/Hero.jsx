import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassButton from './GlassButton';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1597074866923-dc0589154358?w=1920&q=80"
          alt="Kashmir mountains"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-kashmir-gradient" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm font-semibold uppercase tracking-[0.25em] text-glacier-300"
        >
          Pristine peaks · Alpine lakes · Legendary treks
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-lg"
        >
          Explore the Hidden Beauty of Kashmir
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 text-lg text-slate-200 md:text-xl max-w-2xl mx-auto"
        >
          Track your unforgettable trekking journey in Kashmir — from Pahalgam meadows to Warwan&apos;s remote
          valleys.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/packages">
            <GlassButton variant="primary" className="min-w-[200px]">
              Explore Packages
            </GlassButton>
          </Link>
          <Link to="/tracking">
            <GlassButton variant="outline" className="min-w-[200px]">
              Start Tracking
            </GlassButton>
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      >
        <span className="block h-10 w-6 rounded-full border-2 border-white/40" />
      </motion.div>
    </section>
  );
}

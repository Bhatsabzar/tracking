import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassButton from './GlassButton';

export default function DestinationCard({ destination, index = 0 }) {
  const { id, name, description, imageUrl, packageCount, startingPrice } = destination;
  const fmt = startingPrice != null ? `₹${Number(startingPrice).toLocaleString('en-IN')}` : '—';

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-3xl glass-panel"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="font-display text-2xl font-semibold">{name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-200">{description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">{packageCount} packages</span>
          <span className="rounded-full bg-glacier-500/40 px-3 py-1 backdrop-blur-sm">From {fmt}</span>
        </div>
        <Link to={`/packages?destinationId=${id}`} className="mt-4 inline-block">
          <GlassButton variant="primary" className="!text-sm">
            View Details
          </GlassButton>
        </Link>
      </div>
    </motion.article>
  );
}

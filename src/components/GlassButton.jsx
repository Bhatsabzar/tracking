import { motion } from 'framer-motion';

export default function GlassButton({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}) {
  const variants = {
    primary:
      'bg-glacier-600/90 hover:bg-glacier-500 text-white border border-white/20 shadow-lg',
    outline:
      'bg-white/10 hover:bg-white/20 text-white border border-white/30 dark:border-white/20',
    ghost: 'bg-transparent hover:bg-white/10 text-inherit border border-transparent',
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold backdrop-blur-md transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

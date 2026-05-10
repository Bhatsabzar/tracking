import { motion } from 'framer-motion';
import { TRACKING_STEPS, stepIndex } from '../utils/trackingStatuses';

export default function TrackingTimeline({ currentStatus }) {
  const active = stepIndex(currentStatus);

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-glacier-400/50 via-glacier-500/30 to-transparent md:left-6" />
      <ul className="space-y-8">
        {TRACKING_STEPS.map((step, i) => {
          const done = i <= active;
          const current = i === active;
          return (
            <motion.li
              key={step.key}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative flex gap-4 md:gap-6 pl-10 md:pl-14"
            >
              <span
                className={`absolute left-2 md:left-4 top-1 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                  done
                    ? 'border-glacier-400 bg-glacier-500 text-white shadow-lg shadow-glacier-500/40'
                    : 'border-slate-300 bg-white/50 text-slate-400 dark:border-slate-600 dark:bg-pine-800'
                } ${current ? 'ring-4 ring-glacier-400/30' : ''}`}
              >
                {done ? '✓' : i + 1}
              </span>
              <div className="glass-panel flex-1 rounded-xl px-4 py-3 md:px-5 md:py-4">
                <p className={`font-semibold ${done ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                  {step.label}
                </p>
                {current && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-glacier-600 dark:text-glacier-400"
                  >
                    Current stage — updates appear live when your guide or admin advances the trip.
                  </motion.p>
                )}
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

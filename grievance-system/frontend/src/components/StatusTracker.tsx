import { motion } from 'framer-motion';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

const STEPS = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'] as const;

const stepLabels: Record<string, string> = {
  PENDING: 'Pending',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
};

export default function StatusTracker({ currentStatus }: { currentStatus: string }) {
  const currentIndex = STEPS.indexOf(currentStatus as (typeof STEPS)[number]);
  const resolvedIndex = currentIndex < 0 ? 3 : currentIndex;

  return (
    <div className="flex items-center justify-between gap-2 py-4">
      {STEPS.map((step, i) => {
        const isComplete = i <= resolvedIndex;
        const isCurrent = i === resolvedIndex && currentStatus !== 'ESCALATED';

        return (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-1 flex-col items-center"
          >
            <div className="flex items-center w-full">
              {i > 0 && (
                <div
                  className={`h-0.5 flex-1 -mr-2 transition-colors ${
                    isComplete ? 'bg-gov-green' : 'bg-slate-200'
                  }`}
                />
              )}
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  isComplete
                    ? 'border-gov-green bg-gov-green text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {isComplete ? (
                  <CheckCircle size={20} />
                ) : isCurrent ? (
                  <Loader2 size={20} className="animate-spin text-gov-accent" />
                ) : (
                  <Circle size={18} className="text-slate-400" />
                )}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 -ml-2 transition-colors ${
                    isComplete ? 'bg-gov-green' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${
                isComplete ? 'text-gov-green' : 'text-slate-500'
              }`}
            >
              {stepLabels[step] || step}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

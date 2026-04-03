import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: 'saffron' | 'navy' | 'green' | 'slate';
  delay?: number;
}

const colorClasses = {
  saffron: 'bg-gov-accentSoft text-gov-accent border-gov-accent/30',
  navy: 'bg-gov-muted text-gov-primary border-gov-primary/30',
  green: 'bg-emerald-50 text-gov-green border-gov-green/30',
  slate: 'bg-slate-100 text-slate-700 border-slate-300/50',
};

export default function StatCard({ title, value, icon: Icon, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gov-primary">{value}</p>
        </div>
        <div className={`rounded-lg p-2.5 border ${colorClasses[color]}`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
      </div>
    </motion.div>
  );
}

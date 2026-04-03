import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

interface ComplaintCardProps {
  id: number;
  description: string;
  category?: string;
  status: string;
  department?: { name: string } | null;
  createdAt?: string;
  onClick?: () => void;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  ASSIGNED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-gov-accentSoft text-gov-accent',
  RESOLVED: 'bg-emerald-100 text-emerald-800',
  ESCALATED: 'bg-red-100 text-red-800',
};

export default function ComplaintCard({
  id,
  description,
  category,
  status,
  department,
  createdAt,
  onClick,
}: ComplaintCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-gov-primary/30 hover:shadow-md transition-all"
    >
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gov-accentSoft">
          <FileText size={20} className="text-gov-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-gov-primary">#{id}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                statusColors[status] || 'bg-slate-100 text-slate-700'
              }`}
            >
              {status.replace('_', ' ')}
            </span>
            {category && (
              <span className="text-xs text-slate-500">{category}</span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{description}</p>
          {(department || createdAt) && (
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
              {department && <span>{department.name}</span>}
              {createdAt && (
                <span>{new Date(createdAt).toLocaleDateString()}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';

export function CardSkeleton() {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="rounded-xl border border-slate-200 bg-white p-5"
    >
      <div className="h-4 w-1/3 rounded bg-slate-200" />
      <div className="mt-3 h-8 w-1/2 rounded bg-slate-200" />
      <div className="mt-4 h-10 w-full rounded bg-slate-100" />
    </motion.div>
  );
}

export function TableRowSkeleton() {
  return (
    <motion.tr
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="border-b border-slate-100"
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-slate-200" />
        </td>
      ))}
    </motion.tr>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatusTracker from '../components/StatusTracker';
import ComplaintCard from '../components/ComplaintCard';
import { complaintApi, Complaint, ComplaintHistory } from '../api/client';
import { isAuthenticated } from '../lib/auth';

export default function TrackComplaintPage() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [history, setHistory] = useState<ComplaintHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/track' } });
      return;
    }
    complaintApi.listMine().then(setComplaints).finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    if (!selected) {
      setHistory([]);
      return;
    }
    setHistoryLoading(true);
    complaintApi
      .history(selected.id)
      .then(setHistory)
      .finally(() => setHistoryLoading(false));
  }, [selected]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-gov-primary">Track Your Complaint</h1>
        <p className="mt-1 text-slate-600">
          Select a complaint to view its status timeline
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">My Complaints</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
              ))}
            </div>
          ) : complaints.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white py-8 text-center text-slate-500">
              No complaints yet
            </p>
          ) : (
            <div className="space-y-3">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`cursor-pointer rounded-xl border transition-all ${
                    selected?.id === c.id
                      ? 'border-gov-primary bg-gov-accentSoft/50'
                      : 'border-slate-200 bg-white hover:border-gov-primary/50'
                  }`}
                >
                  <ComplaintCard
                    id={c.id}
                    description={c.description || ''}
                    category={c.category}
                    status={c.status}
                    department={c.department}
                    createdAt={c.createdAt}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {selected ? (
            <>
              <StatusTracker currentStatus={selected.status} />
              <div className="mt-6 border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-gov-primary">Status History</h3>
                {historyLoading ? (
                  <div className="mt-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 animate-pulse rounded bg-slate-100" />
                    ))}
                  </div>
                ) : history.length === 0 ? (
                  <p className="mt-4 text-slate-500">No updates yet</p>
                ) : (
                  <ol className="mt-4 space-y-4">
                    {history.map((h) => (
                      <li key={h.id} className="border-l-2 border-gov-primary pl-4">
                        <p className="font-medium text-slate-800">{h.status}</p>
                        <p className="text-sm text-slate-600">{h.remarks}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(h.updatedAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </>
          ) : (
            <p className="py-12 text-center text-slate-500">
              Select a complaint to view its status
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

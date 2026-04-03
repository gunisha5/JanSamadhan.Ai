import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Clock, Loader2, CheckCircle } from 'lucide-react';
import StatCard from '../../components/StatCard';
import { complaintApi, Complaint } from '../../api/client';
import { getFirstName } from '../../lib/auth';
import ComplaintCard from '../../components/ComplaintCard';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complaintApi.listAll().then(setComplaints).finally(() => setLoading(false));
  }, []);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'PENDING').length;
  const inProgress = complaints.filter((c) =>
    ['ASSIGNED', 'IN_PROGRESS'].includes(c.status)
  ).length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gov-primary">Welcome, {getFirstName()}</h1>
        <p className="text-slate-600 mt-1">Overview of grievance management</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Complaints" value={loading ? '—' : total} icon={FileText} color="navy" delay={0} />
        <StatCard title="Pending" value={loading ? '—' : pending} icon={Clock} color="saffron" delay={0.05} />
        <StatCard title="In Progress" value={loading ? '—' : inProgress} icon={Loader2} color="slate" delay={0.1} />
        <StatCard title="Resolved" value={loading ? '—' : resolved} icon={CheckCircle} color="green" delay={0.15} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gov-primary mb-4">Recent Complaints</h2>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : complaints.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white py-12 text-center text-slate-500">No complaints yet</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {complaints.slice(0, 6).map((c) => (
              <ComplaintCard
                key={c.id}
                id={c.id}
                description={c.description || ''}
                category={c.category}
                status={c.status}
                department={c.department}
                createdAt={c.createdAt}
                onClick={() => navigate('/admin/complaints')}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

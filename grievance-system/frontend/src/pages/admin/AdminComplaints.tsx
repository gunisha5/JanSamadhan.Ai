import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../../components/Modal';
import { Button, TextArea } from '../../components/FormControls';
import { complaintApi, Complaint } from '../../api/client';
import { TableRowSkeleton } from '../../components/LoadingSkeleton';

const STATUS_OPTIONS = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'ESCALATED'] as const;

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [status, setStatus] = useState('RESOLVED');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = () => {
    setLoading(true);
    complaintApi.listAll().then(setComplaints).finally(() => setLoading(false));
  };

  const openUpdateModal = (c: Complaint) => {
    setSelectedComplaint(c);
    setStatus(c.status);
    setRemarks('');
    setModalOpen(true);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setSubmitting(true);
    try {
      await complaintApi.updateStatus(selectedComplaint.id, {
        status: status as (typeof STATUS_OPTIONS)[number],
        remarks: remarks || `Status updated to ${status}`,
      });
      setModalOpen(false);
      setSelectedComplaint(null);
      loadComplaints();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gov-primary">Complaint Management</h1>
        <p className="text-slate-600 mt-1">Update status and resolve complaints</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold text-gov-primary">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gov-primary">User</th>
                <th className="px-4 py-3 text-left font-semibold text-gov-primary">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-gov-primary">Department</th>
                <th className="px-4 py-3 text-left font-semibold text-gov-primary">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gov-primary">Created</th>
                <th className="px-4 py-3 text-right font-semibold text-gov-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => <TableRowSkeleton key={i} />)
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    No complaints found
                  </td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <motion.tr key={c.id} layout className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium">#{c.id}</td>
                    <td className="px-4 py-3">{c.user?.email || c.user?.name || '—'}</td>
                    <td className="px-4 py-3">{c.category || '—'}</td>
                    <td className="px-4 py-3">{c.department?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                          c.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openUpdateModal(c)}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-gov-primary hover:bg-gov-accentSoft transition-colors"
                        title="Update status"
                      >
                        Update Status
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedComplaint(null);
        }}
        title="Update Complaint Status"
      >
        {selectedComplaint && (
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            <p className="text-sm text-slate-600">Complaint #{selectedComplaint.id}</p>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-gov-primary focus:ring-1 focus:ring-gov-primary"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </label>
            <TextArea
              label="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks for this status update"
            />
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </motion.div>
  );
}

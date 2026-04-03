import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button, TextArea } from '../components/FormControls';
import { complaintApi } from '../api/client';
import { isAuthenticated } from '../lib/auth';

export default function SubmitComplaintPage() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [complaintId, setComplaintId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/submit' } });
      return;
    }
    if (!description.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const c = await complaintApi.submit({ description });
      setSuccess(true);
      setComplaintId(c.id);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || 'Failed to submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success && complaintId) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-lg"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle size={32} className="text-gov-green" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gov-primary">Complaint Submitted</h2>
        <p className="mt-2 text-slate-600">
          Your grievance has been received. Reference ID: <strong>#{complaintId}</strong>
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Our AI has analyzed and routed it to the appropriate department. Track its status in My Complaints.
        </p>
        <Button
          className="mt-6"
          onClick={() => navigate('/dashboard')}
        >
          View My Complaints
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-2xl"
    >
      <h1 className="text-2xl font-bold text-gov-primary">Submit a Grievance</h1>
      <p className="mt-1 text-slate-600">
        Describe your issue clearly. Our AI will categorize and route it automatically.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <TextArea
          label="Describe your grievance"
          placeholder="Provide a clear and factual description. Include dates, locations, and reference numbers if available. Do not share sensitive identifiers (full Aadhaar, card numbers, passwords)."
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[180px]"
        />
        <p className="text-xs text-slate-500">
          Character count: {description.length}/2000
        </p>
        {!isAuthenticated() && (
          <p className="mt-2 text-sm text-amber-700">
            You need to log in to submit a complaint.{' '}
            <button
              type="button"
              onClick={() => navigate('/login', { state: { from: '/submit' } })}
              className="font-medium underline"
            >
              Login
            </button>
          </p>
        )}
        <Button
          type="submit"
          className="mt-4"
          disabled={submitting || !isAuthenticated()}
        >
          {submitting ? 'Submitting...' : 'Submit Grievance'}
        </Button>
      </form>
    </motion.div>
  );
}

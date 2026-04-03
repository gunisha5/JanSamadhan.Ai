import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextArea } from '../components/FormControls';
import { complaintApi, Complaint, ComplaintHistory } from '../api/client';
import { getFirstName } from '../lib/auth';

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [history, setHistory] = useState<ComplaintHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstName = getFirstName();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadComplaints();
  }, [navigate]);

  const loadComplaints = async () => {
    setLoadingList(true);
    try {
      const data = await complaintApi.listMine();
      setComplaints(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load complaints.');
    } finally {
      setLoadingList(false);
    }
  };

  const loadHistory = async (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setHistory([]);
    setHistoryLoading(true);
    try {
      const data = await complaintApi.history(complaint.id);
      setHistory(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load complaint history.');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await complaintApi.submit({ description });
      setDescription('');
      await loadComplaints();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <section className="lg:col-span-3 space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-gov-primary">Welcome, {firstName}</h1>
          <p className="text-xs text-slate-600 mt-1">
            Submit a new grievance with clear details so that it can be automatically routed to the appropriate
            department.
          </p>
        </div>
        {error && (
          <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 border border-slate-200 rounded-xl shadow-md p-5 space-y-3 backdrop-blur"
        >
          <TextArea
            label="Describe your grievance"
            placeholder="Provide a clear and factual description of your issue. Include dates, locations, and reference numbers if available."
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Do not share sensitive personal identifiers (full Aadhaar, card numbers, passwords) in the text.</span>
            <span>{description.length}/1000</span>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit grievance'}
          </Button>
        </form>
      </section>
      <section className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">My recent complaints</h2>
        </div>
        <div className="bg-white/95 border border-slate-200 rounded-xl shadow-sm divide-y max-h-[420px] overflow-y-auto backdrop-blur">
          {loadingList ? (
            <p className="p-4 text-xs text-slate-500">Loading your complaints...</p>
          ) : complaints.length === 0 ? (
            <p className="p-4 text-xs text-slate-500">No complaints submitted yet.</p>
          ) : (
            complaints.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => loadHistory(c)}
                className={`w-full text-left px-4 py-3 text-xs hover:bg-gov-accentSoft/60 flex flex-col gap-1 transition-colors ${
                  selectedComplaint?.id === c.id ? 'bg-gov-muted/60 border-l-2 border-gov-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">#{c.id}</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] uppercase tracking-wide text-slate-700">
                      {c.status}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gov-accent/10 text-[10px] uppercase tracking-wide text-gov-primary">
                      {c.priority}
                    </span>
                  </span>
                </div>
                <p className="line-clamp-2 text-slate-600">{c.description}</p>
                {c.department && (
                  <p className="text-[11px] text-slate-500">Department: {c.department.name}</p>
                )}
              </button>
            ))
          )}
        </div>
        <div className="bg-white/95 border border-slate-200 rounded-xl shadow-sm p-4 text-xs backdrop-blur">
          <h3 className="font-semibold text-slate-800 mb-2">Complaint tracking</h3>
          {selectedComplaint ? (
            historyLoading ? (
              <p className="text-slate-500">Loading history...</p>
            ) : history.length === 0 ? (
              <p className="text-slate-500">No status updates recorded yet.</p>
            ) : (
              <ol className="space-y-3">
                {history.map((h) => (
                  <li key={h.id} className="border-l-2 border-gov-primary/50 pl-3">
                    <p className="font-semibold text-slate-800">{h.status}</p>
                    <p className="text-slate-600">{h.remarks}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Updated at {new Date(h.updatedAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ol>
            )
          ) : (
            <p className="text-slate-500">Select a complaint from the list to view its status timeline.</p>
          )}
        </div>
      </section>
    </div>
  );
}


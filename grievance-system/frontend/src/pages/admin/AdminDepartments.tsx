import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Modal from '../../components/Modal';
import { Button, TextInput, TextArea } from '../../components/FormControls';
import { departmentApi, Department } from '../../api/client';

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = () => {
    setLoading(true);
    departmentApi
      .list()
      .then(setDepartments)
      .finally(() => setLoading(false));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await departmentApi.create({ name, description });
      setName('');
      setDescription('');
      setModalOpen(false);
      loadDepartments();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gov-primary">
            Department Management
          </h1>
          <p className="text-slate-600 mt-1">View and create departments</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add Department
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-slate-200"
            />
          ))
        ) : departments.length === 0 ? (
          <p className="col-span-full rounded-xl border border-slate-200 bg-white py-12 text-center text-slate-500">
            No departments yet. Create one to get started.
          </p>
        ) : (
          departments.map((d) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h3 className="font-semibold text-gov-primary">{d.name}</h3>
              <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                {d.description || 'No description'}
              </p>
            </motion.div>
          ))
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setName('');
          setDescription('');
        }}
        title="Create Department"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <TextInput
            label="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Municipal Corporation"
          />
          <TextArea
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the department"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}

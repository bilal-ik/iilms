import { useEffect, useState } from 'react';
import api from '../../api/axios';
import ErrorMessage from '../../components/ErrorMessage';
import { formatDate } from '../../utils/formatDate';

const STATUS_COLORS = { pending: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30', accepted: 'bg-green-500/20 text-green-300 border border-green-500/30', rejected: 'bg-red-500/20 text-red-300 border border-red-500/30' };

export default function ReviewApplications() {
  const [internships, setInternships] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/internships/my').then((res) => setInternships(res.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    api.get(`/applications/internship/${selectedId}`)
      .then((res) => setApplications(res.data.data || []))
      .catch(() => setError('Failed to load applications.'));
  }, [selectedId]);

  async function updateStatus(appId, status) {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      setApplications((prev) => prev.map((a) => a.id === appId ? { ...a, status } : a));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Review Applications</h1>
      <ErrorMessage message={error} />
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Internship</label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full max-w-sm"
        >
          <option value="">-- Choose --</option>
          {internships.map((i) => <option key={i.id} value={i.id}>{i.title}</option>)}
        </select>
      </div>
      {applications.length === 0 && selectedId && <p className="text-slate-400">No applications for this internship.</p>}
      <div className="grid gap-3">
        {applications.map((a) => (
          <div key={a.id} className="glass border border-white/10 p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-white">{a.student_name}</p>
              <p className="text-sm text-slate-500">Applied: {formatDate(a.applied_at)}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${STATUS_COLORS[a.status]}`}>{a.status}</span>
            </div>
            {a.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => updateStatus(a.id, 'accepted')} className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700">Accept</button>
                <button onClick={() => updateStatus(a.id, 'rejected')} className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700">Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

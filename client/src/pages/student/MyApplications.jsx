import { useEffect, useState } from 'react';
import api from '../../api/axios';
import ErrorMessage from '../../components/ErrorMessage';
import { formatDate } from '../../utils/formatDate';

const STATUS_COLORS = { pending: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30', accepted: 'bg-green-500/20 text-green-300 border border-green-500/30', rejected: 'bg-red-500/20 text-red-300 border border-red-500/30' };

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/applications/my')
      .then((res) => setApplications(res.data.data))
      .catch(() => setError('Failed to load applications.'));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      <ErrorMessage message={error} />
      {applications.length === 0 && !error && <p className="text-slate-400">No applications yet.</p>}
      <div className="grid gap-3">
        {applications.map((a) => (
          <div key={a.id} className="glass border border-white/10 p-4 flex justify-between items-start">
            <div>
              <p className="font-semibold text-white">{a.internship_title}</p>
              <p className="text-sm text-slate-400">{a.company_name}</p>
              <p className="text-sm text-slate-500">Applied: {formatDate(a.applied_at)}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[a.status]}`}>
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

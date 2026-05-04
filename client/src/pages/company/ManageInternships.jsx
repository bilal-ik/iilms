import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import ErrorMessage from '../../components/ErrorMessage';
import { formatDate } from '../../utils/formatDate';

export default function ManageInternships() {
  const [internships, setInternships] = useState([]);
  const [error, setError] = useState('');

  function load() {
    api.get('/internships/my').then((res) => setInternships(res.data.data || [])).catch(() => setError('Failed to load.'));
  }

  useEffect(() => { load(); }, []);

  async function toggleStatus(i) {
    const newStatus = i.status === 'open' ? 'closed' : 'open';
    await api.patch(`/internships/${i.id}/status`, { status: newStatus });
    load();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this internship?')) return;
    await api.delete(`/internships/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Internships</h1>
        <Link to="/company/internships/new" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          + Post New
        </Link>
      </div>
      <ErrorMessage message={error} />
      {internships.length === 0 && !error && <p className="text-slate-400">No internships posted yet.</p>}
      <div className="grid gap-3">
        {internships.map((i) => (
          <div key={i.id} className="glass border border-white/10 p-4 flex justify-between items-start">
            <div>
              <p className="font-semibold text-white">{i.title}</p>
              <p className="text-sm text-slate-400">{i.location} · {i.duration_weeks}w · Deadline: {formatDate(i.deadline)}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${i.status === 'open' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-slate-600/40 text-slate-400 border border-white/10'}`}>
                {i.status}
              </span>
            </div>
            <div className="flex gap-2 text-sm">
              <Link to={`/company/internships/${i.id}/edit`} className="text-blue-600 underline">Edit</Link>
              <button onClick={() => toggleStatus(i)} className="text-yellow-600 underline">{i.status === 'open' ? 'Close' : 'Open'}</button>
              <button onClick={() => handleDelete(i.id)} className="text-red-600 underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';
import ErrorMessage from '../../components/ErrorMessage';
import { formatDate } from '../../utils/formatDate';

export default function BrowseInternships() {
  const [internships, setInternships] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState({});
  const limit = 10;

  useEffect(() => {
    api.get(`/internships?page=${page}&limit=${limit}`)
      .then((res) => setInternships(res.data.data))
      .catch(() => setError('Failed to load internships.'));
  }, [page]);

  async function handleApply(id) {
    try {
      await api.post('/applications', { internship_id: id });
      setMessages((m) => ({ ...m, [id]: 'Applied successfully!' }));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to apply.';
      setMessages((m) => ({ ...m, [id]: msg }));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Browse Internships</h1>
      <ErrorMessage message={error} />
      <div className="grid gap-4">
        {internships.map((i) => (
          <div key={i.id} className="glass border border-white/10 p-4">
            <h2 className="text-lg font-semibold">{i.title}</h2>
            <p className="text-sm text-slate-300">{i.company_name} · {i.location}</p>
            <p className="text-sm text-slate-400">Deadline: {formatDate(i.deadline)}</p>
            <div className="flex items-center gap-3 mt-3">
              <Link to={`/internships/${i.id}`} className="text-blue-600 text-sm">View Details</Link>
              <button
                onClick={() => handleApply(i.id)}
                className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
            {messages[i.id] && <p className="text-sm mt-1 text-green-700">{messages[i.id]}</p>}
          </div>
        ))}
      </div>
      <Pagination page={page} onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} hasMore={internships.length === limit} />
    </div>
  );
}

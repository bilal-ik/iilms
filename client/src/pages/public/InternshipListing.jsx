import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';
import ErrorMessage from '../../components/ErrorMessage';
import { formatDate } from '../../utils/formatDate';

export default function InternshipListing() {
  const [internships, setInternships] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const limit = 10;

  useEffect(() => {
    api.get(`/internships?page=${page}&limit=${limit}`)
      .then((res) => setInternships(res.data.data))
      .catch(() => setError('Failed to load internships.'));
  }, [page]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Open Internships</h1>
        <p className="text-slate-400">Discover opportunities from top industry partners.</p>
      </div>
      <ErrorMessage message={error} />
      {internships.length === 0 && !error && <p className="text-slate-400">No internships available right now.</p>}
      <div className="grid md:grid-cols-2 gap-4">
        {internships.map((i) => (
          <div key={i.id} className="glass border border-white/10 hover:border-blue-500/40 p-5 transition-all hover:scale-[1.01]">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-semibold text-white">{i.title}</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Open</span>
            </div>
            <p className="text-sm text-slate-300 mb-1">🏢 {i.company_name}</p>
            <p className="text-sm text-slate-400 mb-1">📍 {i.location}</p>
            <p className="text-sm text-slate-400 mb-4">⏰ Deadline: {formatDate(i.deadline)}</p>
            <Link to={`/internships/${i.id}`} className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
              View Details →
            </Link>
          </div>
        ))}
      </div>
      <Pagination
        page={page}
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
        hasMore={internships.length === limit}
      />
    </div>
  );
}

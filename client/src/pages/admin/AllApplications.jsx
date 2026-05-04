import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';
import ErrorMessage from '../../components/ErrorMessage';
import { formatDate } from '../../utils/formatDate';

const STATUS_COLORS = { pending: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30', accepted: 'bg-green-500/20 text-green-300 border border-green-500/30', rejected: 'bg-red-500/20 text-red-300 border border-red-500/30' };

export default function AllApplications() {
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const limit = 20;

  useEffect(() => {
    api.get(`/applications?page=${page}&limit=${limit}`)
      .then((res) => setApplications(res.data.data || []))
      .catch(() => setError('Failed to load applications.'));
  }, [page]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Applications</h1>
      <ErrorMessage message={error} />
      <table className="w-full text-sm border">
        <thead className="bg-slate-800/50">
          <tr>{['Student', 'Internship', 'Company', 'Applied', 'Status'].map((h) => <th key={h} className="border px-3 py-2 text-left">{h}</th>)}</tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr key={a.id}>
              <td className="border px-3 py-2">{a.student_name}</td>
              <td className="border px-3 py-2">{a.internship_title}</td>
              <td className="border px-3 py-2">{a.company_name}</td>
              <td className="border px-3 py-2">{formatDate(a.applied_at)}</td>
              <td className="border px-3 py-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[a.status]}`}>{a.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination page={page} onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} hasMore={applications.length === limit} />
    </div>
  );
}

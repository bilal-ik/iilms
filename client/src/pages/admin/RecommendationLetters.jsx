import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';
import ErrorMessage from '../../components/ErrorMessage';
import { formatDate } from '../../utils/formatDate';

export default function RecommendationLetters() {
  const [letters, setLetters] = useState([]);
  const [page, setPage] = useState(1);
  const [appId, setAppId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const limit = 20;

  function load() {
    api.get(`/recommendations?page=${page}&limit=${limit}`)
      .then((res) => setLetters(res.data.data || []))
      .catch(() => setError('Failed to load letters.'));
  }

  useEffect(() => { load(); }, [page]);

  async function generate() {
    setError(''); setSuccess('');
    try {
      await api.post('/recommendations', { application_id: Number(appId) });
      setSuccess('Letter generated.');
      setAppId('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate.');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Recommendation Letters</h1>
      <ErrorMessage message={error} />
      {success && <p className="text-green-400 text-sm mb-4">{success}</p>}

      <div className="glass border border-white/10 p-4 mb-6 flex gap-3 items-end rounded-xl">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Application ID</label>
          <input type="number" value={appId} onChange={(e) => setAppId(e.target.value)} className="border rounded px-3 py-2 text-sm w-40" />
        </div>
        <button onClick={generate} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Generate</button>
      </div>

      <div className="grid gap-4">
        {letters.map((l) => (
          <div key={l.id} className="glass border border-white/10 p-4">
            <div className="flex justify-between mb-2">
              <p className="font-semibold text-white">{l.student_name}</p>
              <p className="text-sm text-slate-500">{formatDate(l.generated_at)}</p>
            </div>
            <p className="text-sm text-slate-400 mb-2">{l.internship_title}</p>
            <p className="text-sm text-slate-200 italic">{l.content}</p>
          </div>
        ))}
      </div>
      <Pagination page={page} onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} hasMore={letters.length === limit} />
    </div>
  );
}

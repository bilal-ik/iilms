import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';
import ErrorMessage from '../../components/ErrorMessage';
import { formatDate } from '../../utils/formatDate';

export default function AllEvaluations() {
  const [evaluations, setEvaluations] = useState([]);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ application_id: '', score: '', feedback: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const limit = 20;

  function load() {
    api.get(`/evaluations?page=${page}&limit=${limit}`)
      .then((res) => setEvaluations(res.data.data || []))
      .catch(() => setError('Failed to load evaluations.'));
  }

  useEffect(() => { load(); }, [page]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await api.post('/evaluations', { ...form, application_id: Number(form.application_id), score: Number(form.score) });
      setSuccess('Evaluation submitted.');
      setForm({ application_id: '', score: '', feedback: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit.');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Evaluations</h1>
      <ErrorMessage message={error} />
      {success && <p className="text-green-400 text-sm mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="glass border border-white/10 p-5 mb-6 space-y-3 rounded-xl">
        <h2 className="font-semibold text-white">Submit Evaluation</h2>
        <input type="number" placeholder="Application ID" value={form.application_id} onChange={(e) => setForm({ ...form, application_id: e.target.value })} className="border rounded px-3 py-2 text-sm w-full" required />
        <input type="number" placeholder="Score (0–100)" min="0" max="100" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} className="border rounded px-3 py-2 text-sm w-full" required />
        <textarea placeholder="Feedback (optional)" value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} className="border rounded px-3 py-2 text-sm w-full" rows={2} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Submit</button>
      </form>

      <table className="w-full text-sm border">
        <thead className="bg-slate-800/50">
          <tr>{['App ID', 'Score', 'Feedback', 'Date'].map((h) => <th key={h} className="border px-3 py-2 text-left">{h}</th>)}</tr>
        </thead>
        <tbody>
          {evaluations.map((e) => (
            <tr key={e.id}>
              <td className="border px-3 py-2">{e.application_id}</td>
              <td className="border px-3 py-2">{e.score}</td>
              <td className="border px-3 py-2 max-w-xs truncate">{e.feedback || '—'}</td>
              <td className="border px-3 py-2">{formatDate(e.evaluated_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination page={page} onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} hasMore={evaluations.length === limit} />
    </div>
  );
}

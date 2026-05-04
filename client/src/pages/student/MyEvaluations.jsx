import { useEffect, useState } from 'react';
import api from '../../api/axios';
import ErrorMessage from '../../components/ErrorMessage';
import { formatDate } from '../../utils/formatDate';

export default function MyEvaluations() {
  const [evaluations, setEvaluations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/evaluations/my')
      .then((res) => setEvaluations(res.data.data))
      .catch(() => setError('Failed to load evaluations.'));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Evaluations</h1>
      <ErrorMessage message={error} />
      {evaluations.length === 0 && !error && <p className="text-slate-400">No evaluations yet.</p>}
      <div className="grid gap-4">
        {evaluations.map((e) => (
          <div key={e.id} className="glass border border-white/10 p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-white">Score: {e.score}/100</p>
              <p className="text-sm text-slate-500">{formatDate(e.evaluated_at)}</p>
            </div>
            <p className="text-slate-200 text-sm">{e.feedback || 'No feedback provided.'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

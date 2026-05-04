import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import ErrorMessage from '../../components/ErrorMessage';
import { formatDate } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';

export default function InternshipDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [error, setError] = useState('');
  const [applyMsg, setApplyMsg] = useState('');

  useEffect(() => {
    api.get(`/internships/${id}`)
      .then((res) => setInternship(res.data.data))
      .catch(() => setError('Internship not found.'));
  }, [id]);

  async function handleApply() {
    try {
      await api.post('/applications', { internship_id: Number(id) });
      setApplyMsg('Application submitted successfully!');
    } catch (err) {
      setApplyMsg(err.response?.data?.message || 'Failed to apply.');
    }
  }

  if (!internship) return <p className="text-slate-400">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate(-1)} className="text-blue-600 text-sm mb-4">← Back</button>
      <ErrorMessage message={error} />
      <h1 className="text-2xl font-bold mb-1">{internship.title}</h1>
      <p className="text-slate-300 mb-4">{internship.company_name} · {internship.location}</p>
      <p className="mb-2"><span className="font-medium">Duration:</span> {internship.duration_weeks} weeks</p>
      <p className="mb-2"><span className="font-medium">Deadline:</span> {formatDate(internship.deadline)}</p>
      <p className="mb-2"><span className="font-medium">Skills:</span> {internship.skills_required || '—'}</p>
      <p className="mt-4 text-slate-200">{internship.description}</p>
      {user?.role === 'student' && internship.status === 'open' && (
        <button
          onClick={handleApply}
          className="mt-6 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Apply Now
        </button>
      )}
      {applyMsg && <p className="mt-3 text-sm text-green-700">{applyMsg}</p>}
    </div>
  );
}

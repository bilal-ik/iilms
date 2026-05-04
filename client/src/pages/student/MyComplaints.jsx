import { useEffect, useState } from 'react';
import api from '../../api/axios';
import ErrorMessage from '../../components/ErrorMessage';
import { formatDate } from '../../utils/formatDate';

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function load() {
    api.get('/complaints/my')
      .then((res) => setComplaints(res.data.data))
      .catch(() => setError('Failed to load complaints.'));
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await api.post('/complaints', form);
      setForm({ subject: '', message: '' });
      setSuccess('Complaint submitted.');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint.');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Complaints</h1>
      <ErrorMessage message={error} />
      {success && <p className="text-green-400 text-sm mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="glass border border-white/10 p-4 mb-6 space-y-3">
        <h2 className="font-semibold text-white">Submit New Complaint</h2>
        <input
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
          required
        />
        <textarea
          placeholder="Describe your issue..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
          rows={3}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
          Submit
        </button>
      </form>

      <div className="grid gap-4">
        {complaints.map((c) => (
          <div key={c.id} className="glass border border-white/10 p-4">
            <div className="flex justify-between mb-2">
              <p className="font-semibold text-white">{c.subject}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${c.status === 'open' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'}`}>
                {c.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">{formatDate(c.created_at)}</p>
            <div className="space-y-2">
              {(c.messages || []).map((m) => (
                <div key={m.id} className={`text-sm p-2 rounded-lg ${m.sender_id === c.student_id ? 'bg-blue-500/10 border border-blue-500/20 text-slate-200' : 'bg-slate-700/50 border border-white/10 text-slate-300'}`}>
                  <p>{m.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(m.sent_at)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

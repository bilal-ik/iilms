import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';
import ErrorMessage from '../../components/ErrorMessage';
import { formatDate } from '../../utils/formatDate';

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const [thread, setThread] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');
  const limit = 20;

  function load() {
    api.get(`/complaints?page=${page}&limit=${limit}`)
      .then((res) => setComplaints(res.data.data || []))
      .catch(() => setError('Failed to load complaints.'));
  }

  useEffect(() => { load(); }, [page]);

  async function expand(c) {
    if (expanded === c.id) { setExpanded(null); return; }
    setExpanded(c.id);
    // Fetch full thread via student endpoint isn't available to admin directly,
    // so we show what we have from the list and allow reply
    setThread([]);
    setReplyText('');
  }

  async function sendReply(complaintId) {
    try {
      await api.post(`/complaints/${complaintId}/reply`, { message: replyText });
      setReplyText('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reply.');
    }
  }

  async function resolve(complaintId) {
    await api.patch(`/complaints/${complaintId}/resolve`);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Complaints</h1>
      <ErrorMessage message={error} />
      <div className="grid gap-3">
        {complaints.map((c) => (
          <div key={c.id} className="glass border border-white/10 p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-white">{c.subject}</p>
                <p className="text-sm text-slate-400">{c.student_name} · {formatDate(c.created_at)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'open' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'}`}>{c.status}</span>
                <button onClick={() => expand(c)} className="text-blue-600 text-sm underline">
                  {expanded === c.id ? 'Collapse' : 'Reply'}
                </button>
                {c.status === 'open' && (
                  <button onClick={() => resolve(c.id)} className="text-green-700 text-sm underline">Resolve</button>
                )}
              </div>
            </div>
            {expanded === c.id && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows={2}
                />
                <button onClick={() => sendReply(c.id)} className="bg-blue-600 text-white text-sm px-4 py-1 rounded hover:bg-blue-700">
                  Send Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <Pagination page={page} onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} hasMore={complaints.length === limit} />
    </div>
  );
}

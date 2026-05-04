import { useEffect, useState } from 'react';
import api from '../../api/axios';
import ErrorMessage from '../../components/ErrorMessage';
import { formatDate } from '../../utils/formatDate';

export default function MyNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  function load() {
    api.get('/notifications')
      .then((res) => setNotifications(res.data.data))
      .catch(() => setError('Failed to load notifications.'));
  }

  useEffect(() => { load(); }, []);

  async function markOne(id) {
    await api.patch(`/notifications/${id}/read`);
    load();
  }

  async function markAll() {
    await api.patch('/notifications/read-all');
    load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.length > 0 && (
          <button onClick={markAll} className="text-sm text-blue-600 underline">Mark all read</button>
        )}
      </div>
      <ErrorMessage message={error} />
      {notifications.length === 0 && !error && <p className="text-slate-400">No unread notifications.</p>}
      <div className="grid gap-3">
        {notifications.map((n) => (
          <div key={n.id} className="glass border border-white/10 p-4 flex justify-between items-start">
            <div>
              <p className="text-sm">{n.message}</p>
              <p className="text-xs text-slate-500 mt-1">{formatDate(n.created_at)}</p>
            </div>
            <button onClick={() => markOne(n.id)} className="text-xs text-blue-600 underline ml-4 shrink-0">
              Mark read
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

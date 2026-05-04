import { useEffect, useState } from 'react';
import api from '../../api/axios';
import ErrorMessage from '../../components/ErrorMessage';

export default function AssignSupervisor() {
  const [applications, setApplications] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selections, setSelections] = useState({});
  const [messages, setMessages] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    // Load all accepted applications
    api.get('/applications?page=1&limit=100').then((res) => {
      const accepted = (res.data.data || []).filter((a) => a.status === 'accepted');
      setApplications(accepted);
    }).catch(() => setError('Failed to load applications.'));

    // Load admin users to use as supervisors (we use the /supervisors/my-students endpoint
    // to get existing assignments; for the list of admins we rely on a simple approach)
    // Since there's no dedicated admin-list endpoint, we'll let the user type a supervisor ID
  }, []);

  async function assign(appId) {
    const supervisorId = selections[appId];
    if (!supervisorId) return;
    try {
      await api.post('/supervisors/assign', { application_id: appId, supervisor_id: Number(supervisorId) });
      setMessages((m) => ({ ...m, [appId]: 'Assigned!' }));
    } catch (err) {
      setMessages((m) => ({ ...m, [appId]: err.response?.data?.message || 'Failed.' }));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Assign Supervisors</h1>
      <ErrorMessage message={error} />
      <p className="text-sm text-slate-400 mb-4">Enter the User ID of an admin to assign as supervisor.</p>
      {applications.length === 0 && !error && <p className="text-slate-400">No accepted applications found.</p>}
      <div className="grid gap-3">
        {applications.map((a) => (
          <div key={a.id} className="glass border border-white/10 p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-white">{a.student_name}</p>
              <p className="text-sm text-slate-400">{a.internship_title} · {a.company_name}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Supervisor ID"
                value={selections[a.id] || ''}
                onChange={(e) => setSelections((s) => ({ ...s, [a.id]: e.target.value }))}
                className="border rounded px-2 py-1 text-sm w-32"
              />
              <button onClick={() => assign(a.id)} className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700">
                Assign
              </button>
              {messages[a.id] && <span className="text-sm text-green-700">{messages[a.id]}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

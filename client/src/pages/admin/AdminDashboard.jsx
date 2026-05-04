import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [evalStats, setEvalStats] = useState([]);

  useEffect(() => {
    api.get('/dashboard/summary').then((r) => setSummary(r.data.data)).catch(() => {});
    api.get('/dashboard/applications-breakdown').then((r) => setBreakdown(r.data.data)).catch(() => {});
    api.get('/dashboard/evaluation-stats').then((r) => setEvalStats(r.data.data)).catch(() => {});
  }, []);

  const metrics = summary ? [
    { label: 'Students', value: summary.students, color: 'blue' },
    { label: 'Companies', value: summary.companies, color: 'purple' },
    { label: 'Open Internships', value: summary.open_internships, color: 'green' },
    { label: 'Pending Applications', value: summary.pending_applications, color: 'yellow' },
    { label: 'Unresolved Complaints', value: summary.unresolved_complaints, color: 'red' },
  ] : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-5 gap-3 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className={`bg-${m.color}-50 border border-${m.color}-200 rounded p-3 text-center`}>
            <p className={`text-2xl font-bold text-${m.color}-700`}>{m.value}</p>
            <p className="text-xs text-slate-300 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {[
          { to: '/admin/applications', label: 'All Applications' },
          { to: '/admin/supervisors', label: 'Assign Supervisors' },
          { to: '/admin/evaluations', label: 'Evaluations' },
          { to: '/admin/recommendations', label: 'Recommendation Letters' },
          { to: '/admin/complaints', label: 'Manage Complaints' },
        ].map((l) => (
          <Link key={l.to} to={l.to} className="block border rounded p-3 hover:bg-slate-800/50 text-blue-700 font-medium">
            {l.label} →
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-2">Applications Breakdown</h2>
      <table className="w-full text-sm border mb-8">
        <thead className="bg-slate-800/50">
          <tr>{['Internship', 'Pending', 'Accepted', 'Rejected'].map((h) => <th key={h} className="border px-3 py-2 text-left">{h}</th>)}</tr>
        </thead>
        <tbody>
          {breakdown.map((r) => (
            <tr key={r.id}>
              <td className="border px-3 py-2">{r.title}</td>
              <td className="border px-3 py-2">{r.pending}</td>
              <td className="border px-3 py-2">{r.accepted}</td>
              <td className="border px-3 py-2">{r.rejected}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-lg font-semibold mb-2">Evaluation Statistics</h2>
      <table className="w-full text-sm border">
        <thead className="bg-slate-800/50">
          <tr>{['Internship', 'Avg Score', 'Total Evaluations'].map((h) => <th key={h} className="border px-3 py-2 text-left">{h}</th>)}</tr>
        </thead>
        <tbody>
          {evalStats.map((r) => (
            <tr key={r.id}>
              <td className="border px-3 py-2">{r.title}</td>
              <td className="border px-3 py-2">{r.avg_score ?? '—'}</td>
              <td className="border px-3 py-2">{r.total_evaluations}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

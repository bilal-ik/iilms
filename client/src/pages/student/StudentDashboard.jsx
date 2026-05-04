import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0 });

  useEffect(() => {
    api.get('/applications/my').then((res) => {
      const apps = res.data.data || [];
      setStats({
        total: apps.length,
        pending: apps.filter((a) => a.status === 'pending').length,
        accepted: apps.filter((a) => a.status === 'accepted').length,
      });
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Welcome, {user?.full_name}</h1>
      <p className="text-slate-400 mb-6">Student Portal</p>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
          <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
          <p className="text-sm text-slate-300 mt-1">Total Applications</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-slate-300 mt-1">Pending</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
          <p className="text-sm text-slate-300 mt-1">Accepted</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { to: '/student/browse', label: 'Browse Internships' },
          { to: '/student/applications', label: 'My Applications' },
          { to: '/student/evaluations', label: 'My Evaluations' },
          { to: '/student/notifications', label: 'Notifications' },
          { to: '/student/complaints', label: 'Complaints' },
        ].map((link) => (
          <Link key={link.to} to={link.to} className="block border rounded p-3 hover:bg-slate-800/50 text-blue-700 font-medium">
            {link.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}

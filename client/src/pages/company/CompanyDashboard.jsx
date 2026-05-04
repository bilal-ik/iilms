import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    api.get('/internships/my').then((res) => setInternships(res.data.data || [])).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Welcome, {user?.full_name}</h1>
      <p className="text-slate-400 mb-6">Company Portal</p>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
          <p className="text-3xl font-bold text-blue-700">{internships.length}</p>
          <p className="text-sm text-slate-300 mt-1">Internships Posted</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
          <p className="text-3xl font-bold text-green-600">
            {internships.filter((i) => i.status === 'open').length}
          </p>
          <p className="text-sm text-slate-300 mt-1">Open Listings</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Link to="/company/internships" className="block border rounded p-3 hover:bg-slate-800/50 text-blue-700 font-medium">
          Manage Internships →
        </Link>
        <Link to="/company/applications" className="block border rounded p-3 hover:bg-slate-800/50 text-blue-700 font-medium">
          Review Applications →
        </Link>
        <Link to="/company/internships/new" className="block border rounded p-3 hover:bg-slate-800/50 text-blue-700 font-medium">
          Post New Internship →
        </Link>
      </div>
    </div>
  );
}

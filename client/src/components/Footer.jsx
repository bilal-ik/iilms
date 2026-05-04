import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'rgba(10,2,26,0.97)', borderTop: '1px solid rgba(168,85,247,0.2)' }} className="mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center text-sm font-black text-slate-900">II</div>
              <span className="font-bold text-lg text-white">IILMS</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Internship & Industry Linkage Management System — bridging universities, students, and industry partners.
            </p>
          </div>

          {/* Students */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Students</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/internships" className="hover:text-purple-400 transition-colors">Browse Internships</Link></li>
              <li><Link to="/student/applications" className="hover:text-purple-400 transition-colors">My Applications</Link></li>
              <li><Link to="/student/evaluations" className="hover:text-purple-400 transition-colors">My Evaluations</Link></li>
              <li><Link to="/student/complaints" className="hover:text-purple-400 transition-colors">Submit Complaint</Link></li>
            </ul>
          </div>

          {/* Companies */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Companies</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/company/internships/new" className="hover:text-blue-400 transition-colors">Post Internship</Link></li>
              <li><Link to="/company/internships" className="hover:text-blue-400 transition-colors">Manage Listings</Link></li>
              <li><Link to="/company/applications" className="hover:text-blue-400 transition-colors">Review Applications</Link></li>
            </ul>
          </div>

          {/* University */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">University</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/admin" className="hover:text-blue-400 transition-colors">Admin Dashboard</Link></li>
              <li><Link to="/admin/supervisors" className="hover:text-blue-400 transition-colors">Assign Supervisors</Link></li>
              <li><Link to="/admin/complaints" className="hover:text-blue-400 transition-colors">Manage Complaints</Link></li>
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">Register Account</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} IILMS. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-slate-500">
            <span>Built with React + Node.js + MySQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

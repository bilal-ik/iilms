import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#1E1B4B', borderTop: '1px solid #312E81' }} className="mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #A78BFA)' }}>II</div>
              <span className="font-bold text-lg text-white">IILMS</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#A5B4FC' }}>
              Internship & Industry Linkage Management System — bridging universities, students, and industry partners.
            </p>
          </div>

          {[
            { title: 'Students', links: [
              { to: '/internships',           label: 'Browse Internships' },
              { to: '/student/applications',  label: 'My Applications' },
              { to: '/student/evaluations',   label: 'My Evaluations' },
              { to: '/student/complaints',    label: 'Submit Complaint' },
            ]},
            { title: 'Companies', links: [
              { to: '/company/internships/new', label: 'Post Internship' },
              { to: '/company/internships',     label: 'Manage Listings' },
              { to: '/company/applications',    label: 'Review Applications' },
            ]},
            { title: 'University', links: [
              { to: '/admin',               label: 'Admin Dashboard' },
              { to: '/admin/supervisors',   label: 'Assign Supervisors' },
              { to: '/admin/complaints',    label: 'Manage Complaints' },
              { to: '/register',            label: 'Register Account' },
            ]},
          ].map((col) => (
            <div key={col.title}>
              <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">{col.title}</h3>
              <ul className="space-y-2 text-sm" style={{ color: '#A5B4FC' }}>
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3"
          style={{ borderTop: '1px solid #312E81' }}>
          <p className="text-sm" style={{ color: '#6366F1' }}>© {new Date().getFullYear()} IILMS. All rights reserved.</p>
          <p className="text-sm" style={{ color: '#6366F1' }}>Built with React + Node.js + MySQL</p>
        </div>
      </div>
    </footer>
  );
}

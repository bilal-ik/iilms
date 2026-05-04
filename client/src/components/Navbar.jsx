import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_HOME = { admin: '/admin', student: '/student', company: '/company' };

const studentLinks = [
  { to: '/student', label: 'Dashboard' },
  { to: '/student/browse', label: 'Browse Internships' },
  { to: '/student/applications', label: 'My Applications' },
  { to: '/student/evaluations', label: 'My Evaluations' },
  { to: '/student/notifications', label: 'Notifications' },
  { to: '/student/complaints', label: 'Complaints' },
];

const companyLinks = [
  { to: '/company', label: 'Dashboard' },
  { to: '/company/internships', label: 'Manage Internships' },
  { to: '/company/internships/new', label: 'Post Internship' },
  { to: '/company/applications', label: 'Review Applications' },
];

const adminLinks = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/applications', label: 'All Applications' },
  { to: '/admin/supervisors', label: 'Assign Supervisors' },
  { to: '/admin/evaluations', label: 'Evaluations' },
  { to: '/admin/recommendations', label: 'Recommendation Letters' },
  { to: '/admin/complaints', label: 'Manage Complaints' },
];

function DropdownMenu({ label, links, icon }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-all`}
        style={{ color: '#e9d5ff' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,85,247,0.15)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        onClick={() => setOpen(!open)}
      >
        {icon && <span>{icon}</span>}
        {label}
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-52 rounded-xl shadow-2xl z-50 overflow-hidden"
          style={{ background: 'rgba(26,5,51,0.97)', border: '1px solid rgba(168,85,247,0.2)' }}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 text-sm hover:bg-blue-600/40 transition-colors ${location.pathname === l.to ? 'bg-blue-600/30 text-blue-300' : 'text-slate-200'}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
    setMobileOpen(false);
  }

  const roleLinks = user?.role === 'student' ? studentLinks : user?.role === 'company' ? companyLinks : user?.role === 'admin' ? adminLinks : [];
  const roleLabel = user?.role === 'student' ? '🎓 Student' : user?.role === 'company' ? '🏢 Company' : user?.role === 'admin' ? '⚙️ Admin' : '';

  return (
    <header className="sticky top-0 z-40" style={{ background: 'rgba(10,20,40,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center text-sm font-black text-slate-900">
              II
            </div>
            <span className="hidden sm:block">IILMS</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 text-slate-200">
            <Link to="/" className="px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium transition-all">🏠 Home</Link>
            <Link to="/internships" className="px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium transition-all">📋 Internships</Link>

            {/* Role-based dropdown */}
            {user?.role === 'student' && <DropdownMenu label="🎓 Student" links={studentLinks} />}
            {user?.role === 'company' && <DropdownMenu label="🏢 Company" links={companyLinks} />}
            {user?.role === 'admin' && <DropdownMenu label="⚙️ University" links={adminLinks} />}

            {/* More dropdown (always visible) */}
            <DropdownMenu label="More" links={[
              { to: '/internships', label: '🔍 Browse All Internships' },
              { to: '/register', label: '📝 Register' },
              { to: '/login', label: '🔐 Login' },
            ]} />
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login" className="px-4 py-1.5 text-sm rounded-lg border border-white/20 hover:bg-white/10 transition-all">Login</Link>
                <Link to="/register" className="px-4 py-1.5 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium transition-all">Register</Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-slate-400">{roleLabel}</p>
                  <p className="text-sm font-medium text-white">{user.full_name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm rounded-lg border border-red-400/30 text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-white mb-1 transition-all" style={{ transform: mobileOpen ? 'rotate(45deg) translate(3px, 6px)' : 'none' }} />
            <div className="w-5 h-0.5 bg-white mb-1 transition-all" style={{ opacity: mobileOpen ? 0 : 1 }} />
            <div className="w-5 h-0.5 bg-white transition-all" style={{ transform: mobileOpen ? 'rotate(-45deg) translate(3px, -6px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 mt-2 pt-3 space-y-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-lg hover:bg-white/10 text-sm">🏠 Home</Link>
            <Link to="/internships" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-lg hover:bg-white/10 text-sm">📋 Internships</Link>
            {roleLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-lg hover:bg-white/10 text-sm pl-6">
                {l.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-3 mt-3">
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-lg hover:bg-white/10 text-sm">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-sm">Register</Link>
                </>
              ) : (
                <>
                  <p className="px-4 py-2 text-sm text-slate-400">{user.full_name} · {user.role}</p>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 text-sm">Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const studentLinks = [
  { to: '/student',               label: '🏠 Dashboard' },
  { to: '/student/browse',        label: '🔍 Browse Internships' },
  { to: '/student/applications',  label: '📋 My Applications' },
  { to: '/student/evaluations',   label: '⭐ My Evaluations' },
  { to: '/student/notifications', label: '🔔 Notifications' },
  { to: '/student/complaints',    label: '💬 Complaints' },
  { to: '/student/cv',            label: '📄 My CV / Resume' },
  { to: '/profile',               label: '👤 My Profile' },
];

const companyLinks = [
  { to: '/company',                   label: '🏠 Dashboard' },
  { to: '/company/internships',       label: '📋 Manage Internships' },
  { to: '/company/internships/new',   label: '➕ Post Internship' },
  { to: '/company/applications',      label: '👥 Review Applications' },
  { to: '/profile',                   label: '👤 Company Profile' },
];

const adminLinks = [
  { to: '/admin',                  label: '🏠 Dashboard' },
  { to: '/admin/applications',     label: '📋 All Applications' },
  { to: '/admin/supervisors',      label: '👨‍🏫 Assign Supervisors' },
  { to: '/admin/evaluations',      label: '⭐ Evaluations' },
  { to: '/admin/recommendations',  label: '📄 Recommendation Letters' },
  { to: '/admin/complaints',       label: '💬 Manage Complaints' },
];

function DropdownMenu({ label, links }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all"
        style={{ color: '#374151' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.color = '#4F46E5'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#374151'; }}
      >
        {label}
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 rounded-xl z-50 overflow-hidden"
          style={{ background: '#FFFFFF', border: '1.5px solid #E5E7EB', boxShadow: '0 8px 30px rgba(79,70,229,0.12)' }}>
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm transition-colors"
              style={{
                color: location.pathname === l.to ? '#4F46E5' : '#374151',
                background: location.pathname === l.to ? '#EEF2FF' : 'transparent',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F5F3FF'; e.currentTarget.style.color = '#4F46E5'; }}
              onMouseLeave={e => { e.currentTarget.style.background = location.pathname === l.to ? '#EEF2FF' : 'transparent'; e.currentTarget.style.color = location.pathname === l.to ? '#4F46E5' : '#374151'; }}
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
    <header className="sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
              II
            </div>
            <span className="hidden sm:block" style={{ color: '#1E1B4B' }}>IILMS</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/"
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ color: '#374151' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.color = '#4F46E5'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#374151'; }}>
              🏠 Home
            </Link>
            <Link to="/internships"
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ color: '#374151' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.color = '#4F46E5'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#374151'; }}>
              📋 Internships
            </Link>

            {user?.role === 'student'  && <DropdownMenu label="🎓 Student"    links={studentLinks} />}
            {user?.role === 'company'  && <DropdownMenu label="🏢 Company"    links={companyLinks} />}
            {user?.role === 'admin'    && <DropdownMenu label="🏛️ University" links={adminLinks} />}

            <DropdownMenu label="More ▾" links={[
              { to: '/internships', label: '🔍 Browse Internships' },
              { to: '/register',    label: '📝 Register' },
              { to: '/login',       label: '🔐 Login' },
            ]} />
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login"
                  className="px-4 py-1.5 text-sm rounded-lg font-medium transition-all"
                  style={{ color: '#4F46E5', border: '1.5px solid #C7D2FE' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  Login
                </Link>
                <Link to="/register"
                  className="px-4 py-1.5 text-sm rounded-lg font-semibold text-white transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', boxShadow: '0 2px 10px rgba(79,70,229,0.3)' }}>
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-medium" style={{ color: '#4F46E5' }}>{roleLabel}</p>
                  <p className="text-sm font-semibold" style={{ color: '#1E1B4B' }}>{user.full_name}</p>
                </div>
                <button onClick={handleLogout}
                  className="px-3 py-1.5 text-sm rounded-lg font-medium transition-all"
                  style={{ color: '#DC2626', border: '1.5px solid #FECACA' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button className="md:hidden p-2 rounded-lg transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: '#374151' }}
            onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div className="w-5 h-0.5 mb-1 rounded" style={{ background: '#374151', transform: mobileOpen ? 'rotate(45deg) translate(3px, 6px)' : 'none' }} />
            <div className="w-5 h-0.5 mb-1 rounded" style={{ background: '#374151', opacity: mobileOpen ? 0 : 1 }} />
            <div className="w-5 h-0.5 rounded" style={{ background: '#374151', transform: mobileOpen ? 'rotate(-45deg) translate(3px, -6px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 mt-2 pt-3 space-y-1 rounded-xl mb-2"
            style={{ borderTop: '1px solid #E5E7EB', background: '#FFFFFF', boxShadow: '0 4px 20px rgba(79,70,229,0.1)' }}>
            <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm" style={{ color: '#374151' }}>🏠 Home</Link>
            <Link to="/internships" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm" style={{ color: '#374151' }}>📋 Internships</Link>
            {roleLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                className="block px-6 py-2.5 rounded-lg text-sm" style={{ color: '#4F46E5' }}>
                {l.label}
              </Link>
            ))}
            <div className="pt-3 mt-2" style={{ borderTop: '1px solid #F3F4F6' }}>
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium" style={{ color: '#4F46E5' }}>Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block mx-4 mt-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white text-center" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>Register</Link>
                </>
              ) : (
                <>
                  <p className="px-4 py-2 text-sm font-medium" style={{ color: '#6B7280' }}>{user.full_name} · {user.role}</p>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium" style={{ color: '#DC2626' }}>Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

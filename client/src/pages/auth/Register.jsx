import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

const ROLES = [
  {
    value: 'student',
    label: 'Student',
    icon: '🎓',
    desc: 'Browse internships, apply, track progress',
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/50',
  },
  {
    value: 'company',
    label: 'Company',
    icon: '🏢',
    desc: 'Post internships, review applicants',
    color: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/50',
  },
  {
    value: 'admin',
    label: 'University Admin',
    icon: '🏛️',
    desc: 'Oversee internships, assign supervisors',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/50',
  },
];

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'student';

  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: defaultRole });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setFieldErrors([]);
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const data = err.response?.data;
      if (!err.response) {
        setError('Cannot reach the server. Make sure the backend is running on port 3000.');
      } else if (data?.errors) {
        setFieldErrors(data.errors);
      } else {
        setError(data?.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass p-10 rounded-2xl border border-green-500/30 text-center max-w-sm w-full">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-white mb-2">Account Created!</h2>
          <p className="text-slate-400 text-sm">Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="glass p-8 rounded-2xl border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              📝
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-slate-400 text-sm mt-1">Join the IILMS platform</p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">I am a...</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.value })}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    form.role === r.value
                      ? `bg-gradient-to-br ${r.color} ${r.border}`
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  style={form.role === r.value ? {} : { background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="text-xl mb-1">{r.icon}</div>
                  <div className="text-xs font-medium text-white">{r.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5 hidden sm:block leading-tight">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Errors */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
              ⚠️ {error}
            </div>
          )}
          {fieldErrors.map((fe) => (
            <p key={fe.field} className="text-red-400 text-xs mb-1">• {fe.field}: {fe.message}</p>
          ))}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
                className="w-full px-4 py-3 rounded-xl text-sm"
                required
                minLength={6}
              />
            </div>

            {/* Role confirmation badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-lg">{ROLES.find(r => r.value === form.role)?.icon}</span>
              <span className="text-sm text-slate-300">
                Registering as <strong className="text-white">{ROLES.find(r => r.value === form.role)?.label}</strong>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

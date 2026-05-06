import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

const ROLES = [
  { value: 'student',  label: 'Student',          icon: '🎓', desc: 'University student seeking internship' },
  { value: 'company',  label: 'Company',           icon: '🏢', desc: 'Industry partner posting internships' },
  { value: 'admin',    label: 'University Admin',  icon: '🏛️', desc: 'University staff managing the program' },
];

const SEX_OPTIONS = ['male','female','other','prefer_not_to_say'];
const COMPANY_SIZES = ['1-10','11-50','51-200','201-500','500+'];

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
        {label}{required && <span style={{ color: '#EF4444' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ type = 'text', value, onChange, placeholder, required, min, max }) {
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      required={required} min={min} max={max}
      className="w-full px-4 py-2.5 rounded-xl text-sm"
    />
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'student';

  const [role, setRole] = useState(defaultRole);
  const [step, setStep] = useState(1); // step 1 = role select, step 2 = details
  const [form, setForm] = useState({
    // Common
    email: '', password: '', phone: '',
    // Student
    first_name: '', last_name: '', university_id: '', university: '',
    sex: '', date_of_birth: '', gpa: '', skills: '', linkedin_url: '',
    // Company
    company_name: '', industry: '', company_size: '', website: '',
    contact_person: '', contact_email: '', contact_phone: '', company_address: '', description: '',
    // Admin
    department: '', staff_id: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setFieldErrors([]); setLoading(true);
    try {
      await api.post('/auth/register', { ...form, role });
      setSuccess(true);
    } catch (err) {
      const data = err.response?.data;
      if (!err.response) setError('Cannot reach the server. Make sure the backend is running.');
      else if (data?.errors) setFieldErrors(data.errors);
      else setError(data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass p-10 rounded-2xl text-center max-w-md w-full"
          style={{ background: '#F0FDF4', borderColor: '#BBF7D0' }}>
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#065F46' }}>Account Created!</h2>
          <p className="mb-4" style={{ color: '#374151' }}>
            A verification link has been sent to <strong>{form.email}</strong>.
          </p>
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
            In development mode, check the <strong>server terminal</strong> for the verification link.
          </p>
          <button onClick={() => navigate('/login')}
            className="px-6 py-2.5 rounded-xl text-white font-semibold"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="glass p-8 rounded-2xl" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>📝</div>
            <h1 className="text-2xl font-bold" style={{ color: '#1E1B4B' }}>Create Account</h1>
            <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Join the IILMS platform</p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3" style={{ color: '#374151' }}>I am a...</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button key={r.value} type="button" onClick={() => setRole(r.value)}
                  className="p-3 rounded-xl border text-center transition-all"
                  style={role === r.value
                    ? { background: '#EEF2FF', borderColor: '#6366F1', borderWidth: '2px' }
                    : { background: '#F9FAFB', borderColor: '#E5E7EB' }}>
                  <div className="text-2xl mb-1">{r.icon}</div>
                  <div className="text-xs font-semibold" style={{ color: role === r.value ? '#4F46E5' : '#374151' }}>{r.label}</div>
                  <div className="text-xs mt-0.5 hidden sm:block" style={{ color: '#9CA3AF' }}>{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Errors */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', color: '#DC2626' }}>
              ⚠️ {error}
            </div>
          )}
          {fieldErrors.map((fe) => (
            <p key={fe.field} className="text-xs mb-1" style={{ color: '#DC2626' }}>• {fe.field}: {fe.message}</p>
          ))}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ── Common fields ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email Address" required>
                <Input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
              </Field>
              <Field label="Password" required>
                <Input type="password" value={form.password} onChange={set('password')} placeholder="Min. 6 characters" required />
              </Field>
            </div>

            {/* ── STUDENT fields ── */}
            {role === 'student' && (
              <>
                <div className="pt-2 pb-1">
                  <div className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg inline-block"
                    style={{ background: '#EEF2FF', color: '#4F46E5' }}>🎓 Student Information</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name" required>
                    <Input value={form.first_name} onChange={set('first_name')} placeholder="First name" required />
                  </Field>
                  <Field label="Last Name" required>
                    <Input value={form.last_name} onChange={set('last_name')} placeholder="Last name" required />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="University">
                    <Input value={form.university} onChange={set('university')} placeholder="Your university" />
                  </Field>
                  <Field label="Student / University ID">
                    <Input value={form.university_id} onChange={set('university_id')} placeholder="e.g. STU2024001" />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Sex">
                    <select value={form.sex} onChange={set('sex')} className="w-full px-4 py-2.5 rounded-xl text-sm">
                      <option value="">Prefer not to say</option>
                      {SEX_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                    </select>
                  </Field>
                  <Field label="Date of Birth">
                    <Input type="date" value={form.date_of_birth} onChange={set('date_of_birth')} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Phone / Contact">
                    <Input type="tel" value={form.phone} onChange={set('phone')} placeholder="+60 12-345 6789" />
                  </Field>
                  <Field label="GPA (optional)">
                    <Input type="number" value={form.gpa} onChange={set('gpa')} placeholder="e.g. 3.75" min="0" max="4" />
                  </Field>
                </div>
                <Field label="Skills (comma separated)">
                  <Input value={form.skills} onChange={set('skills')} placeholder="React, Node.js, Python..." />
                </Field>
                <Field label="LinkedIn URL (optional)">
                  <Input value={form.linkedin_url} onChange={set('linkedin_url')} placeholder="https://linkedin.com/in/..." />
                </Field>
              </>
            )}

            {/* ── COMPANY fields ── */}
            {role === 'company' && (
              <>
                <div className="pt-2 pb-1">
                  <div className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg inline-block"
                    style={{ background: '#FFF7ED', color: '#EA580C' }}>🏢 Company Information</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Company Name" required>
                    <Input value={form.company_name} onChange={set('company_name')} placeholder="Acme Corp" required />
                  </Field>
                  <Field label="Industry">
                    <Input value={form.industry} onChange={set('industry')} placeholder="Technology, Finance..." />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Company Size">
                    <select value={form.company_size} onChange={set('company_size')} className="w-full px-4 py-2.5 rounded-xl text-sm">
                      <option value="">Select size</option>
                      {COMPANY_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                    </select>
                  </Field>
                  <Field label="Website">
                    <Input value={form.website} onChange={set('website')} placeholder="https://company.com" />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Contact Person" required>
                    <Input value={form.contact_person} onChange={set('contact_person')} placeholder="HR Manager name" required />
                  </Field>
                  <Field label="Contact Phone" required>
                    <Input type="tel" value={form.contact_phone} onChange={set('contact_phone')} placeholder="+60 3-1234 5678" required />
                  </Field>
                </div>
                <Field label="Company Address" required>
                  <Input value={form.company_address} onChange={set('company_address')} placeholder="123 Business St, Kuala Lumpur" required />
                </Field>
                <Field label="Company Description">
                  <textarea value={form.description} onChange={set('description')}
                    placeholder="Brief description of your company..."
                    className="w-full px-4 py-2.5 rounded-xl text-sm" rows={3} />
                </Field>
              </>
            )}

            {/* ── ADMIN fields ── */}
            {role === 'admin' && (
              <>
                <div className="pt-2 pb-1">
                  <div className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg inline-block"
                    style={{ background: '#F0FDF4', color: '#059669' }}>🏛️ University Staff Information</div>
                </div>
                <Field label="Full Name" required>
                  <Input value={form.first_name} onChange={set('first_name')} placeholder="Dr. John Smith" required />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="University / Institution" required>
                    <Input value={form.university} onChange={set('university')} placeholder="University of Technology" required />
                  </Field>
                  <Field label="Department">
                    <Input value={form.department} onChange={set('department')} placeholder="Computer Science" />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Staff ID">
                    <Input value={form.staff_id} onChange={set('staff_id')} placeholder="STAFF001" />
                  </Field>
                  <Field label="Phone">
                    <Input type="tel" value={form.phone} onChange={set('phone')} placeholder="+60 3-1234 5678" />
                  </Field>
                </div>
              </>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 mt-2"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', boxShadow: '0 4px 16px rgba(79,70,229,0.3)' }}>
              {loading ? 'Creating account...' : `Create ${ROLES.find(r => r.value === role)?.label} Account`}
            </button>
          </form>

          <p className="mt-5 text-center text-sm" style={{ color: '#6B7280' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold" style={{ color: '#4F46E5' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

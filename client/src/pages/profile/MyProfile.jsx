import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../../components/ErrorMessage';

const SEX_OPTIONS = ['male','female','other','prefer_not_to_say'];
const COMPANY_SIZES = ['1-10','11-50','51-200','201-500','500+'];

export default function MyProfile() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/profile/me').then(res => {
      setData(res.data.data);
      // Flatten for form
      const d = res.data.data;
      setForm({ ...d, ...(d.profile || {}) });
    }).catch(() => setError('Failed to load profile.'));
  }, []);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  async function handleSave(e) {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await api.put('/profile/me', form);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      // Reload
      const res = await api.get('/profile/me');
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally { setLoading(false); }
  }

  if (!data) return <div className="text-center py-20" style={{ color: '#6B7280' }}>Loading profile...</div>;

  const profile = data.profile || {};
  const isStudent = user?.role === 'student';
  const isCompany = user?.role === 'company';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header card */}
      <div className="glass p-6 rounded-2xl mb-6 flex flex-col sm:flex-row items-center gap-5"
        style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)', borderColor: '#C7D2FE' }}>
        {/* Avatar */}
        <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl shrink-0"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white' }}>
          {data.photo_url
            ? <img src={data.photo_url} alt="avatar" className="w-full h-full object-cover rounded-2xl" />
            : (isStudent ? '🎓' : isCompany ? '🏢' : '🏛️')
          }
        </div>
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl font-bold" style={{ color: '#1E1B4B' }}>
            {isCompany ? (profile.company_name || data.full_name) : data.full_name}
          </h1>
          <p className="text-sm font-medium capitalize" style={{ color: '#4F46E5' }}>
            {data.role} {isStudent && profile.university ? `· ${profile.university}` : ''}
            {isCompany && profile.industry ? `· ${profile.industry}` : ''}
          </p>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>{data.email}</p>
          {data.bio && <p className="text-sm mt-2" style={{ color: '#374151' }}>{data.bio}</p>}
          <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${data.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {data.is_verified ? '✅ Verified' : '⚠️ Email not verified'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
              ID: #{data.id}
            </span>
          </div>
        </div>
        <button onClick={() => setEditing(!editing)}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: editing ? '#FEF2F2' : '#EEF2FF', color: editing ? '#DC2626' : '#4F46E5', border: `1.5px solid ${editing ? '#FECACA' : '#C7D2FE'}` }}>
          {editing ? '✕ Cancel' : '✏️ Edit Profile'}
        </button>
      </div>

      <ErrorMessage message={error} />
      {success && <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium" style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', color: '#059669' }}>✅ {success}</div>}

      {editing ? (
        <form onSubmit={handleSave} className="glass p-6 rounded-2xl space-y-4" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <h2 className="font-bold text-lg" style={{ color: '#1E1B4B' }}>Edit Profile</h2>

          {/* Common */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Bio / About</label>
              <textarea value={form.bio || ''} onChange={set('bio')} rows={3}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-2.5 rounded-xl text-sm col-span-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Phone</label>
              <input value={form.phone || ''} onChange={set('phone')} placeholder="+60 12-345 6789"
                className="w-full px-4 py-2.5 rounded-xl text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Photo URL</label>
            <input value={form.photo_url || ''} onChange={set('photo_url')} placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-2.5 rounded-xl text-sm" />
          </div>

          {/* Student-specific */}
          {isStudent && (
            <>
              <div className="pt-2 border-t" style={{ borderColor: '#F3F4F6' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#4F46E5' }}>Student Details</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>First Name</label>
                  <input value={form.first_name || ''} onChange={set('first_name')} className="w-full px-4 py-2.5 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Last Name</label>
                  <input value={form.last_name || ''} onChange={set('last_name')} className="w-full px-4 py-2.5 rounded-xl text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>University</label>
                  <input value={form.university || ''} onChange={set('university')} className="w-full px-4 py-2.5 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Student ID</label>
                  <input value={form.university_id || ''} onChange={set('university_id')} className="w-full px-4 py-2.5 rounded-xl text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Sex</label>
                  <select value={form.sex || ''} onChange={set('sex')} className="w-full px-4 py-2.5 rounded-xl text-sm">
                    <option value="">Prefer not to say</option>
                    {SEX_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>GPA</label>
                  <input type="number" value={form.gpa || ''} onChange={set('gpa')} min="0" max="4" step="0.01" className="w-full px-4 py-2.5 rounded-xl text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Skills</label>
                <input value={form.skills || ''} onChange={set('skills')} placeholder="React, Python, SQL..." className="w-full px-4 py-2.5 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>LinkedIn URL</label>
                <input value={form.linkedin_url || ''} onChange={set('linkedin_url')} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-2.5 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Testimonial (optional)</label>
                <textarea value={form.testimonial || ''} onChange={set('testimonial')} rows={2}
                  placeholder="Share your experience with IILMS..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm" />
              </div>
            </>
          )}

          {/* Company-specific */}
          {isCompany && (
            <>
              <div className="pt-2 border-t" style={{ borderColor: '#F3F4F6' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#EA580C' }}>Company Details</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Company Name</label>
                  <input value={form.company_name || ''} onChange={set('company_name')} className="w-full px-4 py-2.5 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Industry</label>
                  <input value={form.industry || ''} onChange={set('industry')} className="w-full px-4 py-2.5 rounded-xl text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Contact Person</label>
                  <input value={form.contact_person || ''} onChange={set('contact_person')} className="w-full px-4 py-2.5 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Contact Phone</label>
                  <input value={form.contact_phone || ''} onChange={set('contact_phone')} className="w-full px-4 py-2.5 rounded-xl text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Company Address</label>
                <input value={form.company_address || ''} onChange={set('company_address')} className="w-full px-4 py-2.5 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Testimonial (optional)</label>
                <textarea value={form.testimonial || ''} onChange={set('testimonial')} rows={2}
                  placeholder="Share your experience with IILMS..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm" />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="px-6 py-2.5 rounded-xl text-white font-semibold disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => setEditing(false)}
              className="px-6 py-2.5 rounded-xl font-semibold"
              style={{ background: '#F3F4F6', color: '#374151', border: '1.5px solid #E5E7EB' }}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* View mode */
        <div className="glass p-6 rounded-2xl space-y-4" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <h2 className="font-bold text-lg" style={{ color: '#1E1B4B' }}>Profile Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Email', value: data.email },
              { label: 'Phone', value: data.phone },
              { label: 'Role', value: data.role },
              ...(isStudent ? [
                { label: 'University', value: profile.university },
                { label: 'Student ID', value: profile.university_id },
                { label: 'Sex', value: profile.sex },
                { label: 'GPA', value: profile.gpa },
                { label: 'Skills', value: profile.skills },
                { label: 'LinkedIn', value: profile.linkedin_url },
              ] : []),
              ...(isCompany ? [
                { label: 'Company', value: profile.company_name },
                { label: 'Industry', value: profile.industry },
                { label: 'Size', value: profile.company_size },
                { label: 'Contact', value: profile.contact_person },
                { label: 'Contact Phone', value: profile.contact_phone },
                { label: 'Address', value: profile.company_address },
                { label: 'Website', value: profile.website },
              ] : []),
            ].filter(f => f.value).map(f => (
              <div key={f.label}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#9CA3AF' }}>{f.label}</p>
                <p style={{ color: '#374151' }}>{f.value}</p>
              </div>
            ))}
          </div>
          {(profile.testimonial) && (
            <div className="pt-4 border-t" style={{ borderColor: '#F3F4F6' }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9CA3AF' }}>Testimonial</p>
              <p className="text-sm italic" style={{ color: '#4B5563' }}>"{profile.testimonial}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

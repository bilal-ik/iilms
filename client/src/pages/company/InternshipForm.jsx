import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import ErrorMessage from '../../components/ErrorMessage';

const EMPTY = { title: '', description: '', location: '', duration_weeks: '', deadline: '', skills_required: '' };

export default function InternshipForm() {
  const { id } = useParams(); // present when editing
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);

  useEffect(() => {
    if (id) {
      api.get(`/internships/${id}`).then((res) => {
        const d = res.data.data;
        setForm({
          title: d.title,
          description: d.description,
          location: d.location,
          duration_weeks: d.duration_weeks,
          deadline: d.deadline?.slice(0, 10) || '',
          skills_required: d.skills_required || '',
        });
      }).catch(() => setError('Failed to load internship.'));
    }
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setFieldErrors([]);
    try {
      if (id) {
        await api.put(`/internships/${id}`, form);
      } else {
        await api.post('/internships', form);
      }
      navigate('/company/internships');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setFieldErrors(data.errors);
      else setError(data?.message || 'Failed to save.');
    }
  }

  const field = (label, key, type = 'text') => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full border rounded px-3 py-2 text-sm"
        required={key !== 'skills_required'}
      />
    </div>
  );

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Internship' : 'Post New Internship'}</h1>
      <ErrorMessage message={error} />
      {fieldErrors.map((fe) => <p key={fe.field} className="text-red-600 text-sm mb-1">{fe.field}: {fe.message}</p>)}
      <form onSubmit={handleSubmit} className="space-y-4">
        {field('Title', 'title')}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
            rows={3}
            required
          />
        </div>
        {field('Location', 'location')}
        {field('Duration (weeks)', 'duration_weeks', 'number')}
        {field('Application Deadline', 'deadline', 'date')}
        {field('Skills Required (optional)', 'skills_required')}
        <div className="flex gap-3">
          <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
            {id ? 'Update' : 'Post'}
          </button>
          <button type="button" onClick={() => navigate('/company/internships')} className="border px-5 py-2 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

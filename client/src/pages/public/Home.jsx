import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const stats = [
  { value: '500+', label: 'Internships Posted',  color: '#4F46E5', bg: '#EEF2FF' },
  { value: '1,200+', label: 'Students Placed',   color: '#7C3AED', bg: '#F5F3FF' },
  { value: '80+',  label: 'Partner Companies',   color: '#0EA5E9', bg: '#E0F2FE' },
  { value: '95%',  label: 'Satisfaction Rate',   color: '#059669', bg: '#D1FAE5' },
];

const testimonials = [
  { name: 'Sarah Chen',     role: 'CS Student',           org: 'University of Technology', avatar: '👩‍💻', text: 'IILMS made finding my internship so easy. I applied to 5 companies in one afternoon and got accepted within a week!', rating: 5 },
  { name: 'Ahmad Razali',   role: 'HR Manager',            org: 'TechCorp Malaysia',        avatar: '👨‍💼', text: 'IILMS centralized everything — we can now review, accept, and evaluate interns all in one place. Game changer.', rating: 5 },
  { name: 'Dr. Nurul Huda', role: 'Internship Coordinator',org: 'National University',      avatar: '👩‍🏫', text: 'The supervisor assignment and evaluation features are exactly what we needed. Recommendation letters in seconds!', rating: 5 },
  { name: 'Marcus Lim',     role: 'Software Eng. Student', org: 'Institute of Technology',  avatar: '👨‍🎓', text: 'I could see my application status in real-time and received notifications whenever something changed. Love it!', rating: 5 },
  { name: 'Priya Sharma',   role: 'Recruitment Lead',      org: 'GreenCo Solutions',        avatar: '👩‍💼', text: 'The quality of student applicants through IILMS is excellent. The evaluation system helps us give proper feedback.', rating: 5 },
  { name: 'Prof. James Wong',role: 'Dean of Engineering',  org: 'City University',          avatar: '👨‍🏫', text: 'IILMS transformed how our faculty manages internships. The complaint system ensures student welfare is protected.', rating: 5 },
];

const features = [
  { icon: '🎓', title: 'For Students',     desc: 'Browse internships, apply in one click, track status, view evaluations and get recommendation letters.', link: '/student',     bg: '#EEF2FF', border: '#C7D2FE', accent: '#4F46E5', tag: 'Student Portal' },
  { icon: '🏢', title: 'For Companies',    desc: 'Post listings, review applicants, accept or reject with one click, and evaluate intern performance.',    link: '/company',     bg: '#FFF7ED', border: '#FED7AA', accent: '#EA580C', tag: 'Company Portal' },
  { icon: '🏛️', title: 'For Universities', desc: 'Oversee the full lifecycle, assign supervisors, manage complaints, and generate recommendation letters.', link: '/admin',       bg: '#F0FDF4', border: '#BBF7D0', accent: '#059669', tag: 'Admin Portal' },
];

const steps = [
  { n: '1', icon: '📢', title: 'Company Posts',      desc: 'Industry partners post internship opportunities', color: '#EA580C', bg: '#FFF7ED' },
  { n: '2', icon: '🔍', title: 'Student Applies',    desc: 'Students browse and submit applications',         color: '#4F46E5', bg: '#EEF2FF' },
  { n: '3', icon: '✅', title: 'Admin Reviews',      desc: 'University admin oversees the process',           color: '#0EA5E9', bg: '#E0F2FE' },
  { n: '4', icon: '👨‍🏫', title: 'Supervisor Assigned',desc: 'Academic supervisor monitors the intern',        color: '#7C3AED', bg: '#F5F3FF' },
  { n: '5', icon: '🏆', title: 'Evaluation & Letter',desc: 'Performance evaluated, letter generated',         color: '#059669', bg: '#D1FAE5' },
];

const announcements = [
  { date: 'May 2026', title: 'Summer Internship Season Open',   desc: 'Over 50 new positions available across tech, finance, and engineering.', color: '#4F46E5', bg: '#EEF2FF' },
  { date: 'Apr 2026', title: 'New Company Partners Onboarded',  desc: 'Welcome TechCorp, GreenCo, and 8 more industry partners.',              color: '#EA580C', bg: '#FFF7ED' },
  { date: 'Mar 2026', title: 'Evaluation System Upgraded',      desc: 'Supervisors can now submit detailed evaluations with structured scoring.',color: '#059669', bg: '#F0FDF4' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 md:py-28 px-6"
        style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #E0F2FE 100%)' }}>
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-40"
          style={{ background: 'radial-gradient(circle, #A78BFA, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-30"
          style={{ background: 'radial-gradient(circle, #6366F1, transparent)' }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: '#EEF2FF', border: '1.5px solid #C7D2FE', color: '#4F46E5' }}>
            🚀 Connecting Universities · Students · Industry
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight" style={{ color: '#1E1B4B' }}>
            Your Internship
            <span className="block" style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #A78BFA 50%, #0EA5E9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Journey Starts Here
            </span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: '#4B5563' }}>
            IILMS streamlines the full internship lifecycle — from posting and applying to supervision, evaluation, and certification. All in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link to="/register"
                  className="px-8 py-3.5 rounded-xl text-white font-semibold text-lg transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', boxShadow: '0 4px 20px rgba(79,70,229,0.35)' }}>
                  Get Started Free ✨
                </Link>
                <Link to="/internships"
                  className="px-8 py-3.5 rounded-xl font-semibold text-lg transition-all hover:scale-105"
                  style={{ background: '#FFFFFF', border: '2px solid #C7D2FE', color: '#4F46E5' }}>
                  Browse Internships →
                </Link>
              </>
            ) : (
              <Link to={user.role === 'admin' ? '/admin' : user.role === 'company' ? '/company' : '/student'}
                className="px-8 py-3.5 rounded-xl text-white font-semibold text-lg transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', boxShadow: '0 4px 20px rgba(79,70,229,0.35)' }}>
                Go to Dashboard →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass p-6 text-center hover:scale-105 transition-all"
              style={{ background: s.bg, borderColor: 'transparent' }}>
              <p className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="text-sm font-medium" style={{ color: '#6B7280' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#1E1B4B' }}>Built for Everyone</h2>
            <p style={{ color: '#6B7280' }} className="max-w-xl mx-auto">One platform, three portals — each designed for a specific role in the internship ecosystem.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <Link key={f.title} to={f.link}
                className="glass p-6 hover:scale-105 transition-all cursor-pointer block"
                style={{ background: f.bg, borderColor: f.border }}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                  style={{ background: f.border, color: f.accent }}>
                  {f.tag}
                </div>
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#1E1B4B' }}>{f.title}</h3>
                <p style={{ color: '#6B7280' }} className="text-sm leading-relaxed">{f.desc}</p>
                <p className="text-sm mt-4 font-semibold" style={{ color: f.accent }}>Learn more →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(135deg, #F5F3FF, #EEF2FF)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#1E1B4B' }}>How It Works</h2>
            <p style={{ color: '#6B7280' }}>A simple 5-step process from posting to certification.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {steps.map((s) => (
              <div key={s.n} className="glass p-4 text-center hover:scale-105 transition-all"
                style={{ background: s.bg, borderColor: 'transparent' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black mx-auto mb-2 text-white"
                  style={{ background: s.color }}>{s.n}</div>
                <div className="text-2xl mb-2">{s.icon}</div>
                <h4 className="font-bold text-sm mb-1" style={{ color: '#1E1B4B' }}>{s.title}</h4>
                <p className="text-xs" style={{ color: '#6B7280' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Announcements ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#1E1B4B' }}>📣 Announcements</h2>
            <p style={{ color: '#6B7280' }}>Latest news from the IILMS platform.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {announcements.map((a) => (
              <div key={a.title} className="glass p-5 hover:scale-[1.02] transition-all"
                style={{ background: a.bg, borderColor: 'transparent' }}>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: a.color }}>{a.date}</span>
                <h3 className="font-bold mt-3 mb-1" style={{ color: '#1E1B4B' }}>{a.title}</h3>
                <p className="text-sm" style={{ color: '#6B7280' }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Carousel ── */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)' }}>
        <div className="text-center mb-12 px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#1E1B4B' }}>💬 What People Say</h2>
          <p style={{ color: '#6B7280' }} className="max-w-xl mx-auto">Trusted by students, companies, and universities across the country.</p>
        </div>
        <div className="testimonials-wrapper">
          <div className="testimonials-track">
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div key={idx} className="glass flex flex-col"
                style={{ minWidth: '300px', maxWidth: '300px', padding: '1.5rem', background: '#FFFFFF', borderColor: '#E5E7EB' }}>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: '#4B5563' }}>"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                    style={{ background: '#EEF2FF', border: '2px solid #C7D2FE' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#1E1B4B' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: '#6B7280' }}>{t.role}</p>
                    <p className="text-xs font-medium" style={{ color: '#4F46E5' }}>{t.org}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!user && (
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center glass p-12"
            style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)', borderColor: '#C7D2FE' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1E1B4B' }}>Ready to Get Started?</h2>
            <p className="mb-8" style={{ color: '#6B7280' }}>Join thousands of students and companies already using IILMS.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?role=student"
                className="px-6 py-3 rounded-xl text-white font-semibold hover:scale-105 transition-all"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', boxShadow: '0 4px 16px rgba(79,70,229,0.3)' }}>
                🎓 Register as Student
              </Link>
              <Link to="/register?role=company"
                className="px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all"
                style={{ background: '#FFFFFF', border: '2px solid #FED7AA', color: '#EA580C' }}>
                🏢 Register as Company
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

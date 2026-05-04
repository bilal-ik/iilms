import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const stats = [
  { value: '500+', label: 'Internships Posted' },
  { value: '1,200+', label: 'Students Placed' },
  { value: '80+', label: 'Partner Companies' },
  { value: '95%', label: 'Satisfaction Rate' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Computer Science Student',
    university: 'University of Technology',
    avatar: '👩‍💻',
    text: 'IILMS made finding my internship so easy. I applied to 5 companies in one afternoon and got accepted within a week. The tracking system kept me updated every step of the way.',
    rating: 5,
  },
  {
    name: 'Ahmad Razali',
    role: 'HR Manager',
    company: 'TechCorp Malaysia',
    avatar: '👨‍💼',
    text: 'As a company, we used to manage internship applications through email. IILMS centralized everything — we can now review, accept, and evaluate interns all in one place.',
    rating: 5,
  },
  {
    name: 'Dr. Nurul Huda',
    role: 'Internship Coordinator',
    university: 'National University',
    avatar: '👩‍🏫',
    text: 'The supervisor assignment and evaluation features are exactly what we needed. We can now monitor all our students\' internships and generate recommendation letters instantly.',
    rating: 5,
  },
  {
    name: 'Marcus Lim',
    role: 'Software Engineering Student',
    university: 'Institute of Technology',
    avatar: '👨‍🎓',
    text: 'I loved how transparent the process was. I could see my application status in real-time and received notifications whenever something changed. Highly recommend!',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Recruitment Lead',
    company: 'GreenCo Solutions',
    avatar: '👩‍💼',
    text: 'The quality of student applicants through IILMS is excellent. The platform pre-screens candidates and the evaluation system helps us give proper feedback.',
    rating: 5,
  },
  {
    name: 'Prof. James Wong',
    role: 'Dean of Engineering',
    university: 'City University',
    avatar: '👨‍🏫',
    text: 'IILMS has transformed how our faculty manages internships. The complaint handling system ensures student welfare is protected throughout the placement.',
    rating: 5,
  },
];

const features = [
  {
    icon: '🎓',
    title: 'For Students',
    desc: 'Browse hundreds of internship opportunities, track your applications in real-time, and receive evaluations and recommendation letters.',
    link: '/student',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(34,211,238,0.15))',
    border: 'rgba(168,85,247,0.4)',
    accent: '#a855f7',
  },
  {
    icon: '🏢',
    title: 'For Companies',
    desc: 'Post internship listings, review applicants, accept or reject with one click, and evaluate intern performance.',
    link: '/company',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,179,8,0.15))',
    border: 'rgba(249,115,22,0.4)',
    accent: '#f97316',
  },
  {
    icon: '🏛️',
    title: 'For Universities',
    desc: 'Oversee the full internship lifecycle, assign supervisors, manage complaints, and generate recommendation letters.',
    link: '/admin',
    gradient: 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(34,211,238,0.15))',
    border: 'rgba(74,222,128,0.4)',
    accent: '#4ade80',
  },
];

const announcements = [
  { date: 'May 2026', title: 'Summer Internship Season Open', desc: 'Over 50 new internship positions available across tech, finance, and engineering sectors.' },
  { date: 'Apr 2026', title: 'New Company Partners Onboarded', desc: 'Welcome TechCorp, GreenCo, and 8 more industry partners to the IILMS platform.' },
  { date: 'Mar 2026', title: 'Evaluation System Upgraded', desc: 'Supervisors can now submit detailed performance evaluations with structured scoring.' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden py-24 px-6">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)' }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.4)', color: '#d8b4fe' }}>
            🚀 Connecting Universities · Students · Industry
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Your Internship
            <span className="block" style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #f97316 50%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Journey Starts Here
            </span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: '#c4b5fd' }}>
            IILMS is a centralized platform that streamlines the full internship lifecycle — from posting and applying to supervision, evaluation, and certification.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link to="/register"
                  className="px-8 py-3.5 rounded-xl text-white font-semibold text-lg transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 25px rgba(124,58,237,0.5)' }}>
                  Get Started Free ✨
                </Link>
                <Link to="/internships"
                  className="px-8 py-3.5 rounded-xl font-semibold text-lg transition-all hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(168,85,247,0.3)', color: '#e9d5ff' }}>
                  Browse Internships →
                </Link>
              </>
            ) : (
              <Link to={user.role === 'admin' ? '/admin' : user.role === 'company' ? '/company' : '/student'}
                className="px-8 py-3.5 rounded-xl text-white font-semibold text-lg transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 25px rgba(124,58,237,0.5)' }}>
                Go to Dashboard →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const colors = ['#a855f7', '#f97316', '#22d3ee', '#4ade80'];
            return (
              <div key={s.label} className="glass p-6 text-center">
                <p className="text-3xl font-black mb-1" style={{ color: colors[i] }}>{s.value}</p>
                <p className="text-sm" style={{ color: '#c4b5fd' }}>{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Built for Everyone</h2>
            <p style={{ color: '#c4b5fd' }} className="max-w-xl mx-auto">One platform, three portals — each designed for a specific role in the internship ecosystem.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <Link key={f.title} to={f.link}
                className="glass p-6 hover:scale-105 transition-all cursor-pointer block"
                style={{ background: f.gradient, borderColor: f.border }}>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p style={{ color: '#e9d5ff' }} className="text-sm leading-relaxed">{f.desc}</p>
                <p className="text-sm mt-4 font-medium" style={{ color: f.accent }}>Learn more →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">How It Works</h2>
            <p style={{ color: '#c4b5fd' }}>A simple 5-step process from posting to certification.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { step: '01', icon: '📢', title: 'Company Posts', desc: 'Industry partners post internship opportunities', color: '#f97316' },
              { step: '02', icon: '🔍', title: 'Student Applies', desc: 'Students browse and submit applications', color: '#a855f7' },
              { step: '03', icon: '✅', title: 'Admin Reviews', desc: 'University admin oversees the process', color: '#22d3ee' },
              { step: '04', icon: '👨‍🏫', title: 'Supervisor Assigned', desc: 'Academic supervisor monitors the intern', color: '#4ade80' },
              { step: '05', icon: '🏆', title: 'Evaluation & Letter', desc: 'Performance evaluated, letter generated', color: '#f59e0b' },
            ].map((item) => (
              <div key={item.step} className="glass p-4 text-center">
                <div className="text-xs font-bold mb-2" style={{ color: item.color }}>{item.step}</div>
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-xs" style={{ color: '#c4b5fd' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Announcements ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">📣 Announcements</h2>
            <p style={{ color: '#c4b5fd' }}>Latest news from the IILMS platform.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {announcements.map((a, i) => {
              const accents = ['rgba(168,85,247,0.3)', 'rgba(249,115,22,0.3)', 'rgba(34,211,238,0.3)'];
              return (
                <div key={a.title} className="glass p-5 transition-all hover:scale-[1.02]"
                  style={{ borderColor: accents[i] }}>
                  <span className="text-xs font-medium" style={{ color: '#f97316' }}>{a.date}</span>
                  <h3 className="text-white font-semibold mt-1 mb-2">{a.title}</h3>
                  <p className="text-sm" style={{ color: '#c4b5fd' }}>{a.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials Carousel ── */}
      <section className="py-16">
        <div className="text-center mb-12 px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">💬 What People Say</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Trusted by students, companies, and universities across the country.</p>
        </div>

        {/* Infinite scroll carousel — duplicated for seamless loop */}
        <div className="testimonials-wrapper">
          <div className="testimonials-track">
            {/* Render twice for seamless infinite loop */}
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div
                key={idx}
                className="glass flex flex-col border border-white/10 hover:border-blue-500/30"
                style={{ minWidth: '320px', maxWidth: '320px', padding: '1.5rem' }}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                {/* Quote */}
                <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">"{t.text}"</p>
                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center text-xl border border-white/10 shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                    <p className="text-blue-400 text-xs">{t.university || t.company}</p>
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
            style={{ borderColor: 'rgba(168,85,247,0.3)', background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(249,115,22,0.1))' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="mb-8" style={{ color: '#c4b5fd' }}>Join thousands of students and companies already using IILMS.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?role=student"
                className="px-6 py-3 rounded-xl text-white font-semibold hover:scale-105 transition-all"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
                🎓 Register as Student
              </Link>
              <Link to="/register?role=company"
                className="px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all"
                style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,179,8,0.15))', border: '1px solid rgba(249,115,22,0.4)', color: '#fed7aa' }}>
                🏢 Register as Company
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import api from '../../api/axios';
import { formatDate } from '../../utils/formatDate';

// ── Harvard CV CSS (injected into print window) ──────────────────────────────
const HARVARD_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 11pt;
    color: #000000;
    background: #ffffff;
    line-height: 1.4;
  }
  .page {
    max-width: 750px;
    margin: 0 auto;
    padding: 36pt 48pt;
  }
  /* ── Header ── */
  .cv-name {
    font-size: 20pt;
    font-weight: bold;
    text-align: center;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 4pt;
  }
  .cv-contact {
    text-align: center;
    font-size: 10pt;
    color: #333;
    margin-bottom: 2pt;
  }
  .cv-contact a { color: #000; text-decoration: none; }
  /* ── Divider ── */
  .divider {
    border: none;
    border-top: 1.5pt solid #000;
    margin: 8pt 0 6pt;
  }
  .divider-thin {
    border: none;
    border-top: 0.5pt solid #999;
    margin: 4pt 0;
  }
  /* ── Section ── */
  .section-title {
    font-size: 11pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 6pt;
    margin-top: 10pt;
  }
  /* ── Entry ── */
  .entry { margin-bottom: 8pt; }
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .entry-title { font-weight: bold; font-size: 11pt; }
  .entry-date { font-size: 10pt; color: #333; white-space: nowrap; }
  .entry-sub {
    font-style: italic;
    font-size: 10.5pt;
    color: #333;
    margin-top: 1pt;
  }
  .entry-body { font-size: 10.5pt; margin-top: 3pt; }
  /* ── Bullet list ── */
  ul.cv-list {
    list-style: disc;
    padding-left: 16pt;
    margin-top: 3pt;
  }
  ul.cv-list li { font-size: 10.5pt; margin-bottom: 2pt; }
  /* ── Skills ── */
  .skills-row { font-size: 10.5pt; margin-bottom: 3pt; }
  .skills-label { font-weight: bold; }
  /* ── Score badge ── */
  .score-inline { font-weight: bold; }
  /* ── Footer ── */
  .cv-footer {
    margin-top: 20pt;
    text-align: center;
    font-size: 9pt;
    color: #999;
    border-top: 0.5pt solid #ccc;
    padding-top: 6pt;
  }
  @media print {
    body { -webkit-print-color-adjust: exact; }
    .page { padding: 20pt 36pt; }
  }
`;

export default function MyCV() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    Promise.all([
      api.get('/profile/me'),
      api.get('/applications/my'),
      api.get('/evaluations/my'),
    ]).then(([p, a, e]) => {
      setProfile(p.data.data);
      setApplications(a.data.data || []);
      setEvaluations(e.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  function handlePrint() {
    const win = window.open('', '_blank', 'width=900,height=700');
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>CV — ${profile?.full_name || 'Student'}</title>
        <style>${HARVARD_CSS}</style>
      </head>
      <body>
        <div class="page">
          ${printRef.current.innerHTML}
        </div>
      </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 600);
  }

  if (loading) return <div className="text-center py-20" style={{ color: '#6B7280' }}>Loading CV...</div>;
  if (!profile) return <div className="text-center py-20" style={{ color: '#DC2626' }}>Failed to load profile.</div>;

  const p = profile.profile || {};
  const acceptedApps = applications.filter(a => a.status === 'accepted');
  const avgScore = evaluations.length
    ? (evaluations.reduce((s, e) => s + Number(e.score), 0) / evaluations.length).toFixed(1)
    : null;

  const skills = p.skills ? p.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1E1B4B' }}>My CV / Resume</h1>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
            Harvard-style template · Auto-filled from your profile
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl text-white font-semibold flex items-center gap-2 hover:scale-105 transition-all"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', boxShadow: '0 4px 16px rgba(79,70,229,0.3)' }}>
            🖨️ Download / Print PDF
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="glass p-4 rounded-xl mb-6 flex gap-3 items-start"
        style={{ background: '#EEF2FF', borderColor: '#C7D2FE' }}>
        <span className="text-xl">💡</span>
        <div className="text-sm" style={{ color: '#374151' }}>
          <strong style={{ color: '#4F46E5' }}>Tips:</strong> Click <strong>Download / Print PDF</strong> to open the print dialog — select "Save as PDF" as the destination.
          Update your profile to add more details (skills, GPA, LinkedIn, bio) that will appear in the CV.
        </div>
      </div>

      {/* CV Preview — Harvard style */}
      <div className="glass rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
        <div className="p-4 flex items-center gap-2" style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
          <span className="text-sm font-medium" style={{ color: '#6B7280' }}>Preview</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#EEF2FF', color: '#4F46E5' }}>Harvard Format</span>
        </div>

        {/* The actual CV content — this gets printed */}
        <div ref={printRef} style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: '11pt',
          color: '#000',
          padding: '36pt 48pt',
          maxWidth: '750px',
          margin: '0 auto',
          lineHeight: '1.4',
          background: '#fff',
        }}>

          {/* ── NAME & CONTACT ── */}
          <div style={{ textAlign: 'center', marginBottom: '4pt' }}>
            <div style={{ fontSize: '20pt', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
              {p.first_name || ''} {p.last_name || profile.full_name}
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '10pt', color: '#333', marginBottom: '2pt' }}>
            {[
              profile.email,
              profile.phone,
              p.linkedin_url,
              p.university && `${p.university}${p.university_id ? ` · ID: ${p.university_id}` : ''}`,
            ].filter(Boolean).join('  |  ')}
          </div>

          <hr style={{ border: 'none', borderTop: '1.5pt solid #000', margin: '8pt 0 6pt' }} />

          {/* ── OBJECTIVE / SUMMARY ── */}
          {profile.bio && (
            <>
              <div style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6pt' }}>
                Objective
              </div>
              <div style={{ fontSize: '10.5pt', marginBottom: '8pt' }}>{profile.bio}</div>
              <hr style={{ border: 'none', borderTop: '0.5pt solid #999', margin: '4pt 0 8pt' }} />
            </>
          )}

          {/* ── EDUCATION ── */}
          {p.university && (
            <>
              <div style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6pt' }}>
                Education
              </div>
              <div style={{ marginBottom: '8pt' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '11pt' }}>{p.university}</span>
                  <span style={{ fontSize: '10pt', color: '#333' }}>Current</span>
                </div>
                <div style={{ fontStyle: 'italic', fontSize: '10.5pt', color: '#333', marginTop: '1pt' }}>
                  Undergraduate Student
                  {p.gpa ? ` · GPA: ${p.gpa}` : ''}
                  {p.university_id ? ` · Student ID: ${p.university_id}` : ''}
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '0.5pt solid #999', margin: '4pt 0 8pt' }} />
            </>
          )}

          {/* ── INTERNSHIP EXPERIENCE ── */}
          {acceptedApps.length > 0 && (
            <>
              <div style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6pt' }}>
                Internship Experience
              </div>
              {acceptedApps.map(a => {
                const ev = evaluations.find(e => e.application_id === a.id);
                return (
                  <div key={a.id} style={{ marginBottom: '10pt' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '11pt' }}>{a.internship_title}</span>
                      <span style={{ fontSize: '10pt', color: '#333' }}>{formatDate(a.applied_at)}</span>
                    </div>
                    <div style={{ fontStyle: 'italic', fontSize: '10.5pt', color: '#333', marginTop: '1pt' }}>
                      {a.company_name}
                    </div>
                    {ev && (
                      <ul style={{ listStyle: 'disc', paddingLeft: '16pt', marginTop: '3pt' }}>
                        <li style={{ fontSize: '10.5pt' }}>
                          Performance score: <strong>{ev.score}/100</strong>
                          {ev.feedback ? ` — ${ev.feedback}` : ''}
                        </li>
                      </ul>
                    )}
                  </div>
                );
              })}
              <hr style={{ border: 'none', borderTop: '0.5pt solid #999', margin: '4pt 0 8pt' }} />
            </>
          )}

          {/* ── SKILLS ── */}
          {skills.length > 0 && (
            <>
              <div style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6pt' }}>
                Skills
              </div>
              <div style={{ fontSize: '10.5pt', marginBottom: '8pt' }}>
                <span style={{ fontWeight: 'bold' }}>Technical Skills: </span>
                {skills.join(', ')}
              </div>
              <hr style={{ border: 'none', borderTop: '0.5pt solid #999', margin: '4pt 0 8pt' }} />
            </>
          )}

          {/* ── APPLICATIONS SUMMARY ── */}
          {applications.length > 0 && (
            <>
              <div style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6pt' }}>
                Internship Applications
              </div>
              {applications.map(a => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5pt', marginBottom: '3pt' }}>
                  <span>{a.internship_title} — {a.company_name}</span>
                  <span style={{ fontStyle: 'italic', color: '#555' }}>{a.status}</span>
                </div>
              ))}
              <hr style={{ border: 'none', borderTop: '0.5pt solid #999', margin: '4pt 0 8pt' }} />
            </>
          )}

          {/* ── ADDITIONAL INFO ── */}
          <div style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6pt' }}>
            Additional Information
          </div>
          <div style={{ fontSize: '10.5pt' }}>
            {p.sex && p.sex !== 'prefer_not_to_say' && (
              <div><span style={{ fontWeight: 'bold' }}>Gender: </span>{p.sex}</div>
            )}
            {avgScore && (
              <div><span style={{ fontWeight: 'bold' }}>Average Internship Score: </span>{avgScore}/100</div>
            )}
            {p.linkedin_url && (
              <div><span style={{ fontWeight: 'bold' }}>LinkedIn: </span>{p.linkedin_url}</div>
            )}
          </div>

          {/* Footer */}
          <div style={{ marginTop: '24pt', textAlign: 'center', fontSize: '9pt', color: '#999', borderTop: '0.5pt solid #ccc', paddingTop: '6pt' }}>
            Generated by IILMS · {new Date().toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Profile completeness tips */}
      <div className="glass p-5 rounded-xl mt-6" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
        <h3 className="font-bold mb-3" style={{ color: '#1E1B4B' }}>📋 CV Completeness</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: 'Name',        done: !!(p.first_name || profile.full_name) },
            { label: 'Email',       done: !!profile.email },
            { label: 'Phone',       done: !!profile.phone },
            { label: 'University',  done: !!p.university },
            { label: 'Student ID',  done: !!p.university_id },
            { label: 'GPA',         done: !!p.gpa },
            { label: 'Bio/Summary', done: !!profile.bio },
            { label: 'Skills',      done: skills.length > 0 },
            { label: 'LinkedIn',    done: !!p.linkedin_url },
            { label: 'Internship',  done: acceptedApps.length > 0 },
            { label: 'Evaluation',  done: evaluations.length > 0 },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              <span>{item.done ? '✅' : '⬜'}</span>
              <span style={{ color: item.done ? '#059669' : '#9CA3AF' }}>{item.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: '#6B7280' }}>
          Go to <strong>My Profile</strong> to fill in missing information and improve your CV.
        </p>
      </div>
    </div>
  );
}

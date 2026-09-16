import Navbar from '../../components/Navbar';

const candidate = {
  name: 'Priya Sharma',
  email: 'priya@example.com',
  phone: '9876543210',
  region: 'Maharashtra',
  sector: 'IT/Digital',
  employmentStatus: 'placed',
  currentEmployer: 'Infosys BPM',
  placedDate: '15 Mar 2024',
  skills: ['SEO', 'Social Media Marketing', 'Google Ads', 'Content Writing', 'Analytics'],
  certifications: [
    { name: 'Digital Marketing Fundamentals', issuer: 'NSDC', year: 2024 },
    { name: 'Google Analytics Certified', issuer: 'Google', year: 2024 },
  ],
  programs: [{ name: 'Digital Marketing Fundamentals', institute: 'NSDC Institute', duration: '3 months', completedOn: 'Feb 2024' }],
};

const statusConfig = {
  placed: { label: '✅ Placed', color: '#059669', bg: '#d1fae5' },
  not_placed: { label: '🔍 Seeking Work', color: '#d97706', bg: '#fef3c7' },
  self_employed: { label: '💼 Self Employed', color: '#4f46e5', bg: '#e0e7ff' },
  pursuing_education: { label: '📚 Studying', color: '#7c3aed', bg: '#ede9fe' },
};

export default function CandidateDashboard() {
  const status = statusConfig[candidate.employmentStatus];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Navbar title="My Skill Passport" />
      <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>

        {/* Profile Header */}
        <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>
              {candidate.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700 }}>{candidate.name}</h2>
              <p style={{ opacity: 0.85, marginTop: 4 }}>{candidate.email} • {candidate.phone}</p>
              <p style={{ opacity: 0.75, fontSize: 13, marginTop: 2 }}>📍 {candidate.region} · {candidate.sector}</p>
            </div>
            <div style={{ background: status.bg, color: status.color, padding: '8px 18px', borderRadius: 20, fontWeight: 600, fontSize: 14 }}>
              {status.label}
            </div>
          </div>
          {candidate.employmentStatus === 'placed' && (
            <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 32 }}>
              <div><p style={{ opacity: 0.75, fontSize: 12 }}>Current Employer</p><p style={{ fontWeight: 600 }}>{candidate.currentEmployer}</p></div>
              <div><p style={{ opacity: 0.75, fontSize: 12 }}>Placed On</p><p style={{ fontWeight: 600 }}>{candidate.placedDate}</p></div>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          {/* Skills */}
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>🛠️ My Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {candidate.skills.map(skill => (
                <span key={skill} style={{ background: '#ede9fe', color: '#5b21b6', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500 }}>
                  {skill}
                </span>
              ))}
            </div>
            <button className="btn-primary" style={{ marginTop: 16, padding: '8px 16px', fontSize: 13 }}>+ Add Skill</button>
          </div>

          {/* Certifications */}
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>🏆 Certifications</h3>
            {candidate.certifications.map((cert, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: 12, background: '#f8f7ff', borderRadius: 8 }}>
                <span style={{ fontSize: 24 }}>🎖️</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{cert.name}</p>
                  <p style={{ color: '#6b7280', fontSize: 12 }}>{cert.issuer} · {cert.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training History */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>📚 Training History</h3>
          {candidate.programs.map((prog, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#f8f7ff', borderRadius: 10, border: '1px solid #e0e7ff' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <span style={{ fontSize: 28 }}>🏫</span>
                <div>
                  <p style={{ fontWeight: 600 }}>{prog.name}</p>
                  <p style={{ color: '#6b7280', fontSize: 13 }}>{prog.institute} · {prog.duration}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-green">✅ Completed</span>
                <p style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>{prog.completedOn}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Employment Timeline */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>📅 Employment Journey</h3>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
            {[
              { label: 'Enrolled', date: 'Nov 2023', icon: '📝', done: true },
              { label: 'Training', date: 'Nov–Feb', icon: '📚', done: true },
              { label: 'Completed', date: 'Feb 2024', icon: '🎓', done: true },
              { label: 'Placed', date: 'Mar 2024', icon: '✅', done: true },
              { label: 'Review (6m)', date: 'Sep 2024', icon: '🔍', done: false },
            ].map((step, i, arr) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  {i > 0 && <div style={{ flex: 1, height: 2, background: step.done ? '#4f46e5' : '#e5e7eb' }} />}
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: step.done ? '#4f46e5' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{step.icon}</div>
                  {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: arr[i+1]?.done ? '#4f46e5' : '#e5e7eb' }} />}
                </div>
                <p style={{ fontSize: 12, fontWeight: 600, marginTop: 8, color: step.done ? '#4f46e5' : '#9ca3af' }}>{step.label}</p>
                <p style={{ fontSize: 11, color: '#9ca3af' }}>{step.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import Navbar from '../../components/Navbar';

const candidates = [
  { id: 1, name: 'Priya Sharma', sector: 'IT/Digital', skills: ['SEO', 'Social Media', 'Google Ads'], region: 'Maharashtra', status: 'placed', score: 92, program: 'Digital Marketing', placedAt: 'Infosys BPM' },
  { id: 2, name: 'Suresh Singh', sector: 'Retail', skills: ['Customer Service', 'POS Systems', 'Inventory'], region: 'Delhi', status: 'placed', score: 85, program: 'Retail Sales', placedAt: 'Big Bazaar' },
  { id: 3, name: 'Anita Patel', sector: 'Healthcare', skills: ['Patient Care', 'First Aid'], region: 'Tamil Nadu', status: 'not_placed', score: 78, program: 'Healthcare Assistant', placedAt: null },
  { id: 4, name: 'Meena Rao', sector: 'IT/Digital', skills: ['Google Ads', 'Analytics', 'Social Media'], region: 'Karnataka', status: 'not_placed', score: 88, program: 'Digital Marketing', placedAt: null },
  { id: 5, name: 'Kiran Joshi', sector: 'Manufacturing', skills: ['Arc Welding', 'Safety', 'MIG'], region: 'Gujarat', status: 'not_placed', score: 81, program: 'Welding', placedAt: null },
];

const jobPostings = [
  { id: 1, title: 'Digital Marketing Executive', requiredSkills: ['SEO', 'Social Media', 'Google Ads'], sector: 'IT/Digital', openings: 3 },
  { id: 2, title: 'Retail Associate', requiredSkills: ['Customer Service', 'POS Systems'], sector: 'Retail', openings: 5 },
  { id: 3, title: 'Healthcare Aide', requiredSkills: ['Patient Care', 'First Aid'], sector: 'Healthcare', openings: 2 },
];

export default function EmployerDashboard() {
  const [selectedSector, setSelectedSector] = useState('All');
  const [hiredIds, setHiredIds] = useState([1, 2]);

  const sectors = ['All', 'IT/Digital', 'Retail', 'Healthcare', 'Manufacturing'];
  const filtered = selectedSector === 'All' ? candidates : candidates.filter(c => c.sector === selectedSector);

  const handleHire = (id) => setHiredIds(prev => [...prev, id]);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Navbar title="Employer Dashboard" />
      <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total Candidates', value: candidates.length, color: '#4f46e5', icon: '👥' },
            { label: 'Hired by Us', value: hiredIds.length, color: '#059669', icon: '✅' },
            { label: 'Open Positions', value: jobPostings.reduce((a, j) => a + j.openings, 0), color: '#d97706', icon: '💼' },
            { label: 'Skill Match Rate', value: '84%', color: '#7c3aed', icon: '🎯' },
          ].map(k => (
            <div key={k.label} className="card" style={{ borderLeft: `4px solid ${k.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: 13 }}>{k.label}</p>
                  <p style={{ fontSize: 28, fontWeight: 700, color: k.color, marginTop: 4 }}>{k.value}</p>
                </div>
                <span style={{ fontSize: 28 }}>{k.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          {/* Candidates */}
          <div>
            {/* Filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {sectors.map(s => (
                <button key={s} onClick={() => setSelectedSector(s)}
                  style={{ padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: selectedSector === s ? '#4f46e5' : 'white', color: selectedSector === s ? 'white' : '#374151', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  {s}
                </button>
              ))}
            </div>

            <div className="card">
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>🔍 Available Candidates</h3>
              {filtered.map(c => (
                <div key={c.id} style={{ padding: '16px', marginBottom: 12, background: '#f8f7ff', borderRadius: 10, border: '1px solid #e0e7ff', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                    {c.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <p style={{ fontWeight: 600 }}>{c.name}</p>
                      <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>Score: {c.score}</span>
                      {hiredIds.includes(c.id) && <span className="badge badge-green">✅ Hired by us</span>}
                    </div>
                    <p style={{ color: '#6b7280', fontSize: 13 }}>📍 {c.region} · {c.program}</p>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                      {c.skills.map(s => <span key={s} style={{ background: '#ede9fe', color: '#6d28d9', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>{s}</span>)}
                    </div>
                  </div>
                  {!hiredIds.includes(c.id) && c.status === 'not_placed' ? (
                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13, flexShrink: 0 }} onClick={() => handleHire(c.id)}>Hire ✓</button>
                  ) : hiredIds.includes(c.id) ? null : (
                    <span style={{ color: '#9ca3af', fontSize: 12, flexShrink: 0 }}>Already placed</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Job Postings */}
          <div>
            <div className="card">
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>💼 My Job Postings</h3>
              {jobPostings.map(job => (
                <div key={job.id} style={{ marginBottom: 16, padding: 14, background: '#f0fdf4', borderRadius: 10, border: '1px solid #d1fae5' }}>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{job.title}</p>
                  <p style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>{job.openings} openings · {job.sector}</p>
                  <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                    {job.requiredSkills.map(s => <span key={s} style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>{s}</span>)}
                  </div>
                </div>
              ))}
              <button className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: 13 }}>+ Post New Job</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

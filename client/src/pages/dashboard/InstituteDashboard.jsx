import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Navbar from '../../components/Navbar';

const programs = [
  { id: 1, name: 'Digital Marketing Fundamentals', sector: 'IT/Digital', duration: '3 months', enrolled: 120, completed: 105, placed: 88, status: 'completed' },
  { id: 2, name: 'Welding & Fabrication', sector: 'Manufacturing', duration: '6 months', enrolled: 80, completed: 72, placed: 60, status: 'completed' },
  { id: 3, name: 'Healthcare Assistant', sector: 'Healthcare', duration: '4 months', enrolled: 90, completed: 78, placed: 55, status: 'active' },
  { id: 4, name: 'Retail Sales Management', sector: 'Retail', duration: '2 months', enrolled: 150, completed: 130, placed: 112, status: 'completed' },
  { id: 5, name: 'Construction & Civil Works', sector: 'Construction', duration: '5 months', enrolled: 60, completed: 50, placed: 35, status: 'active' },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const pieData = [
  { name: 'Placed', value: 350, color: '#10b981' },
  { name: 'Not Placed', value: 85, color: '#ef4444' },
  { name: 'Self Employed', value: 45, color: '#f59e0b' },
  { name: 'In Education', value: 20, color: '#4f46e5' },
];

export default function InstituteDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [newProgram, setNewProgram] = useState({ name: '', sector: '', duration: '' });

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Navbar title="Institute Dashboard" />
      <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>Training Programs</h2>
            <p style={{ color: '#6b7280', marginTop: 4 }}>Manage programs & track placements</p>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ New Program</button>
        </div>

        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total Programs', value: 5, color: '#4f46e5', icon: '📚' },
            { label: 'Total Enrolled', value: 500, color: '#059669', icon: '👥' },
            { label: 'Placements', value: 350, color: '#d97706', icon: '✅' },
            { label: 'Avg Placement %', value: '71%', color: '#7c3aed', icon: '📈' },
          ].map((k) => (
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

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 28 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>📊 Program Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={programs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={10} tickFormatter={v => v.split(' ')[0]} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="enrolled" fill="#ddd6fe" name="Enrolled" radius={[3,3,0,0]} />
                <Bar dataKey="completed" fill="#818cf8" name="Completed" radius={[3,3,0,0]} />
                <Bar dataKey="placed" fill="#4f46e5" name="Placed" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>🎯 Outcome Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Programs Table */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>📋 All Programs</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                {['Program Name', 'Sector', 'Duration', 'Enrolled', 'Placed', 'Rate', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {programs.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: '12px' }}><span className="badge badge-blue">{p.sector}</span></td>
                  <td style={{ padding: '12px', color: '#6b7280' }}>{p.duration}</td>
                  <td style={{ padding: '12px' }}>{p.enrolled}</td>
                  <td style={{ padding: '12px', color: '#059669', fontWeight: 600 }}>{p.placed}</td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{Math.round((p.placed / p.completed) * 100)}%</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${p.status === 'active' ? 'badge-green' : 'badge-blue'}`}>
                      {p.status === 'active' ? '🟢 Active' : '✅ Completed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Program Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div className="card" style={{ width: 420, maxWidth: '90%' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>➕ Add New Program</h3>
            {['name', 'sector', 'duration'].map(field => (
              <div key={field} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 6, textTransform: 'capitalize' }}>{field}</label>
                <input value={newProgram[field]} onChange={e => setNewProgram({ ...newProgram, [field]: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Save Program</button>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

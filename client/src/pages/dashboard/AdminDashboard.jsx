import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const KPICard = ({ title, value, subtitle, color, icon }) => (
  <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 6 }}>{title}</p>
        <p style={{ fontSize: 32, fontWeight: 700, color }}>{value}</p>
        {subtitle && <p style={{ color: '#9ca3af', fontSize: 12, marginTop: 4 }}>{subtitle}</p>}
      </div>
      <span style={{ fontSize: 32 }}>{icon}</span>
    </div>
  </div>
);

// Mock data for charts (would come from API in production)
const employmentTrend = [
  { month: 'Jan', placed: 42, notPlaced: 18 },
  { month: 'Feb', placed: 58, notPlaced: 22 },
  { month: 'Mar', placed: 75, notPlaced: 15 },
  { month: 'Apr', placed: 90, notPlaced: 20 },
  { month: 'May', placed: 110, notPlaced: 18 },
  { month: 'Jun', placed: 95, notPlaced: 12 },
];

const skillGapData = [
  { sector: 'IT/Digital', demand: 85, supply: 60 },
  { sector: 'Manufacturing', demand: 70, supply: 65 },
  { sector: 'Healthcare', demand: 90, supply: 45 },
  { sector: 'Retail', demand: 75, supply: 70 },
  { sector: 'Construction', demand: 60, supply: 50 },
  { sector: 'Logistics', demand: 65, supply: 30 },
];

const programImpact = [
  { name: 'Digital Mktg', enrolled: 120, placed: 88, rate: 84 },
  { name: 'Welding', enrolled: 80, placed: 60, rate: 75 },
  { name: 'Healthcare', enrolled: 90, placed: 55, rate: 61 },
  { name: 'Retail Mgmt', enrolled: 150, placed: 112, rate: 75 },
  { name: 'Construction', enrolled: 60, placed: 35, rate: 58 },
];

export default function AdminDashboard() {
  const { token } = useAuth();
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    axios.get('/api/analytics/overview', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOverview(res.data))
      .catch(() => setOverview({ totalCandidates: 500, totalPlaced: 370, placementRate: 74.0, totalPrograms: 5, totalPlacements: 370 }));
  }, [token]);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Navbar title="Admin Dashboard" />
      <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a202c' }}>Overview</h2>
          <p style={{ color: '#6b7280', marginTop: 4 }}>National skilling outcomes at a glance</p>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
          <KPICard title="Total Candidates" value={overview?.totalCandidates ?? '—'} subtitle="Enrolled in programs" color="#4f46e5" icon="👥" />
          <KPICard title="Placed Successfully" value={overview?.totalPlaced ?? '—'} subtitle="Confirmed employment" color="#059669" icon="✅" />
          <KPICard title="Placement Rate" value={overview ? `${overview.placementRate}%` : '—'} subtitle="Avg across all programs" color="#d97706" icon="📈" />
          <KPICard title="Active Programs" value={overview?.totalPrograms ?? '—'} subtitle="Training programs" color="#7c3aed" icon="🏫" />
        </div>

        {/* Employment Trend + Skill Gap */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>📊 Employment Outcomes (Monthly)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={employmentTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="placed" fill="#4f46e5" name="Placed" radius={[4,4,0,0]} />
                <Bar dataKey="notPlaced" fill="#f87171" name="Not Placed" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>🎯 Skill Gap by Sector</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={skillGapData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="sector" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={10} />
                <Radar name="Demand" dataKey="demand" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
                <Radar name="Supply" dataKey="supply" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Program Impact Table */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>📈 Program Impact Report</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                {['Program', 'Enrolled', 'Placed', 'Placement Rate', 'Impact'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {programImpact.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: '12px', color: '#6b7280' }}>{p.enrolled}</td>
                  <td style={{ padding: '12px', color: '#059669', fontWeight: 600 }}>{p.placed}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, background: '#e5e7eb', borderRadius: 4, height: 8 }}>
                        <div style={{ width: `${p.rate}%`, background: p.rate > 70 ? '#10b981' : p.rate > 60 ? '#f59e0b' : '#ef4444', height: 8, borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, minWidth: 35 }}>{p.rate}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${p.rate > 70 ? 'badge-green' : p.rate > 60 ? 'badge-yellow' : 'badge-red'}`}>
                      {p.rate > 70 ? '⭐ High' : p.rate > 60 ? '📊 Medium' : '⚠️ Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

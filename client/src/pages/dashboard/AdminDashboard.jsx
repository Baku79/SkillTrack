import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

/* ── Static chart data ─────────────────────────────────── */
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

/* ── Helpers ───────────────────────────────────────────── */
const ROLE_CONFIG = {
  admin:     { color: '#4f46e5', bg: '#ede9fe', icon: '🏛️', label: 'Admin' },
  institute: { color: '#059669', bg: '#d1fae5', icon: '🏫', label: 'Institute' },
  candidate: { color: '#d97706', bg: '#fef3c7', icon: '👤', label: 'Candidate' },
  employer:  { color: '#dc2626', bg: '#fee2e2', icon: '🏢', label: 'Employer' },
};

const LOG_CONFIG = {
  REGISTER:   { color: '#059669', bg: '#d1fae5', icon: '✨', label: 'Registered' },
  LOGIN:      { color: '#4f46e5', bg: '#ede9fe', icon: '🔑', label: 'Logged In' },
  LOGIN_FAIL: { color: '#dc2626', bg: '#fee2e2', icon: '⚠️', label: 'Login Failed' },
};

const fmt = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

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

/* ── Main Component ────────────────────────────────────── */
export default function AdminDashboard() {
  const { token } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [overview, setOverview] = useState({ totalCandidates: 500, totalPlaced: 370, placementRate: '74.0', totalPrograms: 5 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    // Load analytics overview
    axios.get('/api/analytics/overview', { headers }).then(r => setOverview(r.data)).catch(() => {});
    // Load users & logs
    axios.get('/api/users', { headers }).then(r => setUsers(r.data)).catch(() => {});
    axios.get('/api/users/logs', { headers }).then(r => setLogs(r.data)).catch(() => {});
  }, []);

  const navItems = [
    { key: 'overview', icon: '📊', label: 'Overview' },
    { key: 'users', icon: '👥', label: 'User Database' },
    { key: 'logs', icon: '📋', label: 'Activity Logs' },
    { key: 'programs', icon: '📚', label: 'Programs' },
    { key: 'skillgap', icon: '🎯', label: 'Skill Gaps' },
  ];

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', flexDirection: 'column' }}>
      <Navbar title="Admin Dashboard" />
      <div style={{ display: 'flex', flex: 1 }}>

        {/* ── Sidebar ─────────────────────────────────── */}
        <aside style={{ width: 220, background: 'white', borderRight: '1px solid #e5e7eb', padding: '24px 12px', position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, padding: '0 12px', marginBottom: 12 }}>Navigation</p>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setActiveSection(item.key)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 4, fontWeight: 600, fontSize: 14, transition: 'all 0.15s',
                background: activeSection === item.key ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                color: activeSection === item.key ? 'white' : '#374151' }}>
              <span>{item.icon}</span> {item.label}
              {item.key === 'users' && users.length > 0 && (
                <span style={{ marginLeft: 'auto', background: activeSection === item.key ? 'rgba(255,255,255,0.3)' : '#ede9fe', color: activeSection === item.key ? 'white' : '#4f46e5', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>{users.length}</span>
              )}
              {item.key === 'logs' && logs.length > 0 && (
                <span style={{ marginLeft: 'auto', background: activeSection === item.key ? 'rgba(255,255,255,0.3)' : '#fef3c7', color: activeSection === item.key ? 'white' : '#d97706', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>{logs.length}</span>
              )}
            </button>
          ))}
        </aside>

        {/* ── Main Content ─────────────────────────────── */}
        <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>

          {/* ── OVERVIEW ─────────────────────────────── */}
          {activeSection === 'overview' && (
            <>
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700 }}>National Overview</h2>
                <p style={{ color: '#6b7280', marginTop: 4 }}>Skilling outcomes at a glance</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 32 }}>
                <KPICard title="Total Candidates" value={overview.totalCandidates} subtitle="Enrolled in programs" color="#4f46e5" icon="👥" />
                <KPICard title="Successfully Placed" value={overview.totalPlaced} subtitle="Verified employment" color="#059669" icon="✅" />
                <KPICard title="Placement Rate" value={`${overview.placementRate}%`} subtitle="All programs avg" color="#d97706" icon="📈" />
                <KPICard title="Active Programs" value={overview.totalPrograms} subtitle="Training programs" color="#7c3aed" icon="🏫" />
                <KPICard title="Registered Users" value={users.length} subtitle="On this platform" color="#0891b2" icon="🪪" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div className="card">
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>📊 Monthly Placement Outcomes</h3>
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
              <div className="card">
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>📈 Program Impact Report</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    {['Program', 'Enrolled', 'Placed', 'Rate', 'Impact'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{programImpact.map((p, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px', fontWeight: 500 }}>{p.name}</td>
                      <td style={{ padding: '12px', color: '#6b7280' }}>{p.enrolled}</td>
                      <td style={{ padding: '12px', color: '#059669', fontWeight: 600 }}>{p.placed}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: 4, height: 8 }}>
                            <div style={{ width: `${p.rate}%`, background: p.rate > 70 ? '#10b981' : p.rate > 60 ? '#f59e0b' : '#ef4444', height: 8, borderRadius: 4 }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700 }}>{p.rate}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${p.rate > 70 ? 'badge-green' : p.rate > 60 ? 'badge-yellow' : 'badge-red'}`}>
                          {p.rate > 70 ? '⭐ High' : p.rate > 60 ? '📊 Medium' : '⚠️ Low'}
                        </span>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </>
          )}

          {/* ── USER DATABASE ─────────────────────────── */}
          {activeSection === 'users' && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700 }}>👥 User Database</h2>
                <p style={{ color: '#6b7280', marginTop: 4 }}>All registered users on SkillTrack — their details and activity</p>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {Object.entries(ROLE_CONFIG).map(([role, cfg]) => {
                  const count = users.filter(u => u.role === role).length;
                  return (
                    <div key={role} className="card" style={{ borderTop: `3px solid ${cfg.color}`, textAlign: 'center' }}>
                      <span style={{ fontSize: 28 }}>{cfg.icon}</span>
                      <p style={{ fontSize: 28, fontWeight: 700, color: cfg.color, marginTop: 4 }}>{count}</p>
                      <p style={{ color: '#6b7280', fontSize: 13 }}>{cfg.label}s</p>
                    </div>
                  );
                })}
              </div>

              {/* Search + Filter */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by name or email..."
                    style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none' }} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['all', 'admin', 'institute', 'candidate', 'employer'].map(r => (
                      <button key={r} onClick={() => setRoleFilter(r)}
                        style={{ padding: '8px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                          background: roleFilter === r ? '#4f46e5' : '#f3f4f6',
                          color: roleFilter === r ? 'white' : '#374151' }}>
                        {r === 'all' ? 'All' : ROLE_CONFIG[r].icon + ' ' + ROLE_CONFIG[r].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="card">
                {users.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <span style={{ fontSize: 60 }}>👥</span>
                    <h3 style={{ fontSize: 20, fontWeight: 700, marginTop: 16, color: '#374151' }}>No Users Yet</h3>
                    <p style={{ color: '#6b7280', marginTop: 8 }}>Users will appear here when they register on SkillTrack.</p>
                    <a href="/login" style={{ display: 'inline-block', marginTop: 16, padding: '10px 24px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                      Register First User →
                    </a>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                      <thead>
                        <tr style={{ background: '#f8f7ff', borderRadius: 10 }}>
                          {['#', 'Name', 'Email', 'Role', 'Phone', 'Organization', 'Region', 'Joined', 'Last Login', 'Logins'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u, i) => {
                          const cfg = ROLE_CONFIG[u.role] || ROLE_CONFIG.candidate;
                          return (
                            <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}
                              onMouseOver={e => e.currentTarget.style.background = '#fafafa'}
                              onMouseOut={e => e.currentTarget.style.background = 'white'}>
                              <td style={{ padding: '12px', color: '#9ca3af', fontSize: 13 }}>{i + 1}</td>
                              <td style={{ padding: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${cfg.color}, #7c3aed)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                                    {u.name?.[0]?.toUpperCase() || '?'}
                                  </div>
                                  <span style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</span>
                                </div>
                              </td>
                              <td style={{ padding: '12px', fontSize: 13, color: '#6b7280' }}>{u.email}</td>
                              <td style={{ padding: '12px' }}>
                                <span style={{ background: cfg.bg, color: cfg.color, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                                  {cfg.icon} {cfg.label}
                                </span>
                              </td>
                              <td style={{ padding: '12px', fontSize: 13, color: '#6b7280' }}>{u.phone || '—'}</td>
                              <td style={{ padding: '12px', fontSize: 13, color: '#6b7280' }}>{u.organization || '—'}</td>
                              <td style={{ padding: '12px', fontSize: 13, color: '#6b7280' }}>{u.region || '—'}</td>
                              <td style={{ padding: '12px', fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>{fmt(u.createdAt)}</td>
                              <td style={{ padding: '12px', fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>{fmt(u.lastLogin)}</td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <span style={{ background: '#ede9fe', color: '#4f46e5', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{u.loginCount || 0}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 12, padding: '0 4px' }}>
                      Showing {filteredUsers.length} of {users.length} users
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── ACTIVITY LOGS ─────────────────────────── */}
          {activeSection === 'logs' && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700 }}>📋 Activity Logs</h2>
                <p style={{ color: '#6b7280', marginTop: 4 }}>Real-time log of all registrations, logins, and failed attempts</p>
              </div>
              <div className="card">
                {logs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <span style={{ fontSize: 60 }}>📋</span>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 16 }}>No Activity Yet</h3>
                    <p style={{ color: '#6b7280', marginTop: 8 }}>Logs will appear when users register or log in.</p>
                  </div>
                ) : (
                  <div>
                    {logs.map((log, i) => {
                      const cfg = LOG_CONFIG[log.type] || LOG_CONFIG.LOGIN;
                      return (
                        <div key={log.id || i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #f3f4f6' }}>
                          <div style={{ width: 38, height: 38, borderRadius: '50%', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{cfg.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <p style={{ fontWeight: 600, fontSize: 14 }}>{log.userName || log.userEmail}</p>
                              <span style={{ background: cfg.bg, color: cfg.color, padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{cfg.label}</span>
                              {log.userRole && <span style={{ background: ROLE_CONFIG[log.userRole]?.bg, color: ROLE_CONFIG[log.userRole]?.color, padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{ROLE_CONFIG[log.userRole]?.icon} {ROLE_CONFIG[log.userRole]?.label}</span>}
                            </div>
                            <p style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>{log.userEmail} · {log.action}</p>
                          </div>
                          <p style={{ color: '#9ca3af', fontSize: 12, whiteSpace: 'nowrap' }}>{fmt(log.timestamp)}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── PROGRAMS ──────────────────────────────── */}
          {activeSection === 'programs' && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700 }}>📚 Training Programs</h2>
                <p style={{ color: '#6b7280', marginTop: 4 }}>All active and completed programs across institutes</p>
              </div>
              <div className="card">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={programImpact}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="enrolled" fill="#ddd6fe" name="Enrolled" radius={[4,4,0,0]} />
                    <Bar dataKey="placed" fill="#4f46e5" name="Placed" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {/* ── SKILL GAP ─────────────────────────────── */}
          {activeSection === 'skillgap' && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700 }}>🎯 Skill Gap Analysis</h2>
                <p style={{ color: '#6b7280', marginTop: 4 }}>Demand vs supply across sectors — identifying where training falls short</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="card">
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Sector Radar Analysis</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={skillGapData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="sector" fontSize={11} />
                      <PolarRadiusAxis domain={[0, 100]} fontSize={10} />
                      <Radar name="Demand" dataKey="demand" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                      <Radar name="Supply" dataKey="supply" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card">
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Gap by Sector</h3>
                  {skillGapData.map(s => {
                    const gap = s.demand - s.supply;
                    return (
                      <div key={s.sector} style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 500 }}>{s.sector}</span>
                          <span style={{ fontSize: 13, color: gap > 30 ? '#dc2626' : gap > 15 ? '#d97706' : '#059669', fontWeight: 700 }}>Gap: {gap}pts</span>
                        </div>
                        <div style={{ background: '#e5e7eb', borderRadius: 6, height: 10, position: 'relative' }}>
                          <div style={{ width: `${s.supply}%`, background: '#10b981', height: 10, borderRadius: 6, position: 'absolute' }} />
                          <div style={{ width: `${s.demand}%`, background: 'rgba(79,70,229,0.3)', height: 10, borderRadius: 6, position: 'absolute', border: '2px solid #4f46e5' }} />
                        </div>
                        <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                          <span style={{ fontSize: 11, color: '#6b7280' }}>Supply: {s.supply}%</span>
                          <span style={{ fontSize: 11, color: '#4f46e5' }}>Demand: {s.demand}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

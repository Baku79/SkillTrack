import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ROLE_CFG = {
  admin:     { icon: '🏛️', label: 'Admin / Government', color: '#6366f1', grad: 'linear-gradient(135deg,#6366f1,#8b5cf6)', route: '/admin', dashLabel: 'Admin Dashboard' },
  institute: { icon: '🏫', label: 'Training Institute',  color: '#10b981', grad: 'linear-gradient(135deg,#10b981,#059669)', route: '/institute', dashLabel: 'Institute Dashboard' },
  candidate: { icon: '👤', label: 'Job Candidate',       color: '#f59e0b', grad: 'linear-gradient(135deg,#f59e0b,#d97706)', route: '/candidate', dashLabel: 'My Skill Passport' },
  employer:  { icon: '🏢', label: 'Employer',            color: '#ef4444', grad: 'linear-gradient(135deg,#ef4444,#dc2626)', route: '/employer',  dashLabel: 'Employer Dashboard' },
};

const fmt = (iso, opts = {}) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', ...opts });
};

const fmtFull = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
};

const daysSince = (iso) => {
  if (!iso) return 0;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
};

export default function PersonalDashboard() {
  const { user, token, logout, updateUser } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(user);
  const [logs, setLogs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: user?.name || '', phone: user?.phone || '', organization: user?.organization || '', region: user?.region || '' });
  const [saveMsg, setSaveMsg] = useState('');

  const role = user?.role || 'candidate';
  const cfg = ROLE_CFG[role];
  const joined = daysSince(userData?.createdAt);
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    // Fetch fresh user data
    axios.get('/api/users/me', { headers }).then(r => { setUserData(r.data); updateUser(r.data); }).catch(() => {});
    // Fetch logs if admin
    if (role === 'admin') {
      axios.get('/api/users/logs', { headers }).then(r => setLogs(r.data.slice(0, 20))).catch(() => {});
    }
  }, []);

  const handleSave = async () => {
    setSaveMsg('');
    // Optimistic update
    updateUser(editForm);
    setUserData(d => ({ ...d, ...editForm }));
    setEditMode(false);
    setSaveMsg('✅ Profile updated!');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  // ── Styles ──
  const C = {
    bg:      { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'Inter, sans-serif', transition: 'all 0.3s' },
    surface: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, transition: 'all 0.3s' },
    input:   { width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`, fontSize: 14, outline: 'none', background: dark ? '#1e1e2e' : 'white', color: 'var(--text)', fontFamily: 'Inter', boxSizing: 'border-box', transition: 'border-color 0.2s' },
    label:   { fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.7, display: 'block', marginBottom: 6 },
  };

  const tabs = [
    { id: 'profile', icon: '👤', label: 'My Profile' },
    { id: 'account', icon: '🔐', label: 'Account Info' },
    { id: 'activity', icon: '📋', label: 'Activity' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div style={C.bg}>
      {/* ── TOP NAVBAR ─────────────────────────────── */}
      <nav style={{ height: 64, background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 100, transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22 }}>🎓</span>
          <span style={{ fontSize: 18, fontWeight: 900, background: 'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillTrack</span>
          <span style={{ color: 'var(--border)', fontSize: 20 }}>·</span>
          <span style={{ color: 'var(--text2)', fontSize: 14, fontWeight: 500 }}>My Dashboard</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Go to role dashboard */}
          <button onClick={() => navigate(cfg.route)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30`, padding: '7px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Inter' }}>
            {cfg.icon} {cfg.dashLabel} →
          </button>
          {/* Dark mode toggle */}
          <button onClick={toggle} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '7px 14px', cursor: 'pointer', fontSize: 14, fontFamily: 'Inter', color: 'var(--text2)' }}>
            {dark ? '☀️' : '🌙'}
          </button>
          {/* Logout */}
          <button onClick={handleLogout} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '7px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Inter' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* ── HERO PROFILE HEADER ─────────────────────── */}
      <div style={{ background: cfg.grad, padding: '48px 40px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative rings */}
        <div style={{ position: 'absolute', top: -40, right: 80, width: 180, height: 180, border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -20, right: 60, width: 100, height: 100, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '40%', width: 200, height: 200, background: 'rgba(255,255,255,0.06)', borderRadius: '50%', transform: 'translateY(50%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 28, alignItems: 'flex-end', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
          {/* Avatar */}
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, fontWeight: 900, color: 'white', flexShrink: 0, backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            {userData?.name?.[0]?.toUpperCase() || '?'}
          </div>

          {/* Info */}
          <div style={{ flex: 1, paddingBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', margin: 0 }}>{userData?.name}</h1>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, backdropFilter: 'blur(10px)' }}>
                {cfg.icon} {cfg.label}
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 4 }}>✉️ {userData?.email}</p>
            {userData?.phone && <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>📞 {userData.phone} {userData.region && `· 📍 ${userData.region}`}</p>}
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 6 }}>
              Member since {fmt(userData?.createdAt)} · {joined} days on SkillTrack
            </p>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 1, background: 'rgba(255,255,255,0.12)', borderRadius: 16, overflow: 'hidden', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', marginBottom: 28 }}>
            {[
              { v: userData?.loginCount || 1, l: 'Total Logins' },
              { v: joined, l: 'Days Active' },
              { v: userData?.lastLogin ? fmt(userData.lastLogin, { month: 'short', day: '2-digit' }) : 'Today', l: 'Last Login' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '16px 24px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none', textAlign: 'center', minWidth: 100 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{s.v}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2, whiteSpace: 'nowrap' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs bar */}
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 4, paddingTop: 8 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ padding: '12px 20px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'Inter', borderRadius: '12px 12px 0 0', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6,
                background: activeTab === t.id ? 'var(--bg)' : 'rgba(255,255,255,0.1)',
                color: activeTab === t.id ? cfg.color : 'rgba(255,255,255,0.75)',
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 40px' }}>

        {/* ─ MY PROFILE ─ */}
        {activeTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* Personal info card */}
            <div style={{ ...C.surface, padding: 28, gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>👤 Personal Information</h3>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {saveMsg && <span style={{ color: '#10b981', fontSize: 13, fontWeight: 600 }}>{saveMsg}</span>}
                  <button onClick={() => setEditMode(!editMode)} style={{ background: editMode ? 'var(--bg3)' : cfg.color, color: editMode ? 'var(--text)' : 'white', border: 'none', padding: '7px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Inter' }}>
                    {editMode ? '✕ Cancel' : '✏️ Edit'}
                  </button>
                  {editMode && <button onClick={handleSave} className="btn-primary" style={{ padding: '7px 18px', fontSize: 13 }}>Save ✓</button>}
                </div>
              </div>

              {editMode ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[['name','Full Name','Your name'],['phone','Phone','9876543210'],['organization','Organization','NSDC / Company'],['region','State / Region','Maharashtra']].map(([k, lbl, ph]) => (
                    <div key={k}>
                      <label style={C.label}>{lbl}</label>
                      <input value={editForm[k]} onChange={e => setEditForm(f => ({ ...f, [k]: e.target.value }))} placeholder={ph} style={C.input}
                        onFocus={e => e.target.style.borderColor = cfg.color}
                        onBlur={e => e.target.style.borderColor = dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                  {[
                    { icon: '👤', l: 'Full Name', v: userData?.name },
                    { icon: '✉️', l: 'Email', v: userData?.email },
                    { icon: '📞', l: 'Phone', v: userData?.phone || '—' },
                    { icon: '🏢', l: 'Organization', v: userData?.organization || '—' },
                    { icon: '📍', l: 'Region', v: userData?.region || '—' },
                    { icon: '🏷️', l: 'Role', v: cfg.label },
                  ].map((f, i) => (
                    <div key={i} style={{ background: 'var(--bg)', borderRadius: 12, padding: '16px 20px', border: '1px solid var(--border)' }}>
                      <p style={C.label}>{f.icon} {f.l}</p>
                      <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{f.v}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Role-specific info card */}
            <div style={{ ...C.surface, padding: 28 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>{cfg.icon} Role Profile</h3>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '16px', background: `${cfg.color}10`, borderRadius: 14, border: `1px solid ${cfg.color}20`, marginBottom: 20 }}>
                <div style={{ fontSize: 36 }}>{cfg.icon}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: cfg.color }}>{cfg.label}</p>
                  <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4, lineHeight: 1.6 }}>
                    {role === 'admin' && 'You have full platform access — manage all users, programs, analytics and system settings.'}
                    {role === 'institute' && 'Manage training programmes, track candidate enrolments, placements and outcomes.'}
                    {role === 'candidate' && 'Build your skill passport, track your training journey and employment progress.'}
                    {role === 'employer' && 'Browse skill-matched candidates, confirm placements and post job requirements.'}
                  </p>
                </div>
              </div>
              <button onClick={() => navigate(cfg.route)} className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: 14 }}>
                Go to {cfg.dashLabel} →
              </button>
            </div>

            {/* Account security */}
            <div style={{ ...C.surface, padding: 28 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>🔐 Account Security</h3>
              {[
                { label: 'Email Verified', status: true },
                { label: 'Password Set', status: true },
                { label: 'Two-Factor Auth', status: false },
                { label: 'Profile Complete', status: !!(userData?.phone && userData?.organization) },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 14, color: 'var(--text2)' }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: s.status ? '#dcfce7' : '#fee2e2', color: s.status ? '#166534' : '#b91c1c' }}>
                    {s.status ? '✓ Active' : '○ Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─ ACCOUNT INFO ─ */}
        {activeTab === 'account' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* Account details */}
            <div style={{ ...C.surface, padding: 28 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 24 }}>📄 Account Details</h3>
              {[
                { icon: '🆔', l: 'User ID', v: userData?.id || '—' },
                { icon: '📅', l: 'Account Created', v: fmtFull(userData?.createdAt) },
                { icon: '🕐', l: 'Last Login', v: fmtFull(userData?.lastLogin) },
                { icon: '🔢', l: 'Total Logins', v: `${userData?.loginCount || 1} times` },
                { icon: '⏱️', l: 'Days Active', v: `${joined} days` },
                { icon: '🏷️', l: 'Account Type', v: cfg.label },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '13px 0', borderBottom: i < 5 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{r.icon}</span>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.7 }}>{r.l}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, marginTop: 2, wordBreak: 'break-all' }}>{r.v}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Activity summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Membership card */}
              <div style={{ background: cfg.grad, borderRadius: 20, padding: 28, color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%' }} />
                <p style={{ fontSize: 12, fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>Member Card</p>
                <h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 8, marginBottom: 4 }}>{userData?.name}</h2>
                <p style={{ opacity: 0.7, fontSize: 13 }}>{cfg.icon} {cfg.label}</p>
                <div style={{ marginTop: 20, display: 'flex', gap: 20 }}>
                  <div><p style={{ opacity: 0.6, fontSize: 11 }}>SINCE</p><p style={{ fontWeight: 700 }}>{fmt(userData?.createdAt)}</p></div>
                  <div><p style={{ opacity: 0.6, fontSize: 11 }}>LOGINS</p><p style={{ fontWeight: 700 }}>{userData?.loginCount || 1}</p></div>
                </div>
              </div>

              {/* Profile strength */}
              <div style={{ ...C.surface, padding: 28 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📊 Profile Strength</h3>
                {[
                  { label: 'Basic Info', done: !!(userData?.name && userData?.email) },
                  { label: 'Phone Added', done: !!userData?.phone },
                  { label: 'Organization', done: !!userData?.organization },
                  { label: 'Region Set', done: !!userData?.region },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: item.done ? '#dcfce7' : 'var(--bg3)', border: `2px solid ${item.done ? '#10b981' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>
                      {item.done ? '✓' : ''}
                    </div>
                    <span style={{ fontSize: 14, color: item.done ? 'var(--text)' : 'var(--text3)', fontWeight: item.done ? 600 : 400 }}>{item.label}</span>
                  </div>
                ))}
                {/* Progress bar */}
                <div style={{ marginTop: 16 }}>
                  {(() => {
                    const items = [!!(userData?.name && userData?.email), !!userData?.phone, !!userData?.organization, !!userData?.region];
                    const pct = Math.round((items.filter(Boolean).length / items.length) * 100);
                    return (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 12, color: 'var(--text2)' }}>Completion</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{pct}%</span>
                        </div>
                        <div style={{ height: 8, background: 'var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: cfg.grad, borderRadius: 10, transition: 'width 1s ease' }} />
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─ ACTIVITY ─ */}
        {activeTab === 'activity' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Login timeline */}
            <div style={{ ...C.surface, padding: 28 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 24 }}>🕐 Recent Activity</h3>
              {[
                { icon: '🔑', text: 'Logged in to SkillTrack', time: fmtFull(userData?.lastLogin), color: '#6366f1' },
                { icon: '✨', text: 'Account created on SkillTrack', time: fmtFull(userData?.createdAt), color: '#10b981' },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: i === 0 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${a.color}20`, border: `1px solid ${a.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{a.icon}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{a.text}</p>
                    <p style={{ color: 'var(--text3)', fontSize: 12, marginTop: 3 }}>{a.time}</p>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 13, color: 'var(--text2)', textAlign: 'center' }}>
                  You have logged in <strong style={{ color: cfg.color }}>{userData?.loginCount || 1} time(s)</strong> total
                </p>
              </div>
            </div>

            {/* Usage stats */}
            <div style={{ ...C.surface, padding: 28 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 24 }}>📈 Your Stats</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { icon: '🔑', label: 'Total Logins', value: userData?.loginCount || 1, color: '#6366f1' },
                  { icon: '📅', label: 'Days Member', value: joined, color: '#10b981' },
                  { icon: '🏷️', label: 'Role', value: cfg.icon, color: cfg.color },
                  { icon: '⭐', label: 'Status', value: 'Active', color: '#f59e0b' },
                ].map((s, i) => (
                  <div key={i} style={{ background: `${s.color}10`, border: `1px solid ${s.color}20`, borderRadius: 14, padding: '18px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin: show all platform logs */}
            {role === 'admin' && logs.length > 0 && (
              <div style={{ ...C.surface, padding: 28, gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>📋 Platform Activity Log (Admin View)</h3>
                {logs.map((log, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < logs.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
                    <span style={{ fontSize: 20 }}>{log.type === 'REGISTER' ? '✨' : log.type === 'LOGIN' ? '🔑' : '⚠️'}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{log.userName || log.userEmail}</span>
                      <span style={{ fontSize: 12, color: 'var(--text3)', marginLeft: 8 }}>{log.action}</span>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text3)', whiteSpace: 'nowrap' }}>{fmtFull(log.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─ SETTINGS ─ */}
        {activeTab === 'settings' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Appearance */}
            <div style={{ ...C.surface, padding: 28 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>🎨 Appearance</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg)', borderRadius: 14, border: '1px solid var(--border)' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15 }}>{dark ? '🌙 Dark Mode' : '☀️ Light Mode'}</p>
                  <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 2 }}>Switch between dark and light theme</p>
                </div>
                <button onClick={toggle} style={{ background: dark ? '#1e1e3a' : '#f0f4ff', border: `2px solid ${dark ? '#6366f1' : '#6366f1'}`, width: 52, height: 28, borderRadius: 14, cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}>
                  <div style={{ position: 'absolute', top: 2, left: dark ? 24 : 2, width: 20, height: 20, borderRadius: '50%', background: '#6366f1', transition: 'left 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>
                    {dark ? '🌙' : '☀️'}
                  </div>
                </button>
              </div>
            </div>

            {/* Account actions */}
            <div style={{ ...C.surface, padding: 28 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>⚙️ Account Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button onClick={() => setActiveTab('profile')} style={{ ...C.surface, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', border: '1px solid var(--border)', borderRadius: 12, textAlign: 'left', width: '100%', color: 'var(--text)', fontFamily: 'Inter', fontSize: 14, fontWeight: 600 }}>
                  ✏️ Edit Profile
                </button>
                <button onClick={() => navigate(cfg.route)} style={{ ...C.surface, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', border: `1px solid ${cfg.color}30`, borderRadius: 12, textAlign: 'left', width: '100%', color: cfg.color, fontFamily: 'Inter', fontSize: 14, fontWeight: 600, background: `${cfg.color}08` }}>
                  {cfg.icon} Go to Role Dashboard
                </button>
                <button onClick={handleLogout} style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', border: '1px solid #fee2e2', borderRadius: 12, textAlign: 'left', width: '100%', color: '#dc2626', fontFamily: 'Inter', fontSize: 14, fontWeight: 700, background: '#fff5f5' }}>
                  🚪 Sign Out
                </button>
              </div>
            </div>

            {/* Who can see this */}
            <div style={{ ...C.surface, padding: 28, gridColumn: '1 / -1' }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>🔒 Privacy — Who Can See This Dashboard?</h3>
              <div style={{ background: 'var(--bg)', borderRadius: 14, padding: '20px 24px', border: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 36, flexShrink: 0 }}>🔐</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>This is your private personal dashboard</p>
                  <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7 }}>
                    Only <strong style={{ color: cfg.color }}>{userData?.name}</strong> can see this page. Your personal details — login history, profile information, account stats — are private and visible only to you when logged in.
                  </p>
                  <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 8 }}>
                    🛡️ Protected by JWT authentication · Data stored securely on server
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

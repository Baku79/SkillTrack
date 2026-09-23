import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ROLES = {
  admin:     { icon: '🏛️', label: 'Admin / Govt',       color: '#6366f1', bg: '#ede9fe' },
  institute: { icon: '🏫', label: 'Training Institute', color: '#10b981', bg: '#d1fae5' },
  candidate: { icon: '👤', label: 'Job Candidate',      color: '#f59e0b', bg: '#fef3c7' },
  employer:  { icon: '🏢', label: 'Employer',           color: '#ef4444', bg: '#fee2e2' },
};

export default function Login() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'candidate', phone: '', organization: '', region: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  const s = {
    page: { minHeight: '100vh', background: dark ? 'linear-gradient(135deg, #05050d 0%, #0d0d1f 40%, #100a1f 100%)' : 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Inter, sans-serif', transition: 'background 0.3s' },
    box: { width: '100%', maxWidth: 500 },
    card: { background: dark ? '#141420' : 'white', borderRadius: 24, padding: 36, boxShadow: dark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 25px 60px rgba(99,102,241,0.12)', border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : '#f0f0ff'}` },
    input: { width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter', background: dark ? '#1e1e2e' : 'white', color: dark ? '#f1f5f9' : '#0f172a', transition: 'all 0.2s' },
    label: { fontSize: 12, fontWeight: 700, color: dark ? '#94a3b8' : '#374151', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
    h2: { fontSize: 22, fontWeight: 800, color: dark ? '#f1f5f9' : '#0f172a', marginBottom: 6 },
    sub: { color: dark ? '#64748b' : '#6b7280', fontSize: 13, marginBottom: 28 },
  };

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (tab === 'register') {
        if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); setLoading(false); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
        const res = await axios.post('/api/auth/register', { name: form.name, email: form.email, password: form.password, role: form.role, phone: form.phone, organization: form.organization, region: form.region });
        login(res.data.user, res.data.token);
      } else {
        const res = await axios.post('/api/auth/login', { email: form.email, password: form.password });
        login(res.data.user, res.data.token);
      }
      navigate('/me');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      {/* Decorative blobs */}
      {dark && <>
        <div style={{ position: 'fixed', top: '15%', left: '10%', width: 300, height: 300, background: 'rgba(99,102,241,0.08)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'fixed', bottom: '20%', right: '8%', width: 250, height: 250, background: 'rgba(139,92,246,0.08)', borderRadius: '50%', filter: 'blur(70px)', pointerEvents: 'none' }} />
      </>}

      <div style={s.box}>
        {/* Theme toggle + back */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Link to="/" style={{ color: dark ? '#64748b' : '#9ca3af', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            ← Home
          </Link>
          <button onClick={toggle} style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', border: 'none', borderRadius: 30, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: dark ? '#94a3b8' : '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillTrack</h1>
          <p style={{ color: dark ? '#4b5563' : '#9ca3af', fontSize: 13, marginTop: 4 }}>India's Skilling Outcomes Platform</p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: dark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', borderRadius: 14, padding: 4, marginBottom: 20, gap: 4 }}>
          {[['login', '🔑 Sign In'], ['register', '✨ Register']].map(([k, l]) => (
            <button key={k} onClick={() => { setTab(k); setError(''); }}
              style={{ flex: 1, padding: '10px', borderRadius: 11, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, transition: 'all 0.2s', fontFamily: 'Inter',
                background: tab === k ? (dark ? '#1e1e3a' : 'white') : 'transparent',
                color: tab === k ? '#6366f1' : dark ? '#4b5563' : '#9ca3af',
                boxShadow: tab === k ? (dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)') : 'none' }}>
              {l}
            </button>
          ))}
        </div>

        <div style={s.card}>
          {/* LOGIN */}
          {tab === 'login' && (
            <>
              <h2 style={s.h2}>Welcome back 👋</h2>
              <p style={s.sub}>Sign in to your SkillTrack account</p>
              <form onSubmit={submit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={s.label}>Email</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" required style={s.input} onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor= dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={s.label}>Password</label>
                  <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" required style={s.input} onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor= dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'} />
                </div>
                {error && <div style={{ background: dark ? '#2d0a0a' : '#fef2f2', border: '1px solid #fca5a5', color: '#ef4444', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: 13, fontSize: 15 }}>
                  {loading ? '⏳ Signing in...' : 'Sign In →'}
                </button>
              </form>
              <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: dark ? '#4b5563' : '#6b7280' }}>
                No account? <button onClick={() => setTab('register')} style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'Inter' }}>Create one →</button>
              </p>
            </>
          )}

          {/* REGISTER */}
          {tab === 'register' && (
            <>
              <h2 style={s.h2}>Create Account ✨</h2>
              <p style={s.sub}>Join SkillTrack — choose your role</p>

              {/* Role grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                {Object.entries(ROLES).map(([role, cfg]) => (
                  <button key={role} type="button" onClick={() => set('role', role)}
                    style={{ padding: '12px 8px', borderRadius: 12, border: `2px solid ${form.role === role ? cfg.color : dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`, background: form.role === role ? (dark ? `${cfg.color}20` : cfg.bg) : (dark ? 'rgba(255,255,255,0.02)' : 'white'), color: form.role === role ? cfg.color : dark ? '#64748b' : '#374151', cursor: 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.15s', fontFamily: 'Inter' }}>
                    <span style={{ fontSize: 24 }}>{cfg.icon}</span>
                    <span>{cfg.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={submit}>
                <div style={{ marginBottom: 14 }}>
                  <label style={s.label}>Full Name *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" required style={s.input} onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor= dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={s.label}>Email *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" required style={s.input} onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor= dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={s.label}>Phone</label>
                    <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="9876543210" style={s.input} onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor= dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'} />
                  </div>
                  <div>
                    <label style={s.label}>State / Region</label>
                    <input value={form.region} onChange={e => set('region', e.target.value)} placeholder="Maharashtra" style={s.input} onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor= dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'} />
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={s.label}>Organization / Institute</label>
                  <input value={form.organization} onChange={e => set('organization', e.target.value)} placeholder="e.g. NSDC, TechCorp" style={s.input} onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor= dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div>
                    <label style={s.label}>Password *</label>
                    <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 chars" required style={s.input} onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor= dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'} />
                  </div>
                  <div>
                    <label style={s.label}>Confirm *</label>
                    <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Repeat" required style={s.input} onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor= dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'} />
                  </div>
                </div>
                {error && <div style={{ background: dark ? '#2d0a0a' : '#fef2f2', border: '1px solid #fca5a5', color: '#ef4444', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: 13, fontSize: 15 }}>
                  {loading ? '⏳ Creating...' : `${ROLES[form.role].icon} Create Account`}
                </button>
              </form>
              <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: dark ? '#4b5563' : '#6b7280' }}>
                Already have an account? <button onClick={() => setTab('login')} style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'Inter' }}>Sign in →</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

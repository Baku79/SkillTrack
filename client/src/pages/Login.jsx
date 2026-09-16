import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const roleColors = { admin: '#4f46e5', institute: '#059669', candidate: '#d97706', employer: '#dc2626' };
const roleIcons = { admin: '🏛️', institute: '🏫', candidate: '👤', employer: '🏢' };

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const demoAccounts = [
    { role: 'admin', email: 'admin@skilltrack.in', password: 'admin123', label: 'Admin' },
    { role: 'institute', email: 'institute@skilltrack.in', password: 'institute123', label: 'Institute' },
    { role: 'candidate', email: 'candidate@skilltrack.in', password: 'candidate123', label: 'Candidate' },
    { role: 'employer', email: 'employer@skilltrack.in', password: 'employer123', label: 'Employer' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/login', form);
      login(res.data.user, res.data.token);
      const routes = { admin: '/admin', institute: '/institute', candidate: '/candidate', employer: '/employer' };
      navigate(routes[res.data.user.role]);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc) => setForm({ email: acc.email, password: acc.password });

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 48 }}>🎓</span>
          <h1 style={{ fontSize: 28, fontWeight: 700, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 8 }}>SkillTrack</h1>
          <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Sign in to your account</p>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 12 }}>🔑 Quick Demo Login</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {demoAccounts.map((acc) => (
              <button key={acc.role} onClick={() => fillDemo(acc)} style={{ padding: '10px', borderRadius: 8, border: `2px solid ${roleColors[acc.role]}20`, background: `${roleColors[acc.role]}10`, color: roleColors[acc.role], cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{roleIcons[acc.role]}</span> {acc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: 12, fontSize: 15 }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#6b7280', fontSize: 13 }}>
          <a href="/" style={{ color: '#4f46e5', textDecoration: 'none' }}>← Back to Home</a>
        </p>
      </div>
    </div>
  );
}

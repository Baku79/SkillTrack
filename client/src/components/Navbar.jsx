import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ROLE_CFG = {
  admin:     { color: '#6366f1', icon: '🏛️', label: 'Admin' },
  institute: { color: '#10b981', icon: '🏫', label: 'Institute' },
  candidate: { color: '#f59e0b', icon: '👤', label: 'Candidate' },
  employer:  { color: '#ef4444', icon: '🏢', label: 'Employer' },
};

export default function Navbar({ title }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const cfg = ROLE_CFG[user?.role] || ROLE_CFG.admin;

  return (
    <nav style={{ height: 64, background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 100, transition: 'all 0.3s', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/me')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
          <span style={{ fontSize: 22 }}>🎓</span>
          <span style={{ fontSize: 17, fontWeight: 900, background: 'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillTrack</span>
        </button>
        {title && <>
          <span style={{ color: 'var(--border)', fontSize: 18 }}>·</span>
          <span style={{ color: 'var(--text2)', fontSize: 14, fontWeight: 600 }}>{title}</span>
        </>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* User badge */}
        <button onClick={() => navigate('/me')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: `${cfg.color}12`, border: `1px solid ${cfg.color}25`, padding: '6px 14px', borderRadius: 10, cursor: 'pointer', fontFamily: 'Inter' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${cfg.color}, #8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 12 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{user?.name?.split(' ')[0]}</span>
          <span style={{ fontSize: 11, color: 'var(--text3)', background: 'var(--bg)', padding: '2px 6px', borderRadius: 8 }}>{cfg.icon} {cfg.label}</span>
        </button>

        {/* Dark mode */}
        <button onClick={toggle} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '7px 13px', cursor: 'pointer', fontSize: 14, fontFamily: 'Inter', color: 'var(--text2)' }}>
          {dark ? '☀️' : '🌙'}
        </button>

        {/* Logout */}
        <button onClick={() => { logout(); navigate('/login'); }} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '7px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Inter' }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

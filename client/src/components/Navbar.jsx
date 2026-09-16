import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleColors = { admin: '#4f46e5', institute: '#059669', candidate: '#d97706', employer: '#dc2626' };
const roleLabels = { admin: '🏛️ Admin', institute: '🏫 Institute', candidate: '👤 Candidate', employer: '🏢 Employer' };

export default function Navbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: 'white', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 24 }}>🎓</span>
        <span style={{ fontSize: 18, fontWeight: 700, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillTrack</span>
        {title && <><span style={{ color: '#d1d5db' }}>|</span><span style={{ color: '#374151', fontSize: 15, fontWeight: 500 }}>{title}</span></>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: `${roleColors[user.role]}15`, color: roleColors[user.role], padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{roleLabels[user.role]}</span>
            <span style={{ color: '#374151', fontSize: 14 }}>{user.name}</span>
          </div>
        )}
        <button onClick={handleLogout} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Logout</button>
      </div>
    </nav>
  );
}

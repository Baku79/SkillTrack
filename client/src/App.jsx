import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import PersonalDashboard from './pages/PersonalDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import InstituteDashboard from './pages/dashboard/InstituteDashboard';
import CandidateDashboard from './pages/dashboard/CandidateDashboard';
import EmployerDashboard from './pages/dashboard/EmployerDashboard';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--text2)', fontFamily: 'Inter' }}>Loading...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const RoleRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/me" replace />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/me" element={<ProtectedRoute><PersonalDashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<RoleRoute role="admin"><AdminDashboard /></RoleRoute>} />
            <Route path="/institute" element={<RoleRoute role="institute"><InstituteDashboard /></RoleRoute>} />
            <Route path="/candidate" element={<RoleRoute role="candidate"><CandidateDashboard /></RoleRoute>} />
            <Route path="/employer" element={<RoleRoute role="employer"><EmployerDashboard /></RoleRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

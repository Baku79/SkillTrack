import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ROLES = {
  admin:     { icon: '🏛️', label: 'Admin / Govt',       color: '#6366f1', desc: 'Government official — requires Govt ID' },
  institute: { icon: '🏫', label: 'Training Institute', color: '#10b981', desc: 'Training provider / skill centre' },
  candidate: { icon: '👤', label: 'Job Candidate',      color: '#f59e0b', desc: 'Job seeker / trainee' },
  employer:  { icon: '🏢', label: 'Employer',           color: '#ef4444', desc: 'Company / recruiter' },
};

const GOVT_ID_TYPES = [
  { value: 'aadhar',   label: 'Aadhar Card',    pattern: /^\d{12}$/,               hint: '12-digit number' },
  { value: 'pan',      label: 'PAN Card',        pattern: /^[A-Z]{5}\d{4}[A-Z]$/,  hint: 'e.g. ABCDE1234F' },
  { value: 'passport', label: 'Passport',        pattern: /^[A-Z]\d{7}$/,           hint: 'e.g. A1234567' },
  { value: 'voter',    label: 'Voter ID',        pattern: /^[A-Z]{3}\d{7}$/,        hint: 'e.g. ABC1234567' },
  { value: 'driving',  label: 'Driving Licence', pattern: /.{8,}/,                  hint: 'State code + number' },
];

/* ── Countdown Timer ────────────────────────────── */
function Timer({ seconds, onExpire, key: timerKey }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    setLeft(seconds);
    const id = setInterval(() => setLeft(l => {
      if (l <= 1) { clearInterval(id); onExpire?.(); return 0; }
      return l - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [timerKey]);
  const m = String(Math.floor(left / 60)).padStart(2, '0');
  const s = String(left % 60).padStart(2, '0');
  return <span style={{ color: left < 30 ? '#ef4444' : '#6366f1', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{m}:{s}</span>;
}

/* ── OTP 6-box input ────────────────────────────── */
function OTPInput({ otp, setOtp, firstRef }) {
  const handleInput = (val, idx) => {
    const d = val.replace(/\D/, '');
    const next = [...otp]; next[idx] = d; setOtp(next);
    if (d && idx < 5) document.getElementById(`otp-box-${idx + 1}`)?.focus();
    if (!d && idx > 0) document.getElementById(`otp-box-${idx - 1}`)?.focus();
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) setOtp(paste.split(''));
    e.preventDefault();
  };
  const handleKey = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) document.getElementById(`otp-box-${idx - 1}`)?.focus();
  };
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {otp.map((d, i) => (
        <input key={i} id={`otp-box-${i}`} ref={i === 0 ? firstRef : null}
          maxLength={1} value={d} inputMode="numeric"
          onChange={e => handleInput(e.target.value, i)}
          onPaste={i === 0 ? handlePaste : undefined}
          onKeyDown={e => handleKey(e, i)}
          style={{ width: 46, height: 54, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 12,
            border: `2px solid ${d ? '#6366f1' : 'rgba(100,100,120,0.2)'}`,
            background: d ? 'rgba(99,102,241,0.08)' : 'transparent',
            color: '#4f46e5', outline: 'none', fontFamily: 'Inter',
            transition: 'all 0.15s', WebkitAppearance: 'none' }} />
      ))}
    </div>
  );
}

/* ── DevOTP display box ─────────────────────────── */
function DevOtpBox({ emailOtp, phoneOtp, dark }) {
  if (!emailOtp && !phoneOtp) return null;
  const copyText = (text) => {
    const el = document.createElement('textarea'); el.value = text;
    document.body.appendChild(el); el.select();
    document.execCommand('copy'); document.body.removeChild(el);
  };
  return (
    <div style={{ background: dark ? '#1a1a2e' : '#f5f3ff', border: '2px dashed #8b5cf6', borderRadius: 14, padding: 16, marginBottom: 16 }}>
      <p style={{ fontSize: 11, fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
        ⚙️ Dev Mode — OTP (configure .env for real sending)
      </p>
      {emailOtp && (
        <div style={{ marginBottom: phoneOtp ? 8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: dark ? '#0d0d1a' : 'white', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(139,92,246,0.3)' }}>
          <span style={{ color: '#6366f1' }}>📧 Email OTP:&nbsp;
            <strong style={{ fontSize: 18, letterSpacing: 4, fontVariantNumeric: 'tabular-nums' }}>{emailOtp}</strong>
          </span>
          <button onClick={() => copyText(emailOtp)} style={{ background: '#ede9fe', border: 'none', color: '#6366f1', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'Inter' }}>📋 Copy</button>
        </div>
      )}
      {phoneOtp && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: dark ? '#0d0d1a' : 'white', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(16,185,129,0.3)' }}>
          <span style={{ color: '#10b981' }}>📱 Phone OTP:&nbsp;
            <strong style={{ fontSize: 18, letterSpacing: 4, fontVariantNumeric: 'tabular-nums' }}>{phoneOtp}</strong>
          </span>
          <button onClick={() => copyText(phoneOtp)} style={{ background: '#d1fae5', border: 'none', color: '#065f46', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'Inter' }}>📋 Copy</button>
        </div>
      )}
    </div>
  );
}

/* ── Error box ──────────────────────────────────── */
function Err({ msg, dark }) {
  return msg ? (
    <div style={{ background: dark ? '#2d0a0a' : '#fef2f2', border: '1px solid #fca5a5', color: '#ef4444', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 14 }}>
      ⚠️ {msg}
    </div>
  ) : null;
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
export default function Login() {
  const [tab, setTab]               = useState('login');

  // ── Registration state ──
  const [regStep, setRegStep]       = useState('form'); // 'form' | 'verify'
  const [verifyMethod, setVerifyMethod] = useState('email');
  const [regOtp, setRegOtp]         = useState(['','','','','','']);
  const [devOtps, setDevOtps]       = useState({ email: '', phone: '' });
  const [otpExpired, setOtpExpired] = useState(false);
  const [otpTimerKey, setOtpTimerKey] = useState(0);
  const [verified, setVerified]     = useState(false);
  const [verifiedMethod, setVerifiedMethod] = useState('');
  const [govtIdType, setGovtIdType] = useState('aadhar');
  const [govtIdError, setGovtIdError] = useState('');

  // ── Login state ──
  const [loginStep, setLoginStep]   = useState('credentials'); // 'credentials' | 'otp'
  const [loginOtp, setLoginOtp]     = useState(['','','','','','']);
  const [devLoginOtp, setDevLoginOtp] = useState('');
  const [loginOtpExpired, setLoginOtpExpired] = useState(false);
  const [loginOtpTimerKey, setLoginOtpTimerKey] = useState(0);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');

  // ── Forgot password state ──
  const [forgotStep, setForgotStep]     = useState(''); // '' | 'email' | 'otp' | 'reset'
  const [forgotEmail, setForgotEmail]   = useState('');
  const [forgotOtp, setForgotOtp]       = useState(['','','','','','']);
  const [forgotPassword, setForgotPassword] = useState('');
  const [forgotConfirm, setForgotConfirm]   = useState('');
  const [devForgotOtp, setDevForgotOtp]     = useState('');
  const [forgotMasked, setForgotMasked]     = useState('');

  // ── Shared form ──
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'candidate', phone: '', organization: '', region: '', govtId: '',
  });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login }        = useAuth();
  const { dark, toggle } = useTheme();
  const navigate         = useNavigate();
  const firstRegOtpRef   = useRef(null);
  const firstLoginOtpRef = useRef(null);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); setGovtIdError(''); };
  const isAdmin  = form.role === 'admin';
  const govtType = GOVT_ID_TYPES.find(t => t.value === govtIdType) || GOVT_ID_TYPES[0];

  /* ── Styles ── */
  const bg = dark
    ? 'linear-gradient(135deg,#05050d 0%,#0d0d1f 50%,#100a1f 100%)'
    : 'linear-gradient(135deg,#f0f4ff 0%,#faf5ff 100%)';
  const card = {
    background: dark ? '#141420' : 'white', borderRadius: 24, padding: '28px 32px',
    boxShadow: dark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 25px 60px rgba(99,102,241,0.12)',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : '#f0f0ff'}`,
  };
  const inp = {
    width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14, outline: 'none',
    border: `1.5px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
    background: dark ? '#1e1e2e' : 'white', color: dark ? '#f1f5f9' : '#0f172a',
    boxSizing: 'border-box', fontFamily: 'Inter', transition: 'border-color 0.2s',
  };
  const lbl = { fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6, color: dark ? '#64748b' : '#374151', textTransform: 'uppercase', letterSpacing: 0.7 };
  const fo  = (c = '#6366f1') => e => e.target.style.borderColor = c;
  const bl  = () => e => e.target.style.borderColor = dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';

  /* ── Validate Govt ID ── */
  const validateGovtId = () => {
    if (!isAdmin) return true;
    const val = form.govtId.trim().toUpperCase().replace(/\s/g, '');
    if (!val) { setGovtIdError('Government ID is required for Admin registration.'); return false; }
    if (!govtType.pattern.test(val)) { setGovtIdError(`Invalid format. Expected: ${govtType.hint}`); return false; }
    return true;
  };

  /* ── Progress bar ── */
  const Prog = ({ step }) => (
    <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < step ? '#6366f1' : dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb', transition: 'background 0.3s' }} />
      ))}
    </div>
  );

  /* ══════════════════════════════════════
     LOGIN HANDLERS
  ══════════════════════════════════════ */

  /* Step 1 — verify password → get login OTP */
  const handleLoginStep1 = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email: form.email, password: form.password });
      if (res.data.requiresOtp) {
        setMaskedEmail(res.data.maskedEmail || '');
        setMaskedPhone(res.data.maskedPhone || '');
        if (res.data.devMode) setDevLoginOtp(res.data.devLoginOtp || '');
        setLoginStep('otp');
        setLoginOtp(['','','','','','']);
        setLoginOtpExpired(false);
        setLoginOtpTimerKey(k => k + 1);
        setTimeout(() => firstLoginOtpRef.current?.focus(), 300);
      }
    } catch (err) {
      if (!err.response) setError('❌ Cannot connect to server. Make sure the backend is running on port 5000.');
      else setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  /* Step 2 — verify login OTP → get token */
  const handleLoginOtpVerify = async () => {
    setError(''); setLoading(true);
    try {
      const res = await axios.post('/api/auth/login-verify-otp', {
        email: form.email, otp: loginOtp.join(''),
      });
      login(res.data.user, res.data.token);
      navigate('/me');
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect OTP. Please try again.');
    } finally { setLoading(false); }
  };

  /* Resend login OTP */
  const resendLoginOtp = async () => {
    setError(''); setLoading(true);
    try {
      const res = await axios.post('/api/auth/login-resend-otp', { email: form.email });
      setLoginOtpExpired(false);
      setLoginOtpTimerKey(k => k + 1);
      setLoginOtp(['','','','','','']);
      if (res.data.devMode) setDevLoginOtp(res.data.devLoginOtp || '');
      setSuccess('✅ New OTP sent!'); setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally { setLoading(false); }
  };

  /* ══════════════════════════════════════
     REGISTRATION HANDLERS
  ══════════════════════════════════════ */

  /* Step 1 — send registration OTP */
  const handleSendOtp = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (verifyMethod === 'phone' && !form.phone) { setError('Please enter your phone number to use Phone OTP.'); return; }
    if (!validateGovtId()) return;
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/send-otp', { email: form.email, phone: form.phone, name: form.name });
      setDevOtps({ email: res.data.devEmailOtp || '', phone: res.data.devPhoneOtp || '' });
      setOtpExpired(false); setRegOtp(['','','','','','']);
      setOtpTimerKey(k => k + 1);
      setRegStep('verify');
      setSuccess('');
      setTimeout(() => firstRegOtpRef.current?.focus(), 300);
    } catch (err) {
      if (!err.response) setError('❌ Cannot connect to server. Make sure the backend is running on port 5000.');
      else setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally { setLoading(false); }
  };

  /* Step 2 — verify registration OTP */
  const handleVerifyRegOtp = async () => {
    setError(''); setLoading(true);
    try {
      await axios.post('/api/auth/verify-otp', { email: form.email, otp: regOtp.join(''), method: verifyMethod });
      setVerified(true); setVerifiedMethod(verifyMethod);
      setSuccess('✅ OTP verified! Complete registration below.');
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect OTP. Please check and try again.');
    } finally { setLoading(false); }
  };

  /* Resend registration OTP */
  const resendRegOtp = async () => {
    setError(''); setLoading(true);
    try {
      const res = await axios.post('/api/auth/resend-otp', {
        email: form.email, phone: form.phone, name: form.name, method: verifyMethod,
      });
      setOtpExpired(false); setRegOtp(['','','','','','']);
      setOtpTimerKey(k => k + 1);
      if (res.data.devMode) setDevOtps({ email: res.data.devEmailOtp || '', phone: res.data.devPhoneOtp || '' });
      setSuccess('✅ New OTP sent!'); setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally { setLoading(false); }
  };

  /* Step 3 — complete registration */
  const handleRegister = async () => {
    setError(''); setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', {
        name: form.name, email: form.email, password: form.password,
        role: form.role, phone: form.phone, organization: form.organization,
        region: form.region, verifiedOtp: true, verifiedMethod,
        govtId: isAdmin ? form.govtId.trim().toUpperCase() : undefined,
        govtIdType: isAdmin ? govtIdType : undefined,
      });
      login(res.data.user, res.data.token);
      navigate('/me');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  /* ══════════════════════════════════════
     RENDER
  ══════════════════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px', fontFamily: 'Inter, sans-serif', transition: 'background 0.3s' }}>
      {dark && <>
        <div style={{ position: 'fixed', top: '10%', left: '5%', width: 300, height: 300, background: 'rgba(99,102,241,0.07)', borderRadius: '50%', filter: 'blur(90px)', pointerEvents: 'none' }} />
        <div style={{ position: 'fixed', bottom: '15%', right: '5%', width: 240, height: 240, background: 'rgba(139,92,246,0.07)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      </>}

      <div style={{ width: '100%', maxWidth: 520 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <Link to="/" style={{ color: dark ? '#4b5563' : '#9ca3af', fontSize: 13, textDecoration: 'none' }}>← Home</Link>
          <button onClick={toggle} style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', border: 'none', borderRadius: 30, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: dark ? '#94a3b8' : '#374151', fontFamily: 'Inter' }}>
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 38 }}>🎓</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '4px 0 2px' }}>SkillTrack</h1>
          <p style={{ color: dark ? '#4b5563' : '#9ca3af', fontSize: 12 }}>India's Skilling Outcomes Platform</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: dark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', borderRadius: 14, padding: 4, marginBottom: 16, gap: 4 }}>
          {[['login', '🔑 Sign In'], ['register', '✨ Register']].map(([k, l]) => (
            <button key={k} onClick={() => { setTab(k); setRegStep('form'); setLoginStep('credentials'); setError(''); setSuccess(''); setVerified(false); setDevOtps({ email: '', phone: '' }); setDevLoginOtp(''); }}
              style={{ flex: 1, padding: '10px', borderRadius: 11, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Inter', transition: 'all 0.2s',
                background: tab === k ? (dark ? '#1e1e3a' : 'white') : 'transparent',
                color: tab === k ? '#6366f1' : dark ? '#4b5563' : '#9ca3af',
                boxShadow: tab === k ? (dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)') : 'none' }}>
              {l}
            </button>
          ))}
        </div>

        {/* ════════════════════════
            LOGIN — Step 1: Credentials
        ════════════════════════ */}
        {tab === 'login' && loginStep === 'credentials' && (
          <div style={card}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, color: dark ? '#f1f5f9' : '#0f172a' }}>Welcome back 👋</h2>
            <p style={{ color: dark ? '#4b5563' : '#6b7280', fontSize: 13, marginBottom: 6 }}>Sign in with your email and password</p>
            <div style={{ background: dark ? '#1a1a2e' : '#f5f3ff', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#6366f1', border: '1px solid #c4b5fd' }}>
              🔐 After password check, we'll send a <strong>One-Time Password (OTP)</strong> to your email for security.
            </div>
            <form onSubmit={handleLoginStep1}>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" required style={inp} onFocus={fo()} onBlur={bl()} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={lbl}>Password</label>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" required style={inp} onFocus={fo()} onBlur={bl()} />
              </div>
              <Err msg={error} dark={dark} />
              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: 13, fontSize: 15 }}>
                {loading ? '⏳ Verifying...' : '🔑 Continue →'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: dark ? '#4b5563' : '#6b7280' }}>
              No account? <button onClick={() => setTab('register')} style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'Inter' }}>Register →</button>
            </p>
            <div style={{ marginTop: 14, padding: '10px 14px', background: dark ? '#0d1117' : '#f8faff', borderRadius: 10, border: '1px solid var(--border,#e5e7eb)', fontSize: 12, color: dark ? '#4b5563' : '#6b7280' }}>
              <strong style={{ color: '#6366f1' }}>Default Admin:</strong> admin@skilltrack.in / admin123
            </div>
          </div>
        )}

        {/* ════════════════════════
            LOGIN — Step 2: OTP Verification
        ════════════════════════ */}
        {tab === 'login' && loginStep === 'otp' && (
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔐</div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: dark ? '#f1f5f9' : '#0f172a', margin: 0 }}>Login OTP Verification</h2>
                <p style={{ color: dark ? '#4b5563' : '#6b7280', fontSize: 12, margin: '2px 0 0' }}>2-Factor Authentication</p>
              </div>
            </div>

            {/* Sent to info */}
            <div style={{ background: dark ? '#1a1a2e' : '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: 12, padding: '12px 16px', margin: '16px 0' }}>
              <p style={{ fontSize: 13, color: dark ? '#a5b4fc' : '#4f46e5', margin: 0 }}>
                📧 OTP sent to <strong>{maskedEmail}</strong>
                {maskedPhone && <><br />📱 Also sent to <strong>{maskedPhone}</strong></>}
              </p>
            </div>

            {/* Dev mode display */}
            {devLoginOtp && (
              <div style={{ background: dark ? '#1a1a2e' : '#f5f3ff', border: '2px dashed #8b5cf6', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>⚙️ Dev Mode OTP</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: 22, letterSpacing: 5, color: '#6366f1', fontVariantNumeric: 'tabular-nums' }}>{devLoginOtp}</strong>
                  <button onClick={() => { const el = document.createElement('textarea'); el.value = devLoginOtp; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); }}
                    style={{ background: '#ede9fe', border: 'none', color: '#6366f1', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Inter' }}>📋 Copy</button>
                </div>
              </div>
            )}

            <label style={{ ...lbl, textAlign: 'center', marginBottom: 12 }}>Enter 6-digit OTP from email</label>
            <div style={{ marginBottom: 16 }}>
              <OTPInput otp={loginOtp} setOtp={setLoginOtp} firstRef={firstLoginOtpRef} />
            </div>

            <p style={{ textAlign: 'center', fontSize: 13, color: dark ? '#4b5563' : '#6b7280', marginBottom: 16 }}>
              {loginOtpExpired
                ? <button onClick={resendLoginOtp} style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'Inter' }}>🔄 OTP expired — Resend</button>
                : <>⏱ Expires in <Timer seconds={600} onExpire={() => setLoginOtpExpired(true)} key={loginOtpTimerKey} /></>}
            </p>

            {success && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#059669', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 14, textAlign: 'center' }}>{success}</div>}
            <Err msg={error} dark={dark} />

            <button onClick={handleLoginOtpVerify} disabled={loginOtp.join('').length < 6 || loading || loginOtpExpired}
              className="btn-primary" style={{ width: '100%', padding: 13, fontSize: 15, opacity: loginOtp.join('').length < 6 ? 0.5 : 1 }}>
              {loading ? '⏳ Verifying...' : '✓ Verify OTP & Login'}
            </button>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button onClick={() => { setLoginStep('credentials'); setError(''); setDevLoginOtp(''); }}
                style={{ flex: 1, padding: 10, borderRadius: 10, border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`, background: 'transparent', color: dark ? '#64748b' : '#6b7280', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Inter' }}>
                ← Back
              </button>
              <button onClick={resendLoginOtp} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid #6366f130', background: '#6366f108', color: '#6366f1', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Inter' }}>
                🔄 Resend OTP
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════
            REGISTER — Step 1: Form
        ════════════════════════ */}
        {tab === 'register' && regStep === 'form' && (
          <div style={card}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, color: dark ? '#f1f5f9' : '#0f172a' }}>Create Account ✨</h2>
            <p style={{ color: dark ? '#4b5563' : '#6b7280', fontSize: 13, marginBottom: 16 }}>Fill your details → verify via OTP</p>
            <Prog step={1} />

            {/* Role */}
            <label style={lbl}>I am a...</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
              {Object.entries(ROLES).map(([role, cfg]) => (
                <button key={role} type="button" onClick={() => set('role', role)}
                  style={{ padding: '10px 8px', borderRadius: 10, border: `2px solid ${form.role === role ? cfg.color : dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`, background: form.role === role ? `${cfg.color}18` : dark ? 'rgba(255,255,255,0.02)' : 'white', color: form.role === role ? cfg.color : dark ? '#64748b' : '#374151', cursor: 'pointer', fontWeight: 700, fontSize: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, fontFamily: 'Inter', transition: 'all 0.15s', textAlign: 'left' }}>
                  <span style={{ fontSize: 16 }}>{cfg.icon} {cfg.label.split('/')[0].trim()}</span>
                  <span style={{ fontSize: 10, opacity: 0.7, fontWeight: 400 }}>{cfg.desc}</span>
                </button>
              ))}
            </div>

            {/* Admin Govt ID */}
            {isAdmin && (
              <div style={{ marginBottom: 18, background: dark ? '#1a1020' : '#fdf4ff', border: `2px solid ${dark ? '#6d28d9' : '#c4b5fd'}`, borderRadius: 14, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 22 }}>🪪</span>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: 14, color: dark ? '#c084fc' : '#7c3aed', margin: 0 }}>Government ID Required</p>
                    <p style={{ fontSize: 11, color: dark ? '#7c3aed' : '#9333ea', margin: '2px 0 0' }}>Only government officials can create Admin accounts</p>
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ ...lbl, color: dark ? '#a78bfa' : '#6d28d9' }}>ID Type</label>
                  <select value={govtIdType} onChange={e => { setGovtIdType(e.target.value); setGovtIdError(''); }}
                    style={{ ...inp, border: `1.5px solid ${dark ? '#6d28d9' : '#c4b5fd'}` }}>
                    {GOVT_ID_TYPES.map(t => <option key={t.value} value={t.value}>{t.label} — {t.hint}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ ...lbl, color: dark ? '#a78bfa' : '#6d28d9' }}>ID Number *</label>
                  <input value={form.govtId} onChange={e => set('govtId', e.target.value.toUpperCase())} placeholder={govtType.hint}
                    style={{ ...inp, border: `1.5px solid ${govtIdError ? '#ef4444' : dark ? '#6d28d9' : '#c4b5fd'}`, textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: 2, fontSize: 15, fontWeight: 700 }}
                    onFocus={fo('#7c3aed')} onBlur={bl()} />
                  {govtIdError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 5 }}>⚠️ {govtIdError}</p>}
                </div>
              </div>
            )}

            <form onSubmit={handleSendOtp}>
              <div style={{ marginBottom: 12 }}>
                <label style={lbl}>Full Name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" required style={inp} onFocus={fo()} onBlur={bl()} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={lbl}>Email *</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" required style={inp} onFocus={fo()} onBlur={bl()} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={lbl}>Phone</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="9876543210" style={inp} onFocus={fo()} onBlur={bl()} />
                </div>
                <div>
                  <label style={lbl}>State</label>
                  <input value={form.region} onChange={e => set('region', e.target.value)} placeholder="Maharashtra" style={inp} onFocus={fo()} onBlur={bl()} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={lbl}>{isAdmin ? 'Department / Ministry' : 'Organization'}</label>
                <input value={form.organization} onChange={e => set('organization', e.target.value)} placeholder={isAdmin ? 'Ministry of Skill Development' : 'Company / Institute name'} style={inp} onFocus={fo()} onBlur={bl()} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={lbl}>Password *</label>
                  <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 chars" required style={inp} onFocus={fo()} onBlur={bl()} />
                </div>
                <div>
                  <label style={lbl}>Confirm *</label>
                  <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Repeat" required style={inp} onFocus={fo()} onBlur={bl()} />
                </div>
              </div>

              {/* OTP method */}
              <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Send OTP via</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[['email', '📧 Email OTP'], ['phone', '📱 Phone OTP']].map(([m, l]) => (
                    <button key={m} type="button" onClick={() => setVerifyMethod(m)}
                      style={{ flex: 1, padding: 10, borderRadius: 10, border: `2px solid ${verifyMethod === m ? '#6366f1' : dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`, background: verifyMethod === m ? '#6366f118' : dark ? 'rgba(255,255,255,0.02)' : 'white', color: verifyMethod === m ? '#6366f1' : dark ? '#64748b' : '#374151', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'Inter' }}>
                      {l}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: dark ? '#4b5563' : '#9ca3af', marginTop: 5 }}>
                  OTP → {verifyMethod === 'email' ? `📧 ${form.email || 'your email'}` : `📱 ${form.phone || 'your phone'}`}
                </p>
              </div>

              <Err msg={error} dark={dark} />
              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: 13, fontSize: 15 }}>
                {loading ? '⏳ Sending OTP...' : `📤 Send ${verifyMethod === 'email' ? 'Email' : 'Phone'} OTP →`}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: dark ? '#4b5563' : '#6b7280' }}>
              Have an account? <button onClick={() => setTab('login')} style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'Inter' }}>Sign in →</button>
            </p>
          </div>
        )}

        {/* ════════════════════════
            REGISTER — Step 2: Verify OTP
        ════════════════════════ */}
        {tab === 'register' && regStep === 'verify' && (
          <div style={card}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, color: dark ? '#f1f5f9' : '#0f172a' }}>
              {verified ? '✅ Verified!' : verifyMethod === 'email' ? '📧 Email Verification' : '📱 Phone Verification'}
            </h2>
            <p style={{ color: dark ? '#4b5563' : '#6b7280', fontSize: 13, marginBottom: 16 }}>
              {verified ? 'OTP confirmed. Complete your registration below.' : `OTP sent to ${verifyMethod === 'email' ? form.email : form.phone}`}
            </p>
            <Prog step={2} />

            {!verified ? (
              <>
                {/* Where OTP was sent */}
                <div style={{ background: dark ? '#1a1a2e' : '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: dark ? '#a5b4fc' : '#4f46e5', margin: 0 }}>
                    {verifyMethod === 'email'
                      ? <>📧 OTP sent to your email <strong>{form.email}</strong></>
                      : <>📱 OTP sent as SMS to <strong>{form.phone}</strong></>}
                    <br /><span style={{ fontSize: 11, opacity: 0.7 }}>Check your inbox / messages. Check spam folder too.</span>
                  </p>
                </div>

                {/* Dev mode OTP box */}
                <DevOtpBox emailOtp={devOtps.email} phoneOtp={devOtps.phone} dark={dark} />

                {/* Method switcher */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  {[['email', '📧 Email OTP'], ['phone', '📱 Phone OTP']].map(([m, l]) => (
                    <button key={m} onClick={() => { setVerifyMethod(m); setRegOtp(['','','','','','']); setError(''); }}
                      style={{ flex: 1, padding: 9, borderRadius: 10, border: `2px solid ${verifyMethod === m ? '#6366f1' : dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`, background: verifyMethod === m ? '#6366f118' : 'transparent', color: verifyMethod === m ? '#6366f1' : dark ? '#64748b' : '#9ca3af', cursor: 'pointer', fontWeight: 700, fontSize: 12, fontFamily: 'Inter' }}>
                      {l}
                    </button>
                  ))}
                </div>

                <label style={{ ...lbl, textAlign: 'center', marginBottom: 12 }}>Enter 6-digit OTP</label>
                <div style={{ marginBottom: 16 }}>
                  <OTPInput otp={regOtp} setOtp={setRegOtp} firstRef={firstRegOtpRef} />
                </div>

                <p style={{ textAlign: 'center', fontSize: 13, color: dark ? '#4b5563' : '#6b7280', marginBottom: 16 }}>
                  {otpExpired
                    ? <button onClick={resendRegOtp} style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'Inter' }}>🔄 OTP expired — Resend</button>
                    : <>⏱ Expires in <Timer seconds={600} onExpire={() => setOtpExpired(true)} key={otpTimerKey} /></>}
                </p>

                {success && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#059669', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 14, textAlign: 'center' }}>{success}</div>}
                <Err msg={error} dark={dark} />

                <button onClick={handleVerifyRegOtp} disabled={regOtp.join('').length < 6 || loading || otpExpired}
                  className="btn-primary" style={{ width: '100%', padding: 13, fontSize: 15, opacity: regOtp.join('').length < 6 ? 0.5 : 1 }}>
                  {loading ? '⏳ Verifying...' : '✓ Verify OTP'}
                </button>
                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  <button onClick={() => { setRegStep('form'); setError(''); setDevOtps({ email: '', phone: '' }); }}
                    style={{ flex: 1, padding: 10, borderRadius: 10, border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`, background: 'transparent', color: dark ? '#64748b' : '#6b7280', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Inter' }}>← Back</button>
                  <button onClick={resendRegOtp} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid #6366f130', background: '#6366f108', color: '#6366f1', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Inter' }}>🔄 Resend OTP</button>
                </div>
              </>
            ) : (
              /* ── Verified → Complete Registration ── */
              <>
                <div style={{ textAlign: 'center', padding: '12px 0 20px' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, margin: '0 auto 12px', boxShadow: '0 8px 24px rgba(16,185,129,0.35)' }}>✓</div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#10b981', marginBottom: 3 }}>Identity Verified!</p>
                  <p style={{ color: dark ? '#4b5563' : '#6b7280', fontSize: 13 }}>via {verifiedMethod === 'email' ? '📧 Email OTP' : '📱 Phone OTP'}</p>
                  {isAdmin && <p style={{ color: '#7c3aed', fontSize: 12, marginTop: 6, fontWeight: 600 }}>🪪 Govt ID recorded securely</p>}
                </div>
                {success && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#059669', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 14, textAlign: 'center' }}>{success}</div>}
                <Err msg={error} dark={dark} />
                <button onClick={handleRegister} disabled={loading} className="btn-primary" style={{ width: '100%', padding: 13, fontSize: 15 }}>
                  {loading ? '⏳ Creating Account...' : `${ROLES[form.role].icon} Complete Registration →`}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

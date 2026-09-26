import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

/* ── Star field ── */
const Stars = ({ count = 120 }) => {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5, delay: Math.random() * 5, duration: Math.random() * 3 + 2,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {stars.map(s => (
        <div key={s.id} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, borderRadius: '50%', background: 'white', animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`, opacity: 0 }} />
      ))}
    </div>
  );
};
const Orb = ({ style }) => <div style={{ borderRadius: '50%', filter: 'blur(80px)', position: 'absolute', pointerEvents: 'none', animation: 'float 8s ease-in-out infinite', ...style }} />;

/* ── Flow arrow ── */
const Arrow = ({ vertical }) => (
  vertical
    ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, margin: '0 auto' }}>
        <div style={{ width: 2, height: 32, background: 'linear-gradient(to bottom,#6366f1,#8b5cf6)' }} />
        <div style={{ width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '10px solid #8b5cf6' }} />
      </div>
    : <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ height: 2, width: 32, background: 'linear-gradient(to right,#6366f1,#8b5cf6)' }} />
        <div style={{ width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: '10px solid #8b5cf6' }} />
      </div>
);

const FEATURES = [
  { icon: '🪪', title: 'Consent-Based Digital ID', desc: 'Every trainee gets a portable, privacy-first digital identity linked across all programmes.' },
  { icon: '🔗', title: 'Training → Job Linkage', desc: 'Automatically connect training completion to real employment outcomes and employer data.' },
  { icon: '📞', title: 'Automated Follow-Ups', desc: 'IVR, SMS and WhatsApp check-ins at 1, 3, 6, 12 months — zero manual effort.' },
  { icon: '📈', title: 'Wage & Retention Tracker', desc: 'Track salary growth, promotions and job tenure to measure long-term training value.' },
  { icon: '🎯', title: 'AI Skill Gap Analysis', desc: 'Identify exactly which skills cause non-placement, attrition or wage stagnation.' },
  { icon: '📊', title: 'Cohort Analytics', desc: 'Drill by district, gender, sector, provider — spot equity gaps and target action.' },
];

const STATS = [
  { n: '47M+', l: 'Trainees Enrolled', icon: '👤' },
  { n: '<30%', l: 'Verified Placements', icon: '❌' },
  { n: '₹12K Cr', l: 'Annual Budget', icon: '💰' },
  { n: '500+', l: 'Training Providers', icon: '🏫' },
];

const ROLES = [
  { icon: '🏛️', title: 'Admin / Govt', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)',
    points: ['Oversee entire platform', 'Download official reports', 'View skill gap analytics', 'Approve training centres'] },
  { icon: '🏫', title: 'Training Institute', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)',
    points: ['Manage training batches', 'Track attendance & assessments', 'Issue digital certificates', 'Report placement outcomes'] },
  { icon: '👤', title: 'Candidate', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)',
    points: ['Get portable digital ID', 'Track training progress', 'Apply for jobs', 'Build verified skill profile'] },
  { icon: '🏢', title: 'Employer', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)',
    points: ['Browse verified candidates', 'Confirm hiring & salary', 'Report retention data', 'Access talent analytics'] },
];

const HOW_STEPS = [
  { step: '01', icon: '📝', title: 'Register & Consent',     desc: 'Trainee joins with OTP verification — unique digital ID created, linked to Aadhaar / DigiLocker.',   color: '#6366f1' },
  { step: '02', icon: '📚', title: 'Training Captured',       desc: 'Attendance, assessments, certifications tracked in real time by institute.',                            color: '#8b5cf6' },
  { step: '03', icon: '🤝', title: 'Placement Confirmed',     desc: 'Employer verifies hiring — role, monthly salary and sector recorded on platform.',                       color: '#a855f7' },
  { step: '04', icon: '📞', title: 'Longitudinal Follow-Up',  desc: 'Automated check-ins at 1m / 3m / 6m / 12m capture real retention and wage growth.',                      color: '#c084fc' },
  { step: '05', icon: '📊', title: 'Analytics & Policy',      desc: 'Cohort reports, skill gap alerts and verified evidence for smarter government investment.',               color: '#60a5fa' },
];

const PROBLEMS = [
  { icon: '📵', title: 'Lost Contact',          desc: 'Trainees change numbers — follow-up is impossible without a digital trail.' },
  { icon: '🗂️', title: 'Fragmented Data',       desc: 'Multiple programmes, different IDs. No unified portable record.' },
  { icon: '❌', title: 'No Employer Data',       desc: 'Employers rarely confirm hiring or retention back to providers.' },
  { icon: '💸', title: 'Wasted Budget',          desc: 'Investment flows to underperforming programmes because impact is unmeasured.' },
  { icon: '🔍', title: 'Hidden Skill Gaps',      desc: 'Without outcome data, no one knows which skills are failing in the market.' },
  { icon: '📉', title: 'No Policy Evidence',     desc: 'Programmes are evaluated on enrolment — not lives actually improved.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => setVisible(v => ({ ...v, [e.target.id]: e.isIntersecting }))),
      { threshold: 0.12 }
    );
    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const reg = (id) => el => { sectionRefs.current[id] = el; };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:0.15} 50%{opacity:0.9} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        .reveal { opacity:0; transform:translateY(28px); transition:opacity 0.7s ease, transform 0.7s ease; }
        .reveal.show { opacity:1; transform:translateY(0); }
        .nav-link { color:rgba(255,255,255,0.75); text-decoration:none; font-size:14px; font-weight:500; transition:color 0.2s; }
        .nav-link:hover { color:white; }
        .feature-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:28px; transition:all 0.3s; cursor:default; }
        .feature-card:hover { background:rgba(99,102,241,0.1); border-color:rgba(99,102,241,0.4); transform:translateY(-4px); }
        .flow-step:hover { transform:translateY(-3px) scale(1.02); }
        .role-card:hover { transform:translateY(-6px); }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? (dark ? 'rgba(8,8,16,0.92)' : 'rgba(255,255,255,0.92)') : 'linear-gradient(to bottom,rgba(5,5,15,0.75),transparent)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${dark ? 'rgba(255,255,255,0.07)' : '#f0f0f8'}` : 'none',
        padding: '0 48px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26 }}>🎓</span>
          <span style={{ fontSize: 20, fontWeight: 900, background: 'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillTrack</span>
        </div>
        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {[['features','Capabilities'], ['problem','Challenge'], ['how-it-works','Platform'], ['roles','Stakeholders']].map(([id, t]) => (
            <a key={id} className="nav-link" href={`#${id}`} style={{ color: scrolled ? (dark ? 'rgba(255,255,255,0.7)' : '#374151') : 'rgba(255,255,255,0.85)' }}>{t}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={toggle} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: scrolled ? (dark ? '#94a3b8' : '#374151') : 'white', borderRadius: 30, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Inter' }}>
            {dark ? '☀️' : '🌙'}
          </button>
          <button onClick={() => navigate('/login')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', color: scrolled ? (dark ? '#94a3b8' : '#4f46e5') : 'white', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: 'Inter' }}>Login</button>
          <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '8px 20px' }}>Get Started →</button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #05050f 0%, #0d0b20 35%, #12082a 65%, #0a0a18 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: '120px 40px 80px' }}>
        <Stars count={140} />
        <Orb style={{ width: 500, height: 500, background: 'rgba(99,102,241,0.12)', top: '5%', left: '-10%' }} />
        <Orb style={{ width: 400, height: 400, background: 'rgba(139,92,246,0.1)', bottom: '10%', right: '-5%', animationDelay: '2s' }} />
        <Orb style={{ width: 300, height: 300, background: 'rgba(168,85,247,0.08)', top: '40%', right: '15%', animationDelay: '4s' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 880, animation: 'fadeUp 0.8s ease both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', padding: '7px 20px', borderRadius: 30, marginBottom: 32, color: '#a78bfa', fontSize: 13, fontWeight: 700, backdropFilter: 'blur(10px)' }}>
            🇮🇳 &nbsp; India's First Longitudinal Skilling Outcomes Platform
          </div>
          <h1 style={{ fontSize: 68, fontWeight: 900, color: 'white', lineHeight: 1.08, marginBottom: 28, letterSpacing: -2 }}>
            Track Every Trainee.{' '}
            <br />
            <span style={{ background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Prove Real Impact.
            </span>
          </h1>
          <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, maxWidth: 660, margin: '0 auto 44px' }}>
            SkillTrack links training to jobs, tracks wages over time, validates employer data — and turns outcomes into <strong style={{ color: 'rgba(255,255,255,0.85)' }}>evidence for smarter policy.</strong>
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '15px 36px', fontSize: 16 }}>🚀 Enter Platform</button>
            <button className="btn-ghost" onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '15px 36px', fontSize: 16 }}>📋 See the Problem</button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, marginTop: 72, background: 'rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ padding: '24px 20px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', textAlign: 'center' }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 30, fontWeight: 900, color: 'white', letterSpacing: -1 }}>{s.n}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4, fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.3)' }}>
          <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)' }} />
        </div>
      </section>

      {/* ── PROBLEM ─────────────────────────────────────── */}
      <section id="problem" style={{ padding: '100px 48px', background: dark ? 'var(--bg2)' : '#fafbff' }} ref={reg('problem')}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div id="problem-head" ref={reg('problem-head')} className={`reveal ${visible['problem-head'] ? 'show' : ''}`} style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-pill">⚠️ The Challenge</span>
            <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1.5, marginBottom: 16 }}>
              Why Outcomes Stay <span className="gradient-text">Invisible</span>
            </h2>
            <p style={{ fontSize: 17, color: 'var(--text2)', maxWidth: 600, margin: '0 auto', lineHeight: 1.75 }}>
              India spends ₹12,000 crore annually on skilling — but <strong>less than 30% of placements are ever verified.</strong> Here's why:
            </p>
          </div>

          {/* Problem grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18, marginBottom: 64 }}>
            {PROBLEMS.map((p, i) => (
              <div key={i} id={`prob-${i}`} ref={reg(`prob-${i}`)} className={`reveal ${visible[`prob-${i}`] ? 'show' : ''}`}
                style={{ background: dark ? 'var(--surface)' : 'white', borderRadius: 18, padding: '24px 26px', border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#f0f0f8'}`, transition: 'all 0.25s', cursor: 'default', position: 'relative', overflow: 'hidden' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.12)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.06)' : '#f0f0f8'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ position: 'absolute', top: -10, right: -10, width: 60, height: 60, background: 'rgba(239,68,68,0.06)', borderRadius: '50%' }} />
                <span style={{ fontSize: 36, display: 'block', marginBottom: 14 }}>{p.icon}</span>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, color: dark ? '#f1f5f9' : '#0f172a' }}>{p.title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: 13.5, lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Before/After comparison */}
          <div id="before-after" ref={reg('before-after')} className={`reveal ${visible['before-after'] ? 'show' : ''}`}
            style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 0, alignItems: 'stretch', borderRadius: 24, overflow: 'hidden', border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#f0f0f8'}` }}>
            {/* Before */}
            <div style={{ background: dark ? 'rgba(239,68,68,0.08)' : '#fef2f2', padding: '32px 36px', borderRight: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#fca5a5'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>❌</div>
                <span style={{ fontWeight: 900, fontSize: 16, color: '#dc2626' }}>Without SkillTrack</span>
              </div>
              {['Enrolment tracked, outcomes unknown', 'No employer verification', 'Trainees disappear after training', 'Budget wasted on bad programmes', 'Policy built on incomplete data'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                  <span style={{ color: '#ef4444', fontWeight: 800, fontSize: 16, marginTop: 1, flexShrink: 0 }}>✗</span>
                  <span style={{ fontSize: 13.5, color: dark ? 'rgba(255,255,255,0.7)' : '#374151', lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
            {/* Divider */}
            <div style={{ background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', width: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontSize: 20, fontWeight: 900, transform: 'rotate(-90deg)', whiteSpace: 'nowrap', letterSpacing: 2 }}>VS</span>
            </div>
            {/* After */}
            <div style={{ background: dark ? 'rgba(16,185,129,0.08)' : '#f0fdf4', padding: '32px 36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✅</div>
                <span style={{ fontWeight: 900, fontSize: 16, color: '#059669' }}>With SkillTrack</span>
              </div>
              {['Full outcome tracking — jobs, salary, retention', 'Employer confirms every placement', 'Automated 12-month follow-up trail', 'Budget flows to proven programmes', 'Real evidence drives better policy'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                  <span style={{ color: '#10b981', fontWeight: 800, fontSize: 16, marginTop: 1, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13.5, color: dark ? 'rgba(255,255,255,0.7)' : '#374151', lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATFORM FLOWCHART ───────────────────────────── */}
      <section id="how-it-works" style={{ padding: '100px 48px', background: dark ? 'linear-gradient(180deg,#080810,#0a0a16)' : 'linear-gradient(180deg,#f0f4ff,#fafbff)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div id="how-head" ref={reg('how-head')} className={`reveal ${visible['how-head'] ? 'show' : ''}`} style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-pill">🗺️ Platform Flow</span>
            <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1.5, marginBottom: 16 }}>
              How <span className="gradient-text">SkillTrack</span> Works
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>A complete outcome journey — from first registration to policy decisions</p>
          </div>

          {/* Horizontal flow — desktop */}
          <div id="flow-row" ref={reg('flow-row')} className={`reveal ${visible['flow-row'] ? 'show' : ''}`}
            style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0, marginBottom: 64, overflowX: 'auto', paddingBottom: 8 }}>
            {HOW_STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}>
                {/* Card */}
                <div className="flow-step" style={{ width: 160, background: dark ? 'rgba(255,255,255,0.04)' : 'white', border: `2px solid ${s.color}40`, borderRadius: 20, padding: '22px 16px', textAlign: 'center', cursor: 'default', transition: 'all 0.25s', boxShadow: dark ? 'none' : `0 4px 20px ${s.color}18` }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${s.color}20`, border: `2px solid ${s.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 12px', boxShadow: `0 4px 16px ${s.color}30` }}>
                    {s.icon}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: s.color, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>Phase {s.step}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: dark ? '#f1f5f9' : '#0f172a', marginBottom: 8, lineHeight: 1.3 }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.6 }}>{s.desc}</div>
                </div>
                {/* Arrow between */}
                {i < HOW_STEPS.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', paddingTop: 26, flexShrink: 0 }}>
                    <div style={{ width: 18, height: 2, background: `linear-gradient(to right,${s.color},${HOW_STEPS[i+1].color})` }} />
                    <div style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: `9px solid ${HOW_STEPS[i+1].color}` }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Data flow diagram */}
          <div id="data-flow" ref={reg('data-flow')} className={`reveal ${visible['data-flow'] ? 'show' : ''}`}
            style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'white', border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#f0f0f8'}`, borderRadius: 24, padding: '40px', boxShadow: dark ? 'none' : '0 8px 40px rgba(99,102,241,0.08)' }}>
            <h3 style={{ textAlign: 'center', fontSize: 18, fontWeight: 800, marginBottom: 32, color: dark ? '#f1f5f9' : '#0f172a' }}>⚡ Intelligence Pipeline</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {/* Column 1 — Inputs */}
              <div>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <span style={{ background: '#6366f120', border: '1px solid #6366f140', color: '#6366f1', padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>📥 Inputs</span>
                </div>
                {[
                  { icon: '👤', label: 'Candidate Enrolment', color: '#f59e0b' },
                  { icon: '🏫', label: 'Institute Training Data', color: '#10b981' },
                  { icon: '🏢', label: 'Employer Confirmation', color: '#ef4444' },
                  { icon: '📱', label: 'SMS / IVR Follow-Up', color: '#6366f1' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: dark ? 'rgba(255,255,255,0.04)' : '#f8faff', borderRadius: 12, marginBottom: 10, border: `1px solid ${item.color}30` }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: dark ? '#cbd5e1' : '#374151' }}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Column 2 — Platform (middle) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 2, height: 40, background: 'linear-gradient(to bottom,#6366f1,#8b5cf6)' }} />
                <div style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 20, padding: '24px 20px', textAlign: 'center', width: '100%', boxShadow: '0 12px 40px rgba(99,102,241,0.35)', position: 'relative' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🎓</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: 'white', marginBottom: 4 }}>SkillTrack</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Outcome Platform</div>
                  {['🔐 Secure & Verified', '📊 Real-time Analytics', '🔒 Privacy-first', '🤖 AI-powered Gaps'].map((f, i) => (
                    <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '5px 8px', marginBottom: 6 }}>{f}</div>
                  ))}
                </div>
                <div style={{ width: 2, height: 40, background: 'linear-gradient(to bottom,#8b5cf6,#60a5fa)' }} />
              </div>

              {/* Column 3 — Outputs */}
              <div>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <span style={{ background: '#10b98120', border: '1px solid #10b98140', color: '#10b981', padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>📤 Outputs</span>
                </div>
                {[
                  { icon: '📊', label: 'Placement Reports (Excel)', color: '#10b981' },
                  { icon: '🎯', label: 'Skill Gap Radar Report', color: '#f59e0b' },
                  { icon: '📈', label: 'Cohort Outcome Dashboard', color: '#6366f1' },
                  { icon: '🏛️', label: 'Govt Policy Evidence', color: '#8b5cf6' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: dark ? 'rgba(255,255,255,0.04)' : '#f0fdf4', borderRadius: 12, marginBottom: 10, border: `1px solid ${item.color}30` }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: dark ? '#cbd5e1' : '#374151' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO IS THIS FOR (ROLES) ──────────────────────── */}
      <section id="roles" style={{ padding: '100px 48px', background: dark ? 'var(--bg2)' : 'white' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div id="roles-head" ref={reg('roles-head')} className={`reveal ${visible['roles-head'] ? 'show' : ''}`} style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-pill">👥 For Everyone</span>
            <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1.5, marginBottom: 16 }}>
              Built for Every <span className="gradient-text">Stakeholder</span>
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
              Four dashboards. One unified platform. Every actor in the skilling ecosystem connected.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20, marginBottom: 56 }}>
            {ROLES.map((r, i) => (
              <div key={i} id={`role-${i}`} ref={reg(`role-${i}`)} className={`reveal role-card ${visible[`role-${i}`] ? 'show' : ''}`}
                style={{ background: dark ? r.bg : 'white', border: `1.5px solid ${r.border}`, borderRadius: 22, padding: '28px 24px', transition: 'all 0.3s', cursor: 'default', boxShadow: `0 4px 20px ${r.color}10` }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: r.bg, border: `2px solid ${r.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 16, boxShadow: `0 4px 16px ${r.color}20` }}>
                  {r.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: r.color, marginBottom: 16 }}>{r.title}</h3>
                {r.points.map((pt, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: r.color, marginTop: 6, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{pt}</span>
                  </div>
                ))}
                <button onClick={() => navigate('/login')} style={{ marginTop: 16, width: '100%', padding: '9px', borderRadius: 10, border: `1.5px solid ${r.color}50`, background: `${r.color}10`, color: r.color, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'Inter' }}>
                  {r.icon} Enter as {r.title.split('/')[0].trim()} →
                </button>
              </div>
            ))}
          </div>

          {/* Connection diagram */}
          <div id="connect" ref={reg('connect')} className={`reveal ${visible['connect'] ? 'show' : ''}`}
            style={{ background: dark ? 'rgba(255,255,255,0.03)' : '#fafbff', border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#f0f0f8'}`, borderRadius: 24, padding: '36px 40px', textAlign: 'center' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>🔗 How They're All Connected</h3>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 28 }}>Every action by one stakeholder creates value for another</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap', rowGap: 20 }}>
              {[
                { icon: '🏛️', label: 'Govt Admin', color: '#6366f1', action: 'Sets policy & monitors' },
                null,
                { icon: '🏫', label: 'Institute', color: '#10b981', action: 'Trains & certifies' },
                null,
                { icon: '👤', label: 'Candidate', color: '#f59e0b', action: 'Learns & gets placed' },
                null,
                { icon: '🏢', label: 'Employer', color: '#ef4444', action: 'Hires & confirms' },
              ].map((item, i) => item === null ? (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 24, height: 2, background: 'linear-gradient(to right,#6366f1,#8b5cf6)' }} />
                  <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #8b5cf6' }} />
                </div>
              ) : (
                <div key={i} style={{ textAlign: 'center', padding: '16px 18px', background: dark ? `${item.color}12` : `${item.color}0d`, border: `1.5px solid ${item.color}30`, borderRadius: 16, minWidth: 110 }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: item.color }}>{item.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4, lineHeight: 1.4 }}>{item.action}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, fontSize: 13, color: 'var(--text2)' }}>
              All data flows back to <strong style={{ color: '#6366f1' }}>SkillTrack</strong> — creating a complete, verified record of every skilling journey.
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 48px', background: dark ? 'linear-gradient(180deg,#080810,#0a0a16)' : 'linear-gradient(180deg,#f0f4ff,#fafbff)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div id="feat-head" ref={reg('feat-head')} className={`reveal ${visible['feat-head'] ? 'show' : ''}`} style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-pill">✨ Capabilities</span>
            <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1.5, marginBottom: 16 }}>
              Built for <span className="gradient-text">Complete Outcome Accountability</span>
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>Everything needed to track training from classroom to career</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 18 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: dark ? '#f1f5f9' : '#0f172a' }}>{f.title}</h3>
                <p style={{ color: dark ? 'rgba(255,255,255,0.5)' : '#6b7280', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section style={{ padding: '100px 48px', background: 'linear-gradient(135deg, #0a0214 0%, #1e0533 40%, #0d0920 100%)', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <Stars count={80} />
        <Orb style={{ width: 400, height: 400, background: 'rgba(99,102,241,0.12)', top: '-20%', left: '10%' }} />
        <Orb style={{ width: 350, height: 350, background: 'rgba(139,92,246,0.1)', bottom: '-15%', right: '5%', animationDelay: '3s' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 52, fontWeight: 900, letterSpacing: -2, lineHeight: 1.1, marginBottom: 20 }}>
            Every Trainee Deserves to Be{' '}
            <span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Counted 🇮🇳</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 44 }}>
            Stop measuring inputs. Start measuring lives changed. Build India's most credible, transparent, outcome-driven skilling ecosystem.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
            <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '16px 44px', fontSize: 17 }}>🚀 Enter Platform</button>
            <button className="btn-ghost" onClick={() => navigate('/login')} style={{ padding: '16px 44px', fontSize: 17 }}>📊 View Dashboard</button>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', borderRadius: 20, padding: '28px 36px' }}>
            <p style={{ fontSize: 18, fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', lineHeight: 1.75 }}>
              "The best investment a nation can make is in its people — but only if we measure whether that investment is actually paying off."
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 12, letterSpacing: 0.5 }}>— Inspired by India's National Skill Development Mission</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer style={{ background: '#05050d', padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 20 }}>🎓</span>
            <span style={{ color: 'white', fontSize: 17, fontWeight: 800 }}>SkillTrack</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>India's Longitudinal Skilling Outcomes Platform</p>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {['Ministry of Skill Dev', 'NSDC', 'Skill India', 'DigiLocker'].map(l => (
            <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color='rgba(255,255,255,0.8)'}
              onMouseOut={e => e.target.style.color='rgba(255,255,255,0.35)'}>{l}</a>
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>© 2024 SkillTrack · Built for Bharat 🇮🇳</p>
      </footer>
    </div>
  );
}

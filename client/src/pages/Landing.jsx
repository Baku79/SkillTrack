import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

/* ── Star field generator ── */
const Stars = ({ count = 120 }) => {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: '50%', background: 'white',
          animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
          opacity: 0,
        }} />
      ))}
    </div>
  );
};

/* ── Floating orb ── */
const Orb = ({ style }) => (
  <div style={{ borderRadius: '50%', filter: 'blur(80px)', position: 'absolute', pointerEvents: 'none', animation: 'float 8s ease-in-out infinite', ...style }} />
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
  { n: '47M+', l: 'Trainees Enrolled' },
  { n: '<30%', l: 'Verified Placements' },
  { n: '₹12Kcr', l: 'Annual Budget' },
  { n: '500+', l: 'Training Providers' },
];

const STEPS = [
  { step: '01', icon: '📝', title: 'Register & Consent', desc: 'Trainee joins with consent — unique ID created, linked to Aadhaar / DigiLocker.' },
  { step: '02', icon: '📚', title: 'Training Captured', desc: 'Attendance, assessments, certifications tracked in real time.' },
  { step: '03', icon: '🤝', title: 'Placement Confirmed', desc: 'Employer verifies hiring — role, salary and sector recorded.' },
  { step: '04', icon: '📞', title: 'Longitudinal Follow-Up', desc: 'Automated 1m / 3m / 6m / 12m check-ins capture retention and wage growth.' },
  { step: '05', icon: '📊', title: 'Analytics & Policy', desc: 'Cohort reports, skill gap alerts and evidence for smarter resource allocation.' },
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
      { threshold: 0.15 }
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
        .reveal { opacity:0; transform:translateY(28px); transition:opacity 0.7s ease, transform 0.7s ease; }
        .reveal.show { opacity:1; transform:translateY(0); }
        .hero-card { transition:all 0.3s; }
        .hero-card:hover { transform:translateY(-6px) scale(1.02); }
        .nav-link { color:rgba(255,255,255,0.75); text-decoration:none; font-size:14px; font-weight:500; transition:color 0.2s; }
        .nav-link:hover { color:white; }
        .feature-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:28px; transition:all 0.3s; cursor:default; }
        .feature-card:hover { background:rgba(99,102,241,0.1); border-color:rgba(99,102,241,0.4); transform:translateY(-4px); }
      `}</style>

      {/* ── STICKY NAV ─────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? (dark ? 'rgba(8,8,16,0.92)' : 'rgba(255,255,255,0.92)') : 'transparent',
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
          {['Features', 'Problem', 'How It Works'].map(t => (
            <a key={t} className="nav-link" href={`#${t.toLowerCase().replace(/ /g,'-')}`} style={{ color: scrolled ? (dark ? 'rgba(255,255,255,0.7)' : '#374151') : 'rgba(255,255,255,0.75)' }}>{t}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={toggle} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: scrolled ? (dark ? '#94a3b8' : '#374151') : 'white', borderRadius: 30, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Inter' }}>
            {dark ? '☀️' : '🌙'}
          </button>
          <button onClick={() => navigate('/login')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', color: scrolled ? (dark ? '#94a3b8' : '#4f46e5') : 'white', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: 'Inter' }}>
            Login
          </button>
          <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '8px 20px' }}>Get Started →</button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #05050f 0%, #0d0b20 35%, #12082a 65%, #0a0a18 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', textAlign: 'center', padding: '120px 40px 80px',
      }}>
        <Stars count={140} />
        <Orb style={{ width: 500, height: 500, background: 'rgba(99,102,241,0.12)', top: '5%', left: '-10%', animationDelay: '0s' }} />
        <Orb style={{ width: 400, height: 400, background: 'rgba(139,92,246,0.1)', bottom: '10%', right: '-5%', animationDelay: '2s' }} />
        <Orb style={{ width: 300, height: 300, background: 'rgba(168,85,247,0.08)', top: '40%', right: '15%', animationDelay: '4s' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 860, animation: 'fadeUp 0.8s ease both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', padding: '7px 20px', borderRadius: 30, marginBottom: 32, color: '#a78bfa', fontSize: 13, fontWeight: 700, backdropFilter: 'blur(10px)' }}>
            🇮🇳 &nbsp; Solving India's ₹12,000 Cr Skilling Accountability Crisis
          </div>

          <h1 style={{ fontSize: 68, fontWeight: 900, color: 'white', lineHeight: 1.08, marginBottom: 28, letterSpacing: -2 }}>
            Track Every Trainee.{' '}
            <br />
            <span style={{ background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Prove Real Impact.
            </span>
          </h1>

          <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, maxWidth: 660, margin: '0 auto 44px' }}>
            A longitudinal outcomes platform that links training to jobs, tracks wages over time, validates employer data — and generates <strong style={{ color: 'rgba(255,255,255,0.85)' }}>evidence for evidence-based policy.</strong>
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '15px 36px', fontSize: 16 }}>
              🚀 Enter Platform
            </button>
            <button className="btn-ghost" onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '15px 36px', fontSize: 16 }}>
              📋 See the Problem
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, marginTop: 80, background: 'rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ padding: '24px 20px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: 'white', letterSpacing: -1 }}>{s.n}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4, fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.3)' }}>
          <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)' }} />
        </div>
      </section>

      {/* ── PROBLEM STATEMENT ─────────────────────────── */}
      <section id="problem" style={{ padding: '100px 48px', background: dark ? 'var(--bg2)' : '#fafbff' }}
        ref={reg('problem')}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }} id="problem-head" ref={reg('problem-head')} className={`reveal ${visible['problem-head'] ? 'show' : ''}`}>
            <span className="section-pill">⚠️ The Challenge</span>
            <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1.5, marginBottom: 16 }}>Why Outcomes Stay <span className="gradient-text">Invisible</span></h2>
            <p style={{ fontSize: 17, color: 'var(--text2)', maxWidth: 580, margin: '0 auto', lineHeight: 1.75 }}>
              Enrolment is captured. Employment is not. This is the gap SkillTrack closes.
            </p>
          </div>

          {/* Problem card — redesigned */}
          <div id="problem-card" ref={reg('problem-card')} className={`reveal ${visible['problem-card'] ? 'show' : ''}`}
            style={{ background: dark ? 'linear-gradient(135deg, #0c0c1e, #14103a)' : 'linear-gradient(135deg, #1e1b4b, #2e1065)', borderRadius: 24, padding: '40px 48px', marginBottom: 48, color: 'white', position: 'relative', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.2)' }}>
            {/* Decorative ring */}
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, border: '1px solid rgba(99,102,241,0.2)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, border: '1px solid rgba(139,92,246,0.2)', borderRadius: '50%' }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', padding: '5px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 24, color: '#a78bfa' }}>
                📋 Official Problem Statement
              </div>
              {[
                <><strong style={{ color: 'white' }}>Training systems frequently capture enrolment, attendance, assessment and certification,</strong> but reliable information on employment, self-employment, job retention, wage progression, relevance of training and longer-term livelihood outcomes may remain incomplete.</>,
                <>Trainees may change phone numbers or locations, employers may not report consistently, and multiple programmes may use <span style={{ color: '#818cf8', fontWeight: 600 }}>different identifiers and definitions.</span></>,
                <>Without longitudinal outcomes, it is difficult to <span style={{ color: '#60a5fa', fontWeight: 600 }}>compare providers, improve courses, target future investments or demonstrate public value.</span> The challenge is to establish credible, low-burden and privacy-conscious outcome tracking.</>
              ].map((para, i) => (
                <p key={i} style={{ fontSize: 16, lineHeight: 1.85, color: 'rgba(255,255,255,0.8)', marginBottom: i < 2 ? 18 : 0 }}>{para}</p>
              ))}
            </div>
          </div>

          {/* Problem grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { icon: '📵', t: 'Lost Contact', d: 'Trainees change numbers or relocate — post-training follow-up becomes impossible without a digital trail.' },
              { icon: '🗂️', t: 'Fragmented Data', d: 'Multiple programmes use different IDs. No unified, portable record of a trainee\'s full journey.' },
              { icon: '❌', t: 'Employer Non-Reporting', d: 'Employers rarely confirm hiring or retention data back to training providers or government.' },
              { icon: '💸', t: 'Misallocated Resources', d: 'Investment flows to underperforming programmes because impact is never independently measured.' },
              { icon: '🔍', t: 'Hidden Skill Gaps', d: 'Without outcome data, it\'s impossible to know which skills are actually failing in the labour market.' },
              { icon: '📉', t: 'No Policy Evidence', d: 'Programmes are evaluated on enrolment, not livelihoods — making evidence-based policy impossible.' },
            ].map((p, i) => (
              <div key={i} style={{ background: dark ? 'var(--surface)' : 'white', borderRadius: 16, padding: 24, border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#f0f0f8'}`, transition: 'all 0.25s', cursor: 'default' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.06)' : '#f0f0f8'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <span style={{ fontSize: 34, display: 'block', marginBottom: 14 }}>{p.icon}</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{p.t}</h3>
                <p style={{ color: 'var(--text2)', fontSize: 13.5, lineHeight: 1.7 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 48px', background: dark ? 'linear-gradient(180deg, #080810 0%, #0a0a16 100%)' : 'linear-gradient(180deg, #f0f4ff 0%, #fafbff 100%)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div id="feat-head" ref={reg('feat-head')} className={`reveal ${visible['feat-head'] ? 'show' : ''}`} style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-pill">✨ Our Solution</span>
            <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1.5, marginBottom: 16 }}>
              Built for <span className="gradient-text">Complete Outcome Accountability</span>
            </h2>
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

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '100px 48px', background: dark ? 'var(--bg2)' : 'white' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div id="how-head" ref={reg('how-head')} className={`reveal ${visible['how-head'] ? 'show' : ''}`} style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-pill">🗺️ The Journey</span>
            <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1.5 }}>How SkillTrack Works</h2>
            <p style={{ color: 'var(--text2)', marginTop: 12, fontSize: 16 }}>Five phases from enrolment to evidence-based policy</p>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 27, top: 28, bottom: 28, width: 2, background: 'linear-gradient(180deg, #6366f1, #c084fc, #60a5fa)' }} />
            {STEPS.map((s, i) => (
              <div key={i} id={`step-${i}`} ref={reg(`step-${i}`)} className={`reveal ${visible[`step-${i}`] ? 'show' : ''}`}
                style={{ display: 'flex', gap: 24, marginBottom: 28, animationDelay: `${i * 0.1}s` }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, position: 'relative', zIndex: 1, boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
                  {s.icon}
                </div>
                <div style={{ background: dark ? 'var(--surface)' : 'white', borderRadius: 16, padding: '20px 24px', flex: 1, border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#f0f0f8'}`, boxShadow: dark ? 'none' : '0 2px 12px rgba(99,102,241,0.06)' }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1.5 }}>Phase {s.step}</span>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: '6px 0 8px' }}>{s.title}</h3>
                  <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
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
          {/* Quote */}
          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', borderRadius: 20, padding: '28px 36px' }}>
            <p style={{ fontSize: 18, fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', lineHeight: 1.75 }}>
              "The best investment a nation can make is in its people — but only if we measure whether that investment is actually paying off."
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 12, letterSpacing: 0.5 }}>— Inspired by India's National Skill Development Mission</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
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

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

/* ─── Data ─────────────────────────────────────────────── */
const stats = [
  { value: '4k+', label: 'Skill India Trainees' },
  { value: '74%', label: 'Avg Placement Gap' },
  { value: '₹12,Cr', label: 'Annual Skilling Budget' },
  { value: '500+', label: 'Training Providers' },
];

const problems = [
  { icon: '📵', title: 'Lost Contact', desc: 'Trainees change phone numbers or locations after training — follow-up becomes impossible.' },
  { icon: '🗂️', title: 'Fragmented Data', desc: 'Multiple programmes use different identifiers. No unified record of a trainee\'s journey.' },
  { icon: '📉', title: 'No Longitudinal Tracking', desc: 'Enrolment is captured but employment, wage growth, and retention outcomes are missing.' },
  { icon: '❌', title: 'Employer Non-Reporting', desc: 'Employers rarely report hiring or retention data back to training providers.' },
  { icon: '🔍', title: 'Hidden Skill Gaps', desc: 'Without outcome data, it\'s impossible to identify which skills are failing in the market.' },
  { icon: '💸', title: 'Misallocated Resources', desc: 'Investments go to underperforming programmes because impact is never properly measured.' },
];

const features = [
  { icon: '🪪', title: 'Consent-Based Trainee Records', desc: 'Create portable, privacy-conscious digital profiles for every trainee — linked across programmes using a single ID.', color: '#4f46e5' },
  { icon: '🔗', title: 'Training → Placement Linkage', desc: 'Automatically link training completion with placement data, employment signals, and employer confirmations.', color: '#7c3aed' },
  { icon: '📞', title: 'Automated Follow-Ups', desc: 'IVR calls, SMS nudges, and WhatsApp check-ins at 1, 3, 6, 12-month intervals to track long-term outcomes.', color: '#059669' },
  { icon: '💼', title: 'Self-Employment & Apprenticeship', desc: 'Captures non-formal outcomes — gig work, micro-entrepreneurship, and apprenticeships with equal rigour.', color: '#d97706' },
  { icon: '✅', title: 'Employer Validation', desc: 'Employers confirm hiring, salary, and retention through a simple portal — reducing self-reporting bias.', color: '#dc2626' },
  { icon: '📈', title: 'Wage & Retention Progression', desc: 'Track salary growth, promotions, and job tenure to measure the real long-term value of training.', color: '#0891b2' },
  { icon: '📊', title: 'Cohort & Demographic Analytics', desc: 'Drill down by district, gender, caste, sector, and provider to identify equity gaps and target interventions.', color: '#7c3aed' },
  { icon: '🎯', title: 'Skill Gap Intelligence', desc: 'AI-powered analysis to identify which skills are causing non-placement, attrition, or wage stagnation.', color: '#4f46e5' },
];

const benefits = [
  { role: '🏛️ Government & Policy', points: ['Evidence-based policy design', 'Outcome-linked budget allocation', 'Provider accountability dashboards', 'District-level gap targeting'] },
  { role: '🏫 Training Institutes', points: ['Real-time placement tracking', 'Course improvement signals', 'Compliance reporting made easy', 'Benchmark against peers'] },
  { role: '👤 Candidates', points: ['Portable digital skill passport', 'Employment journey timeline', 'Wage progression visibility', 'Grievance & support access'] },
  { role: '🏢 Employers', points: ['Pre-screened candidate pool', 'Skill-match hiring', 'Easy placement confirmation', 'Workforce pipeline planning'] },
];

const testimonials = [
  { quote: 'For the first time, we can see whether our trainees are actually employed 6 months later. This changes everything for programme design.', name: 'Dr. Anita Sharma', role: 'Secretary, Skill Development Ministry', avatar: 'A' },
  { quote: 'We used to guess about placement rates. Now we have verified employer data in real-time. Our funding decisions are finally evidence-based.', name: 'Rajesh Menon', role: 'Director, NSDC Partner Institute', avatar: 'R' },
  { quote: 'I can see my certifications, my job, my salary growth — all in one place. It feels like my hard work is finally being counted.', name: 'Priya Sharma', role: 'Candidate, Digital Marketing Graduate', avatar: 'P' },
];

const timeline = [
  { phase: 'Phase 1', title: 'Enrolment & Consent', desc: 'Trainee registers, gives consent, gets unique digital ID linked to Aadhaar/DigiLocker', icon: '📝' },
  { phase: 'Phase 2', title: 'Training Tracking', desc: 'Attendance, assessments, certifications captured in real-time', icon: '📚' },
  { phase: 'Phase 3', title: 'Placement Linkage', desc: 'Job placement confirmed by employer, salary and role recorded', icon: '🤝' },
  { phase: 'Phase 4', title: 'Longitudinal Follow-up', desc: 'Automated check-ins at 1m, 3m, 6m, 12m to track retention and wage growth', icon: '📞' },
  { phase: 'Phase 5', title: 'Analytics & Action', desc: 'Cohort reports, skill gap alerts, policy recommendations generated', icon: '📊' },
];

/* ─── Component ─────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      {/* ── Sticky Navbar ─────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 48px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>🎓</span>
          <span style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillTrack</span>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {['Features', 'Problem', 'Benefits', 'How It Works'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
              style={{ color: scrolled ? '#374151' : 'white', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'opacity 0.2s' }}
              onMouseOver={e => e.target.style.opacity = '0.7'}
              onMouseOut={e => e.target.style.opacity = '1'}>
              {item}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('/login')} style={{ background: scrolled ? 'white' : 'rgba(255,255,255,0.15)', color: scrolled ? '#4f46e5' : 'white', border: `2px solid ${scrolled ? '#4f46e5' : 'rgba(255,255,255,0.5)'}`, padding: '8px 20px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            Login
          </button>
          <button className="btn-primary" onClick={() => navigate('/login')}>Get Started →</button>
        </div>
      </nav>

      {/* ── Hero Section ──────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 70%, #4f46e5 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 40px 80px', position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '15%', left: '8%', width: 300, height: 300, background: 'rgba(139,92,246,0.15)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '5%', width: 250, height: 250, background: 'rgba(79,70,229,0.2)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '15%', width: 150, height: 150, background: 'rgba(168,85,247,0.15)', borderRadius: '50%', filter: 'blur(40px)' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 820 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: 30, marginBottom: 28, color: 'white', fontSize: 13, fontWeight: 600 }}>
            🇮🇳 &nbsp; Solving India's ₹12,000 Cr Skilling Outcome Crisis
          </div>

          <h1 style={{ fontSize: 62, fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 24 }}>
            Track Every Trainee.{' '}
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Measure Real Impact.
            </span>
          </h1>

          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 40, maxWidth: 640, margin: '0 auto 40px' }}>
            A longitudinal skilling-outcomes platform that links training with employment, tracks wage progression, validates employer data, and generates evidence for policy — all with trainee consent and privacy at the core.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ padding: '14px 36px', fontSize: 16 }} onClick={() => navigate('/login')}>
              🚀 View Live Dashboard
            </button>
            <button className="btn-ghost" style={{ padding: '14px 36px', fontSize: 16 }} onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}>
              📖 See the Problem
            </button>
          </div>

          {/* Hero Stats */}
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 72, flexWrap: 'wrap' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: 'white' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{s.icon} {s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.5)', fontSize: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span>Scroll to explore</span>
          <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.3)' }} />
        </div>
      </section>

      {/* ── Problem Section ───────────────────────────── */}
      <section id="problem" style={{ padding: '100px 48px', background: '#fafafa' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-tag">⚠️ The Challenge</span>
            <h2 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16 }}>Why Skilling Outcomes Stay Invisible</h2>
            <p style={{ fontSize: 18, color: '#6b7280', maxWidth: 680, margin: '0 auto', lineHeight: 1.7 }}>
              Training systems capture enrolment and certification — but reliable employment, wage, and retention data remain critically incomplete.
            </p>
          </div>

          {/* Problem Statement Box */}
          <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', borderRadius: 20, padding: '40px 48px', marginBottom: 60, color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 200, height: 200, background: 'rgba(139,92,246,0.2)', borderRadius: '50%', filter: 'blur(40px)' }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
                📋 Official Problem Statement
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.9, color: 'rgba(255,255,255,0.85)', marginBottom: 20 }}>
                <strong style={{ color: 'white' }}>Training systems frequently capture enrolment, attendance, assessment and certification,</strong> but reliable information on employment, self-employment, job retention, wage progression, relevance of training and longer-term livelihood outcomes may remain incomplete.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.9, color: 'rgba(255,255,255,0.85)', marginBottom: 20 }}>
                Trainees may change phone numbers or locations, employers may not report consistently, and multiple programmes may use <strong style={{ color: '#a78bfa' }}>different identifiers and definitions.</strong>
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.9, color: 'rgba(255,255,255,0.85)' }}>
                Without longitudinal outcomes, it is difficult to <strong style={{ color: '#60a5fa' }}>compare providers, improve courses, target future investments or demonstrate public value.</strong> The challenge is to establish credible, low-burden and privacy-conscious outcome tracking.
              </p>
            </div>
          </div>

          {/* Problem Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {problems.map(p => (
              <div key={p.title} style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #f0f0f0', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <span style={{ fontSize: 36, display: 'block', marginBottom: 14 }}>{p.icon}</span>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{p.title}</h3>
                <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────────── */}
      <section id="features" style={{ padding: '100px 48px', background: 'linear-gradient(180deg, #f8f7ff 0%, #ffffff 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-tag">✨ Our Solution</span>
            <h2 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16 }}>Everything Needed for Outcome Accountability</h2>
            <p style={{ fontSize: 18, color: '#6b7280', maxWidth: 620, margin: '0 auto', lineHeight: 1.7 }}>
              A comprehensive longitudinal system that turns invisible outcomes into actionable intelligence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: 'white', borderRadius: 16, padding: '28px 24px', border: `1px solid ${f.color}20`, transition: 'all 0.25s', cursor: 'default' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 20px 40px ${f.color}20`; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: 52, height: 52, background: `${f.color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 16 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: '#1a202c' }}>{f.title}</h3>
                <p style={{ color: '#6b7280', fontSize: 13.5, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Expected Outcomes Section ─────────────────── */}
      <section style={{ padding: '100px 48px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)', color: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
              🎯 Expected Outcomes
            </span>
            <h2 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16 }}>What This Platform Achieves</h2>
            <p style={{ fontSize: 18, opacity: 0.8, maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
              From raw training enrolment to longitudinal impact — creating a credible, evidence-based skilling ecosystem.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { icon: '📊', title: 'Higher-Quality Outcome Data', desc: 'Verified, longitudinal employment data instead of self-reported placement numbers' },
              { icon: '🏆', title: 'Provider Accountability', desc: 'Public rankings and outcome reports for all training institutes and programmes' },
              { icon: '🎯', title: 'Targeted Remedial Actions', desc: 'Identify and intervene for non-placed candidates before they disengage' },
              { icon: '💰', title: 'Improved Resource Allocation', desc: 'Fund high-performing programmes; defund or reform those with poor outcomes' },
              { icon: '📜', title: 'Evidence-Based Policy', desc: 'Design future skilling interventions backed by real longitudinal data' },
            ].map(o => (
              <div key={o.title} className="glass-card" style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 40, display: 'block', marginBottom: 16 }}>{o.icon}</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{o.title}</h3>
                <p style={{ opacity: 0.8, fontSize: 13.5, lineHeight: 1.6 }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits by Role ──────────────────────────── */}
      <section id="benefits" style={{ padding: '100px 48px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-tag">🤝 Who Benefits</span>
            <h2 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16 }}>Built for Every Stakeholder</h2>
          </div>

          {/* Role Tabs */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 40, flexWrap: 'wrap' }}>
            {benefits.map((b, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                style={{ padding: '10px 22px', borderRadius: 30, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
                  background: activeTab === i ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : '#f3f4f6',
                  color: activeTab === i ? 'white' : '#374151',
                  boxShadow: activeTab === i ? '0 4px 15px rgba(79,70,229,0.3)' : 'none' }}>
                {b.role}
              </button>
            ))}
          </div>

          <div style={{ background: 'linear-gradient(135deg, #f8f7ff, #ede9fe)', borderRadius: 20, padding: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {benefits[activeTab].points.map((point, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'white', padding: '16px 20px', borderRadius: 12 }}>
                <span style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, flexShrink: 0 }}>✓</span>
                <p style={{ fontSize: 15, fontWeight: 500 }}>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '100px 48px', background: '#f8f9ff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-tag">🗺️ The Journey</span>
            <h2 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16 }}>How SkillTrack Works</h2>
            <p style={{ fontSize: 18, color: '#6b7280', lineHeight: 1.7 }}>Five phases — from enrolment to evidence-based policy</p>
          </div>

          <div style={{ position: 'relative' }}>
            {/* Connecting line */}
            <div style={{ position: 'absolute', left: 28, top: 28, bottom: 28, width: 2, background: 'linear-gradient(180deg, #4f46e5, #a855f7)', zIndex: 0 }} />

            {timeline.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 28, marginBottom: 32, position: 'relative', zIndex: 1 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: '0 4px 15px rgba(79,70,229,0.4)' }}>
                  {step.icon}
                </div>
                <div style={{ background: 'white', borderRadius: 16, padding: '20px 24px', flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: 1 }}>{step.phase}</span>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: '6px 0 8px' }}>{step.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────── */}
      <section style={{ padding: '100px 48px', background: '#1e1b4b', color: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
              💬 Voices from the Field
            </span>
            <h2 style={{ fontSize: 42, fontWeight: 800 }}>Why This Matters</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card">
                <span style={{ fontSize: 36, color: '#a78bfa', display: 'block', marginBottom: 16 }}>"</span>
                <p style={{ fontSize: 15, lineHeight: 1.8, opacity: 0.9, marginBottom: 24, fontStyle: 'italic' }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>{t.avatar}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</p>
                    <p style={{ opacity: 0.6, fontSize: 12 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Motivational CTA ──────────────────────────── */}
      <section style={{ padding: '100px 48px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #a855f7)', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, left: '20%', width: 300, height: 300, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -80, right: '15%', width: 400, height: 400, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 48, fontWeight: 900, marginBottom: 20, lineHeight: 1.2 }}>
            Every Trainee Deserves to Be Counted. 🇮🇳
          </h2>
          <p style={{ fontSize: 18, opacity: 0.85, lineHeight: 1.7, marginBottom: 40 }}>
            Stop measuring inputs. Start measuring lives changed. Join India's mission to build a credible, transparent, outcome-driven skilling ecosystem.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ padding: '16px 40px', fontSize: 17, background: 'white', color: '#4f46e5' }} onClick={() => navigate('/login')}>
              🚀 Enter Platform
            </button>
            <button className="btn-ghost" style={{ padding: '16px 40px', fontSize: 17 }} onClick={() => navigate('/login')}>
              📊 View Demo Dashboard
            </button>
          </div>

          {/* Motivation quote */}
          <div style={{ marginTop: 60, padding: '24px 32px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)' }}>
            <p style={{ fontSize: 18, fontStyle: 'italic', opacity: 0.9 }}>
              "The best investment a nation can make is in its people — but only if we measure whether that investment is actually paying off."
            </p>
            <p style={{ marginTop: 12, opacity: 0.6, fontSize: 13 }}>— Inspired by India's National Skill Development Mission</p>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer style={{ background: '#0f0c29', color: 'rgba(255,255,255,0.6)', padding: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>🎓</span>
            <span style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>SkillTrack</span>
          </div>
          <p style={{ fontSize: 13 }}>India's Longitudinal Skilling Outcomes Platform</p>
        </div>
        <div style={{ display: 'flex', gap: 40 }}>
          {['Ministry of Skill Development', 'NSDC', 'Skill India', 'DigiLocker'].map(link => (
            <a key={link} href="#" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}
              onMouseOver={e => e.target.style.color = 'white'}
              onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.5)'}>
              {link}
            </a>
          ))}
        </div>
        <p style={{ fontSize: 12 }}>© 2024 SkillTrack · Built for Bharat 🇮🇳</p>
      </footer>
    </div>
  );
}

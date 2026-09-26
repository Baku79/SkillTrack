import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import Navbar from '../../components/Navbar';

/* ── Chart data ─ */
const empTrend = [
  { month: 'Jan', placed: 42, notPlaced: 18 },
  { month: 'Feb', placed: 58, notPlaced: 22 },
  { month: 'Mar', placed: 75, notPlaced: 15 },
  { month: 'Apr', placed: 90, notPlaced: 20 },
  { month: 'May', placed: 110, notPlaced: 18 },
  { month: 'Jun', placed: 95, notPlaced: 12 },
];
const skillGap = [
  { sector: 'IT/Digital',    demand: 85, supply: 60 },
  { sector: 'Manufacturing', demand: 70, supply: 65 },
  { sector: 'Healthcare',    demand: 90, supply: 45 },
  { sector: 'Retail',        demand: 75, supply: 70 },
  { sector: 'Construction',  demand: 60, supply: 50 },
  { sector: 'Logistics',     demand: 65, supply: 30 },
];
const programs = [
  { name: 'Digital Mktg',  enrolled: 120, placed: 88,  rate: 84 },
  { name: 'Welding',       enrolled: 80,  placed: 60,  rate: 75 },
  { name: 'Healthcare',    enrolled: 90,  placed: 55,  rate: 61 },
  { name: 'Retail Mgmt',   enrolled: 150, placed: 112, rate: 75 },
  { name: 'Construction',  enrolled: 60,  placed: 35,  rate: 58 },
];

/* ── Excel Report Datasets (Admin/Govt only) ── */
const PLACEMENT_DATA = [
  { '#':1,'Candidate':'Priya Sharma','Gender':'Female','Age':23,'State':'Maharashtra','Programme':'Digital Marketing','Institute':'NSDC Mumbai','Skills':'SEO, Google Ads, Analytics','Employer':'InfoTech Pvt Ltd','Job Title':'Digital Marketing Exec','Sector':'IT/Digital','Monthly Salary (₹)':18000,'Type':'Full-Time','Placed On':'15-Jan-2024','Retention (mo)':8,'Status':'Employed' },
  { '#':2,'Candidate':'Rahul Patil','Gender':'Male','Age':25,'State':'Maharashtra','Programme':'Welding','Institute':'JSPM Pune','Skills':'MIG Welding, Arc Welding','Employer':'Steel Works India','Job Title':'Junior Welder','Sector':'Manufacturing','Monthly Salary (₹)':14000,'Type':'Full-Time','Placed On':'20-Jan-2024','Retention (mo)':7,'Status':'Employed' },
  { '#':3,'Candidate':'Anjali Desai','Gender':'Female','Age':22,'State':'Gujarat','Programme':'Healthcare Aide','Institute':'HealthSkill Ahmedabad','Skills':'Patient Care, First Aid','Employer':'Fortis Hospital','Job Title':'Healthcare Aide','Sector':'Healthcare','Monthly Salary (₹)':12000,'Type':'Full-Time','Placed On':'10-Feb-2024','Retention (mo)':6,'Status':'Employed' },
  { '#':4,'Candidate':'Suresh Kumar','Gender':'Male','Age':28,'State':'Tamil Nadu','Programme':'Retail Mgmt','Institute':'RetailPro Chennai','Skills':'Customer Service, POS, Inventory','Employer':'DMart','Job Title':'Store Associate','Sector':'Retail','Monthly Salary (₹)':11000,'Type':'Full-Time','Placed On':'05-Feb-2024','Retention (mo)':6,'Status':'Employed' },
  { '#':5,'Candidate':'Meena Iyer','Gender':'Female','Age':24,'State':'Karnataka','Programme':'Digital Marketing','Institute':'TechSkill Bangalore','Skills':'Social Media, Content Writing','Employer':'StartupHub','Job Title':'Content Strategist','Sector':'IT/Digital','Monthly Salary (₹)':22000,'Type':'Full-Time','Placed On':'18-Feb-2024','Retention (mo)':5,'Status':'Employed' },
  { '#':6,'Candidate':'Vikram Singh','Gender':'Male','Age':26,'State':'Rajasthan','Programme':'Construction Tech','Institute':'BuildSkill Jaipur','Skills':'Civil Drawing, Safety','Employer':'L&T Construction','Job Title':'Site Technician','Sector':'Construction','Monthly Salary (₹)':16000,'Type':'Contract','Placed On':'01-Mar-2024','Retention (mo)':5,'Status':'Employed' },
  { '#':7,'Candidate':'Deepika Nair','Gender':'Female','Age':21,'State':'Kerala','Programme':'Healthcare Aide','Institute':'MedSkill Kochi','Skills':'Elderly Care, Nursing Support','Employer':'Apollo Clinic','Job Title':'Nursing Assistant','Sector':'Healthcare','Monthly Salary (₹)':13500,'Type':'Full-Time','Placed On':'12-Mar-2024','Retention (mo)':4,'Status':'Employed' },
  { '#':8,'Candidate':'Arun Yadav','Gender':'Male','Age':27,'State':'UP','Programme':'Logistics','Institute':'LogiSkill Lucknow','Skills':'Warehouse Mgmt, ERP','Employer':'Blue Dart','Job Title':'Logistics Executive','Sector':'Logistics','Monthly Salary (₹)':15000,'Type':'Full-Time','Placed On':'20-Mar-2024','Retention (mo)':4,'Status':'Employed' },
  { '#':9,'Candidate':'Pooja Joshi','Gender':'Female','Age':23,'State':'MP','Programme':'Retail Mgmt','Institute':'RetailSkill Bhopal','Skills':'Visual Merchandising, CRM','Employer':'Reliance Retail','Job Title':'Retail Associate','Sector':'Retail','Monthly Salary (₹)':10500,'Type':'Part-Time','Placed On':'05-Apr-2024','Retention (mo)':3,'Status':'Employed' },
  { '#':10,'Candidate':'Kiran Reddy','Gender':'Male','Age':29,'State':'Telangana','Programme':'Welding','Institute':'WeldPro Hyderabad','Skills':'TIG Welding, QC','Employer':'Tata Motors','Job Title':'Production Welder','Sector':'Manufacturing','Monthly Salary (₹)':19000,'Type':'Full-Time','Placed On':'15-Apr-2024','Retention (mo)':3,'Status':'Employed' },
  { '#':11,'Candidate':'Sneha Kulkarni','Gender':'Female','Age':22,'State':'Maharashtra','Programme':'Digital Marketing','Institute':'DigiSkill Nashik','Skills':'PPC, Email Marketing','Employer':'E-Commerce Co.','Job Title':'Marketing Analyst','Sector':'IT/Digital','Monthly Salary (₹)':17000,'Type':'Full-Time','Placed On':'02-May-2024','Retention (mo)':2,'Status':'Employed' },
  { '#':12,'Candidate':'Manoj Gupta','Gender':'Male','Age':30,'State':'Bihar','Programme':'Construction Tech','Institute':'BuildIndia Patna','Skills':'Plumbing, Electrical','Employer':'Shapoorji Pallonji','Job Title':'Construction Worker','Sector':'Construction','Monthly Salary (₹)':13000,'Type':'Contract','Placed On':'20-May-2024','Retention (mo)':2,'Status':'Employed' },
  { '#':13,'Candidate':'Ritu Sharma','Gender':'Female','Age':24,'State':'Delhi','Programme':'Healthcare Aide','Institute':'HealthFirst Delhi','Skills':'OPD Support, Medical Records','Employer':'Max Hospital','Job Title':'Medical Receptionist','Sector':'Healthcare','Monthly Salary (₹)':14000,'Type':'Full-Time','Placed On':'10-Jun-2024','Retention (mo)':1,'Status':'Employed' },
  { '#':14,'Candidate':'Tarun Mehta','Gender':'Male','Age':25,'State':'Gujarat','Programme':'Logistics','Institute':'LogiPro Surat','Skills':'Freight, Customs Clearance','Employer':'FedEx India','Job Title':'Logistics Coordinator','Sector':'Logistics','Monthly Salary (₹)':16500,'Type':'Full-Time','Placed On':'15-Jun-2024','Retention (mo)':1,'Status':'Employed' },
  { '#':15,'Candidate':'Neha Jain','Gender':'Female','Age':23,'State':'Rajasthan','Programme':'Retail Mgmt','Institute':'RetailPro Jaipur','Skills':'Customer Handling, Billing','Employer':'Big Bazaar','Job Title':'Sales Executive','Sector':'Retail','Monthly Salary (₹)':9500,'Type':'Part-Time','Placed On':'25-Jun-2024','Retention (mo)':1,'Status':'Job Seeking' },
];

const SKILL_GAP_DATA = [
  { '#':1,'Sector':'IT / Digital','Demand':85,'Supply':60,'Gap':25,'Trainees':320,'Job Openings':650,'Unfilled':330,'Avg Salary (₹)':25000,'Priority':'🔴 Critical','Skills Needed':'Python, Cloud, Cybersecurity','Top States':'KA, MH, TN','Recommendation':'Scale IT batches by 40%' },
  { '#':2,'Sector':'Healthcare','Demand':90,'Supply':45,'Gap':45,'Trainees':180,'Job Openings':520,'Unfilled':340,'Avg Salary (₹)':14000,'Priority':'🔴 Critical','Skills Needed':'Nursing Aide, Diagnostics, Elder Care','Top States':'All metros','Recommendation':'Launch 50 new healthcare centres' },
  { '#':3,'Sector':'Logistics','Demand':65,'Supply':30,'Gap':35,'Trainees':90,'Job Openings':350,'Unfilled':260,'Avg Salary (₹)':15000,'Priority':'🟠 High','Skills Needed':'Warehouse, ERP, Fleet Ops','Top States':'DL, MH, TN','Recommendation':'Partner with logistics firms' },
  { '#':4,'Sector':'Construction','Demand':60,'Supply':50,'Gap':10,'Trainees':210,'Job Openings':380,'Unfilled':170,'Avg Salary (₹)':13000,'Priority':'🟡 Medium','Skills Needed':'Civil, Plumbing, Safety','Top States':'MH, UP, RJ','Recommendation':'Upskill via short-term RPL' },
  { '#':5,'Sector':'Manufacturing','Demand':70,'Supply':65,'Gap':5,'Trainees':400,'Job Openings':480,'Unfilled':80,'Avg Salary (₹)':16000,'Priority':'🟢 Low','Skills Needed':'CNC, Welding, QC','Top States':'GJ, TN, Pune','Recommendation':'Maintain current strength' },
  { '#':6,'Sector':'Retail','Demand':75,'Supply':70,'Gap':5,'Trainees':500,'Job Openings':550,'Unfilled':50,'Avg Salary (₹)':10000,'Priority':'🟢 Low','Skills Needed':'CRM, POS, Merchandising','Top States':'All states','Recommendation':'Focus on quality' },
  { '#':7,'Sector':'Agri-Tech','Demand':55,'Supply':20,'Gap':35,'Trainees':60,'Job Openings':200,'Unfilled':140,'Avg Salary (₹)':9000,'Priority':'🟠 High','Skills Needed':'Precision Farming, IoT, Cold Chain','Top States':'PB, UP, MP','Recommendation':'20 agri-tech hubs in rural areas' },
  { '#':8,'Sector':'Hospitality','Demand':50,'Supply':35,'Gap':15,'Trainees':120,'Job Openings':220,'Unfilled':100,'Avg Salary (₹)':11000,'Priority':'🟡 Medium','Skills Needed':'Event Mgmt, Language, Service','Top States':'GA, DL, HP','Recommendation':'Integrate English + soft skills' },
];

const OVERVIEW_SUMMARY = [
  { '#':1,'Metric':'Total Enrolled','Value':500,'Unit':'Candidates','Period':'Jan–Jun 2024' },
  { '#':2,'Metric':'Certifications Issued','Value':430,'Unit':'Certificates','Period':'Jan–Jun 2024' },
  { '#':3,'Metric':'Verified Placements','Value':370,'Unit':'Candidates','Period':'Jan–Jun 2024' },
  { '#':4,'Metric':'Overall Placement Rate','Value':'74%','Unit':'%','Period':'Jan–Jun 2024' },
  { '#':5,'Metric':'Avg Monthly Salary','Value':'₹15,100','Unit':'INR','Period':'Jun 2024' },
  { '#':6,'Metric':'Female Participation','Value':'48%','Unit':'%','Period':'Jan–Jun 2024' },
  { '#':7,'Metric':'Active Institutes','Value':12,'Unit':'Institutes','Period':'Jun 2024' },
  { '#':8,'Metric':'Programmes Running','Value':5,'Unit':'Programmes','Period':'Active' },
  { '#':9,'Metric':'States Covered','Value':8,'Unit':'States','Period':'Jan–Jun 2024' },
  { '#':10,'Metric':'Avg Training Duration','Value':'45 days','Unit':'Days','Period':'Per batch' },
  { '#':11,'Metric':'Dropout Rate','Value':'14%','Unit':'%','Period':'Jan–Jun 2024' },
  { '#':12,'Metric':'6-Month Retention','Value':'82%','Unit':'%','Period':'Jan–Jun 2024' },
];
const OVERVIEW_MONTHLY = [
  { 'Month':'January 2024','Enrolled':80,'Certified':68,'Placed':42,'Rate':'52%','Avg Salary (₹)':13500 },
  { 'Month':'February 2024','Enrolled':85,'Certified':72,'Placed':58,'Rate':'68%','Avg Salary (₹)':14200 },
  { 'Month':'March 2024','Enrolled':90,'Certified':78,'Placed':75,'Rate':'83%','Avg Salary (₹)':14800 },
  { 'Month':'April 2024','Enrolled':95,'Certified':82,'Placed':90,'Rate':'95%','Avg Salary (₹)':15500 },
  { 'Month':'May 2024','Enrolled':100,'Certified':88,'Placed':110,'Rate':'110%','Avg Salary (₹)':16200 },
  { 'Month':'June 2024','Enrolled':50,'Certified':42,'Placed':95,'Rate':'190%','Avg Salary (₹)':16900 },
];
const OVERVIEW_PROGRAMS = programs.map((p, i) => ({
  '#': i+1,
  'Programme': p.name,
  'Enrolled': p.enrolled,
  'Certified': Math.round(p.enrolled * 0.9),
  'Placed': p.placed,
  'Rate': `${p.rate}%`,
  'Avg Salary (₹)': [18000,14000,12000,11000,13000][i],
  'Top Employer': ['InfoTech','Steel Works','Fortis','DMart','L&T'][i],
}));

const ROLE_CFG = {
  admin:     { color: '#6366f1', bg: '#ede9fe', icon: '🏛️', label: 'Admin' },
  institute: { color: '#10b981', bg: '#d1fae5', icon: '🏫', label: 'Institute' },
  candidate: { color: '#f59e0b', bg: '#fef3c7', icon: '👤', label: 'Candidate' },
  employer:  { color: '#ef4444', bg: '#fee2e2', icon: '🏢', label: 'Employer' },
};
const LOG_CFG = {
  REGISTER:   { icon: '✨', label: 'Registered',   color: '#10b981', bg: '#d1fae5' },
  LOGIN:      { icon: '🔑', label: 'Logged In',    color: '#6366f1', bg: '#ede9fe' },
  LOGIN_FAIL: { icon: '⚠️', label: 'Login Failed', color: '#ef4444', bg: '#fee2e2' },
};

const fmt = (iso, short = false) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', short
    ? { day: '2-digit', month: 'short' }
    : { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
};

const KPI = ({ title, value, sub, color, icon }) => (
  <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 6 }}>{title}</p>
        <p style={{ fontSize: 30, fontWeight: 800, color }}>{value}</p>
        {sub && <p style={{ color: 'var(--text3)', fontSize: 12, marginTop: 4 }}>{sub}</p>}
      </div>
      <span style={{ fontSize: 30 }}>{icon}</span>
    </div>
  </div>
);

/* ════════════════════════════════════════════ */
export default function AdminDashboard() {
  const { token } = useAuth();
  const { dark } = useTheme();
  const [section, setSection] = useState('overview');
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [exporting, setExporting] = useState(false);

  // ── Editable report data — admin has full control ──
  const [placementRows, setPlacementRows] = useState(PLACEMENT_DATA);
  const [skillGapRows,  setSkillGapRows]  = useState(SKILL_GAP_DATA);
  const [editModal,     setEditModal]     = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const BLANK_PLACEMENT = { Candidate:'', Gender:'Male', Age:'', State:'', Programme:'', Institute:'', Skills:'', Employer:'', 'Job Title':'', Sector:'', 'Monthly Salary (₹)':'', Type:'Full-Time', 'Placed On':'', 'Retention (mo)':'', Status:'Employed' };
  const BLANK_SKILLGAP  = { Sector:'', Demand:'', Supply:'', Gap:'', Trainees:'', 'Job Openings':'', Unfilled:'', 'Avg Salary (₹)':'', Priority:'🟡 Medium', 'Skills Needed':'', 'Top States':'', Recommendation:'' };

  const openEdit = (type, idx) => {
    const rows = type === 'placement' ? placementRows : skillGapRows;
    const blank = type === 'placement' ? BLANK_PLACEMENT : BLANK_SKILLGAP;
    setEditModal({ type, idx, row: idx === null ? { ...blank } : { ...rows[idx] } });
  };
  const handleEditChange = (key, val) => setEditModal(prev => ({ ...prev, row: { ...prev.row, [key]: val } }));
  const saveEdit = () => {
    const { type, idx, row } = editModal;
    const setter = type === 'placement' ? setPlacementRows : setSkillGapRows;
    setter(prev => {
      const next = [...prev];
      if (idx === null) next.push({ ...row, '#': next.length + 1 });
      else next[idx] = { ...next[idx], ...row };
      return next;
    });
    setEditModal(null);
  };
  const confirmDelete = () => {
    const { type, idx } = deleteConfirm;
    const setter = type === 'placement' ? setPlacementRows : setSkillGapRows;
    setter(prev => prev.filter((_, i) => i !== idx).map((r, i) => ({ ...r, '#': i + 1 })));
    setDeleteConfirm(null);
  };
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  // Live chart data computed from real users + logs
  const [liveCharts, setLiveCharts] = useState({ registrationTrend: [], loginActivity: [], roleBreakdown: [] });

  const hdr = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('/api/users', { headers: hdr }).then(r => setUsers(r.data)).catch(() => {});
    axios.get('/api/users/logs', { headers: hdr }).then(r => setLogs(r.data)).catch(() => {});
    axios.get('/api/users/export', { headers: hdr }).then(r => setExportData(r.data)).catch(() => {});
  }, []);

  // Compute real charts whenever users or logs change
  useEffect(() => {
    if (!users.length && !logs.length) return;
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const now = new Date();
    // Registration + login trend over last 6 months
    const registrationTrend = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = MONTHS[d.getMonth()];
      const registered = users.filter(u => {
        const ud = new Date(u.createdAt);
        return ud.getMonth() === d.getMonth() && ud.getFullYear() === d.getFullYear();
      }).length;
      const loggedIn = logs.filter(l => {
        const ld = new Date(l.timestamp);
        return l.type === 'LOGIN' && ld.getMonth() === d.getMonth() && ld.getFullYear() === d.getFullYear();
      }).length;
      return { month: label, registered, logins: loggedIn };
    });
    // Login activity last 7 days
    const loginActivity = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short' });
      const count = logs.filter(l => {
        const ld = new Date(l.timestamp);
        return l.type === 'LOGIN' && ld.toDateString() === d.toDateString();
      }).length;
      return { day: dayLabel, logins: count };
    });
    // Role breakdown
    const roleCounts = {};
    users.forEach(u => { roleCounts[u.role] = (roleCounts[u.role] || 0) + 1; });
    const roleBreakdown = Object.entries(roleCounts).map(([role, count]) => ({
      role: role.charAt(0).toUpperCase() + role.slice(1), count,
    }));
    setLiveCharts({ registrationTrend, loginActivity, roleBreakdown });
  }, [users, logs]);

  // Reset page when filter/search changes
  useEffect(() => setPage(1), [search, roleFilter]);

  /* ── Excel download ── */
  const downloadExcel = () => {
    setExporting(true);
    const ws = XLSX.utils.json_to_sheet(exportData);
    /* Column widths */
    ws['!cols'] = [
      { wch: 4 }, { wch: 22 }, { wch: 30 }, { wch: 22 }, { wch: 12 },
      { wch: 15 }, { wch: 20 }, { wch: 16 }, { wch: 24 }, { wch: 24 }, { wch: 14 }, { wch: 20 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SkillTrack Users');
    /* Logs sheet */
    const logsFormatted = logs.map((l, i) => ({
      '#': i + 1,
      'Type': l.type,
      'User Name': l.userName || '—',
      'Email': l.userEmail || '—',
      'Role': l.userRole || '—',
      'Action': l.action,
      'Timestamp': fmt(l.timestamp),
    }));
    const ws2 = XLSX.utils.json_to_sheet(logsFormatted);
    ws2['!cols'] = [{ wch: 4 }, { wch: 14 }, { wch: 22 }, { wch: 30 }, { wch: 12 }, { wch: 35 }, { wch: 24 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Activity Logs');
    XLSX.writeFile(wb, `SkillTrack_Admin_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    setExporting(false);
  };

  const downloadCSV = () => {
    if (!exportData.length) return;
    const headers = Object.keys(exportData[0]);
    const rows = exportData.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `SkillTrack_Users_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  /* ── Placement Report Excel (uses live editable state) ── */
  const downloadPlacementReport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(placementRows);
    ws['!cols'] = [
      {wch:4},{wch:20},{wch:8},{wch:5},{wch:14},{wch:20},{wch:18},
      {wch:28},{wch:20},{wch:22},{wch:14},{wch:18},{wch:12},{wch:14},{wch:14},{wch:12},
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Placements');
    const bySector = {};
    placementRows.forEach(r => {
      if (!bySector[r.Sector]) bySector[r.Sector] = { Sector: r.Sector, Count: 0, TotalSalary: 0, Employed: 0 };
      bySector[r.Sector].Count++;
      bySector[r.Sector].TotalSalary += Number(r['Monthly Salary (₹)']) || 0;
      if (r.Status === 'Employed') bySector[r.Sector].Employed++;
    });
    const sectorSummary = Object.values(bySector).map(s => ({
      'Sector': s.Sector, 'Total Placed': s.Count, 'Currently Employed': s.Employed,
      'Retention Rate': `${Math.round((s.Employed / s.Count) * 100)}%`,
      'Avg Salary (₹)': Math.round(s.TotalSalary / s.Count),
    }));
    const ws2 = XLSX.utils.json_to_sheet(sectorSummary);
    ws2['!cols'] = [{wch:16},{wch:14},{wch:18},{wch:16},{wch:16}];
    XLSX.utils.book_append_sheet(wb, ws2, 'Sector Summary');
    XLSX.writeFile(wb, `SkillTrack_Placement_Report_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  /* ── Skill Gap Report Excel (uses live editable state) ── */
  const downloadSkillGapReport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(skillGapRows);
    ws['!cols'] = [
      {wch:4},{wch:16},{wch:8},{wch:8},{wch:6},{wch:10},{wch:14},{wch:10},{wch:14},{wch:16},{wch:28},{wch:16},{wch:40},
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Skill Gap Analysis');
    const priority = skillGapRows.filter(r => String(r.Priority).includes('Critical') || String(r.Priority).includes('High'))
      .sort((a, b) => Number(b.Gap) - Number(a.Gap))
      .map((r, i) => ({ '#': i+1, 'Sector': r.Sector, 'Gap Score': r.Gap, 'Unfilled': r.Unfilled, 'Priority': r.Priority, 'Immediate Action': r.Recommendation }));
    const ws2 = XLSX.utils.json_to_sheet(priority);
    ws2['!cols'] = [{wch:4},{wch:16},{wch:10},{wch:10},{wch:16},{wch:50}];
    XLSX.utils.book_append_sheet(wb, ws2, 'Priority Actions');
    XLSX.writeFile(wb, `SkillTrack_SkillGap_Report_${new Date().toISOString().slice(0,10)}.xlsx`);
  };



  /* ── Overview Report Excel (3 sheets) ── */
  const downloadOverviewReport = () => {
    const wb = XLSX.utils.book_new();
    // Sheet 1: Summary KPIs
    const ws1 = XLSX.utils.json_to_sheet(OVERVIEW_SUMMARY);
    ws1['!cols'] = [{wch:4},{wch:28},{wch:14},{wch:14},{wch:16}];
    XLSX.utils.book_append_sheet(wb, ws1, 'KPI Summary');
    // Sheet 2: Monthly Breakdown
    const ws2 = XLSX.utils.json_to_sheet(OVERVIEW_MONTHLY);
    ws2['!cols'] = [{wch:18},{wch:10},{wch:11},{wch:8},{wch:8},{wch:16}];
    XLSX.utils.book_append_sheet(wb, ws2, 'Monthly Breakdown');
    // Sheet 3: By Programme
    const ws3 = XLSX.utils.json_to_sheet(OVERVIEW_PROGRAMS);
    ws3['!cols'] = [{wch:4},{wch:18},{wch:10},{wch:11},{wch:8},{wch:8},{wch:16},{wch:16}];
    XLSX.utils.book_append_sheet(wb, ws3, 'By Programme');
    XLSX.writeFile(wb, `SkillTrack_Overview_Report_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const filtered = users.filter(u => {
    const s = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const r = roleFilter === 'all' || u.role === roleFilter;
    return s && r;
  });

  const navItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'users',    icon: '👥', label: 'User Database', badge: users.length },
    { id: 'report',   icon: '📋', label: 'Admin Report', badge: '⬇' },
    { id: 'reports',  icon: '📑', label: 'Reports Centre', badge: '3' },
    { id: 'logs',     icon: '🕐', label: 'Activity Logs', badge: logs.length },
    { id: 'skillgap', icon: '🎯', label: 'Skill Gaps' },
    { id: 'programs', icon: '📚', label: 'Programs' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <Navbar title="Admin Dashboard" />

      <div style={{ display: 'flex', flex: 1 }}>
        {/* ── Sidebar ─────────────────────────────── */}
        <aside style={{ width: 230, background: 'var(--surface)', borderRight: '1px solid var(--border)', padding: '20px 10px', position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto', transition: 'background 0.3s' }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, padding: '0 12px', marginBottom: 10 }}>Navigation</p>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setSection(item.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 3, fontWeight: 600, fontSize: 13, transition: 'all 0.15s', fontFamily: 'Inter', justifyContent: 'space-between',
                background: section === item.id ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
                color: section === item.id ? 'white' : 'var(--text2)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>{item.icon} {item.label}</span>
              {item.badge !== undefined && item.badge !== 0 && (
                <span style={{ background: section === item.id ? 'rgba(255,255,255,0.25)' : 'var(--bg)', color: section === item.id ? 'white' : '#6366f1', fontSize: 11, fontWeight: 800, padding: '2px 7px', borderRadius: 10 }}>{item.badge}</span>
              )}
            </button>
          ))}
        </aside>

        {/* ── Content ─────────────────────────────── */}
        <main style={{ flex: 1, padding: 28, overflowY: 'auto' }}>

          {/* ─ OVERVIEW ─ */}
          {section === 'overview' && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>National Overview</h2>
              <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>Platform-wide skilling outcomes at a glance</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 28 }}>
                <KPI title="Total Candidates" value="500" sub="Enrolled" color="#6366f1" icon="👥" />
                <KPI title="Placed" value="370" sub="Verified jobs" color="#10b981" icon="✅" />
                <KPI title="Placement Rate" value="74%" sub="All programmes" color="#f59e0b" icon="📈" />
                <KPI title="Programmes" value="5" sub="Active" color="#8b5cf6" icon="🏫" />
                <KPI title="Registered Users" value={users.length} sub="On platform" color="#0891b2" icon="🪪" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="card">
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>📊 Monthly Placements</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={empTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1e1e2e' : '#f0f0f5'} />
                      <XAxis dataKey="month" fontSize={11} tick={{ fill: 'var(--text2)' }} />
                      <YAxis fontSize={11} tick={{ fill: 'var(--text2)' }} />
                      <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)' }} />
                      <Legend />
                      <Bar dataKey="placed" fill="#6366f1" name="Placed" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="notPlaced" fill="#f87171" name="Not Placed" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card">
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>🎯 Skill Gap Radar</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={skillGap}>
                      <PolarGrid stroke={dark ? '#1e1e2e' : '#e5e7eb'} />
                      <PolarAngleAxis dataKey="sector" fontSize={10} tick={{ fill: 'var(--text2)' }} />
                      <PolarRadiusAxis domain={[0, 100]} fontSize={9} tick={{ fill: 'var(--text3)' }} />
                      <Radar name="Demand" dataKey="demand" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                      <Radar name="Supply" dataKey="supply" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Real Live Data Charts */}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
                <div className="card">
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>📅 Real Registration Trend</h3>
                  <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>Actual new users & logins — last 6 months</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={liveCharts.registrationTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1e1e2e' : '#f0f0f5'} />
                      <XAxis dataKey="month" fontSize={11} tick={{ fill: 'var(--text2)' }} />
                      <YAxis fontSize={11} tick={{ fill: 'var(--text2)' }} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)' }} />
                      <Legend />
                      <Bar dataKey="registered" fill="#6366f1" name="New Users" radius={[4,4,0,0]} />
                      <Bar dataKey="logins" fill="#10b981" name="Logins" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card">
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>🕐 Login Activity</h3>
                  <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>Actual logins per day — last 7 days</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={liveCharts.loginActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1e1e2e' : '#f0f0f5'} />
                      <XAxis dataKey="day" fontSize={11} tick={{ fill: 'var(--text2)' }} />
                      <YAxis fontSize={11} tick={{ fill: 'var(--text2)' }} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)' }} />
                      <Bar dataKey="logins" fill="#8b5cf6" name="Logins" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}


          {/* ─ USER DATABASE ─ */}
          {section === 'users' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>👥 User Database</h2>
                  <p style={{ color: 'var(--text2)', fontSize: 14 }}>All registered accounts on SkillTrack</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={downloadCSV} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0', padding: '9px 16px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'Inter' }}>⬇ CSV</button>
                  <button onClick={downloadExcel} disabled={exporting} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', border: 'none', padding: '9px 18px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'Inter', opacity: exporting ? 0.7 : 1 }}>
                    {exporting ? '⏳ Exporting...' : '📊 Export Excel'}
                  </button>
                </div>
              </div>

              {/* Role stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
                {Object.entries(ROLE_CFG).map(([role, cfg]) => (
                  <div key={role} className="card" style={{ borderTop: `3px solid ${cfg.color}`, textAlign: 'center', padding: 16 }}>
                    <span style={{ fontSize: 24 }}>{cfg.icon}</span>
                    <p style={{ fontSize: 26, fontWeight: 800, color: cfg.color, margin: '4px 0' }}>{users.filter(u => u.role === role).length}</p>
                    <p style={{ color: 'var(--text2)', fontSize: 12 }}>{cfg.label}s</p>
                  </div>
                ))}
              </div>

              {/* Search & filter */}
              <div className="card" style={{ marginBottom: 16, padding: 16 }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search name or email..." style={{ flex: 1, minWidth: 200, padding: '9px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 13, outline: 'none', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'Inter' }} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['all', 'admin', 'institute', 'candidate', 'employer'].map(r => (
                      <button key={r} onClick={() => setRoleFilter(r)} style={{ padding: '7px 13px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Inter', background: roleFilter === r ? '#6366f1' : 'var(--bg)', color: roleFilter === r ? 'white' : 'var(--text2)' }}>
                        {r === 'all' ? 'All' : `${ROLE_CFG[r].icon} ${ROLE_CFG[r].label}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                {users.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <span style={{ fontSize: 52 }}>👥</span>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 12 }}>No Users Yet</h3>
                    <p style={{ color: 'var(--text2)', marginTop: 6 }}>Users will appear here once they register.</p>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                    <thead>
                      <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                        {['#', 'User', 'Email (Login ID)', 'Password', 'Role', '🪪 Govt ID', 'Phone', 'Organization', 'Region', 'Joined', 'Last Login', 'Logins'].map(h => (
                          <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.7, whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((u, i) => {
                        const cfg = ROLE_CFG[u.role] || ROLE_CFG.candidate;
                        return (
                          <tr key={u.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                            onMouseOver={e => e.currentTarget.style.background = 'var(--bg)'}
                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                            <td style={{ padding: '11px 12px', color: 'var(--text3)', fontSize: 12 }}>{(page - 1) * PER_PAGE + i + 1}</td>
                            <td style={{ padding: '11px 12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: cfg.grad || cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 13, flexShrink: 0, backgroundImage: `linear-gradient(135deg, ${cfg.color}, #8b5cf6)` }}>
                                  {u.name?.[0]?.toUpperCase() || '?'}
                                </div>
                                <span style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: '11px 12px', fontSize: 12, color: 'var(--text2)' }}>{u.email}</td>
                            <td style={{ padding: '11px 12px' }}>
                              <span style={{ background: dark ? '#1a1a00' : '#fffbeb', color: '#92400e', padding: '3px 10px', borderRadius: 6, fontSize: 12, fontFamily: 'monospace', border: '1px solid #fcd34d', letterSpacing: 1 }}>
                                🔑 {u.plainPassword || '—'}
                              </span>
                            </td>
                            <td style={{ padding: '11px 12px' }}>
                              <span style={{ background: cfg.bg, color: cfg.color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                                {cfg.icon} {cfg.label}
                              </span>
                            </td>
                            <td style={{ padding: '11px 12px' }}>
                              {u.govtId ? (
                                <div>
                                  <span style={{ background: dark ? '#1a0a30' : '#fdf4ff', color: '#7c3aed', padding: '3px 10px', borderRadius: 8, fontSize: 11, fontFamily: 'monospace', border: '1px solid #c4b5fd', letterSpacing: 1, fontWeight: 700 }}>
                                    🪪 {u.govtId}
                                  </span>
                                  <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{u.govtIdType}</p>
                                </div>
                              ) : (
                                <span style={{ color: 'var(--text3)', fontSize: 12 }}>—</span>
                              )}
                            </td>
                            <td style={{ padding: '11px 12px', fontSize: 12, color: 'var(--text2)' }}>{u.phone || '—'}</td>
                            <td style={{ padding: '11px 12px', fontSize: 12, color: 'var(--text2)' }}>{u.organization || '—'}</td>
                            <td style={{ padding: '11px 12px', fontSize: 12, color: 'var(--text2)' }}>{u.region || '—'}</td>
                            <td style={{ padding: '11px 12px', fontSize: 11, color: 'var(--text3)', whiteSpace: 'nowrap' }}>{fmt(u.createdAt)}</td>
                            <td style={{ padding: '11px 12px', fontSize: 11, color: 'var(--text3)', whiteSpace: 'nowrap' }}>{fmt(u.lastLogin)}</td>
                            <td style={{ padding: '11px 12px', textAlign: 'center' }}>
                              <span style={{ background: '#ede9fe', color: '#6366f1', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>{u.loginCount || 0}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
                {/* Pagination footer */}
                {filtered.length > 0 && (
                  <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <p style={{ color: 'var(--text3)', fontSize: 12 }}>
                      Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} users
                    </p>
                    {Math.ceil(filtered.length / PER_PAGE) > 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                          style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', cursor: page === 1 ? 'not-allowed' : 'pointer', fontFamily: 'Inter', fontSize: 12, opacity: page === 1 ? 0.4 : 1 }}>
                          ← Prev
                        </button>
                        {Array.from({ length: Math.ceil(filtered.length / PER_PAGE) }, (_, i) => i + 1).map(p => (
                          <button key={p} onClick={() => setPage(p)}
                            style={{ padding: '5px 10px', borderRadius: 8, border: 'none', background: p === page ? '#6366f1' : 'transparent', color: p === page ? 'white' : 'var(--text2)', cursor: 'pointer', fontWeight: p === page ? 800 : 400, fontFamily: 'Inter', fontSize: 12 }}>
                            {p}
                          </button>
                        ))}
                        <button onClick={() => setPage(p => Math.min(Math.ceil(filtered.length / PER_PAGE), p + 1))} disabled={page === Math.ceil(filtered.length / PER_PAGE)}
                          style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', cursor: page === Math.ceil(filtered.length / PER_PAGE) ? 'not-allowed' : 'pointer', fontFamily: 'Inter', fontSize: 12, opacity: page === Math.ceil(filtered.length / PER_PAGE) ? 0.4 : 1 }}>
                          Next →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}


          {/* ─ ADMIN REPORT (EXCEL) ─ */}
          {section === 'report' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>📋 Admin User Report</h2>
                  <p style={{ color: 'var(--text2)', fontSize: 14 }}>Complete user data — Login IDs, roles, activity, login counts. Export to Excel or CSV.</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={downloadCSV} style={{ display: 'flex', alignItems: 'center', gap: 6, background: dark ? '#052e16' : '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0', padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'Inter' }}>
                    ⬇ Download CSV
                  </button>
                  <button onClick={downloadExcel} disabled={exporting} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'Inter', boxShadow: '0 4px 16px rgba(99,102,241,0.35)', opacity: exporting ? 0.7 : 1 }}>
                    {exporting ? '⏳ Exporting...' : '📊 Download Excel (.xlsx)'}
                  </button>
                </div>
              </div>

              {/* Info card */}
              <div style={{ background: dark ? '#1a0a00' : '#fffbeb', border: '1px solid #fcd34d', borderRadius: 14, padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 24 }}>🔑</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: dark ? '#fbbf24' : '#92400e', marginBottom: 4 }}>Admin Access — Passwords Visible</p>
                  <p style={{ color: dark ? '#fde68a' : '#78350f', fontSize: 13, lineHeight: 1.6 }}>
                    This report shows the <strong>actual password</strong> entered by each user at registration — visible only to Admin. Keep this data confidential and secure.
                  </p>
                </div>
              </div>

              {/* Report table preview */}
              <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700 }}>👁 Preview — {exportData.length} Users</h3>
                  <span style={{ fontSize: 12, color: 'var(--text3)', background: 'var(--bg)', padding: '4px 12px', borderRadius: 20, border: '1px solid var(--border)' }}>📊 Excel includes 2 sheets: Users + Activity Logs</span>
                </div>

                {exportData.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <span style={{ fontSize: 52 }}>📋</span>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 12 }}>No data yet</h3>
                    <p style={{ color: 'var(--text2)', marginTop: 6 }}>Register some users first to see them here.</p>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
                    <thead>
                      <tr style={{ background: 'var(--bg)' }}>
                        {Object.keys(exportData[0] || {}).map(h => (
                          <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap', borderBottom: '2px solid var(--border)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {exportData.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}
                          onMouseOver={e => e.currentTarget.style.background = 'var(--bg)'}
                          onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                          {Object.entries(row).map(([k, v]) => (
                            <td key={k} style={{ padding: '10px 12px', fontSize: 12, color: k === 'Password' ? '#9ca3af' : k.includes('Login') && v === 'Never' ? '#f59e0b' : 'var(--text)', whiteSpace: 'nowrap', fontFamily: k === 'Password' || k === 'User ID' ? 'monospace' : 'Inter' }}>
                              {k === 'Role' ? (
                                <span style={{ background: ROLE_CFG[v]?.bg || '#e5e7eb', color: ROLE_CFG[v]?.color || '#374151', padding: '2px 8px', borderRadius: 10, fontWeight: 700, fontSize: 11 }}>
                                  {ROLE_CFG[v]?.icon} {v}
                                </span>
                              ) : k === 'Total Logins' ? (
                                <span style={{ background: '#ede9fe', color: '#6366f1', padding: '2px 10px', borderRadius: 20, fontWeight: 800, fontSize: 12 }}>{v}</span>
                              ) : String(v)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* ─ REPORTS CENTRE ─ */}
          {section === 'reports' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>📑 Reports Centre</h2>
                  <p style={{ color: 'var(--text2)', fontSize: 14 }}>🔒 Admin & Government access only — Download official reports in Excel format</p>
                </div>
                {/* Download All */}
                <button onClick={() => { downloadPlacementReport(); setTimeout(downloadSkillGapReport, 500); setTimeout(downloadOverviewReport, 1000); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', border: 'none', padding: '11px 22px', borderRadius: 12, cursor: 'pointer', fontWeight: 800, fontSize: 14, fontFamily: 'Inter', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
                  📦 Download All 3 Reports
                </button>
              </div>

              {/* ── 3 Report Cards ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
                {[
                  { icon: '✅', title: 'Placement Report', sub: '15 candidates · 2 sheets', color: '#10b981', bg: dark ? '#052e16' : '#f0fdf4', border: '#bbf7d0', desc: 'Candidate-wise placement data: employer, salary, job title, sector, retention. + Sector summary sheet.', sheets: ['Placements (15 rows)', 'Sector Summary'], fn: downloadPlacementReport, label: 'Download Placement .xlsx' },
                  { icon: '🎯', title: 'Skill Gap Report',  sub: '8 sectors · 2 sheets',   color: '#f59e0b', bg: dark ? '#1c1200' : '#fffbeb', border: '#fde68a', desc: 'Demand vs supply per sector: gap score, unfilled positions, avg salary, priority level, recommendations.', sheets: ['Skill Gap Analysis (8 sectors)', 'Priority Actions'], fn: downloadSkillGapReport, label: 'Download Skill Gap .xlsx' },
                  { icon: '📊', title: 'Overview Report',  sub: '12 KPIs · 3 sheets',    color: '#6366f1', bg: dark ? '#1a1a2e' : '#f5f3ff', border: '#c4b5fd', desc: 'National summary: KPI metrics, monthly trend breakdown, and programme-wise performance.', sheets: ['KPI Summary (12 metrics)', 'Monthly Breakdown (6 months)', 'By Programme (5 programs)'], fn: downloadOverviewReport, label: 'Download Overview .xlsx' },
                ].map((r, i) => (
                  <div key={i} style={{ background: r.bg, border: `1.5px solid ${r.border}`, borderRadius: 18, padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 14, background: `${r.color}20`, border: `2px solid ${r.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{r.icon}</div>
                      <div>
                        <p style={{ fontWeight: 800, fontSize: 15, color: r.color }}>{r.title}</p>
                        <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{r.sub}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{r.desc}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {r.sheets.map((s, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text3)' }}>
                          <span style={{ color: r.color, fontWeight: 700 }}>▸</span> {s}
                        </div>
                      ))}
                    </div>
                    <button onClick={r.fn} style={{ background: r.color, color: 'white', border: 'none', padding: '10px 16px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'Inter', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 'auto' }}>
                      ⬇ {r.label}
                    </button>
                  </div>
                ))}
              </div>

              {/* ── Placement Preview Table (Editable) ── */}
              <div className="card" style={{ padding: 0, marginBottom: 24 }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>✅ Placement Data <span style={{ color: 'var(--text3)', fontWeight: 400, fontSize: 13 }}>({placementRows.length} records)</span></h3>
                    <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Admin can edit, delete or add any placement record</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit('placement', null)}
                      style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 14px', borderRadius: 9, cursor: 'pointer', fontWeight: 700, fontSize: 12, fontFamily: 'Inter', display: 'flex', alignItems: 'center', gap: 5 }}>
                      ＋ Add Record
                    </button>
                    <button onClick={downloadPlacementReport}
                      style={{ background: '#059669', color: 'white', border: 'none', padding: '8px 14px', borderRadius: 9, cursor: 'pointer', fontWeight: 700, fontSize: 12, fontFamily: 'Inter' }}>
                      ⬇ Excel
                    </button>
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
                    <thead>
                      <tr style={{ background: 'var(--bg)' }}>
                        {['#','Candidate','State','Programme','Employer','Job Title','Sector','Salary (₹)','Status','Retention','Actions'].map(h => (
                          <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap', borderBottom: '2px solid var(--border)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {placementRows.map((r, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                          onMouseOver={e => e.currentTarget.style.background = 'var(--bg)'}
                          onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--text3)' }}>{r['#']}</td>
                          <td style={{ padding: '9px 12px', fontWeight: 600, fontSize: 13 }}>{r.Candidate}</td>
                          <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--text2)' }}>{r.State}</td>
                          <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--text2)' }}>{r.Programme}</td>
                          <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--text2)' }}>{r.Employer}</td>
                          <td style={{ padding: '9px 12px', fontSize: 12 }}>{r['Job Title']}</td>
                          <td style={{ padding: '9px 12px' }}>
                            <span style={{ background: dark ? 'rgba(99,102,241,0.15)' : '#ede9fe', color: '#6366f1', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{r.Sector}</span>
                          </td>
                          <td style={{ padding: '9px 12px', fontWeight: 700, color: '#10b981', fontSize: 13 }}>₹{Number(r['Monthly Salary (₹)']).toLocaleString('en-IN')}</td>
                          <td style={{ padding: '9px 12px' }}>
                            <span style={{ background: r.Status === 'Employed' ? '#dcfce7' : '#fef3c7', color: r.Status === 'Employed' ? '#166534' : '#92400e', padding: '2px 9px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{r.Status}</span>
                          </td>
                          <td style={{ padding: '9px 12px', fontWeight: 700, color: 'var(--text2)', fontSize: 13 }}>{r['Retention (mo)']} mo</td>
                          <td style={{ padding: '9px 12px', whiteSpace: 'nowrap' }}>
                            <button onClick={() => openEdit('placement', i)}
                              style={{ background: '#ede9fe', color: '#6366f1', border: 'none', padding: '4px 10px', borderRadius: 7, cursor: 'pointer', fontWeight: 700, fontSize: 11, fontFamily: 'Inter', marginRight: 6 }}>
                              ✏️ Edit
                            </button>
                            <button onClick={() => setDeleteConfirm({ type: 'placement', idx: i, name: r.Candidate })}
                              style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 10px', borderRadius: 7, cursor: 'pointer', fontWeight: 700, fontSize: 11, fontFamily: 'Inter' }}>
                              🗑 Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Skill Gap Preview (Editable) ── */}
              <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>🎯 Skill Gap Analysis <span style={{ color: 'var(--text3)', fontWeight: 400, fontSize: 13 }}>({skillGapRows.length} sectors)</span></h3>
                    <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Admin can edit, delete or add sector data</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit('skillgap', null)}
                      style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '8px 14px', borderRadius: 9, cursor: 'pointer', fontWeight: 700, fontSize: 12, fontFamily: 'Inter', display: 'flex', alignItems: 'center', gap: 5 }}>
                      ＋ Add Sector
                    </button>
                    <button onClick={downloadSkillGapReport}
                      style={{ background: '#d97706', color: 'white', border: 'none', padding: '8px 14px', borderRadius: 9, cursor: 'pointer', fontWeight: 700, fontSize: 12, fontFamily: 'Inter' }}>
                      ⬇ Excel
                    </button>
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                    <thead>
                      <tr style={{ background: 'var(--bg)' }}>
                        {['Sector','Demand','Supply','Gap','Trainees','Openings','Unfilled','Priority','Recommendation','Actions'].map(h => (
                          <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap', borderBottom: '2px solid var(--border)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {skillGapRows.map((r, i) => {
                        const gapColor = r.Gap >= 30 ? '#ef4444' : r.Gap >= 20 ? '#f59e0b' : r.Gap >= 10 ? '#eab308' : '#10b981';
                        return (
                          <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                            onMouseOver={e => e.currentTarget.style.background = 'var(--bg)'}
                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                            <td style={{ padding: '9px 12px', fontWeight: 700, fontSize: 13 }}>{r.Sector}</td>
                            <td style={{ padding: '9px 12px', fontWeight: 700, color: '#6366f1' }}>{r.Demand}</td>
                            <td style={{ padding: '9px 12px', fontWeight: 700, color: '#10b981' }}>{r.Supply}</td>
                            <td style={{ padding: '9px 12px' }}>
                              <span style={{ background: `${gapColor}20`, color: gapColor, padding: '3px 10px', borderRadius: 10, fontWeight: 800, fontSize: 13 }}>{r.Gap}</span>
                            </td>
                            <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--text2)' }}>{r.Trainees}</td>
                            <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--text2)' }}>{r['Job Openings']}</td>
                            <td style={{ padding: '9px 12px', fontWeight: 700, color: '#ef4444', fontSize: 13 }}>{r.Unfilled}</td>
                            <td style={{ padding: '9px 12px', fontSize: 13 }}>{r.Priority}</td>
                            <td style={{ padding: '9px 12px', fontSize: 11, color: 'var(--text2)', maxWidth: 180 }}>{r.Recommendation}</td>
                            <td style={{ padding: '9px 12px', whiteSpace: 'nowrap' }}>
                              <button onClick={() => openEdit('skillgap', i)}
                                style={{ background: '#ede9fe', color: '#6366f1', border: 'none', padding: '4px 10px', borderRadius: 7, cursor: 'pointer', fontWeight: 700, fontSize: 11, fontFamily: 'Inter', marginRight: 6 }}>
                                ✏️ Edit
                              </button>
                              <button onClick={() => setDeleteConfirm({ type: 'skillgap', idx: i, name: r.Sector })}
                                style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 10px', borderRadius: 7, cursor: 'pointer', fontWeight: 700, fontSize: 11, fontFamily: 'Inter' }}>
                                🗑 Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Edit Modal ── */}
              {editModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
                  onClick={e => e.target === e.currentTarget && setEditModal(null)}>
                  <div style={{ background: dark ? '#1e1e2e' : 'white', borderRadius: 20, padding: 28, width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: dark ? '#f1f5f9' : '#0f172a', margin: 0 }}>
                          {editModal.idx === null ? '➕ Add' : '✏️ Edit'} {editModal.type === 'placement' ? 'Placement Record' : 'Skill Gap Sector'}
                        </h3>
                        <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>All fields are editable. Changes reflect immediately in the table.</p>
                      </div>
                      <button onClick={() => setEditModal(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text3)' }}>✕</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      {Object.keys(editModal.row).filter(k => k !== '#').map(key => (
                        <div key={key} style={{ gridColumn: ['Skills','Recommendation','Skills Needed'].includes(key) ? '1 / -1' : 'auto' }}>
                          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>{key}</label>
                          {key === 'Status' ? (
                            <select value={editModal.row[key]} onChange={e => handleEditChange(key, e.target.value)}
                              style={{ width: '100%', padding: '8px 10px', borderRadius: 9, border: '1px solid var(--border)', background: dark ? '#0d0d1a' : '#f8faff', color: 'var(--text)', fontSize: 13, fontFamily: 'Inter' }}>
                              <option>Employed</option><option>Job Seeking</option><option>Self-Employed</option>
                            </select>
                          ) : key === 'Priority' ? (
                            <select value={editModal.row[key]} onChange={e => handleEditChange(key, e.target.value)}
                              style={{ width: '100%', padding: '8px 10px', borderRadius: 9, border: '1px solid var(--border)', background: dark ? '#0d0d1a' : '#f8faff', color: 'var(--text)', fontSize: 13, fontFamily: 'Inter' }}>
                              <option>🔴 Critical</option><option>🟠 High</option><option>🟡 Medium</option><option>🟢 Low</option>
                            </select>
                          ) : key === 'Gender' ? (
                            <select value={editModal.row[key]} onChange={e => handleEditChange(key, e.target.value)}
                              style={{ width: '100%', padding: '8px 10px', borderRadius: 9, border: '1px solid var(--border)', background: dark ? '#0d0d1a' : '#f8faff', color: 'var(--text)', fontSize: 13, fontFamily: 'Inter' }}>
                              <option>Male</option><option>Female</option><option>Other</option>
                            </select>
                          ) : key === 'Type' ? (
                            <select value={editModal.row[key]} onChange={e => handleEditChange(key, e.target.value)}
                              style={{ width: '100%', padding: '8px 10px', borderRadius: 9, border: '1px solid var(--border)', background: dark ? '#0d0d1a' : '#f8faff', color: 'var(--text)', fontSize: 13, fontFamily: 'Inter' }}>
                              <option>Full-Time</option><option>Part-Time</option><option>Contract</option><option>Freelance</option>
                            </select>
                          ) : (
                            <input
                              value={editModal.row[key] ?? ''}
                              onChange={e => handleEditChange(key, e.target.value)}
                              placeholder={key}
                              style={{ width: '100%', padding: '8px 10px', borderRadius: 9, border: '1px solid var(--border)', background: dark ? '#0d0d1a' : '#f8faff', color: 'var(--text)', fontSize: 13, fontFamily: 'Inter', boxSizing: 'border-box' }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 22, justifyContent: 'flex-end' }}>
                      <button onClick={() => setEditModal(null)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter' }}>Cancel</button>
                      <button onClick={saveEdit} style={{ padding: '10px 24px', borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontFamily: 'Inter', fontSize: 14 }}>
                        {editModal.idx === null ? '➕ Add Row' : '💾 Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Delete Confirm ── */}
              {deleteConfirm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                  <div style={{ background: dark ? '#1e1e2e' : 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 400, textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
                    <div style={{ fontSize: 52, marginBottom: 12 }}>🗑️</div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Delete Record?</h3>
                    <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>
                      Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>? This cannot be undone.
                    </p>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                      <button onClick={() => setDeleteConfirm(null)} style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text2)', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter' }}>Cancel</button>
                      <button onClick={confirmDelete} style={{ padding: '10px 22px', borderRadius: 10, background: '#dc2626', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontFamily: 'Inter' }}>🗑 Yes, Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}


          {/* ─ ACTIVITY LOGS ─ */}
          {section === 'logs' && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>🕐 Activity Logs</h2>
              <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>Every registration, login, and failed attempt across the platform</p>
              <div className="card" style={{ padding: 0 }}>
                {logs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <span style={{ fontSize: 52 }}>📋</span>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 12 }}>No Logs Yet</h3>
                  </div>
                ) : (
                  <>
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12 }}>
                      {Object.entries(LOG_CFG).map(([type, cfg]) => (
                        <span key={type} style={{ background: dark ? `${cfg.color}20` : cfg.bg, color: cfg.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                          {cfg.icon} {logs.filter(l => l.type === type).length} {cfg.label}
                        </span>
                      ))}
                    </div>
                    {logs.map((log, i) => {
                      const cfg = LOG_CFG[log.type] || LOG_CFG.LOGIN;
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < logs.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
                          onMouseOver={e => e.currentTarget.style.background = 'var(--bg)'}
                          onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: dark ? `${cfg.color}20` : cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{cfg.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 600, fontSize: 14 }}>{log.userName || 'Unknown'}</span>
                              <span style={{ background: dark ? `${cfg.color}25` : cfg.bg, color: cfg.color, padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{cfg.label}</span>
                              {log.userRole && ROLE_CFG[log.userRole] && (
                                <span style={{ background: dark ? `${ROLE_CFG[log.userRole].color}20` : ROLE_CFG[log.userRole].bg, color: ROLE_CFG[log.userRole].color, padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>
                                  {ROLE_CFG[log.userRole].icon} {ROLE_CFG[log.userRole].label}
                                </span>
                              )}
                            </div>
                            <p style={{ color: 'var(--text3)', fontSize: 12, marginTop: 2 }}>{log.userEmail} · {log.action}</p>
                          </div>
                          <p style={{ color: 'var(--text3)', fontSize: 11, whiteSpace: 'nowrap' }}>{fmt(log.timestamp)}</p>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </>
          )}

          {/* ─ SKILL GAP ─ */}
          {section === 'skillgap' && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>🎯 Skill Gap Analysis</h2>
              <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>Demand vs supply across sectors</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="card">
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Sector Radar</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={skillGap}>
                      <PolarGrid stroke={dark ? '#1e1e2e' : '#e5e7eb'} />
                      <PolarAngleAxis dataKey="sector" fontSize={10} tick={{ fill: 'var(--text2)' }} />
                      <PolarRadiusAxis domain={[0, 100]} fontSize={9} tick={{ fill: 'var(--text3)' }} />
                      <Radar name="Demand" dataKey="demand" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
                      <Radar name="Supply" dataKey="supply" stroke="#10b981" fill="#10b981" fillOpacity={0.35} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card">
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Gap by Sector</h3>
                  {skillGap.map(s => {
                    const gap = s.demand - s.supply;
                    return (
                      <div key={s.sector} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{s.sector}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: gap > 30 ? '#ef4444' : gap > 15 ? '#f59e0b' : '#10b981' }}>Gap: {gap}pts</span>
                        </div>
                        <div style={{ height: 8, background: 'var(--border)', borderRadius: 6, position: 'relative' }}>
                          <div style={{ position: 'absolute', width: `${s.supply}%`, background: '#10b981', height: '100%', borderRadius: 6 }} />
                          <div style={{ position: 'absolute', width: `${s.demand}%`, background: 'rgba(99,102,241,0.4)', height: '100%', borderRadius: 6, border: '1px solid #6366f1' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ─ PROGRAMS ─ */}
          {section === 'programs' && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>📚 Training Programs</h2>
              <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>Enrolment vs placement by programme</p>
              <div className="card">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={programs}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1e1e2e' : '#f0f0f5'} />
                    <XAxis dataKey="name" fontSize={12} tick={{ fill: 'var(--text2)' }} />
                    <YAxis fontSize={12} tick={{ fill: 'var(--text2)' }} />
                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)' }} />
                    <Legend />
                    <Bar dataKey="enrolled" fill="#c4b5fd" name="Enrolled" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="placed" fill="#6366f1" name="Placed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}

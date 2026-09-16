# SkillTrack 🎓

> A multi-stakeholder platform to track employment outcomes, skill gaps, and the impact of skilling initiatives.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (free) OR local MongoDB

---

### 1. Setup Backend

```bash
cd server
npm install
```

Edit `server/.env` and replace `MONGO_URI` with your MongoDB Atlas connection string:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/skilltrack
```

Seed the database with demo data:
```bash
npm run seed
```

Start the server:
```bash
npm run dev
```
✅ Server runs at: http://localhost:5000

---

### 2. Setup Frontend

```bash
cd client
npm install
npm run dev
```
✅ App runs at: http://localhost:5173

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 🏛️ Admin | admin@skilltrack.in | admin123 |
| 🏫 Institute | institute@skilltrack.in | institute123 |
| 👤 Candidate | candidate@skilltrack.in | candidate123 |
| 🏢 Employer | employer@skilltrack.in | employer123 |

---

## 📁 Project Structure

```
skilltrack/
├── client/          # React + Vite frontend
└── server/          # Node.js + Express backend
```

## 🌟 Features

- **Admin Dashboard** — KPI cards, employment trend chart, skill gap radar, program impact table
- **Institute Dashboard** — Program management, bar chart, outcome pie chart
- **Candidate Dashboard** — Skill passport, certifications, employment timeline
- **Employer Dashboard** — Candidate browsing, skill filtering, job postings

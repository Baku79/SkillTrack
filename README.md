<div align="center">

# 🎓 SkillTrack

### National Skilling & Employment Outcome Tracking Platform
**Smart India Hackathon (SIH) 2026 Innovation**

Track employment outcomes, analyze skill gaps, measure program impact, and enable evidence-based policymaking.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-26.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![2FA Security](https://img.shields.io/badge/Security-2FA%20OTP-indigo?style=for-the-badge&logo=auth0&logoColor=white)]()
[![SIH 2026](https://img.shields.io/badge/Hackathon-SIH%202026-orange?style=for-the-badge)]()

[Explore Features](#-features) • [Installation](#-getting-started) • [Tech Stack](#-tech-stack) • [Deployment](#-deployment) • [API Guide](#-api--key-routes)

</div>

---

## 📌 Executive Summary

**SkillTrack** is a centralized, multi-stakeholder platform engineered for **Smart India Hackathon (SIH) 2026**. It solves a critical gap in India's skill development ecosystem: *the lack of longitudinal tracking of trainees after certification.*

While conventional platforms stop at enrollment and certification, **SkillTrack** continuously tracks post-training employment outcomes, wage progression, job retention, self-employment, and sectoral skill gaps across 4 distinct role-based portals.

---

## ✨ Key Capabilities

| Role / Portal | Highlights & Core Features |
| :--- | :--- |
| 🏛️ **Admin (Government)** | • **Reports Centre**: Generate, edit, and download official Excel (`.xlsx`) & CSV reports.<br>• **Full Data Management**: Inline edit, add, and delete records for Placement and Skill Gap analytics.<br>• **Real-Time Analytics**: Live registration trends, daily login charts, and district-wise outcome monitoring.<br>• **Identity Governance**: Government ID verification (Aadhaar / Passport / Govt ID) required for admin accounts. |
| 🏫 **Training Institute** | • Batch enrollment & candidate tracking.<br>• Placement status updates & certification logging.<br>• Sector-wise employment performance metrics. |
| 👤 **Candidate** | • Digital **Skill Passport** with verified training history.<br>• Career progression log, certification downloads, and job application tracking. |
| 🏢 **Employer** | • Browse verified candidate profiles matching specific skill requirements.<br>• Directly recruit skilled workforce & confirm employment retention. |

---

## 🔒 Security & Authentication

- **2-Factor Authentication (2FA)**: Password check followed by automated 6-digit OTP verification via **Email (Nodemailer)** or **SMS (Twilio)**.
- **Forgot Password Flow**: Secure 3-step OTP verification and password reset system.
- **Role-Based Access Control (RBAC)**: Enforced via JSON Web Tokens (JWT).
- **Plain + Hash Audit Transparency**: Plaintext tracking options alongside bcrypt hashing for admin verification reports.

---

## ⚡ Tech Stack

| Layer | Technology | Usage / Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Fast Single-Page Application (SPA) with HMR |
| **UI Components** | CSS Modules / Custom Design System | Dark/Light theme support, Glassmorphism UI |
| **Charts & Visuals** | Recharts | Bar charts, Radar charts, Line trends |
| **Exports** | SheetJS (XLSX) | Multi-sheet Excel workbook generation |
| **Backend** | Node.js + Express.js | RESTful API server & auth controller |
| **Database** | Embedded JSON DB (`db.json`) | Lightweight, zero-config local persistence |
| **Mailing / SMS** | Nodemailer & Twilio API | Real-time OTP delivery with dev-mode fallback |

---

## 📁 Repository Architecture

```text
skilltrack/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, OTPInput, DevOtpBox
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── pages/              # Landing, Login, Dashboard
│   │   │   └── dashboard/      # AdminDashboard, Candidate, etc.
│   │   └── api.js              # Axios configuration & interceptors
│   ├── vercel.json             # Vercel deployment routes
│   └── vite.config.js          # Proxy & dev server config
│
├── server/                     # Express API Server
│   ├── data/                   # File-based DB (db.json)
│   ├── routes/                 # Auth (2FA/OTP), Users, Analytics
│   ├── services/               # Nodemailer (Email) & Twilio (SMS) OTP service
│   ├── render.yaml             # Render cloud deployment settings
│   ├── createAdmin.js          # Admin account seed script
│   └── index.js                # Server entry point
│
└── DEPLOY.md                   # Cloud Deployment Step-by-Step Guide
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 1. Clone the Repository
```bash
git clone https://github.com/Baku79/SkillTrack.git
cd SkillTrack
```

### 2. Configure Backend Environment
Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
JWT_SECRET=skilltrack_secret_key_2026

# Optional: Real Email OTP (Gmail App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password

# Optional: Real SMS OTP (Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE=+1XXXXXXXXXX
```

> [!NOTE]
> If `EMAIL_USER` or `TWILIO` keys are omitted, SkillTrack automatically runs in **Dev Mode**, displaying OTPs directly on screen in a dev box for testing.

### 3. Install Dependencies & Run

#### Terminal 1 — Backend Server
```bash
cd server
npm install
npm run dev
```
*Server runs on `http://localhost:5000`*

#### Terminal 2 — Frontend App
```bash
cd client
npm install
npm run dev -- --host
```
*App runs on `http://localhost:5173` and network IP (e.g. `http://192.168.x.x:5173`)*

---

## 🌐 Local Wi-Fi Network Access

To test SkillTrack on multiple laptops or mobile devices on the same Wi-Fi:
1. Ensure the frontend is launched with `--host`.
2. Access `http://<YOUR_LOCAL_IP>:5173` on any browser in the network.

---

## ☁️ Deployment

- **Frontend**: Pre-configured for **Vercel** (`client/vercel.json`).
- **Backend**: Pre-configured for **Render** (`server/render.yaml`).

For detailed deployment instructions, refer to [DEPLOY.md](./DEPLOY.md).

---

## 👥 Default Demo Credentials

| Role | Email | Password | Govt ID / Details |
| :--- | :--- | :--- | :--- |
| **Admin (Government)** | `admin@skilltrack.in` | `admin123` | `GOVT-IND-882190` |
| **Training Institute** | `institute@skilltrack.in` | `inst1234` | Pune Skill Hub |
| **Candidate** | `candidate@skilltrack.in` | `cand1234` | ITI Trainee |
| **Employer** | `employer@skilltrack.in` | `emp12345` | TechCorp India |

---

## 📜 License & Citation

Developed for **Smart India Hackathon (SIH) 2026**. Developed with ❤️ by **Team SkillTrack**.

---

<div align="center">
⭐ <b>Star this repository if you find it helpful!</b>
</div>

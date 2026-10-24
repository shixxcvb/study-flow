# StudyFlow 🎓 — Student Productivity & Academic Planner

> An original academic portfolio project designed and engineered by **Charlene Calamba**, a Bachelor of Science in Information Technology student.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://studyflow-dashboard.vercel.app)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

**Live Demo:** [https://studyflow-dashboard.vercel.app](https://studyflow-dashboard.vercel.app) *(Deploy placeholder)*  
**Author:** Charlene Calamba ([@shixxcvb](https://github.com/shixxcvb))  
**Academic Degree:** Bachelor of Science in Information Technology  
**Repository Name:** `studyflow-dashboard`

---

## 📖 Overview

**StudyFlow** is a premium, interactive student productivity web application engineered to solve real academic workflow challenges: managing heavy coursework deadlines, maintaining deep focus intervals, visualizing semester schedules, and tracking study velocity.

Unlike static UI mockups, **StudyFlow** is a complete, fully functional client-side application featuring persistent local data storage, drift-free timestamp-based Pomodoro focus tracking, full task CRUD with validation and search filtering, an interactive monthly academic calendar, and real progress analytics computed directly from stored user actions.

---

## ✨ Key Features

### 1. 🗂️ Bento Grid Dashboard
- **Personalized Greeting**: Dynamic, context-aware greeting ("Good morning, Charlene!") based on local time and completion velocity.
- **Productivity Pulse**: Real-time counters for *Tasks Due Today*, *Tasks Completed*, *Study Time Summary*, and *Active Streaks*.
- **Priority Action List**: Instant task completion toggle with confetti celebration and quick edit access.
- **Interactive Mini Calendar**: Month overview with task indicator dots and day jumping.
- **Focus Studio Launcher**: One-click quick launch into deep study intervals.

### 2. 📝 Coursework & Task Management
- **Full CRUD Workflow**: Add, Edit, Delete (with safety confirmation dialog), and toggle status (To Do, In Progress, Completed).
- **Academic Metadata**: Course subject categorizations (e.g., *IT 312: Cloud Architecture*, *IT 315: Web Systems*, *IT 320: Database Systems*), priority ratings (*High*, *Medium*, *Low*), time estimates, and markdown-friendly note descriptions.
- **Multi-Factor Search & Filtering**: Instant client-side search by title or note text; filter by status, course subject, and priority.
- **Sorting Options**: Sort by due date (earliest/latest), priority level, or alphabetical order.
- **Dual View Modes**: Switch between structured List View and agile 3-column Kanban Board View.

### 3. 📅 Academic Schedule Calendar
- **Interactive Month Grid**: True local date mathematics (`YYYY-MM-DD`) preventing timezone shifting errors.
- **Month Navigation**: Previous/Next month controls and quick "Return to Today" button.
- **Day Inspection Panel**: Click any day to inspect all assignments due on that specific date.
- **Quick-Add by Date**: Select a date and immediately schedule a new task for that calendar slot.
- **Deadline Indicators**: Visual markers highlighting days with approaching high-priority deadlines.

### 4. ⏱️ Drift-Free Pomodoro Focus Timer
- **Three Mode Intervals**: Focus Session (25 min default), Short Break (5 min), and Long Break (15 min) — all customizable in Settings.
- **Wall-Clock Timestamp Math**: Calculates remaining time against `endTime` timestamps (`endTime = Date.now() + remainingMs`), preventing clock drift when browser tabs are throttled in the background.
- **State Persistence**: Timer state is saved to `localStorage`, allowing safe recovery after browser refreshes.
- **Task Linkage**: Optionally assign a focus interval to a specific course assignment.
- **Harmonic Audio Chimes**: Synthesized dual-frequency chimes via browser Web Audio API — 100% reliable without external audio dependencies.
- **Celebration Confetti**: Physics-based confetti burst when finishing a focus block.

### 5. 📊 Real Data Study Analytics
- **No Fabricated Statistics**: All charts and figures derive directly from stored user tasks and logged focus sessions.
- **7-Day Activity Chart**: Dual-metric bar visualizer tracking daily completed tasks and logged focus minutes over the past 7 days with interactive hover tooltips.
- **Coursework Breakdown**: Progress bars and completion percentages for each enrolled subject.
- **Study Streak Tracker**: Calculates continuous daily study momentum based on actual completion dates.

### 6. ⚙️ Preferences & Student Settings
- **Light & Dark Mode**: Handcrafted lavender/lilac light theme and soft obsidian dark mode with zero color clash.
- **Customizable Durations**: Adjust Focus, Short Break, and Long Break lengths to your personal study rhythm.
- **Audio Controls**: Enable or mute harmonic chimes.
- **Demo Data Controls**: Pre-load rich IT coursework sample data for academic presentations or clear all data with safety confirmation.
- **Portfolio Showcase Card**: Embedded student profile credentials for Charlene Calamba.

---

## 🎨 Visual Identity & Design Discipline

The visual identity follows modern design guidelines:
- **Palette**: Lavender (`#A78BFA`), Soft Purple (`#C4B5FD`), Lilac (`#EDE9FE`), Pink Accent (`#F9A8D4`), Canvas Background (`#FAF8FF`), and Slate Contrast (`#242039`).
- **Zero-Pill Metadata**: Tags, dates, and course labels use clean unboxed text with typographic `·` separators.
- **Top Bar Contract**: Clean 3-zone layout with breadcrumb trail, date context, and theme/action controls.
- **Tabular Figures**: All numerical timers, dates, and counters utilize `tabular-nums` for rock-solid vertical alignment.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19 (Functional Components, Custom Hooks) |
| **Language** | TypeScript 5 (Strict Mode, Typed Interfaces) |
| **Styling & CSS** | Tailwind CSS v4, Custom CSS Variables |
| **Animations** | Motion (Framer Motion v12), Canvas Confetti |
| **Icons** | Lucide React |
| **Audio Engine** | Web Audio API (Synthesized harmonic frequencies) |
| **State & Storage** | React Context API + Browser LocalStorage Persistence |
| **Build Tooling** | Vite 8, ESBuild, PostCSS |

---

## 🚀 Local Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) (version 18 or later) installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/shixxcvb/studyflow-dashboard.git
cd studyflow-dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` (or the port specified in terminal).

### 4. Build for production
```bash
npm run build
```
The compiled, optimized production files will be output to the `dist/` directory.

### 5. Preview production build locally
```bash
npm run preview
```

---

## ☁️ Deployment Guide (GitHub to Vercel)

Deploying StudyFlow to Vercel takes less than two minutes:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete StudyFlow student productivity dashboard"
   git branch -M main
   git remote add origin https://github.com/shixxcvb/studyflow-dashboard.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in with your GitHub account (`shixxcvb`).
   - Click **"Add New..."** → **"Project"**.
   - Select the `studyflow-dashboard` repository from the list.

3. **Configure Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   *(No environment secrets or database connection strings are required!)*

4. **Deploy**:
   - Click **Deploy**. Vercel will build and assign a free HTTPS URL (e.g., `https://studyflow-dashboard.vercel.app`).

---

## 📌 Suggested Git Commit Milestones

For a clean portfolio Git history, the following structured commit milestones are recommended:

| Commit Hash / Milestone | Commit Message |
| :--- | :--- |
| `01-setup` | `chore: initial project scaffold with Vite, React 19, TypeScript and Tailwind v4` |
| `02-types` | `feat: define core TypeScript interfaces, storage keys, and seed datasets` |
| `03-context` | `feat: implement AppContext with local storage synchronization and audio engine` |
| `04-layout` | `feat: build responsive collapsible sidebar, top navigation bar, and dark mode support` |
| `05-dashboard` | `feat: construct bento grid dashboard with live metrics, today's schedule, and mini calendar` |
| `06-tasks` | `feat: develop full task CRUD system with search, filter tabs, sorting, and kanban view` |
| `07-calendar` | `feat: build interactive monthly academic calendar with date selection and deadline badges` |
| `08-timer` | `feat: implement drift-free Pomodoro focus timer with circular progress and task linkage` |
| `09-analytics`| `feat: implement study analytics with 7-day activity bar chart and course distribution` |
| `10-settings` | `feat: create user preference controls, demo data loader, and student portfolio card` |
| `11-polish`   | `chore: finalize documentation, accessibility audit, and Vercel deployment configuration` |

---

## 👩‍💻 Author & Credits

- **Author:** Charlene Calamba
- **Degree:** Bachelor of Science in Information Technology (BSIT)
- **GitHub:** [@shixxcvb](https://github.com/shixxcvb)
- **Project Purpose:** Academic Capstone / Web Systems Portfolio Demonstration

*Designed with dedication to academic excellence, human-centered UI/UX design, and clean full-stack frontend engineering.*

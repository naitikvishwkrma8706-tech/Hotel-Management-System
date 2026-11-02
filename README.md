# 🏨 Grand Horizon Resort & Suites | Enterprise Hotel Management System

> **Recreated & Re-architected as a 5-Star Hotel Management Web Application & Frontend Prototype.**  
> Ready for instantaneous local development, testing, and production deployment on **Vercel**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnaitikvishwkrma8706-tech%2FHotel-Management-System)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Overview & Re-architecture

This project reimagines the original Python/MySQL command-line tool into a **world-class, responsive, luxury hotel management web prototype**. It faithfully incorporates all database structures (`guest` and `staff` tables), subroutines, validations, salary logic, and Matplotlib graphical charts, while introducing real-time interactive room matrix mapping, automated billing generation, caller verification, and data backup/restore capabilities.

---

## ✨ Key Features & Capabilities

### 1. 🧍 Guest Database Management (Front Desk)

- **Add Guest Records:** Duplicate primary key ID checks, auto-assigned room occupancy, check-in and check-out date duration calculations, and booking channel tracking.
- **Interactive Data Table:** Instant multi-field search (by **1. ID**, **2. Name**, **3. Source of Booking**, **4. Room No**, **5. Date**, **6. Type of Room** matching `search_guest()`).
- **Update & Delete:** Safe modifications with real-time room status synchronization and confirmation dialogs.
- **Express Check-In & Check-Out:** Instantly release or occupy suites with single-click operational controls.
- **Matplotlib Visuals Simulation:** Interactive bar charts illustrating **Rooms Booked frequency** and **Acquisition Channel breakdown** (recreating `graph_guest()`).

### 2. 👨‍💼 Staff & Payroll Directory (Human Resources & Management)

- **Automated Salary Mapping:** Implements the exact PRD/TRD logic where base salary automatically maps based on department:
  - `cleaning` ➔ **$2,000 / month**
  - `food and beverages` ➔ **$4,000 / month**
  - `management` ➔ **$6,000 / month**
  - Custom overrides supported with a manual salary override toggle.
- **Auto-Recalculation on Department Update:** Changing an employee's department automatically updates their salary tier!
- **Staff Directory Roster:** Filter by department, search by ID, Name, Department, Salary, or Hire Date.
- **Salary Distribution Graph:** Recreates `graph_staff()` with visual bar representations of employee headcounts in the $2,000, $4,000, and $6,000 brackets.

### 3. 🛌 Interactive Room Rack & Floor Matrix

- **4-Floor Luxury Layout:** 18 suites categorized across **Floor 1 (Standard)**, **Floor 2 (Deluxe)**, **Floor 3 (Executive Suite)**, and **Floor 4 (Presidential Penthouse)**.
- **Live Status Tracking:** Visual color-coded cards for **Available (Green)**, **Occupied (Blue)**, **Reserved (Amber)**, and **Housekeeping/Maintenance (Purple)**.
- **Direct Room Booking:** One-click reservation modal directly from any vacant suite.

### 4. 🧾 Dynamic Pricing & Printable Billing Invoices (PRD Section 8)

- **Automated Stay Duration Computation:** Real-time calculation of total nights between check-in and check-out dates.
- **Itemized Folio Breakdown:** Room nightly rate & subtotal, plus 12% State & Local Hotel Occupancy Tax.
- **Printable Guest Invoice:** Single-click browser printing/PDF generation with luxury Grand Horizon branding.

### 5. 📞 Guest Phone & Caller Verification Tool

- **Web Port of `phonenumber.py`:** Validates international telephone formatting (E.164), extracts carrier, location circle, country name, and line type (mobile vs. landline).
- **Preloaded In-House Guest Numbers:** One-click testing with realistic guest phone numbers across USA, UK, India, UAE, and Spain.

### 6. 💻 Authentic Python 3.8 CLI Interactive Shell Simulator

- Click **"Python CLI Mode"** to launch an in-browser terminal emulator running the authentic text-based menu (`main.py`, `guest_menu()`, `staff_menu()`).

### 7. 💾 Data Resilience & Portability

- **Client-Side Persistence:** Instant `localStorage` synchronization with zero backend setup required.
- **Backup & Restore:** Full JSON export/import and one-click **"Reset to Demo Data"** for testing.
- **CSV Export:** Download separate CSV files for guest and staff records.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Build System:** Vite 5
- **Icons & UI:** Lucide React, Custom Tailwind Typography
- **Hosting / Deployment Target:** Vercel (Configured via `vercel.json` with SPA routing)
- **Legacy CLI (Preserved):** Python 3.8+, PyMySQL, SQLAlchemy, Pandas, Matplotlib

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install

```bash
git clone https://github.com/naitikvishwkrma8706-tech/Hotel-Management-System.git
cd Hotel-Management-System

# Install dependencies
npm install
```

### 2. Start Dev Server

```bash
npm run dev
```

Open your browser at `http://localhost:3000` to interact with the prototype.

### 3. Production Build

```bash
npm run build
npm run preview
```

---

## 🌐 Deploy to Vercel

### Method 1: Deploy with Vercel Web Dashboard (Recommended)

1. Push your repository to **GitHub**.
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New Project"** and import your `Hotel-Management-System` repository.
4. Vercel will automatically detect **Vite**:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **"Deploy"**. Your site will be live on an HTTPS `.vercel.app` domain in seconds!

### Method 2: Deploy with Vercel CLI

If you have Vercel CLI installed:

```bash
# Login to Vercel
npx vercel login

# Deploy preview
npx vercel

# Deploy to production
npx vercel --prod
```

The included `vercel.json` ensures client-side routing works seamlessly:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📂 Project Structure

```text
Hotel-Management-System/
├── index.html                 # HTML entry point with Google Fonts
├── package.json               # Node dependencies & npm scripts
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Custom luxury color palette & typography
├── tsconfig.json              # TypeScript compiler configuration
├── vercel.json                # Vercel SPA routing & build configuration
├── src/
│   ├── main.tsx               # React application mounting point
│   ├── App.tsx                # Main layout, tabs & modal controllers
│   ├── index.css              # Tailwind directives & luxury styling
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces (Guest, Staff, Room)
│   ├── data/
│   │   └── seedData.ts        # Pre-seeded realistic hotel records
│   ├── context/
│   │   └── HotelContext.tsx   # Reactive state, CRUD actions & localStorage
│   ├── utils/
│   │   └── helpers.ts         # Salary mapping, stay totals, CSV/JSON exports
│   └── components/
│       ├── Navbar.tsx         # Brand header, role switcher & data tools
│       ├── Sidebar.tsx        # Navigation menu & terminal launcher
│       ├── Dashboard.tsx       # Executive KPIs & live occupancy metrics
│       ├── GuestManagement.tsx# Full guest CRUD, 6-param search & charts
│       ├── StaffManagement.tsx# Staff roster, auto-salary calc & salary charts
│       ├── RoomRack.tsx       # Floor-by-floor interactive room grid
│       ├── AnalyticsView.tsx  # Matplotlib visualization suite
│       ├── BillingView.tsx    # PRD 8 stay invoice & pricing calculator
│       ├── PhoneVerification.tsx # Port of phonenumber.py validation
│       ├── AddGuestModal.tsx  # Guest registration modal
│       ├── AddStaffModal.tsx  # Employee hiring modal
│       ├── TerminalModal.tsx  # Python CLI in-browser simulator
│       └── ToastContainer.tsx # Notification toast stack
├── legacy_cli/                # Original Python CLI preserved intact
│   ├── main.py                # Original CLI entry point
│   ├── db_setup.sql           # MySQL database schema
│   ├── phonenumber.py         # Original phone validation script
│   ├── requirements.txt       # Original Python dependencies
│   └── src/
│       ├── db/db.py           # MySQL connector
│       └── modules/
│           ├── guest.py       # Python guest functions
│           └── staff.py       # Python staff functions
├── docs/
│   ├── PRD.md                 # Product Requirements Document
│   └── TRD.md                 # Technical Requirements Document
└── README.md                  # Project documentation
```

---

## 🐍 Running the Legacy Python CLI (Optional)

If you would like to run the original terminal CLI against a local MySQL database:

1. Ensure MySQL is running on port 3306.
2. Initialize database: `mysql -u root < legacy_cli/db_setup.sql`.
3. Enter `legacy_cli/` and run:
   ```bash
   cd legacy_cli
   python -m venv venv
   source venv/bin/activate  # Or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   python main.py
   ```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

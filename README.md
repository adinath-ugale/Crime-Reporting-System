#  Crime Reporting System (CRS)
### *Report. Track. Respond.*

A complete, production-grade frontend web application for citizen crime reporting, police station investigation management, and executive state law enforcement analytics.

Built entirely using **HTML5, CSS3, and Vanilla JavaScript** with temporary client-side persistence powered by a centralized **LocalStorage service architecture**. The application is cleanly decoupled with a dedicated service/API layer (`js/api.js`) allowing a **PHP + MySQL backend** to be attached seamlessly without modifying any user interfaces, forms, or stylesheets.

---

##  Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Folder Structure](#-folder-structure)
5. [How to Run Locally](#-how-to-run-locally)
6. [How to Deploy (GitHub Pages)](#-how-to-deploy-github-pages)
7. [Application Roles & Access Matrix](#-application-roles--access-matrix)
8. [End-to-End User Workflows](#-end-to-end-user-workflows)
   - [Citizen Workflow](#citizen-workflow)
   - [Police Officer Workflow](#police-officer-workflow)
   - [Station In-Charge Workflow](#station-in-charge-workflow)
   - [Executive State Official Workflow](#executive-state-official-workflow)
9. [Frontend & Data Architecture](#-frontend--data-architecture)
   - [LocalStorage Key Specifications](#localstorage-key-specifications)
   - [Complaint Lifecycle Statuses](#complaint-lifecycle-statuses)
10. [Future PHP & MySQL Integration Guide](#-future-php--mysql-integration-guide)
    - [Database Schema (DDL)](#mysql-database-schema)
    - [RESTful PHP Endpoint Blueprint](#restful-php-endpoint-blueprint)
    - [Switching from LocalStorage to PHP API](#switching-from-localstorage-to-php-api)

---

## Project Overview

The **Crime Reporting System (CRS)** provides an authentic civic technology portal that brings speed, accountability, and legal transparency to public safety grievance handling.

- **Zero-barrier Citizen Lodging:** Multi-step guided complaint filing with comprehensive crime categories, suspect profiles, and digital evidence metadata attachments.
- **Real-Time Stage Progression Tracking:** Instant public docket search displaying live milestones: `Submitted` ➔ `Verified` ➔ `Assigned` ➔ `Investigation` ➔ `Resolved` ➔ `Closed`.
- **Departmental Case Management:** Police and station commanding officers can verify jurisdictions, assign investigating officers, record chronological case diaries, and trigger automated citizen notifications.
- **Executive Analytics:** High-level executive dashboard featuring pure CSS/SVG visual charts without external library bloat, tabular audit reporting, and client-side CSV exports.

---

##  Key Features

- **Production-Style Civic Design:** Modern civic palette using Deep Navy (`#0f172a`), Royal Blue (`#1d4ed8`), Emergency Red accents (`#dc2626`), Success Green (`#16a34a`), and crisp typography.
- **Pure Native Execution:** 100% vanilla JavaScript, HTML5, and CSS3. Zero external frameworks, zero npm/Node.js dependencies, zero build scripts. Runs directly in any modern browser.
- **Centralized LocalStorage Persistence:** Automated initial seeding of realistic civic datasets (police stations, officers, administrative accounts, seed complaints, and notifications) when storage is empty.
- **Role-Based Routing:** Automated role detection routing users to their tailored control panels:
  - Citizen ➔ `dashboard.html`
  - Police Officer ➔ `police-dashboard.html`
  - Station In-Charge ➔ `incharge-dashboard.html`
  - State Official ➔ `official-dashboard.html`
- **Thorough Input Validation:** Real-time checking for valid email formats, 10-digit Indian mobile numbers (`^[6-9]\d{9}$`), 6-digit Indian PIN codes, password strength meters, and confirm-password verification.
- **Digital Evidence File Handling:** Drag-and-drop file uploader with size computation and metadata logging.
- **Export & Print Ready:**
  - One-click client-side CSV export generator using JavaScript `Blob`.
  - Dedicated print stylesheet (`@media print`) rendering printable case dossiers and FIR summaries.
- **Fully Responsive:** Tested across `320px`, `375px`, `414px`, `768px`, `1024px`, `1366px`, and `1920px` viewports with touch-friendly touch targets and collapsible off-canvas navigation.

---

##  Technology Stack

| Layer | Technologies Used |
|---|---|
| **Markup** | Semantic HTML5 (ARIA attributes, accessible form controls, clean semantic tags) |
| **Styling** | Modern CSS3 (Custom properties/CSS variables, Flexbox, Grid, Pure CSS charts, `@media print`) |
| **Client Scripting** | Vanilla JavaScript (ES6+ async/await, DOM APIs, Blob generation, URLSearchParams) |
| **Client Storage** | Browser `localStorage` with automated JSON serialization/deserialization |
| **Assets** | Custom SVG vectors (CRS emblem logo, civic security dashboard illustration, icons) |
| **Future Backend** | Prepared for PHP 8.x + MySQL 8.x (via `js/api.js` abstraction) |

---

##  Folder Structure

```
crime-reporting-system/
│
├── index.html                    # Public homepage with hero, quick actions & SOP
├── login.html                    # Citizen authentication portal
├── register.html                 # Citizen registration form with full validation
├── report-crime.html             # Multi-step 7-section crime complaint lodging wizard
├── complaint-history.html        # Citizen complaint archives with filters & search
├── complaint-details.html        # Comprehensive case dossier with timeline & print
├── track-complaint.html          # Public live case status tracking portal
├── dashboard.html                # Citizen control panel with dynamic KPI metrics
├── profile.html                  # Profile editor for Citizen and Police users
├── notifications.html            # Notifications hub with unread filters and actions
├── police-login.html             # Dedicated law enforcement access portal
├── police-dashboard.html         # Police administrative workspace with 5 KPI cards
├── complaints-management.html    # Case management, status transitions & officer assignment
├── investigation.html            # Investigation module & chronological case diary
├── police-stations.html          # Station directory, jurisdictions & management
├── officer-management.html       # Officer roster, rank, and caseload allocations
├── incharge-dashboard.html       # Station in-charge supervisory dashboard
├── official-dashboard.html       # State Headquarters executive analytics with charts
├── reports.html                  # Caseload audit, print generator & CSV export
├── about.html                    # System mission, pillars, and governance
├── contact.html                  # Contact support portal with form and helplines
├── privacy.html                  # Statutory privacy and data confidentiality policy
├── terms.html                    # Terms of service and Section 182/211 IPC legal notice
├── 404.html                      # Error 404 resource not found page
│
├── css/
│   ├── style.css                 # Base design tokens, resets, typography & layouts
│   ├── components.css            # Reusable UI components (buttons, badges, modals, toasts)
│   ├── forms.css                 # Form controls, input groups, file dropzone & stepper
│   ├── dashboard.css             # Dashboard sidebar, topbar, pure CSS/SVG charts
│   └── responsive.css            # Media query breakpoints (320px to 1920px)
│
├── js/
│   ├── data.js                   # Realistic civic seed dataset (stations, officers, cases)
│   ├── storage.js                # Centralized LocalStorage manager & CRUD helpers
│   ├── api.js                    # Promise-based API service layer for future PHP backend
│   ├── auth.js                   # Frontend session management & role guards
│   ├── validation.js             # Form validation utilities (regex, strength, errors)
│   ├── app.js                    # Global controller (toasts, modals, formatters, badges)
│   ├── navigation.js             # Active links, mobile drawer, user bar & unread counters
│   ├── complaints.js             # Crime report filing, history, details, and tracking
│   ├── police.js                 # Police operations, assignment, diary & station CRUD
│   ├── dashboard.js              # KPI calculations, CSS charts, and reports CSV export
│   └── notifications.js          # Notification hub logic, mark as read, delete
│
├── assets/
│   ├── logos/
│   │   └── crs-logo.svg          # Official CRS emblem and typography logo
│   ├── images/
│   │   └── hero-civic-security.svg # Civic monitoring console vector illustration
│   └── icons/                    # Embedded scalable SVG icons
│
└── README.md                     # Comprehensive documentation and integration guide
```

---

##  How to Run Locally

Because the application is built entirely using standard HTML5, CSS3, and JavaScript, **no installation, Node.js, Python, or local server is strictly required**.

### Method 1: Direct Browser Launch
1. Clone or download the repository.
2. Double-click `index.html` or right-click `index.html` and select **Open with Google Chrome / Firefox / Microsoft Edge / Safari**.
3. All relative paths, LocalStorage functions, and interactions will execute immediately.

### Method 2: Local HTTP Server (Recommended)
You can also serve the files with any lightweight HTTP server:
- **VS Code Live Server:** Right-click `index.html` and click **"Open with Live Server"**.
- **Python 3:** Run `python -m http.server 8000` inside `crime-reporting-system/` and navigate to `http://localhost:8000`.
- **PHP Built-in Server:** Run `php -S localhost:8000` inside `crime-reporting-system/` and navigate to `http://localhost:8000`.

---

##  How to Deploy (GitHub Pages)

The project is structured with 100% relative paths (`./`, `css/...`, `js/...`, `assets/...`) and does not rely on server-side routing or URL rewriting.

1. Push the contents of the `crime-reporting-system` directory to a GitHub repository.
2. Navigate to **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and directory `/ (root)`.
4. Click **Save**.
5. Your application will be live at `https://<username>.github.io/<repository-name>/`.

---

##  Application Roles & Access Matrix

The system provides pre-configured operational system accounts:

| Role | Portal / Login Page | Default Identifier / Police ID | Default Password | Access Scope |
|---|---|---|---|---|
| **Citizen** | `login.html` | `citizen@crs.gov.in` | `Password@123` | File complaints, view history, print dossier, track status, manage profile. |
| **Police Officer** | `police-login.html` | `POL-7821` (Station: `CPS-01`) | `Police@123` | Station complaints docket, status progression, case diary entries. |
| **Station In-Charge** | `police-login.html` | `POL-9102` (Station: `CCU-02`) | `Incharge@123` | Station oversight, assign & reassign officers, review inquiries, workload management. |
| **Head / State Official** | `police-login.html` | `HQ-001` (Station: `HQ-STATE`) | `Official@123` | Statewide analytics, cross-district charts, station network audits, CSV exports. |

*Note: New citizens can register accounts freely on `register.html`.*

---

##  End-to-End User Workflows

### Citizen Workflow
1. Navigate to `register.html` and create a citizen profile.
2. Log in at `login.html`. You are directed to `dashboard.html`.
3. Click **"Report New Crime"** to open `report-crime.html`.
4. Complete the 7-step wizard (Complainant ➔ Incident ➔ Description ➔ Suspect ➔ Evidence ➔ Police Station ➔ Declaration).
5. Submit the complaint. A unique identifier (e.g., `CRS-2026-XXXXX`) is generated and saved in LocalStorage.
6. The system automatically redirects to `complaint-details.html?id=...` showing the full dossier and initial timeline.
7. Complainant receives an automated notification in `notifications.html`.
8. Check `complaint-history.html` to filter, search, and view all submitted cases.

### Police Officer Workflow
1. Log in at `police-login.html` using Police ID `POL-7821`, Station `CPS-01`, and Password `Police@123`.
2. Lands on `police-dashboard.html` showing dynamic KPI counts calculated from LocalStorage.
3. Open `complaints-management.html` to view registered complaints for the station.
4. Click **"Update Status"** to transition a case (e.g. from `Submitted` to `Investigation`), enter remarks, and submit.
5. The citizen is notified immediately, and the complaint's audit timeline is permanently updated.
6. Navigate to `investigation.html`, select the active case, and record official case diary notes.

### Station In-Charge Workflow
1. Log in at `police-login.html` with ID `POL-9102`, Station `CCU-02`, Password `Incharge@123`.
2. Lands on `incharge-dashboard.html` with station-level summaries and officer deployment statistics.
3. On pending cases, click **"Assign Officer"** to allocate an unassigned case to a duty officer.
4. Monitor officer caseloads and station clearance velocity.

### Executive State Official Workflow
1. Log in with ID `HQ-001`, Station `HQ-STATE`, Password `Official@123`.
2. Lands on `official-dashboard.html` displaying statewide charts:
   - Dynamic Bar Chart of crime incident categories.
   - Stage progression distribution bars.
   - District caseload rankings.
3. Open `reports.html`, apply supervisory filters (District, Crime Category, Stage), review metrics, and click **"Export to CSV"** to generate an immediate client-side download.

---

##  Frontend & Data Architecture

All client data access is mediated through `js/storage.js` and abstracted via `js/api.js`.

### LocalStorage Key Specifications

| Key | Description | Data Structure Summary |
|---|---|---|
| `crs_users` | Registered citizens and personnel accounts | `[{ id, fullName, email, mobile, password, role, address, city, district, state, pincode, policeId?, rank?, stationCode? }]` |
| `crs_complaints` | All registered complaints repository | `[{ id, userId, complainantName, crimeCategory, incidentDate, location, stationCode, status, priority, suspect: {}, evidence: [], timeline: [] }]` |
| `crs_stations` | Jurisdictional police stations | `[{ id, code, name, district, city, contact, email, inCharge, status, totalPersonnel }]` |
| `crs_officers` | Active duty police officers | `[{ id, policeId, name, rank, stationCode, stationName, district, email, mobile, casesAssigned, status }]` |
| `crs_investigations` | Chronological case diary entries | `[{ id, complaintId, officerId, officerName, date, actionTaken, evidenceStatus, nextAction, notes }]` |
| `crs_notifications` | System & case status notifications | `[{ id, userId, role, complaintId?, title, message, read, timestamp }]` |
| `crs_contacts` | Support inquiries from contact form | `[{ id, name, email, phone, subject, message, submittedAt }]` |
| `crs_current_session` | Active authenticated user session | `{ id, fullName, email, role, ...loginTimestamp }` |

### Complaint Lifecycle Statuses

```
┌─────────────┐     Station     ┌────────────┐     Officer     ┌────────────┐
│  SUBMITTED  │ ──────────────> │  VERIFIED  │ ──────────────> │  ASSIGNED  │
└─────────────┘   Verification  └────────────┘   Allocation    └────────────┘
                                                                     │
┌─────────────┐     Citizen     ┌────────────┐     Forensic /        │
│   CLOSED    │ <────────────── │  RESOLVED  │ <────────────── ┌─────┴──────┐
└─────────────┘   Satisfaction  └────────────┘     Inquiry     │INVESTIGATION│
                                                               └────────────┘
```

---

##  Future PHP & MySQL Integration Guide

The frontend was specifically architected with clean separation of concerns. In `js/api.js`, every data operation is exposed as an asynchronous Promise.

### MySQL Database Schema

```sql
CREATE DATABASE IF NOT EXISTS `crs_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `crs_db`;

-- 1. Users Table (Citizens, Police, In-Charge, Officials)
CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `mobile` VARCHAR(15) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('citizen', 'police', 'incharge', 'official') NOT NULL DEFAULT 'citizen',
  `police_id` VARCHAR(50) NULL,
  `rank_title` VARCHAR(100) NULL,
  `station_code` VARCHAR(20) NULL,
  `address` TEXT NULL,
  `city` VARCHAR(100) NULL,
  `district` VARCHAR(100) NULL,
  `state` VARCHAR(100) DEFAULT 'Maharashtra',
  `pincode` VARCHAR(10) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Police Stations Table
CREATE TABLE `police_stations` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) DEFAULT 'Maharashtra',
  `pincode` VARCHAR(10) NOT NULL,
  `contact_number` VARCHAR(30) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `officer_in_charge` VARCHAR(150) NULL,
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `total_personnel` INT DEFAULT 30
) ENGINE=InnoDB;

-- 3. Complaints Table
CREATE TABLE `complaints` (
  `id` VARCHAR(30) NOT NULL PRIMARY KEY, -- CRS-YYYY-XXXXX
  `user_id` VARCHAR(36) NOT NULL,
  `complainant_name` VARCHAR(150) NOT NULL,
  `complainant_mobile` VARCHAR(15) NOT NULL,
  `complainant_email` VARCHAR(150) NOT NULL,
  `crime_category` VARCHAR(100) NOT NULL,
  `incident_date` DATE NOT NULL,
  `incident_time` TIME NOT NULL,
  `location` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `description` LONGTEXT NOT NULL,
  `suspect_name` VARCHAR(150) NULL,
  `suspect_vehicle` VARCHAR(50) NULL,
  `suspect_description` TEXT NULL,
  `suspect_additional` TEXT NULL,
  `station_code` VARCHAR(20) NOT NULL,
  `assigned_officer_id` VARCHAR(50) NULL,
  `assigned_officer_name` VARCHAR(150) NULL,
  `status` ENUM('Submitted', 'Verified', 'Assigned', 'Investigation', 'Resolved', 'Closed') DEFAULT 'Submitted',
  `priority` ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  `declaration_accepted` BOOLEAN NOT NULL DEFAULT TRUE,
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Complaint Audit Timeline Table
CREATE TABLE `complaint_timeline` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `complaint_id` VARCHAR(30) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `officer_name` VARCHAR(150) NOT NULL,
  `notes` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`complaint_id`) REFERENCES `complaints`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Investigation Case Diary Table
CREATE TABLE `investigation_logs` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `complaint_id` VARCHAR(30) NOT NULL,
  `officer_id` VARCHAR(50) NOT NULL,
  `officer_name` VARCHAR(150) NOT NULL,
  `action_taken` TEXT NOT NULL,
  `evidence_status` VARCHAR(255) NULL,
  `next_action` VARCHAR(255) NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`complaint_id`) REFERENCES `complaints`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Notifications Table
CREATE TABLE `notifications` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `role` VARCHAR(30) NOT NULL,
  `complaint_id` VARCHAR(30) NULL,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
```

### RESTful PHP Endpoint Blueprint

Create an `api/` directory when building the backend:

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/register.php` | `POST` | Registers a citizen user in `users` table after hashing password (`password_hash`). |
| `/api/login.php` | `POST` | Validates citizen email/mobile and password, creates JWT or PHP session. |
| `/api/police-login.php` | `POST` | Validates Police ID, Station Code, and Departmental password. |
| `/api/complaints.php` | `GET` | Returns filtered complaints based on query params (`userId`, `status`, `district`, `search`). |
| `/api/complaints.php?id=...` | `GET` | Returns single case dossier with suspect details, evidence metadata, and timeline. |
| `/api/complaints.php` | `POST` | Inserts new complaint, generates `CRS-YYYY-XXXXX`, appends initial timeline row. |
| `/api/complaints.php` | `PUT` | Updates case status or assigned officer, appends timeline row, generates notification. |
| `/api/investigations.php` | `POST` | Records a new investigation log in `investigation_logs` table. |
| `/api/stations.php` | `GET`, `POST` | Station directory query and new station registration. |
| `/api/officers.php` | `GET`, `POST` | Officer roster retrieval and new officer deployment. |
| `/api/notifications.php` | `GET`, `POST`, `DELETE` | Retrieves alerts, marks as read, or removes notifications. |

### Switching from LocalStorage to PHP API

To connect the application to the PHP backend, open `js/api.js` and change the single configuration flag:

```javascript
// In js/api.js:
const ApiService = {
  // Toggle this flag from 'LOCAL_STORAGE' to 'PHP_API'
  BACKEND_MODE: 'PHP_API', 
  ...
};
```

All functions (`apiLogin`, `apiRegister`, `apiGetComplaints`, etc.) will immediately route their HTTP requests to the respective `/api/*.php` endpoints without requiring a single change to any HTML form, button, or dashboard page!

---

## ⚖️ Legal Notice & Disclaimer

This software is built for civic technology and authorized law enforcement workflows. Unauthorized access to departmental administrative portals, submission of fabricated incident reports, or impersonation of law enforcement personnel is punishable under applicable penal laws.

# 🏥 MediCare — Clinic Management System

A full-stack Clinic Management System built with **Django + DRF** (backend) and **React + Vite + Tailwind CSS** (frontend).

---

## 🎨 Features

- **Role-Based Access**: Admin, Doctor, Receptionist, Patient
- **Doctor Management**: CRUD for doctor profiles (Admin only)
- **Patient Management**: Register/edit patients (Admin & Receptionist)
- **Appointment Booking**: Book with doctor + date + time selection; prevents double-booking
- **Real Dashboard**: Role-specific stats pulled from the live database
- **Public Homepage**: Doctor listing, services, contact info, hero CTA
- **Session Auth**: Secure login/logout with CSRF protection

---

## 🗂️ Project Structure

```
clinic-management/
├── backend/                  # Django project
│   ├── apps/
│   │   ├── accounts/         # Custom user model + auth APIs
│   │   ├── doctors/          # Doctor model + API
│   │   ├── patients/         # Patient model + API
│   │   ├── appointments/     # Appointment model + API
│   │   └── dashboard/        # Dashboard stats API
│   ├── clinic_management/    # Django settings, urls, wsgi
│   ├── manage.py
│   ├── requirements.txt
│   └── seed_data.py          # Dev seed script
│
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── api/              # Axios API service layer
│   │   ├── components/       # Shared components
│   │   ├── context/          # Auth + Toast context
│   │   └── pages/            # All pages
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start (Windows PowerShell)

### Prerequisites

- **Python 3.10+** — https://python.org
- **Node.js 18+** — https://nodejs.org

---

### 1. Backend Setup

```powershell
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py makemigrations accounts
python manage.py makemigrations doctors
python manage.py makemigrations patients
python manage.py makemigrations appointments
python manage.py migrate

# Seed the database with sample data
python seed_data.py

# Start the development server
python manage.py runserver
```

> Backend runs at: **http://127.0.0.1:8000**

---

### 2. Frontend Setup

Open a **new** PowerShell window:

```powershell
# Navigate to frontend
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```

> Frontend runs at: **http://localhost:5173**

---

## Default Login Credentials (after seeding)

| Role         | Username       | Password    |
|--------------|----------------|-------------|
| Admin        | admin          | admin123    |
| Receptionist | receptionist   | recep123    |
| Doctor       | dr.smith       | doctor123   |
| Patient      | patient1       | patient123  |

---

## API Endpoints

All endpoints are prefixed with /api/v1/

### Auth
- POST /auth/register/     - Register patient
- POST /auth/login/        - Login
- POST /auth/logout/       - Logout
- GET  /auth/me/           - Current user
- GET  /auth/csrf/         - Get CSRF token

### Doctors
- GET    /doctors/          - List doctors (public)
- POST   /doctors/          - Create doctor (Admin)
- GET    /doctors/{id}/     - Doctor detail
- PUT    /doctors/{id}/     - Update doctor (Admin)
- DELETE /doctors/{id}/     - Delete doctor (Admin)

### Patients
- GET   /patients/          - List patients
- POST  /patients/          - Register patient
- GET   /patients/{id}/     - Patient detail
- PATCH /patients/{id}/     - Update patient

### Appointments
- GET    /appointments/             - List appointments
- POST   /appointments/             - Book appointment
- GET    /appointments/{id}/        - Appointment detail
- PATCH  /appointments/{id}/        - Update status
- DELETE /appointments/{id}/        - Cancel appointment
- GET    /appointments/slots/       - Get booked time slots

### Dashboard
- GET /dashboard/stats/    - Role-specific stats

---

## Role Permissions

| Action                | Admin | Doctor | Receptionist | Patient  |
|-----------------------|-------|--------|--------------|----------|
| Create Doctor         | Yes   | No     | No           | No       |
| Edit/Delete Doctor    | Yes   | No     | No           | No       |
| Register Patient      | Yes   | No     | Yes          | No       |
| Edit Patient          | Yes   | No     | Yes          | Own only |
| Book Appointment      | Yes   | No     | Yes          | Yes      |
| Confirm Appointment   | Yes   | No     | Yes          | No       |
| Cancel Appointment    | Yes   | No     | Yes          | Own(pend)|
| Mark Completed        | Yes   | Yes    | Yes          | No       |
| View All Appointments | Yes   | Own    | Yes          | Own      |
| Dashboard Stats       | Full  | Own    | Partial      | Own      |

---

## Tech Stack

Backend: Python 3.10+, Django 4.2, Django REST Framework, SQLite
Frontend: React 18, Vite 5, Tailwind CSS 3, React Router 6, Axios, Lucide React

---

## Troubleshooting

### PowerShell execution policy error
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Migration errors
```powershell
python manage.py migrate --run-syncdb
```

### CORS / CSRF errors
- Make sure backend is on port 8000 and frontend on port 5173
- Vite proxies /api requests to backend automatically
- Visit http://localhost:5173 (not 127.0.0.1:5173)

## Pages

| Route                      | Description                    |
|----------------------------|-------------------------------|
| /                          | Public homepage               |
| /login                     | Login page                    |
| /register                  | Patient registration          |
| /doctors                   | Doctor listing                |
| /appointments/book         | Book appointment              |
| /dashboard                 | Role-specific dashboard       |
| /dashboard/doctors         | Doctor management (Admin)     |
| /dashboard/patients        | Patient management            |
| /dashboard/appointments    | Appointment management        |

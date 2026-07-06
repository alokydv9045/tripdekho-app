# 🔐 TripDekho Development Credentials & Accounts

This file contains the credentials for the database seed accounts and the development configurations. Use these to log in and test the various user dashboards and features.

---

## 👥 1. Seed Accounts & Logins
All accounts below are seeded with the default password: **`password123`**

| Role / User Type | Name | Email Address | Password | Description / Dashboard |
| :--- | :--- | :--- | :--- | :--- |
| **System Admin** | `System Admin` | **`admin@tripdekho.com`** | `password123` | Full platform analytics and global system control panel |
| **Vendor (Mountain)** | `Himalayan Adventures` | **`vendor@tripdekho.com`** | `password123` | Lists treks and mountaineering expeditions |
| **Vendor (Coastal)** | `Goa Coastal Escapes` | **`vendor2@tripdekho.com`** | `password123` | Lists beach retreats and wellness holidays |
| **Vendor (Cultural)** | `Heritage India Tours` | **`vendor3@tripdekho.com`** | `password123` | Lists temple tours and heritage walks |
| **Customer 1** | `John Doe` | **`customer@tripdekho.com`** | `password123` | Regular customer account with active bookings/payments |
| **Customer 2** | `Jane Smith` | **`customer2@tripdekho.com`** | `password123` | Regular customer account with active bookings/payments |

---

## 🌐 2. Ports & Local Services

- **Frontend App:** http://localhost:3001
- **Backend API:** http://localhost:5001/api/v2
- **Database (Supabase Remote):** PostgreSQL port `5432` / pooler `6543`
- **Redis (Local Cache):** Port `6379` (Bypassed locally in dev via `.env` parameter `DISABLE_REDIS=true`)

---

## 🔑 3. Main Configuration Values
Refer to [backend/.env](file:///d:/Projects/TripDekho1/backend/.env) and [frontend/.env.local](file:///d:/Projects/TripDekho1/frontend/.env.local) for the full configurations.

- **JWT Secret Key:** `tripdekho_secure_jwt_secret_key_2024_elite`
- **Google OAuth Client ID:** `120826421585-n07vgl589pdmelm0rs2b2akg4l8aqcaa.apps.googleusercontent.com`
- **Twilio Phone Number:** `+19784945808`

# 🌍 TripDekho Enterprise Platform

![TripDekho Logo](https://via.placeholder.com/1200x300?text=TripDekho+Full-Stack+Enterprise+Travel+Platform)

TripDekho is a highly scalable, next-generation travel booking and vendor management platform. It is engineered to deliver seamless trip planning, real-time availability tracking, automated vendor onboarding, and AI-powered custom itineraries.

This repository houses the **TripDekho Full-Stack Platform**, including the Next.js Frontend and NestJS Backend, built using advanced architectural patterns designed for microservice readiness, high concurrency, extreme fault tolerance, and beautiful UX.

---

## 🎨 1. Frontend Architecture (Next.js)

The frontend is a modern, server-side rendered application designed for speed and SEO.

- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS & Framer Motion for buttery-smooth animations
- **State Management:** Redux Toolkit & Context API
- **Data Fetching:** Axios with HTTP interceptors for automatic CSRF & JWT Refresh Token rotation
- **Performance:** Implements highly aggressive Incremental Static Regeneration (ISR) and Edge caching for instant page loads.

---

## 🏗️ 2. Backend Architecture (NestJS)

The backend avoids a monolithic "big ball of mud" by adhering strictly to **Domain-Driven Design (DDD)** and **Hexagonal Architecture (Ports & Adapters)**.

- **Framework:** NestJS v11 (Node.js/TypeScript)
- **CQRS:** Segregates heavy database reads (Queries) from state mutations (Commands) using `@nestjs/cqrs`.
- **Database:** PostgreSQL 16 via TypeORM
- **Caching:** In-memory caching for massive query optimization
- **Security:** Global `JwtAuthGuard`, strict RBAC `RolesGuard`, Helmet, and Throttler.

### Third-Party SaaS Integrations (Production Ready)
- **💸 Payments (Razorpay):** Fully integrates Razorpay Webhooks using `crypto.createHmac` for signature verification. Implements Razorpay Route for automated Vendor Account generation and commission splitting.
- **⚙️ Workflows (Temporal):** Uses `@temporalio/client` to execute long-running, fault-tolerant gRPC workflows for Vendor Onboarding (GST validation, Risk Scoring).
- **🤖 Artificial Intelligence (OpenAI):** Utilizes the official `@openai/sdk` (`gpt-4o`) to generate custom day-by-day JSON itineraries. 

---

## 🚀 3. Deployment

TripDekho is containerized using Docker and orchestrated using Docker Compose.

**IMPORTANT:** Deploying this application has a specific sequence of steps required to successfully bake the Next.js cache and prevent Supabase connection limits.

👉 **[Read the Ultimate Deployment Guide (DEPLOYMENT.md)](./DEPLOYMENT.md)** before deploying to a VPS!

---

## 🛠️ 4. Local Development Setup

### Prerequisites
- **Node.js**: v20.x
- **PostgreSQL**: Running locally or via Supabase
- **Temporal**: A local Temporal cluster running on `localhost:7233` (Optional, but required for Vendor Workflows).

### Step 1: Environment Configuration
You need two `.env` files. NEVER commit these to version control.

**`backend/.env`**
```env
PORT=5001
DATABASE_URL=postgres://user:password@localhost:5432/tripdekho
DB_SYNCHRONIZE=true # Set to false in production!
JWT_SECRET=super_secret_key
RAZORPAY_KEY_ID=rzp_test_yourkey
RAZORPAY_KEY_SECRET=your_razorpay_secret
OPENAI_API_KEY=sk-your-openai-key
```

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v2
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

### Step 2: Start the Backend
```bash
cd backend
npm install
npm run start:dev
```

### Step 3: Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

---
*Maintained by the TripDekho Engineering Team.*

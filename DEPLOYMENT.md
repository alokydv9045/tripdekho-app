# TripDekho: Ultimate Deployment Guide 🚀

This guide outlines the bulletproof, step-by-step process to deploy the TripDekho platform (Next.js Frontend + NestJS Backend) onto a VPS using Docker Compose. 

By following these instructions, you will avoid common pitfalls such as database connection exhaustion, empty static caching during builds, and schema synchronization errors.

---

## 1. Local Pre-Deployment Preparation

Before touching your VPS, you must ensure your live database schema is perfectly synchronized. TypeORM must create all required columns (like `kycDocuments`) before the frontend attempts to build.

1. **Connect to your live database locally**: Make sure your local Mac's `backend/.env` file is pointing to the **Production Supabase Database**.
2. **Run the backend locally in dev mode**:
   ```bash
   cd backend
   npm run start:dev
   ```
3. **Wait for the success message**: The moment you see `Nest application successfully started`, TypeORM has finished syncing the schema. You can now press `Ctrl + C` to kill the local server.

---

## 2. Server Environment Setup

SSH into your VPS and configure your environment files. Ensure you have the `.env` files correctly set up in both the `backend/` and `frontend/` folders.

### Backend `.env`
Must contain your production database URLs.
```env
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[SUPABASE_HOST]:5432/postgres"
# IMPORTANT: For connection pooling, use the pgbouncer port 6543
DIRECT_URL="postgresql://[USER]:[PASSWORD]@[SUPABASE_HOST]:6543/postgres?pgbouncer=true"

# Disable local Redis to avoid connection errors if you aren't using the docker redis container
DISABLE_REDIS=true 
```

### Frontend `.env.local`
Must contain your public VPS IP so the frontend knows where to fetch data.
```env
NEXT_PUBLIC_API_URL=http://[YOUR_VPS_IP]:8080/api/v2
NEXT_PUBLIC_SOCKET_URL=http://[YOUR_VPS_IP]:8080
```

---

## 3. The Deployment Build Phase

Next.js statically generates pages during the `npm run build` process inside Docker. During this phase, it will attempt to fetch data (like the trips for the homepage) using `NEXT_PUBLIC_API_URL`.

To ensure Docker doesn't use corrupted, cached `.next` folders from previous failed builds, **always use the `--no-cache` flag for the frontend**.

```bash
# Build the images from scratch
sudo docker-compose -f docker-compose.prod.yml build --no-cache
```

---

## 4. Launching the Containers (The Scale Rule)

**CRITICAL WARNING:** Supabase's free tier strictly limits you to **15 simultaneous connections**. If your `docker-compose.prod.yml` spins up 16 backend replicas, 15 of them will crash with `EMAXCONNSESSION`, bringing down your entire platform.

You must explicitly scale the backend and frontend to `1` replica to maintain a healthy 1-to-1 architecture.

```bash
# Launch the platform with exactly 1 replica each
sudo docker-compose -f docker-compose.prod.yml up -d --scale frontend=1 --scale backend=1
```

---

## 5. Post-Deployment Verification

1. **Check Backend Logs**: Ensure the backend isn't throwing database connection errors.
   ```bash
   sudo docker-compose -f docker-compose.prod.yml logs --tail 50 backend
   ```
2. **Check the Frontend**: Open your browser and navigate to your VPS IP (`http://[YOUR_VPS_IP]:8080/`).
3. **Hard Refresh**: Perform a hard refresh (`Cmd + Shift + R`) to clear any stale browser cache.

---

## Troubleshooting Cheat Sheet

- **"No trips available" on the homepage**: 
  - *Cause*: The Next.js Docker build failed to reach the backend to fetch trips, caching an empty array.
  - *Fix*: Ensure the backend is running first, ensure `NEXT_PUBLIC_API_URL` is set in `.env.local`, and rebuild the frontend with `--no-cache`.
- **500 Internal Server Error in the browser**: 
  - *Cause*: Your backend replicas have exhausted the database connection pool.
  - *Fix*: Scale down the backend using `--scale backend=1`.
- **"Column does not exist" in backend logs**:
  - *Cause*: The database schema is out of sync with your entities.
  - *Fix*: Run the backend locally with `npm run start:dev` connected to the production database to trigger TypeORM synchronization.

# Internship & Industry Linkage Management System (IILMS)

A full-stack web application connecting universities, students, and industry partners through a structured internship lifecycle management platform.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js (MVC)
- **Database**: MySQL 8.x

---

## Prerequisites

- Node.js ≥ 18
- MySQL 8.x running locally
- npm

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd internship-and-industry-linkage-management-system
```

### 2. Set up the database

Open MySQL and run the schema and seed files:

```sql
source server/db/schema.sql;
source server/db/seed.sql;
```

Or via CLI:

```bash
mysql -u root -p < server/db/schema.sql
mysql -u root -p < server/db/seed.sql
```

### 3. Configure the backend environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your values:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend port | `3000` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `yourpassword` |
| `DB_NAME` | Database name | `iilms` |
| `JWT_SECRET` | Secret for signing JWTs | `change_this_secret` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `BCRYPT_COST_FACTOR` | bcrypt rounds (min 10) | `10` |

### 4. Install backend dependencies

```bash
cd server
npm install
```

### 5. Start the backend

```bash
npm start
# or for development with auto-reload:
npm run dev
```

Backend runs at `http://localhost:3000`

### 6. Install frontend dependencies

```bash
cd client
npm install
```

### 7. Configure the frontend environment (optional)

The Vite dev server proxies `/api` to `localhost:3000` automatically. No `.env` needed for local dev.

If deploying separately, create `client/.env`:
```
VITE_API_URL=http://localhost:3000/api
```

### 8. Start the frontend

```bash
cd client
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Default Seed Accounts

All seed accounts use password: **`password`**

| Email | Role | Name |
|---|---|---|
| admin1@iilms.edu | Admin | Alice Admin |
| admin2@iilms.edu | Admin | Bob Supervisor |
| student1@uni.edu | Student | Carol Chen |
| student2@uni.edu | Student | David Diaz |
| student3@uni.edu | Student | Eva Evans |
| hr@techcorp.com | Company | TechCorp HR |
| recruit@greenco.com | Company | GreenCo Recruiter |

---

## Running Tests

```bash
# Backend (Jest)
cd server
npm test
# or single run:
npx jest --runInBand

# Frontend (Vitest)
cd client
npm test
# or single run:
npx vitest --run
```

---

## Project Structure

```
├── server/
│   ├── config/         # DB pool
│   ├── controllers/    # Request handlers
│   ├── db/             # schema.sql, seed.sql
│   ├── middleware/     # auth, roleGuard, validate
│   ├── models/         # SQL query functions
│   ├── routes/         # Express routers
│   ├── services/       # Business logic
│   ├── validators/     # express-validator rules
│   ├── app.js          # Express app
│   └── server.js       # Entry point
└── client/
    └── src/
        ├── api/        # Axios instance
        ├── components/ # Shared UI components
        ├── context/    # AuthContext
        ├── pages/      # admin/ company/ student/ public/ auth/
        └── utils/      # formatDate
```

---

## Common Errors & Fixes

**`Error: connect ECONNREFUSED 127.0.0.1:3306`**
MySQL is not running. Start it: `net start mysql` (Windows) or `sudo service mysql start` (Linux).

**`Error: ER_ACCESS_DENIED_ERROR`**
Wrong DB_USER or DB_PASSWORD in `.env`. Double-check credentials.

**`JsonWebTokenError: invalid signature`**
JWT_SECRET in `.env` doesn't match the one used to sign existing tokens. Clear localStorage in the browser and log in again.

**`CORS error in browser`**
Backend is not running, or the Vite proxy isn't configured. Ensure `server` is running on port 3000 and `vite.config.js` has the proxy set.

**`Port 3000 already in use`**
Change `PORT` in `server/.env` to another value (e.g. `3001`) and update the Vite proxy target in `client/vite.config.js`.

**`Table 'iilms.Users' doesn't exist`**
You haven't run `schema.sql` yet. Run it against your MySQL instance first.

**`422 Validation failed` on register**
Password must be at least 6 characters. Role must be one of: `student`, `company`, `admin`.

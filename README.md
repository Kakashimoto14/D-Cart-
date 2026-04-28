# D'Cart

D'Cart is a full stack e-commerce management system for Decolores Grocery Store in Rodriguez, Rizal.

## Stack

- Backend: Node.js, Express.js, Prisma ORM, MySQL, JWT
- Frontend: React, TailwindCSS, Axios

## Structure

- `backend/` contains the API, Prisma schema, migrations, and seed script
- `frontend/` contains the customer and admin web application

## Local Setup

### Backend

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

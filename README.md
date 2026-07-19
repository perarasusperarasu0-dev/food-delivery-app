# Nightmarket — MERN Food Delivery Starter

A full-stack starter for a food delivery web app: MongoDB + Express + React + Node,
with JWT auth, menu/order CRUD, and Stripe checkout.

## Structure

```
food-delivery-app/
  backend/     Express API (auth, menu, orders, payments)
  frontend/    React + Vite + Tailwind client
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — your MongoDB connection string (local or Atlas)
- `JWT_SECRET` — any long random string
- `STRIPE_SECRET_KEY` — from your Stripe dashboard (test mode key starts with `sk_test_`)
- `CLIENT_URL` — leave as `http://localhost:5173` for local dev

Seed a few sample menu items (optional):
```bash
node seed.js
```

Run the API:
```bash
npm run dev
```
The API runs on `http://localhost:5000`.

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` and set `VITE_STRIPE_PUBLISHABLE_KEY` to your Stripe **publishable** key (starts with `pk_test_`).

Run the client:
```bash
npm run dev
```
The app runs on `http://localhost:5173` and proxies `/api` calls to the backend.

## 3. Creating an admin user

Every new signup is a `customer` by default. To make one an admin, update it directly in MongoDB:

```js
// in mongosh, connected to your database
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

Admins get access to `/admin` for managing the menu (create/edit/delete dishes) and updating order statuses.

## 4. Testing payments

Stripe test mode card: `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP.

## What's included

**Backend**
- JWT-based register/login (`/api/auth`)
- Menu CRUD, public reads, admin-only writes (`/api/menu`)
- Order creation, customer order history, admin order management (`/api/orders`)
- Stripe PaymentIntent creation and confirmation (`/api/payments`)

**Frontend**
- Auth context + protected routes (customer and admin-only)
- Cart context (in-memory, per-session)
- Menu browsing with category filter
- Stripe Elements checkout
- Order history for customers
- Admin dashboard: menu CRUD + order status updates

## Notes & next steps

- Cart state is in-memory only (resets on refresh). Swap in `localStorage` sync or a
  persisted cart on the backend if you want it to survive reloads.
- Add image upload (e.g. Cloudinary or S3) instead of raw image URLs for menu items.
- Add pagination/search on the menu and admin order list as the catalog grows.
- Consider adding real-time order status updates via WebSockets (e.g. Socket.IO).
- Deploy: backend to Render/Railway/Fly.io, frontend to Vercel/Netlify, MongoDB Atlas for the database.

# E-Commerce Website

Comprehensive full-stack e-commerce example built with React (Vite) frontend and Express + MongoDB backend.

This repository is intended as a learning/demo project and a starting point for small e-commerce applications. It contains user authentication (JWT), product CRUD (admin), cart + checkout flows on the client, and order creation and retrieval on the server.

## Table of contents

- [Key features](#key-features)
- [Tech stack & architecture](#tech-stack--architecture)
- [Repository layout](#repository-layout)
- [Getting started (local development)](#getting-started-local-development)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [API reference (summary & examples)](#api-reference-summary--examples)
- [Authentication details](#authentication-details)
- [Data models (short)](#data-models-short)
- [Deployment notes](#deployment-notes)
- [Security & best practices](#security--best-practices)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License & attribution](#license--attribution)

## Key features

- User registration and login (JWT-based authentication)
- Product listing and details
- Admin-only product management (create, update, delete)
- Cart & checkout flows in the frontend
- Order creation and per-user order history

## Tech stack & architecture

- Frontend: React (Vite) with functional components and context for auth/cart
- HTTP: axios (central instance at `client/src/api/axios.js`)
- Backend: Node.js, Express, Mongoose
- Auth: JWT (signed with `JWT_SECRET`)
- Database: MongoDB

The app follows a standard client-server architecture:

- client/ (React) — UI, routing, state management, calls backend API at `/api`
- server/ (Express) — REST API, controllers, route protection middleware, MongoDB via Mongoose

## Repository layout

- `client/` — React frontend

  - `src/api/axios.js` — axios instance (attaches JWT from localStorage)
  - `src/context` — Auth and Cart contexts
  - `src/components` — reusable UI components
  - `src/pages` — route pages (Home, Products, Cart, Checkout, Admin pages)

- `server/` — backend API
  - `src/server.js` — app entry
  - `src/config/db.js` — mongo connection
  - `src/controllers` — route handlers for auth, products, orders
  - `src/middlewares` — auth middleware
  - `src/models` — Mongoose models (User, Product, Order)
  - `src/routes` — mounted API routes

## Getting started (local development)

Requirements

- Node.js (v18+ recommended)
- npm (or yarn)
- MongoDB (local or Atlas)

Quick start — two terminals recommended

1. Start the server

```powershell
cd server
npm install
# development with auto-reload (nodemon is a dependency)
npm run dev

# or start normally
npm start
```

2. Start the client (Vite)

```powershell
cd client
npm install
npm run dev
```

By default the frontend expects the API at `http://localhost:5000/api`. You can change it by setting a `VITE_API_URL` environment variable (see notes below).

## Environment variables

Create a `.env` file in the `server/` folder with these values (example):

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/mydb?retryWrites=true&w=majority
JWT_SECRET=strong_secret_here
PORT=5000
```

Recommended additions (not currently required by code but useful):

- `NODE_ENV=development|production`
- `VITE_API_URL=http://localhost:5000/api` (for the frontend if updated to use Vite envs)

Important files that reference these:

- `server/src/config/db.js` — reads `process.env.MONGO_URI`
- `server/src/utils/generateToken.js` — reads `process.env.JWT_SECRET`

## Scripts

Server (in `server/package.json`):

- `npm run dev` — start server with `nodemon src/server.js`
- `npm start` — start server with `node src/server.js`

Client (in `client/package.json`):

- `npm run dev` — start Vite dev server
- `npm run build` — build for production
- `npm run preview` — locally preview production build
- `npm run lint` — run ESLint

## API reference (summary & examples)

Base URL (default): http://localhost:5000/api

All request bodies and responses are JSON unless noted.

Auth

- POST /api/auth/signup
  - Purpose: Create a new user
  - Body example:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "pass1234"
}
```

- POST /api/auth/login
  - Purpose: Authenticate and receive JWT
  - Body example:

```json
{
  "email": "john@example.com",
  "password": "pass1234"
}
```

Response (login) example:

```json
{
  "_id": "userId",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "<jwt-token>"
}
```

Products

- GET /api/products

  - Purpose: Return product list (public)

- GET /api/products/:id

  - Purpose: Return product details by id

- POST /api/products (admin)

  - Purpose: Create a product. Requires Authorization header: `Bearer <token>` of an admin user

- PUT /api/products/:id (admin)

  - Purpose: Update product

- DELETE /api/products/:id (admin)
  - Purpose: Delete product

Orders

- POST /api/orders

  - Purpose: Create an order for authenticated user
  - Body: order items, totals, shipping info (see `server/src/models/Order.js` for shape)

- GET /api/orders/myorders
  - Purpose: Return orders for authenticated user

Authentication

- For protected endpoints include header:

```
Authorization: Bearer <token>
```

The frontend stores the token in `localStorage` and attaches it via an axios interceptor (`client/src/api/axios.js`).

## Authentication details

- JWTs are generated by `server/src/utils/generateToken.js` and signed with `JWT_SECRET`.
- The middleware `server/src/middlewares/authMiddleware.js` checks the token and sets `req.user` for downstream controllers.

## Data models (short)

- User: name, email, password (hashed), isAdmin
- Product: name, description, price, image, countInStock, category
- Order: user (ref), orderItems, shippingAddress, paymentResult, itemsPrice, taxPrice, shippingPrice, totalPrice, isPaid, paidAt

Check the Mongoose schemas in `server/src/models/` for exact fields.

## Deployment notes

- Build the client (`client/npm run build`) and serve static assets from a CDN or a static host (Netlify, Vercel) or configure Express to serve `client/dist`.
- Configure `MONGO_URI` and `JWT_SECRET` as environment variables on your host (Heroku, Render, DigitalOcean, etc.).
- Ensure API CORS is configured correctly (server uses `cors()` by default).

Example production checklist:

1. Set strong, unique `JWT_SECRET`.
2. Use a production-ready MongoDB (Atlas recommended).
3. Enable HTTPS / TLS for client and API.
4. Do not commit `.env` to version control.

## Security & best practices

- Never commit secrets. Use a `.env` file locally and environment variables in production.
- Use strong passwords for database users and rotate credentials.
- Consider rate limiting and request validation for production APIs.
- Add validation and sanitization for user input (e.g., express-validator).

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feat/my-feature`
3. Make changes and include tests where applicable
4. Open a pull request with a clear description

Guidelines:

- Keep changes small and focused
- Add or update tests for new logic
- Follow existing code style (ES modules, modern JS)

## Troubleshooting

- MongoDB connection error: ensure `MONGO_URI` is correct and network access allowed.
- 401/403 on protected routes: confirm the token is sent in `Authorization` header as `Bearer <token>` and that the user has the `isAdmin` flag for admin routes.
- Client can't reach server: verify `client/src/api/axios.js` baseURL or set `VITE_API_URL` and update the axios instance accordingly.

## Notes / Next recommended changes

- Add a `server/.env.example` file listing the required environment variables.
- Make the frontend axios base URL configurable via Vite env (e.g., `VITE_API_URL`) so deployments don't require code changes.
- Add tests for critical backend endpoints and a simple end-to-end test for the main purchase flow.

If you want, I can implement the `.env.example` and update `client/src/api/axios.js` to use `import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`—tell me to proceed and I will make those changes.

## License & attribution

This project does not include a license. If you intend to share or publish this project, add a `LICENSE` file (MIT, Apache-2.0, etc.).

---

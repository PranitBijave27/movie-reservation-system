# 🎬 CineBook — Movie Ticketing System

A production-ready RESTful backend for a movie ticketing system built with Node.js, Express.js, and MongoDB. Features JWT authentication, role-based access control, MongoDB transactions for atomic seat booking, automated booking expiry, and dynamic pricing.

> 🚀 **Live API:** [https://movie-reservation-api-2ub6.onrender.com](https://movie-reservation-api-2ub6.onrender.com)  
> 📖 **API Docs:** [https://movie-reservation-api-2ub6.onrender.com/api-docs](https://movie-reservation-api-2ub6.onrender.com/api-docs)

---

## ⚙️ Tech Stack

| Technology | Version |
|------------|---------|
| Node.js | v22.19.0 |
| Express.js | v5.2.1 |
| MongoDB | via Mongoose v9.2.1 |
| JWT | Authentication |
| Bcrypt | Password Hashing |
| Swagger UI | API Documentation |
| Node-Cron | Booking Expiry Scheduler |

---

## ✨ Features

- **JWT Authentication** with bcrypt password hashing and `select: false` field protection
- **Role Based Access Control (RBAC)** — Admin and User roles with protected routes
- **MongoDB Transactions** for atomic seat booking, preventing race conditions and double booking
- **Seat Blocking with Expiry** — Seats locked for 5 minutes during booking, auto released via cron job scheduler
- **Dynamic Pricing** — Regular, Premium, and VIP seat tiers with price multipliers
- **Psychological Pricing** — Amounts ending in 0 automatically adjusted (e.g. ₹500 → ₹499)
- **Show Overlap Detection** — Prevents scheduling conflicts using time range queries
- **Auto Seat Generation** — Seats with types auto generated on screen creation using bulk `insertMany`
- **Soft Delete** — Movies archived instead of deleted to preserve booking history
- **Cancellation Policy** — Bookings cannot be cancelled within 2 hours of showtime
- **Swagger UI Documentation** — All 20+ APIs documented and testable in browser
---
## 🤖 AI Powered Feature
### Smart Seat Recommendation
- CineBook integrates **Google Gemini AI** to provide intelligent seat recommendations based on user preferences.
---

## 🗂️ Project Structure

```
├── controllers/        # Route handlers
├── services/           # Business logic
├── models/             # Mongoose schemas
├── routes/             # Express routers
├── middleware/         # Auth, Admin, Error handlers
├── docs/               # Swagger documentation
├── utils/              # Helper functions
└── app.js              # Entry point
```

---

## 📦 Data Models

| Model | Description |
|-------|-------------|
| User | Authentication with hashed password and role |
| Movie | Movie details with genre enum and status |
| Theater | Venue with city, address and screen count |
| Screen | Screen inside theater with layout type |
| Seat | Auto generated seats with Regular/Premium/VIP types |
| Show | Movie scheduled on a screen with overlap detection |
| Booking | Atomic booking with seat locking and expiry |

---

## 🔐 Authentication Flow

```
Register → bcrypt hash password (pre-save hook)
         → generate JWT (7 days)
         → return user + token

Login    → fetch user with password (select: +password)
         → bcrypt.compare
         → generate JWT
         → return user (password excluded) + token
```

---

## 🎟️ Booking Flow

```
Select Show → Check Seat Availability
           → Create Booking (MongoDB Transaction)
           → Seats Locked for 5 Minutes
           → Confirm Booking + Simulate Payment
           → Booking Confirmed / Expired (Cron Job)
```

---

## 💰 Pricing Logic

```
Base Price  →  Regular seat  × 1.00
            →  Premium seat  × 1.45
            →  VIP seat      × 1.75
            →  Math.ceil() for rounding
            →  Psychological pricing (×99 ending)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas or local MongoDB

### Installation

```bash
# Clone the repository
git clone https://github.com/PranitBijave27/movie-reservation-system

# Navigate to project
cd movie-reservation-system/backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

### Environment Variables

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run the server

```bash
# Development
npm run dev

# Production
npm start
```

### API Documentation

Visit `http://localhost:3000/api-docs` to explore and test all APIs using Swagger UI.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login user |

### Movies
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/movies | Public | Get all active movies |
| GET | /api/movies/:id | Public | Get movie by id |
| POST | /api/movies | Admin | Create movie |
| PATCH | /api/movies/:id/archive | Admin | Archive movie |

### Theaters
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/theaters | Public | Get all active theaters |
| GET | /api/theaters/:id | Public | Get theater by id |
| POST | /api/theaters | Admin | Create theater |

### Screens
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/screens | Admin | Create screen with auto seat generation |

### Shows
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/shows/movie/:movieId | Public | Get shows by movie |
| GET | /api/shows/:id | Public | Get show by id |
| POST | /api/shows | Admin | Create show |

### Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/bookings | Auth | Create booking |
| GET | /api/bookings/show/:showId/seats | Public | Get booked seats |
| GET | /api/bookings/show/:showId/availability | Public | Get seat availability |
| PATCH | /api/bookings/:bookingId/confirm | Auth | Confirm booking |
| PATCH | /api/bookings/:bookingId/cancel | Auth | Cancel booking |
| GET | /api/bookings/me | Auth | Get my bookings |

---

## 🔒 Security Features

- Passwords hashed using **bcrypt** with salt rounds
- Password field excluded from DB queries by default (`select: false`)
- Generic error messages on auth failure to prevent **user enumeration**
- JWT payload contains only `userId` — no sensitive data
- MongoDB **compound unique indexes** prevent duplicate seats and shows

---

## 👨‍💻 Author

**Pranit Bijave**
Third Year Information Technology Student
Shri Sant Gajanan Maharaj College of Engineering, Shegaon

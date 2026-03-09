#  🎟️ Distributed Movie Ticket Reservation System

A **production-grade cinema ticket reservation backend** inspired by platforms like BookMyShow.

Built to solve real-world engineering challenges: **concurrent seat booking, race condition prevention, booking lifecycle management, and automated expiry handling**.

> **Live API:** https://movie-reservation-api-2ub6.onrender.com  
> **Tech Stack:** Node.js · Express · MongoDB · Mongoose · JWT · node-cron

---

## ⚙️ Key Engineering Decisions

### 1. Concurrent Booking & Double Booking Prevention
The hardest problem in any reservation system is two users booking the same seat simultaneously.

**Solution:** MongoDB transactions with session-scoped queries.

```js
const session = await mongoose.startSession();
session.startTransaction();

// All queries use the same session — atomic operation
const existing = await Booking.findOne({ seats: { $in: seatIds } }).session(session);
const booking = await Booking.create([{...}], { session });

await session.commitTransaction();
```

Every query inside the booking flow runs within the same session, ensuring atomicity. If any step fails, the entire transaction rolls back — seats are never partially booked.

---

### 2. Seat Locking with Automatic Expiry
Seats need to be temporarily locked while a user is in the checkout flow.

**Solution:** Pending bookings with TTL + cron-based expiry.

```
User selects seats → booking created (status: pending, expiresAt: +5min)
                           ↓
              User confirms → status: confirmed
                           ↓
              Timer expires → cron releases seats (status: expired)
```

A cron job runs every minute, finds expired pending bookings, and releases the seats back to available — keeping the system consistent without manual intervention.

---

### 3. Dynamic Seat Generation
Instead of hardcoding seat data, seats are generated dynamically based on screen configuration.

---

### 4. Dynamic Pricing by Seat Type
Ticket price is calculated at booking time based on seat type and base price.

```
Regular  → basePrice × 1.0
Premium  → basePrice × 1.45
VIP      → basePrice × 1.75
```

Psychological pricing is also applied (prices ending in 0 are reduced by 1) — mimicking real-world ticketing platforms.

---

### 5. Booking Lifecycle State Machine
```
pending ──► confirmed
   │
   ├──► expired   (cron job — timer ran out)
   │
   └──► cancelled (user cancelled before payment)
```

`expired` and `cancelled` are distinct states — expired is system-triggered, cancelled is user-triggered. This distinction matters for analytics and refund logic.

---

## 🏗️ Architecture

```
Client Request
      ↓
   Routes          → Define API endpoints
      ↓
 Controllers       → Handle HTTP, parse request/response
      ↓
  Services         → Core business logic (booking, pricing, validation)
      ↓
   Models          → MongoDB schemas via Mongoose
      ↓
  MongoDB Atlas    → Persistent storage with transactions
```

Background jobs (node-cron) run independently to handle expiry and show status updates.

---

## 🗄️ Data Models

```
User ──────────────────────────────► Booking
                                        │
Movie ──► Show ──► Screen ──► Seat ─────┘
              └──► Theater
```

| Model | Key Fields |
|---|---|
| User | name, email, passwordHash, role |
| Movie | title, genre, duration, language, status |
| Theater | name, city, address |
| Screen | theaterId, rows, seatsPerRow |
| Seat | screenId, row, number, type (regular/premium/vip) |
| Show | movieId, screenId, startTime, endTime, basePrice, status |
| Booking | userId, showId, seats[], status, totalAmount, expiresAt, transactionId |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register user | ❌ |
| POST | `/api/auth/login` | Login, returns JWT | ❌ |

### Movies
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/movies` | List all movies | ❌ |
| GET | `/api/movies/:id` | Get movie details | ❌ |
| POST | `/api/movies` | Create movie | Admin |
| PATCH | `/api/movies/:id/archive` | Archive movie | Admin |

### Theater & Screens
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/theaters` | Create theater | Admin |
| POST | `/api/screens` | Create screen + generate seats | Admin |

### Shows
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/shows` | Schedule a show | Admin |
| GET | `/api/shows/movie/:movieId` | Get shows for a movie | ❌ |

### Seats
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/bookings/show/:showId/availability` | Get available/booked seats | ❌ |

### Bookings
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/bookings` | Create booking (locks seats 5 min) | User |
| PATCH | `/api/bookings/:id/confirm` | Confirm & pay | User |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking | User |
| GET | `/api/bookings/me` | Get user booking history | User |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB with Replica Set for transactions)

### Installation

```bash
# Clone the repo
git clone https://github.com/PranitBijave27/movie-reservation-system.git
cd movie-reservation-system

# Install dependencies
npm install

```

### Environment Variables

```env
PORT=3000
MONGO_URI=mongo atlas uri
JWT_SECRET=jwt secret

```

> ⚠️ MongoDB transactions require a **Replica Set**. Use MongoDB Atlas (free tier works) or configure a local replica set.

### Run

```bash
# Development
npm run dev

# Production
npm start
```

---

## 🔁 Example Booking Flow

```bash
# 1. Register
POST /api/auth/register
{ "name": "Pranit", "email": "pranit@email.com", "password": "123456" }

# 2. Login → get JWT token
POST /api/auth/login

# 3. Browse movies
GET /api/movies

# 4. View shows for a movie
GET /api/shows/movie/:movieId

# 5. Check seat availability
GET /api/bookings/show/:showId/availability

# 6. Reserve seats (locked for 5 minutes)
POST /api/bookings
{ "showId": "...", "seatIds": ["...", "..."] }

# 7. Confirm booking (simulated payment)
PATCH /api/bookings/:bookingId/confirm
```

---

## 🛠️ Tech Stack

| Category | Technology | Reason |
|---|---|---|
| Runtime | Node.js | Async I/O, ideal for concurrent requests |
| Framework | Express.js | Lightweight, unopinionated |
| Database | MongoDB + Mongoose | Flexible schema, Atlas-managed replica set for transactions |
| Auth | JWT + bcrypt | Stateless authentication |
| Validation | Joi | Schema-based request validation |
| Automation | node-cron | Booking expiry, show completion jobs |
| Deployment | Render | Simple Node.js deployment |

---

## 📈 Planned Improvements (v2)

- [ ] PostgreSQL migration for stronger ACID guarantees
- [ ] Redis caching for seat availability
- [ ] Real-time seat updates via WebSockets
- [ ] Rate limiting
---

## 👨‍💻 Author

**Pranit**  
[GitHub](https://github.com/PranitBijave27) · [LinkedIn](https://linkedin.com/in/pranitbijave)

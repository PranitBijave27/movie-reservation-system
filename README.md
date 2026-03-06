# 🎟️ Movie Ticket Reservation System (Backend)

A **backend-driven cinema ticket reservation system inspired by platforms like BookMyShow**.

This project implements the **core reservation engine** used by cinema booking platforms. It manages theaters, screens, seats, shows, and bookings while ensuring **seat availability integrity and booking lifecycle management**.

The system focuses on **backend architecture, booking state management, authentication, and automated system tasks**.

---

# 🚀 Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* Secure login & registration
* Role-based access control (Admin / User)
* Protected routes using middleware

---

### 🎬 Movie Management

Admins can manage movies including:

* Create movies
* Archive movies
* Store metadata such as:

  * title
  * description
  * genre
  * duration
  * language
  * poster

---

### 🏢 Theater Infrastructure

The system models real cinema structure:

```
Theater
   ↓
Screen
   ↓
Seat
   ↓
Show
```

Capabilities:

* Create theaters
* Create screens
* Automatically generate seats

---

# 🎥 Show Scheduling

Admins schedule movie shows with:

* Movie
* Screen
* Start time
* Base ticket price

The system automatically:

* Calculates show end time
* Prevents overlapping shows

---

# 🪑 Seat Availability System

Seat availability is **derived dynamically from bookings**.

A seat becomes unavailable when:

```
booking.status = pending OR confirmed
```

This prevents **double booking**.

---

# 🎟️ Booking System

Users can:

1. Browse movies
2. View show timings
3. Check seat availability
4. Reserve seats

Booking lifecycle:

```
pending → confirmed → completed
pending → expired
pending → cancelled → refunded
```

When booking is created:

```
status = pending
expiresAt = 5 minutes
```

Seats are temporarily locked until confirmation.

---

# ⚙️ Automation

Background cron jobs maintain system consistency.

### Expire Pending Bookings

```
pending bookings
+ expired timer
→ status = expired
```

### Complete Shows

```
show.endTime < currentTime
→ show.status = completed
```

---

# 🏗️ Architecture

The backend follows a **layered architecture**.

```
routes
   ↓
controllers
   ↓
services
   ↓
models
```

| Layer       | Responsibility                 |
| ----------- | ------------------------------ |
| Routes      | Define API endpoints           |
| Controllers | Handle HTTP requests           |
| Services    | Business logic                 |
| Models      | Database schemas               |
| Middleware  | Authentication / Authorization |
| Utils       | Helper utilities               |

---

# 📡 API Documentation

## 🔐 Authentication

### Register User

```
POST /api/auth/register
```

Request Body

```json
{
  "name": "Pranit",
  "email": "pranit@email.com",
  "password": "123456"
}
```

---

### Login

```
POST /api/auth/login
```

Request Body

```json
{
  "email": "pranit@email.com",
  "password": "123456"
}
```

Response

```json
{
  "token": "JWT_TOKEN"
}
```

---

# 🎬 Movies

### Get All Movies

```
GET /api/movies
```

No body required.

---

### Get Movie By ID

```
GET /api/movies/:id
```

Example

```
GET /api/movies/64f123abc
```

---

### Create Movie (Admin)

```
POST /api/movies
```

Headers

```
Authorization: Bearer JWT_TOKEN
```

Request Body

```json
{
  "title": "Interstellar",
  "description": "Epic science fiction film",
  "duration": 169,
  "genre": ["Sci-Fi"],
  "language": "English",
  "releaseDate": "2014-11-07",
  "posterUrl": "https://image-url"
}
```

---

### Archive Movie

```
PATCH /api/movies/:id/archive
```

Headers

```
Authorization: Bearer JWT_TOKEN
```

No body required.

---

# 🏢 Theater Infrastructure

### Create Theater

```
POST /api/theaters
```

Headers

```
Authorization: Bearer JWT_TOKEN
```

Request Body

```json
{
  "name": "PVR Phoenix Mall",
  "city": "Mumbai",
  "address": "Lower Parel"
}
```

---

### Create Screen

```
POST /api/screens
```

Headers

```
Authorization: Bearer JWT_TOKEN
```

Request Body

```json
{
  "theaterId": "THEATER_ID",
  "name": "Screen 1",
  "rows": ["A", "B", "C", "D"],
  "seatsPerRow": 10
}
```

This automatically generates seats.

---

# 🎥 Shows

### Create Show

```
POST /api/shows
```

Headers

```
Authorization: Bearer JWT_TOKEN
```

Request Body

```json
{
  "movieId": "MOVIE_ID",
  "screenId": "SCREEN_ID",
  "startTime": "2026-03-10T18:00:00Z",
  "basePrice": 200
}
```

---

### Get Shows For Movie

```
GET /api/shows/movie/:movieId
```

Example

```
GET /api/shows/movie/64f123abc
```

---

# 🪑 Seat Availability

### Get Seat Availability

```
GET /api/bookings/show/:showId/availability
```

Example

```
GET /api/bookings/show/64fshow123/availability
```

Response

```json
[
  {
    "_id": "seat1",
    "row": "A",
    "number": 1,
    "isBooked": false
  }
]
```

---

# 🎟️ Bookings

### Create Booking

```
POST /api/bookings
```

Headers

```
Authorization: Bearer JWT_TOKEN
```

Request Body

```json
{
  "showId": "SHOW_ID",
  "seatIds": ["SEAT_ID_1", "SEAT_ID_2"]
}
```

Creates booking:

```
status = pending
expiresAt = 5 minutes
```

---

### Confirm Booking

```
PATCH /api/bookings/:bookingId/confirm
```

Headers

```
Authorization: Bearer JWT_TOKEN
```

Updates booking:

```
status = confirmed
paymentStatus = paid
```

---

### Cancel Booking

```
PATCH /api/bookings/:bookingId/cancel
```

Headers

```
Authorization: Bearer JWT_TOKEN
```

If payment completed:

```
status = cancelled
paymentStatus = refunded
```

---

### Get User Booking History

```
GET /api/bookings/me
```

Headers

```
Authorization: Bearer JWT_TOKEN
```

Returns all bookings for the logged-in user.

---

# 🗄️ Database Models

```
User
Movie
Theater
Screen
Seat
Show
Booking
```

Relationships

```
Movie
   ↓
Show
   ↓
Screen
   ↓
Theater
```

Bookings reference:

```
User
Show
Seats
```

---

# 🛠️ Tech Stack

Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

Authentication

* JWT
* bcrypt

Automation

* node-cron

Tools

* Postman
* MongoDB Atlas
* Git

---

# 📦 Installation

Clone the repository

```
git clone https://github.com/yourusername/movie-reservation-system.git
```

Install dependencies

```
npm install
```

Create `.env`

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

Run server

```
npm start
```

---

# 🧪 Example Booking Flow

```
User Login
↓
Browse Movies
↓
View Shows
↓
Check Seat Availability
↓
Reserve Seats
↓
Confirm Booking
```

---

# 📈 Future Improvements

Possible improvements:

* Payment gateway integration
* Real-time seat updates
* Admin dashboard
* City-based search
* Dynamic seat pricing
* API rate limiting

---

# 👨‍💻 Author

Backend project focused on **reservation system design, booking lifecycle management, and scalable backend architecture**.

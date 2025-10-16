# Event Management API

A RESTful API for managing events with user authentication, role-based authorization, event registration, and analytics.

## Base URL
```
http://localhost:3000/api
```

## Technologies
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing

---

## API Documentation

### 🔐 Authentication APIs

#### 1. Register User
**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123",
  "role": "User"
}
```

**Fields:**
- `username` (string, required): Unique username
- `password` (string, required): User password
- `role` (string, optional): Either "User" or "Admin" (default: "User")

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "userId": "64f9a8b3c1234567890abcde"
}
```

**Error Responses:**
```json
// 400 - Username already exists
{
  "message": "Username already exists"
}

// 400 - Missing fields
{
  "message": "Username and password are required"
}
```

---

#### 2. Login
**POST** `/api/auth/login`

Login and receive JWT token.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "User",
  "userId": "64f9a8b3c1234567890abcde"
}
```

**Error Responses:**
```json
// 401 - Invalid credentials
{
  "message": "Invalid credentials"
}

// 400 - Missing fields
{
  "message": "Username and password are required"
}
```

---

### 🎉 Event Management APIs

All event APIs require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### 3. Create Event (Admin Only)
**POST** `/api/events`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "date": "2025-12-15T10:00:00.000Z",
  "location": "New York",
  "maxAttendees": 100
}
```

**Fields:**
- `title` (string, required): Event title
- `description` (string, optional): Event description
- `date` (Date, required): Event date and time
- `location` (string, optional): Event location
- `maxAttendees` (number, optional): Maximum number of attendees

**Response (201 Created):**
```json
{
  "message": "Event created successfully",
  "event": {
    "_id": "64f9a8b3c1234567890abcde",
    "title": "Tech Conference 2025",
    "description": "Annual technology conference",
    "date": "2025-12-15T10:00:00.000Z",
    "location": "New York",
    "maxAttendees": 100,
    "createdBy": "64f9a8b3c1234567890abcde"
  }
}
```

**Error Responses:**
```json
// 400 - Missing required fields
{
  "message": "Title and date are required"
}

// 403 - Not an admin
{
  "message": "Forbidden: Admins only"
}

// 401 - No token
{
  "message": "No token provided"
}
```

---

#### 4. Get All Events
**GET** `/api/events`

Get all events with optional filtering.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters (Optional):**
- `date` (string): Filter by date (format: YYYY-MM-DD)
- `location` (string): Filter by location (case-insensitive partial match)

**Examples:**
```
GET /api/events
GET /api/events?date=2025-12-15
GET /api/events?location=New York
GET /api/events?date=2025-12-15&location=New York
```

**Response (200 OK):**
```json
{
  "events": [
    {
      "_id": "64f9a8b3c1234567890abcde",
      "title": "Tech Conference 2025",
      "description": "Annual technology conference",
      "date": "2025-12-15T10:00:00.000Z",
      "location": "New York",
      "maxAttendees": 100,
      "createdBy": {
        "_id": "64f9a8b3c1234567890abcde",
        "username": "admin",
        "role": "Admin"
      }
    }
  ]
}
```

---

#### 5. Get Event by ID
**GET** `/api/events/:id`

Get a single event by ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Example:**
```
GET /api/events/64f9a8b3c1234567890abcde
```

**Response (200 OK):**
```json
{
  "event": {
    "_id": "64f9a8b3c1234567890abcde",
    "title": "Tech Conference 2025",
    "description": "Annual technology conference",
    "date": "2025-12-15T10:00:00.000Z",
    "location": "New York",
    "maxAttendees": 100,
    "createdBy": {
      "_id": "64f9a8b3c1234567890abcde",
      "username": "admin",
      "role": "Admin"
    }
  }
}
```

**Error Response:**
```json
// 404 - Event not found
{
  "message": "Event not found"
}
```

---

#### 6. Update Event (Admin Only)
**PUT** `/api/events/:id`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "title": "Updated Tech Conference 2025",
  "description": "Updated description",
  "date": "2025-12-16T10:00:00.000Z",
  "location": "Boston",
  "maxAttendees": 150
}
```

**Response (200 OK):**
```json
{
  "message": "Event updated successfully",
  "event": {
    "_id": "64f9a8b3c1234567890abcde",
    "title": "Updated Tech Conference 2025",
    "description": "Updated description",
    "date": "2025-12-16T10:00:00.000Z",
    "location": "Boston",
    "maxAttendees": 150,
    "createdBy": "64f9a8b3c1234567890abcde"
  }
}
```

**Error Responses:**
```json
// 404 - Event not found
{
  "message": "Event not found"
}

// 403 - Not an admin
{
  "message": "Forbidden: Admins only"
}
```

---

#### 7. Delete Event (Admin Only)
**DELETE** `/api/events/:id`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Example:**
```
DELETE /api/events/64f9a8b3c1234567890abcde
```

**Response (200 OK):**
```json
{
  "message": "Event deleted successfully"
}
```

**Error Responses:**
```json
// 404 - Event not found
{
  "message": "Event not found"
}

// 403 - Not an admin
{
  "message": "Forbidden: Admins only"
}
```

---

### 📝 Event Registration APIs

#### 8. Register for Event
**POST** `/api/events/:id/register`

Register the authenticated user for an event.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Example:**
```
POST /api/events/64f9a8b3c1234567890abcde/register
```

**Response (201 Created):**
```json
{
  "message": "Successfully registered for event",
  "registration": {
    "_id": "64f9a8b3c1234567890abcde",
    "user": "64f9a8b3c1234567890abcde",
    "event": "64f9a8b3c1234567890abcde"
  }
}
```

**Error Responses:**
```json
// 404 - Event not found
{
  "message": "Event not found"
}

// 400 - Already registered
{
  "message": "You are already registered for this event"
}

// 400 - Event is full
{
  "message": "Event is full"
}
```

---

#### 9. Cancel Registration
**DELETE** `/api/events/:id/register`

Cancel the authenticated user's registration for an event.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Example:**
```
DELETE /api/events/64f9a8b3c1234567890abcde/register
```

**Response (200 OK):**
```json
{
  "message": "Registration cancelled successfully"
}
```

**Error Response:**
```json
// 404 - Not registered
{
  "message": "You are not registered for this event"
}
```

---

### 📊 Analytics APIs (Admin Only)

#### 10. Get Events Per Month
**GET** `/api/analytics/events-per-month`

Get the number of events per month for the current year.

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK):**
```json
{
  "eventsPerMonth": [
    {
      "month": 1,
      "count": 5
    },
    {
      "month": 3,
      "count": 8
    },
    {
      "month": 12,
      "count": 12
    }
  ]
}
```

**Error Response:**
```json
// 403 - Not an admin
{
  "message": "Forbidden: Admins only"
}
```

---

#### 11. Get Top 3 Events
**GET** `/api/analytics/top-events`

Get the top 3 events by registration count.

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK):**
```json
{
  "topEvents": [
    {
      "_id": "64f9a8b3c1234567890abcde",
      "title": "Tech Conference 2025",
      "description": "Annual technology conference",
      "date": "2025-12-15T10:00:00.000Z",
      "location": "New York",
      "registrationCount": 85
    },
    {
      "_id": "64f9a8b3c1234567890abcdf",
      "title": "Startup Meetup",
      "description": "Networking event for startups",
      "date": "2025-11-20T18:00:00.000Z",
      "location": "San Francisco",
      "registrationCount": 67
    },
    {
      "_id": "64f9a8b3c1234567890abce0",
      "title": "Developer Workshop",
      "description": "Hands-on coding workshop",
      "date": "2025-10-10T14:00:00.000Z",
      "location": "Seattle",
      "registrationCount": 45
    }
  ]
}
```

**Error Response:**
```json
// 403 - Not an admin
{
  "message": "Forbidden: Admins only"
}
```

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```
```json
{
  "message": "Invalid token"
}
```
```json
{
  "message": "Token expired"
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden: Admins only"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error message description",
  "error": "Detailed error message"
}
```

---

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/event-management
JWT_SECRET=YOUR_SUPER_SECRET_KEY
PORT=3000
```

3. Start the server:
```bash
npm run dev
```

---

## Testing Workflow with Postman

### Step 1: Register Admin
```
POST http://localhost:3000/api/auth/register
Body: { "username": "admin", "password": "admin123", "role": "Admin" }
```

### Step 2: Register Regular User
```
POST http://localhost:3000/api/auth/register
Body: { "username": "user1", "password": "user123" }
```

### Step 3: Login as Admin
```
POST http://localhost:3000/api/auth/login
Body: { "username": "admin", "password": "admin123" }
```
Save the returned token.

### Step 4: Create Event (as Admin)
```
POST http://localhost:3000/api/events
Headers: Authorization: Bearer <admin_token>
Body: { "title": "My Event", "date": "2025-12-15T10:00:00.000Z", "maxAttendees": 50 }
```

### Step 5: Login as User
```
POST http://localhost:3000/api/auth/login
Body: { "username": "user1", "password": "user123" }
```

### Step 6: View Events (as User)
```
GET http://localhost:3000/api/events
Headers: Authorization: Bearer <user_token>
```

### Step 7: Register for Event (as User)
```
POST http://localhost:3000/api/events/<event_id>/register
Headers: Authorization: Bearer <user_token>
```

### Step 8: View Analytics (as Admin)
```
GET http://localhost:3000/api/analytics/top-events
Headers: Authorization: Bearer <admin_token>
```

---

## License
ISC

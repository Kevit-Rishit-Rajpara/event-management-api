# Event Management API

Hey, this is a solid RESTful API for managing events, built with Node.js, Express, and MongoDB. It handles user authentication, role-based permissions, event sign-ups, and some analytics.

## What It Does

- User login/signup with JWT tokens
- Role-based access (regular users and admins)
- Full CRUD for events
- Register for events with capacity limits
- Analytics like monthly event counts and top events
- Solid error handling and input validation
- Token blacklisting for logout
- Code documented with JSDoc
- ESLint and Prettier set up
- Follows REST standards

## Base URL
```
http://localhost:3000/api
```

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT
- **Passwords:** Hashed with bcryptjs
- **Validation:** Mongoose schemas
- **Code Quality:** ESLint, Prettier
- **Dev:** Nodemon

---

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Steps

1. Clone the repository:
```bash
git clone https://github.com/Kevit-Rishit-Rajpara/event-management-api.git
cd event-management-api
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb://localhost:27017/event-management
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/event-management

JWT_SECRET=your_super_secret_jwt_key_here
PORT=3000
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

5. The API will be running at `http://localhost:3000`

---

## 📚 API Documentation

### Response Format

All API responses follow this standard format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message"
}
```

---

## 🔐 Authentication APIs

### 1. Register User
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
- `username` (string, required): Unique username (min 3 characters)
- `password` (string, required): User password
- `role` (string, optional): Either "User" or "Admin" (default: "User")

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": "64f9a8b3c1234567890abcde"
}
```

**Error Responses:**
```json
// 400 - Username already exists
{
  "success": false,
  "statusCode": 400,
  "message": "Username already exists"
}

// 400 - Validation error
{
  "success": false,
  "statusCode": 400,
  "message": "Username must be at least 3 characters long"
}
```

---

### 2. Login
**POST** `/api/auth/login`

Login and receive JWT token (valid for 24 hours).

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
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "User",
  "userId": "64f9a8b3c1234567890abcde"
}
```

**Error Responses:**
```json
// 401 - Invalid credentials
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

---

### 3. Logout
**POST** `/api/auth/logout`

Logout user by blacklisting the current token.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Note:** After logout, the token is blacklisted and cannot be used again.

---

## 🎉 Event Management APIs

All event APIs require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### 4. Create Event (Admin Only)
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
- `title` (string, required): Event title (min 3 characters)
- `description` (string, optional): Event description
- `date` (Date, required): Event date and time (ISO 8601 format)
- `location` (string, optional): Event location
- `maxAttendees` (number, optional): Maximum attendees (min 1)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "event": {
    "_id": "64f9a8b3c1234567890abcde",
    "title": "Tech Conference 2025",
    "description": "Annual technology conference",
    "date": "2025-12-15T10:00:00.000Z",
    "location": "New York",
    "maxAttendees": 100,
    "createdBy": "64f9a8b3c1234567890abcde",
    "createdAt": "2024-10-16T10:00:00.000Z",
    "updatedAt": "2024-10-16T10:00:00.000Z"
  }
}
```

**Error Responses:**
```json
// 400 - Validation error
{
  "success": false,
  "statusCode": 400,
  "message": "Title and date are required"
}

// 403 - Not an admin
{
  "success": false,
  "statusCode": 403,
  "message": "Forbidden: Admins only"
}
```

---

### 5. Get All Events
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
  "success": true,
  "count": 1,
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
      },
      "createdAt": "2024-10-16T10:00:00.000Z",
      "updatedAt": "2024-10-16T10:00:00.000Z"
    }
  ]
}
```

---

### 6. Get Event by ID
**GET** `/api/events/:id`

Get a single event by ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
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
  "success": false,
  "statusCode": 404,
  "message": "Event not found"
}
```

---

### 7. Update Event (Admin Only)
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
  "success": true,
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

---

### 8. Delete Event (Admin Only)
**DELETE** `/api/events/:id`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

## 📝 Event Registration APIs

### 9. Register for Event
**POST** `/api/events/:id/register`

Register the authenticated user for an event.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Successfully registered for event",
  "registration": {
    "_id": "64f9a8b3c1234567890abcde",
    "user": "64f9a8b3c1234567890abcde",
    "event": "64f9a8b3c1234567890abcde",
    "createdAt": "2024-10-16T10:00:00.000Z"
  }
}
```

**Error Responses:**
```json
// 404 - Event not found
{
  "success": false,
  "statusCode": 404,
  "message": "Event not found"
}

// 400 - Already registered
{
  "success": false,
  "statusCode": 400,
  "message": "You are already registered for this event"
}

// 400 - Event is full
{
  "success": false,
  "statusCode": 400,
  "message": "Event is full"
}
```

---

### 10. Cancel Registration
**DELETE** `/api/events/:id/register`

Cancel the authenticated user's registration for an event.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Registration cancelled successfully"
}
```

**Error Response:**
```json
// 404 - Not registered
{
  "success": false,
  "statusCode": 404,
  "message": "You are not registered for this event"
}
```

---

## 📊 Analytics APIs (Admin Only)

### 11. Get Events Per Month
**GET** `/api/analytics/events-per-month`

Get the number of events per month for the current year.

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "year": 2025,
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

---

### 12. Get Top 3 Events
**GET** `/api/analytics/top-events`

Get the top 3 events by registration count.

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
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

---

## ⚠️ Error Responses

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "success": false,
  "statusCode": 401,
  "message": "No token provided"
}
```

### Authentication Errors (401)

```json
{ "success": false, "statusCode": 401, "message": "No token provided" }
{ "success": false, "statusCode": 401, "message": "Invalid token" }
{ "success": false, "statusCode": 401, "message": "Token expired" }
{ "success": false, "statusCode": 401, "message": "Token has been invalidated. Please login again" }
```

### Authorization Errors (403)

```json
{ "success": false, "statusCode": 403, "message": "Forbidden: Admins only" }
```

### Route Not Found (404)

```json
{ "success": false, "statusCode": 404, "message": "Route not found - /api/invalid/route" }
```

---

## 🧪 Testing with Postman

### Import Collection

1. Import the `Event-Management-API.postman_collection.json` file into Postman
2. The collection includes all endpoints organized by category
3. Environment variables are automatically set after login

### Testing Workflow

#### Step 1: Register Users
```
POST /api/auth/register
Body: { "username": "admin", "password": "admin123", "role": "Admin" }

POST /api/auth/register
Body: { "username": "user1", "password": "user123" }
```

#### Step 2: Login
```
POST /api/auth/login (Admin)
Body: { "username": "admin", "password": "admin123" }
→ Token saved to {{admin_token}}

POST /api/auth/login (User)
Body: { "username": "user1", "password": "user123" }
→ Token saved to {{user_token}}
```

#### Step 3: Create Event (Admin)
```
POST /api/events
Headers: Authorization: Bearer {{admin_token}}
Body: { "title": "My Event", "date": "2025-12-15T10:00:00.000Z", "maxAttendees": 50 }
→ Event ID saved to {{event_id}}
```

#### Step 4: View Events (User)
```
GET /api/events
Headers: Authorization: Bearer {{user_token}}
```

#### Step 5: Register for Event (User)
```
POST /api/events/{{event_id}}/register
Headers: Authorization: Bearer {{user_token}}
```

#### Step 6: View Analytics (Admin)
```
GET /api/analytics/top-events
Headers: Authorization: Bearer {{admin_token}}
```

#### Step 7: Logout
```
POST /api/auth/logout
Headers: Authorization: Bearer {{user_token}}
```

### Test Cases Included

- ✅ Success scenarios for all endpoints
- ✅ Authentication failures (no token, invalid token)
- ✅ Authorization failures (user accessing admin routes)
- ✅ Validation failures (missing required fields)
- ✅ Edge cases (already registered, event full, etc.)

---

## 🛡️ Security Features

- **Password Hashing:** bcryptjs with salt rounds
- **JWT Authentication:** Secure token-based auth
- **Token Blacklisting:** Logout invalidates tokens
- **Role-Based Access Control:** Admin vs User permissions
- **Input Validation:** Mongoose schema validation
- **Error Handling:** No sensitive data in error messages

---

## 📁 Project Structure

```
event-management-api/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── analytics.controller.js
│   │   ├── auth.controller.js
│   │   ├── event.controller.js
│   │   └── registration.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── role.middleware.js    # Role checking
│   ├── models/
│   │   ├── event.model.js
│   │   ├── registration.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── analytics.routes.js
│   │   ├── auth.routes.js
│   │   └── event.routes.js
│   ├── utils/
│   │   ├── errorHandler.js       # Error handling utilities
│   │   └── tokenBlacklist.js     # Token blacklist management
│   └── server.js                 # Application entry point
├── .env                          # Environment variables
├── .eslintrc.json                # ESLint configuration
├── .gitignore
├── .prettierrc.json              # Prettier configuration
├── Event-Management-API.postman_collection.json
├── package.json
└── README.md
```

---

## 🧹 Code Quality

### Linting

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### Formatting

```bash
# Format all files with Prettier
npm run format
```

### JSDoc Documentation

All functions include comprehensive JSDoc comments:

```javascript
/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @returns {Object} Success message and user ID
 */
```

---

## 🚀 Development Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run ESLint
npm run lint

# Fix ESLint errors automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

---

## 🌐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/event-management` |
| `JWT_SECRET` | Secret key for JWT signing | `your_super_secret_key` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` or `production` |

---






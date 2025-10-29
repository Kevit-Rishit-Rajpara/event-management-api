# Event Management API

Hey there! This is a solid RESTful API for managing events, built with user authentication, role-based permissions, event sign-ups, and some basic analytics. The cool part is, I've got it implemented in two ways: one using good old Express.js and another with NestJS. Both do the same thing, so you can pick what suits your style or learn by comparing them.

## What's Inside

The API handles everything you'd expect for event management:

- **Authentication**: Sign up, log in, log out with JWT tokens. Supports user and admin roles.
- **Events**: Create, view, update, or delete events. Admins can manage them, and there's filtering by date/location.
- **Registrations**: Sign up for events, cancel if needed, with checks to avoid overbooking.
- **Analytics**: Get monthly event stats or top events – admin access only.

## Repo Layout

- `main` branch: This overview and docs.
- `nodejs-express` branch: The Express.js version.
- `nestjs` branch: The NestJS version.

## Getting Started

Pick your flavor:

For Express.js:

```bash
git checkout nodejs-express
npm install
npm run dev
```

For NestJS:

```bash
git checkout nestjs
npm install --legacy-peer-deps
npm run start:dev
```

Either way, it'll run on `http://localhost:3000/api`.

## API Endpoints

Here's what you can do:

- `POST /api/auth/register` - Sign up (public)
- `POST /api/auth/login` - Log in (public)
- `POST /api/auth/logout` - Log out (needs auth)
- `POST /api/events` - Create event (admin only)
- `GET /api/events` - List events (needs auth)
- `GET /api/events/:id` - Get specific event (needs auth)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)
- `POST /api/events/:id/register` - Register for event (needs auth)
- `DELETE /api/events/:id/register` - Cancel registration (needs auth)
- `GET /api/analytics/events-per-month` - Monthly stats (admin only)
- `GET /api/analytics/top-events` - Top 3 events (admin only)

## Tech Stack

Express version uses Node.js, Express, MongoDB with Mongoose, JWT, bcrypt, and some linting tools.

NestJS version has NestJS with TypeScript, MongoDB via Mongoose, Passport for auth, and validation.

Both need a `.env` file like this:

```
MONGO_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your_secret_key_here
PORT=3000
NODE_ENV=development
```

## Testing

There's a Postman collection included – import `Event-Management-API.postman_collection.json` and test away.

For more details, check the README in each branch.

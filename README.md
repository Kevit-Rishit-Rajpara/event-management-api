# Event Management API

> A production-ready RESTful API for managing events with user authentication, role-based authorization, event registration, and analytics. **Available in both Express.js and NestJS implementations!**

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-red.svg)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Repository Structure](#-repository-structure)
- [API Endpoints](#-api-endpoints)
- [Technologies](#-technologies)
- [Quick Start](#-quick-start)
- [Implementation Comparison](#-implementation-comparison)
- [Documentation](#-documentation)
- [Testing](#-testing)
- [License](#-license)

---

## 🎯 Overview

This repository contains **two complete implementations** of an Event Management API:

1. **Express.js Version** (`nodejs-express` branch) - Traditional Node.js with Express
2. **NestJS Version** (`nestjs` branch) - Modern TypeScript framework with advanced features

Both implementations provide identical functionality with the same API endpoints, making it perfect for:
- Learning different Node.js frameworks
- Understanding architectural differences
- Comparing Express vs NestJS
- Building production-ready APIs

---

## ✨ Features

Both implementations include:

### 🔐 Authentication & Authorization
- JWT-based authentication
- User registration and login
- Token blacklisting for logout
- Role-based access control (User/Admin)
- Secure password hashing

### 🎉 Event Management
- Create, read, update, delete events (CRUD)
- Filter events by date and location
- Admin-only event creation
- Event capacity management
- Timestamp tracking

### 📝 Event Registration
- Register for events
- Cancel registration
- Capacity checking
- Duplicate prevention

### 📊 Analytics
- Events per month
- Top 3 events
- Admin-only access

---

## 📁 Repository Structure

```
main (you are here)         → Documentation & Overview
├── nodejs-express          → Express.js Implementation
└── nestjs                  → NestJS Implementation
```

---

## 🚀 Quick Start

### Choose Your Implementation

#### Express.js (Traditional)
```bash
git checkout nodejs-express
npm install
npm run dev
```

#### NestJS (Modern)
```bash
git checkout nestjs
npm install --legacy-peer-deps
npm run start:dev
```

Both run at: `http://localhost:3000/api`

---

## 📚 API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Private |
| POST | `/api/events` | Create event | Admin |
| GET | `/api/events` | Get events | Private |
| GET | `/api/events/:id` | Get event | Private |
| PUT | `/api/events/:id` | Update event | Admin |
| DELETE | `/api/events/:id` | Delete event | Admin |
| POST | `/api/events/:id/register` | Register for event | Private |
| DELETE | `/api/events/:id/register` | Cancel registration | Private |
| GET | `/api/analytics/events-per-month` | Monthly stats | Admin |
| GET | `/api/analytics/top-events` | Top 3 events | Admin |

---

## 🔄 Implementation Comparison

| Feature | Express.js | NestJS |
|---------|-----------|--------|
| **Setup** | ⚡ Fast | 🕐 Moderate |
| **Learning** | 📈 Easy | 📈 Moderate |
| **TypeScript** | ⚠️ Optional | ✅ Built-in |
| **Structure** | 🔧 Flexible | 📦 Opinionated |
| **DI** | ❌ No | ✅ Yes |
| **Scalability** | ⚠️ Manual | ✅ Excellent |

### Use Express When:
- ✅ Quick prototyping
- ✅ Small projects
- ✅ Maximum flexibility

### Use NestJS When:
- ✅ Large applications
- ✅ TypeScript projects
- ✅ Enterprise features

---

## 📖 Documentation

### Branch-Specific Docs
- **Express:** Switch to `nodejs-express` branch and read README.md
- **NestJS:** Switch to `nestjs` branch and read README-NESTJS.md
- **Migration Guide:** Available in `nestjs` branch

---

## 🧪 Testing

Both implementations include Postman collection:
- Import `Event-Management-API.postman_collection.json`
- Test all endpoints with saved environments
- Automated token management

---

## 🛠️ Technologies

### Express Stack
- Node.js + Express
- MongoDB + Mongoose  
- JWT + bcrypt
- ESLint + Prettier

### NestJS Stack
- NestJS + TypeScript
- MongoDB + @nestjs/mongoose
- Passport + JWT Strategy
- class-validator

---

## 🌐 Environment Setup

Both require `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your_secret_key_here
PORT=3000
NODE_ENV=development
```

---

## 📊 Project Stats

- ✅ 2 Complete Implementations
- ✅ 12 API Endpoints
- ✅ 4 Database Models  
- ✅ Full Authentication
- ✅ Role-Based Auth
- ✅ Production Ready
- ✅ Well Documented

---

## 👨‍💻 Author

**Rishit Rajpara**
- GitHub: [@Kevit-Rishit-Rajpara](https://github.com/Kevit-Rishit-Rajpara)

---

## 📝 License

ISC

---

<div align="center">

## ⭐ Star this repo if helpful!

### Choose Your Path:

**[Try Express.js →](../../tree/nodejs-express)** | **[Try NestJS →](../../tree/nestjs)**

Made with ❤️ for developers

</div>

# NestJS Migration Guide

This document explains how the Express version was migrated to NestJS and highlights the key differences.

## 🎯 Migration Overview

The Event Management API has been successfully implemented in NestJS with all features from the Express version:

✅ User Authentication (JWT)  
✅ Role-based Authorization  
✅ Event CRUD Operations  
✅ Event Registration System  
✅ Analytics Dashboard  
✅ Token Blacklisting (Logout)  
✅ Input Validation  
✅ Error Handling  

## 📁 File Structure Comparison

### Express Structure
```
src/
├── config/
│   └── db.js
├── controllers/
│   ├── auth.controller.js
│   ├── event.controller.js
│   ├── registration.controller.js
│   └── analytics.controller.js
├── middleware/
│   ├── auth.middleware.js
│   └── role.middleware.js
├── models/
│   ├── user.model.js
│   ├── event.model.js
│   └── registration.model.js
├── routes/
│   ├── auth.routes.js
│   ├── event.routes.js
│   └── analytics.routes.js
├── utils/
│   ├── errorHandler.js
│   └── tokenBlacklist.js
└── server.js
```

### NestJS Structure
```
src/
├── main.ts                    # Application entry
├── app.module.ts              # Root module
├── app.controller.ts
│
├── auth/                      # Auth Module
│   ├── auth.module.ts
│   ├── controllers/
│   ├── services/
│   ├── strategies/           # Passport strategies
│   ├── guards/               # Auth & Role guards
│   └── dto/
│
├── users/                    # Users Module
│   ├── users.module.ts
│   ├── services/
│   └── schemas/
│
├── events/                   # Events Module
│   ├── events.module.ts
│   ├── controllers/
│   ├── services/
│   ├── schemas/
│   └── dto/
│
├── analytics/                # Analytics Module
│   ├── analytics.module.ts
│   ├── controllers/
│   └── services/
│
└── common/                   # Shared
    └── decorators/
```

## 🔄 Key Migration Changes

### 1. Authentication

**Express:**
```javascript
// middleware/auth.middleware.js
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.substring(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};
```

**NestJS:**
```typescript
// auth/strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  async validate(payload: any) {
    return { id: payload.id, role: payload.role };
  }
}

// Usage in controller
@UseGuards(JwtAuthGuard)
async someMethod(@CurrentUser() user: any) { }
```

### 2. Validation

**Express:**
```javascript
// Manual validation in controller
if (!title || !date) {
  return res.status(400).json({ message: 'Title and date are required' });
}
```

**NestJS:**
```typescript
// DTO with class-validator
export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsDateString()
  date: string;
}

// Automatic validation
@Post()
async create(@Body() dto: CreateEventDto) { }
```

### 3. Database Models

**Express:**
```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  role: { type: String, enum: ['User', 'Admin'] }
});

module.exports = mongoose.model('User', UserSchema);
```

**NestJS:**
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ enum: ['User', 'Admin'], default: 'User' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

### 4. Role-Based Authorization

**Express:**
```javascript
// middleware/role.middleware.js
const checkAdmin = (req, res, next) => {
  if (req.user?.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admins only' });
  }
};

// Usage
router.post('/', authMiddleware, checkAdmin, createEvent);
```

**NestJS:**
```typescript
// guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get(ROLES_KEY, context.getHandler());
    // ... check logic
  }
}

// Usage with decorator
@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
async create() { }
```

### 5. Error Handling

**Express:**
```javascript
// utils/errorHandler.js
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message });
};
```

**NestJS:**
```typescript
// Built-in exceptions
throw new NotFoundException('Event not found');
throw new BadRequestException('Event is full');
throw new UnauthorizedException('Invalid credentials');
throw new ForbiddenException('Admins only');

// No custom error handler needed
```

### 6. Dependency Injection

**Express:**
```javascript
// Manual imports
const Event = require('../models/event.model');
const Registration = require('../models/registration.model');

exports.createEvent = async (req, res) => {
  const event = new Event({ ... });
  // ...
};
```

**NestJS:**
```typescript
// Dependency injection
@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Registration.name) private regModel: Model<RegDocument>
  ) {}

  async create(dto: CreateEventDto) {
    const event = new this.eventModel({ ... });
    // ...
  }
}
```

## 📊 Feature Comparison

| Feature | Express | NestJS |
|---------|---------|--------|
| **Setup Time** | ⚡ Fast | 🕐 Moderate |
| **Learning Curve** | 📈 Low | 📈 Moderate |
| **Type Safety** | ⚠️ Partial | ✅ Full |
| **Structure** | 🔧 Manual | 📦 Built-in |
| **Validation** | 🔧 Manual | ✅ Automatic |
| **DI Container** | ❌ No | ✅ Yes |
| **Decorators** | ❌ No | ✅ Extensive |
| **Testing Support** | 🔧 Manual | ✅ Built-in |
| **Scalability** | ⚠️ Manual | ✅ Excellent |
| **Microservices** | 🔧 Manual | ✅ Built-in |

## 🚀 Running the Applications

### Express Version
```bash
git checkout nodejs-express
npm install
npm run dev
```

### NestJS Version
```bash
git checkout nestjs
npm install --legacy-peer-deps
npm run start:dev
```

## 🎓 What You Learned

### Express
- Manual middleware creation
- Custom error handling
- File-based organization
- Flexible but requires more setup

### NestJS
- Modular architecture
- Dependency injection
- Decorators and metadata
- Built-in validation
- Guards for authorization
- Type safety with TypeScript
- Opinionated but scalable

## 📝 Key Takeaways

### Use Express When:
- Building small to medium APIs
- Need maximum flexibility
- Team is familiar with Express
- Rapid prototyping

### Use NestJS When:
- Building large enterprise applications
- Need strong structure and conventions
- Team uses TypeScript
- Require built-in features (validation, DI, testing)
- Planning for microservices
- Need long-term maintainability

## 🔧 Migration Steps (For Your Projects)

1. **Plan Modules** - Identify feature boundaries
2. **Create DTOs** - Define input/output types
3. **Build Schemas** - Convert Mongoose models
4. **Implement Services** - Business logic layer
5. **Create Controllers** - HTTP layer
6. **Add Guards** - Authentication/authorization
7. **Wire Modules** - Connect dependencies
8. **Test Endpoints** - Verify functionality

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS Fundamentals](https://docs.nestjs.com/first-steps)
- [Passport.js](http://www.passportjs.org/)
- [Class Validator](https://github.com/typestack/class-validator)

## ✅ Conclusion

Both implementations are production-ready and follow best practices. NestJS provides more structure and built-in features, while Express offers more flexibility. Choose based on your project requirements!

---

**Both versions:**
- ✅ Same functionality
- ✅ Same API endpoints
- ✅ Same Postman collection works
- ✅ Same database structure
- ✅ Same security features

# Event Management API - NestJS

Hey, this is the NestJS version of the Event Management API. It's built with NestJS, MongoDB, and Passport JWT for a more structured, scalable approach.

## What Makes This NestJS Version Cool

- Modular setup with separate modules for auth, users, events, and analytics
- Built-in dependency injection for clean code
- DTOs with class validator for automatic input validation
- Passport JWT strategy for solid authentication
- Guards and decorators for easy authorization
- Full TypeScript support
- Mongoose decorators for type-safe database schemas
- Built-in error handling with exception filters
- Pipes and interceptors for request/response handling

## 📦 Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Build the project
npm run build
```

## 🚀 Running the Application

```bash
# Development mode (with watch)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000/api`

## 🏗️ Project Structure

```
src/
├── main.ts                      # Application entry point
├── app.module.ts                # Root module
├── app.controller.ts            # Root controller
│
├── auth/                        # Authentication module
│   ├── auth.module.ts
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── token-blacklist.service.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts      # Passport JWT strategy
│   ├── guards/
│   │   ├── jwt-auth.guard.ts    # JWT authentication
│   │   └── roles.guard.ts       # Role-based authorization
│   └── dto/
│       ├── register.dto.ts
│       └── login.dto.ts
│
├── users/                       # Users module
│   ├── users.module.ts
│   ├── services/
│   │   └── users.service.ts
│   └── schemas/
│       └── user.schema.ts       # Mongoose schema with decorators
│
├── events/                      # Events module
│   ├── events.module.ts
│   ├── controllers/
│   │   └── events.controller.ts
│   ├── services/
│   │   ├── events.service.ts
│   │   └── registration.service.ts
│   ├── schemas/
│   │   ├── event.schema.ts
│   │   └── registration.schema.ts
│   └── dto/
│       ├── create-event.dto.ts
│       └── update-event.dto.ts
│
├── analytics/                   # Analytics module
│   ├── analytics.module.ts
│   ├── controllers/
│   │   └── analytics.controller.ts
│   └── services/
│       └── analytics.service.ts
│
└── common/                      # Shared resources
    └── decorators/
        ├── roles.decorator.ts   # @Roles() decorator
        └── current-user.decorator.ts  # @CurrentUser() decorator
```

## 🔑 Key NestJS Concepts Used

### 1. Modules
Each feature is encapsulated in its own module:

```typescript
@Module({
  imports: [MongooseModule.forFeature([...])],
  providers: [EventsService, RegistrationService],
  controllers: [EventsController],
  exports: [EventsService]
})
export class EventsModule {}
```

### 2. DTOs (Data Transfer Objects)
Input validation with class-validator:

```typescript
export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsDateString()
  date: string;
}
```

### 3. Guards
Protect routes with authentication and authorization:

```typescript
@Controller('events')
@UseGuards(JwtAuthGuard)  // All routes require authentication
export class EventsController {
  
  @Post()
  @UseGuards(RolesGuard)  // This route also requires admin role
  @Roles('Admin')
  async create(@Body() dto: CreateEventDto) {
    //...
  }
}
```

### 4. Decorators
Custom decorators for cleaner code:

```typescript
@Post()
@UseGuards(JwtAuthGuard)
async register(@CurrentUser() user: any, @Param('id') eventId: string) {
  // user is automatically extracted from JWT
}
```

### 5. Mongoose Schemas with Decorators
Type-safe database schemas:

```typescript
@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, trim: true, minlength: 3 })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: User;
}
```

## 📚 API Endpoints

All endpoints remain the same as the Express version:

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (requires auth)

### Events
- `POST /api/events` - Create event (Admin only)
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)

### Registration
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/register` - Cancel registration

### Analytics
- `GET /api/analytics/events-per-month` - Events per month (Admin only)
- `GET /api/analytics/top-events` - Top 3 events (Admin only)

## 🔐 Authentication Flow

### 1. JWT Strategy
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, 
              private tokenBlacklist: TokenBlacklistService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Return user data that will be attached to request
    return { id: payload.id, role: payload.role };
  }
}
```

### 2. Using Guards
```typescript
@Get()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
async getAdminData(@CurrentUser() user: any) {
  // Only admins with valid JWT can access this
}
```

## ⚙️ Configuration

### Environment Variables (`.env`)
```env
MONGO_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your_super_secret_jwt_key
PORT=3000
NODE_ENV=development
```

### MongoDB Connection
Configured in `app.module.ts`:

```typescript
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGO_URI')
  }),
  inject: [ConfigService]
})
```

## 🧪 Testing with Postman

Import the same `Event-Management-API.postman_collection.json` file. All endpoints work identically!

## 🔄 Differences from Express Version

| Feature | Express | NestJS |
|---------|---------|--------|
| **Structure** | File-based | Module-based |
| **DI** | Manual | Built-in |
| **Validation** | Custom middleware | Class-validator DTOs |
| **Auth** | Custom middleware | Passport + Guards |
| **Type Safety** | Partial (JSDoc) | Full (TypeScript) |
| **Error Handling** | Custom utility | Built-in exceptions |
| **Decorators** | Not available | Extensive use |
| **Testing** | Manual setup | Built-in test utilities |

## 💡 NestJS Best Practices Applied

1. **Single Responsibility** - Each service handles one concern
2. **Dependency Injection** - Services injected where needed
3. **DTOs** - All input validated with class-validator
4. **Exception Filters** - Consistent error responses
5. **Guards** - Authentication/authorization logic separated
6. **Modules** - Features encapsulated and reusable
7. **TypeScript** - Full type safety throughout

## 🚀 Build for Production

```bash
# Build the application
npm run build

# Run production server
npm run start:prod
```

Built files will be in the `dist/` directory.

## 📊 Comparison: Express vs NestJS

### When to use Express:
- Small, simple APIs
- Maximum flexibility needed
- Minimal boilerplate preferred
- Team familiar with Express

### When to use NestJS:
- **Large, complex applications** ✅
- **Need structure and scalability** ✅
- **Team uses TypeScript** ✅
- **Enterprise-grade features** ✅
- **Built-in testing support** ✅
- **Microservices architecture** ✅

## 📖 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Passport.js](http://www.passportjs.org/)
- [Class Validator](https://github.com/typestack/class-validator)
- [Mongoose](https://mongoosejs.com/)



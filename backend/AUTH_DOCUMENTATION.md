# Authentication System Documentation

## Overview
This authentication system provides secure user registration and login functionality using JWT (JSON Web Tokens) with bcryptjs password hashing and multer file upload support for profile photos.

## Security Features

### Password Security
- **Hashing**: Passwords are hashed using bcryptjs with 12 salt rounds (very secure)
- **Validation**: Minimum 6 characters required
- **Storage**: Only hashed passwords are stored in the database

### JWT Authentication
- **Token-based**: Stateless authentication using JWT tokens
- **Payload**: Contains user ID, email, username, role, and name
- **Expiration**: Configurable token expiration (default: 7 days)
- **Secret**: Uses environment-specific JWT secret

### File Upload Security
- **File Type**: Only image files are allowed
- **Size Limit**: 5MB maximum file size
- **Storage**: Secure file naming with timestamps
- **Cleanup**: Failed uploads are automatically cleaned up

## API Endpoints

### Authentication Routes
Base URL: `/api/auth`

#### 1. User Signup
```
POST /api/auth/signup
Content-Type: multipart/form-data
```

**Form Fields:**
- `name` (required): User's full name
- `userName` (required): Unique username
- `email` (required): Valid email address
- `password` (required): Minimum 6 characters
- `role` (optional): User role (default: "user")
- `profilePhoto` (optional): Image file (max 5MB)

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_uuid",
      "name": "John Doe",
      "userName": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "profilePhoto": "/uploads/profiles/profile-1234567890.jpg"
    }
  }
}
```

#### 2. User Login
```
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "user_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_uuid",
      "name": "John Doe",
      "userName": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "profilePhoto": "/uploads/profiles/profile-1234567890.jpg"
    }
  }
}
```

#### 3. Get User Profile
```
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "user_uuid",
      "name": "John Doe",
      "userName": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "profilePhoto": "/uploads/profiles/profile-1234567890.jpg",
      "createdAt": "2025-07-12T10:00:00.000Z",
      "updatedAt": "2025-07-12T10:00:00.000Z"
    }
  }
}
```

#### 4. Verify Token
```
POST /api/auth/verify-token
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "user": {
      "userId": "user_uuid",
      "email": "john@example.com",
      "userName": "johndoe",
      "role": "user",
      "name": "John Doe"
    }
  }
}
```

#### 5. Logout
```
POST /api/auth/logout
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## Authentication Middleware

### Usage in Protected Routes
```typescript
import { authMiddleware } from "../middlewares/authMiddleware";

// Require authentication
router.get("/protected", authMiddleware.verifyToken, controller.method);

// Require specific role
router.post("/admin-only", authMiddleware.requireAdmin, controller.method);

// Require admin or moderator
router.put("/moderator", authMiddleware.requireAdminOrModerator, controller.method);

// Optional authentication
router.get("/optional", authMiddleware.optionalAuth, controller.method);
```

### Available Middleware Methods
1. `verifyToken`: Requires valid JWT token
2. `requireRole(roles)`: Requires specific roles
3. `requireAdmin`: Admin only access
4. `requireAdminOrModerator`: Admin or moderator access
5. `optionalAuth`: Optional authentication (doesn't fail if no token)

## User Entity Structure

```typescript
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Hashed with bcryptjs

  @Column({ nullable: true })
  profilePhoto?: string; // Path to uploaded image

  @Column({ 
    type: "enum", 
    enum: ["admin", "user", "moderator"], 
    default: "user" 
  })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name

# JWT Configuration (IMPORTANT: Use strong secrets in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Error Handling

### Common Error Responses

#### Validation Errors
```json
{
  "success": false,
  "message": "Name, username, email, and password are required"
}
```

#### Authentication Errors
```json
{
  "success": false,
  "message": "Invalid or expired token. Please login again."
}
```

#### Authorization Errors
```json
{
  "success": false,
  "message": "Insufficient permissions. Required roles: admin"
}
```

#### Duplicate User Errors
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

## File Upload

### Profile Photos
- **Location**: `backend/uploads/profiles/`
- **Access URL**: `http://localhost:3001/uploads/profiles/filename.jpg`
- **Allowed Types**: Images only (jpg, png, gif, etc.)
- **Size Limit**: 5MB
- **Naming**: `profile-{timestamp}-{random}.{extension}`

## Frontend Integration Example

### Signup with Profile Photo
```javascript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('userName', 'johndoe');
formData.append('email', 'john@example.com');
formData.append('password', 'securepassword');
formData.append('profilePhoto', fileInput.files[0]); // Optional

const response = await fetch('http://localhost:3001/api/auth/signup', {
  method: 'POST',
  body: formData
});
```

### Login
```javascript
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'securepassword'
  })
});
```

### Using JWT Token
```javascript
const response = await fetch('http://localhost:3001/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Setup Instructions

1. **Install Dependencies**: Already included in package.json
2. **Environment Setup**: Copy `.env.example` to `.env` and configure
3. **Database Setup**: Ensure PostgreSQL is running and database exists
4. **Run Server**: `npm run dev`
5. **Test Endpoints**: Use the provided API documentation

## Security Best Practices

1. **JWT Secret**: Use a strong, random secret in production
2. **HTTPS**: Always use HTTPS in production
3. **Token Storage**: Store tokens securely on the client side
4. **Password Policy**: Implement strong password requirements
5. **Rate Limiting**: Consider adding rate limiting for auth endpoints
6. **File Validation**: Validate uploaded files thoroughly
7. **Error Messages**: Don't expose sensitive information in error messages

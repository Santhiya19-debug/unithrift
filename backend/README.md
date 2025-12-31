# UniThrift Backend - Authentication API

Production-grade MongoDB + Express authentication backend for UniThrift.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MongoDB Atlas account (free tier)
- SMTP email service (Gmail, SendGrid, etc.)

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env

# Start development server
npm run dev

# Or start production server
npm start
```

## 📁 Project Structure

```
backend/
├── models/
│   ├── User.js              # User schema
│   └── AuthToken.js         # Security tokens schema
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── roleCheck.js         # Admin role enforcement
│   ├── blockedUser.js       # Blocked user denial
│   ├── rateLimiter.js       # Rate limiting
│   └── errorHandler.js      # Global error handler
├── routes/
│   └── auth.js              # All auth endpoints
├── utils/
│   ├── emailValidation.js   # Email validation
│   ├── emailService.js      # Email sending
│   └── jwtHelper.js         # JWT utilities
├── config/
│   └── db.js                # MongoDB connection
├── server.js                # Server entry point
├── .env.example             # Environment template
└── package.json
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api/auth
```

### Health Check
```http
GET /health
```

### Authentication Endpoints

#### 1. Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe2024@vitstudent.ac.in",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully. Please check your email to verify your account."
}
```

#### 2. Verify Email
```http
GET /api/auth/verify-email?token=abc123...
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully. You can now login."
}
```

#### 3. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe2024@vitstudent.ac.in",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe2024@vitstudent.ac.in",
    "role": "user",
    "isVerified": true,
    "isBlocked": false,
    "createdAt": "2024-12-28T10:00:00.000Z"
  }
}
```

#### 4. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe2024@vitstudent.ac.in",
    "role": "user",
    "isVerified": true,
    "isBlocked": false
  }
}
```

#### 5. Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john.doe2024@vitstudent.ac.in"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If that email is registered, a password reset link has been sent."
}
```

#### 6. Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "abc123...",
  "newPassword": "NewSecurePass456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully. You can now login with your new password."
}
```

#### 7. Resend Verification (Rate-Limited)
```http
POST /api/auth/resend-verification
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "john.doe2024@vitstudent.ac.in"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent. Please check your inbox."
}
```

**Rate Limit:** 1 request per 60 seconds per email

#### 8. Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## ⚙️ Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/unithrift` |
| `JWT_SECRET` | Secret key for JWT signing | `your-super-secret-key` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password/app password | `your-app-password` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `JWT_EXPIRY` | Token expiration | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## 🔒 Security Features

### Password Security
- Hashed with bcrypt (10 salt rounds)
- Never stored in plain text
- Minimum 8 characters enforced

### JWT Security
- Signed with secret key
- 7-day expiration
- Contains: userId, email, role, isVerified, isBlocked
- Validated on every protected route

### Token Security
- Verification tokens: 24-hour expiry
- Reset tokens: 30-minute expiry
- One-time use tokens
- Hashed before storage (SHA-256)

### Email Validation
- Strict domain enforcement
- Students: `@vitstudent.ac.in` with 4-digit year
- Faculty: `@artvip.ac.in`
- Public domains rejected

### Role-Based Access
- Role checked on protected routes
- Admin-only routes enforced
- Blocked users denied server-side

## 📧 Email Configuration

### Gmail Setup

1. Enable 2FA on your Gmail account
2. Generate App Password:
   - Go to Google Account → Security → 2-Step Verification
   - Scroll to "App passwords"
   - Generate password for "Mail"
3. Use in `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

### Other SMTP Providers

**SendGrid:**
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-api-key
```

**Mailgun:**
```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-password
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  passwordHash: String,
  role: "user" | "admin",
  isVerified: Boolean,
  isBlocked: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### AuthTokens Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  tokenHash: String (indexed),
  type: "EMAIL_VERIFICATION" | "PASSWORD_RESET",
  expiresAt: Date (indexed),
  used: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Manual Testing

#### Test Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test.user2024@vitstudent.ac.in",
    "password": "TestPass123"
  }'
```

#### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.user2024@vitstudent.ac.in",
    "password": "TestPass123"
  }'
```

#### Test Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🐛 Troubleshooting

### Database Connection Fails
- Check MONGO_URI format
- Verify IP whitelist in MongoDB Atlas
- Check network connectivity

### Email Not Sending
- Verify SMTP credentials
- Check Gmail App Password (not regular password)
- Verify sender email is correct
- Check spam folder

### JWT Token Invalid
- Verify JWT_SECRET matches
- Check token expiry
- Ensure token format: `Bearer <token>`

### Rate Limit Errors
- Wait 60 seconds between resend requests
- Check server restart (rate limit resets)

## 🚀 Deployment

### Environment Setup
1. Set all environment variables in production
2. Use strong JWT_SECRET (32+ characters)
3. Enable MongoDB Atlas production cluster
4. Configure production SMTP service

### Security Checklist
- [ ] Change JWT_SECRET from default
- [ ] Enable HTTPS
- [ ] Set secure CORS origin
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Use production SMTP credentials
- [ ] Set NODE_ENV=production

## 📝 Notes

### Database Connection
- Server will NOT start if MongoDB connection fails
- This is intentional (fail-fast design)
- Check logs for connection errors

### Token Cleanup
- Expired tokens auto-delete via MongoDB TTL index
- Used tokens marked but not immediately deleted
- Manual cleanup can be added if needed

### Rate Limiting
- Basic in-memory rate limiting (60s cooldown)
- Resets on server restart
- Production should use Redis-based rate limiting

## 🤝 Frontend Integration

The backend is designed to work seamlessly with the existing UniThrift frontend:

- JWT sent in `Authorization: Bearer <token>` header
- Response format matches frontend expectations
- Error messages consistent with frontend validation
- Email validation matches frontend rules

No frontend code changes required.

## 📚 Additional Documentation

- Frontend authentication docs: `../frontend/AUTHENTICATION.md`
- API testing collection: Use the curl examples above
- Database setup: See MongoDB Atlas documentation

---

**Backend Status: ✅ Production Ready**
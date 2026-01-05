# UniThrift

A secure, campus-exclusive marketplace platform that connects students and faculty within their university community to buy, sell, and exchange items safely.

Built with trust and scalability in mind, UniThrift enforces institutional email verification, provides admin moderation tools, and maintains a clean, professional interface suitable for real-world deployment.

---

## 🎯 What Problem Does This Solve?

Campus communities need a trustworthy platform for peer-to-peer transactions. Public marketplaces lack the safety and accountability that comes from verified institutional identity. UniThrift solves this by:

- **Restricting access** to verified university members only
- **Preventing anonymous listings** through email verification
- **Enabling administrative oversight** for community safety
- **Scaling reliably** for thousands of concurrent users
- **Maintaining simplicity** without compromising functionality

---

## 🏗️ Architecture

UniThrift follows a clean separation of concerns:

```
┌─────────────────────────────────────────────┐
│  Frontend (React + Vite + Tailwind CSS)     │
│  • Component-based UI                       │
│  • Context API for state management         │
│  • Role-based routing                       │
└─────────────────┬───────────────────────────┘
                  │
                  ↓ REST API
┌─────────────────────────────────────────────┐
│  Backend (Node.js + Express)                │
│  • JWT authentication                       │
│  • Middleware-based security                │
│  • MongoDB integration via Mongoose         │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│  Database (MongoDB Atlas)                   │
│  • Users, products, tokens, wishlist        │
│  • Indexed for performance                  │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for utility-first styling
- **React Router** for client-side routing
- **Context API** for authentication state management

### Backend
- **Node.js** with Express.js
- **MongoDB Atlas** for managed database hosting
- **Mongoose** for elegant data modeling
- **JWT** for stateless authentication
- **bcrypt** for secure password hashing
- **Nodemailer** for email verification

### Infrastructure
- **MongoDB Atlas** (free tier supported)
- **SMTP service** (Gmail App Password or equivalent)
- **Environment-based configuration** for security

---

## 🔐 Authentication & Security

### Email Verification System

UniThrift enforces strict email domain policies:

**Student Emails:**
- Domain: `@vitstudent.ac.in`
- Format: Letters, optional dots, must end with 4-digit year
- Examples: `alex2024@vitstudent.ac.in`, `alex.s2023@vitstudent.ac.in`

**Faculty Emails:**
- Domain: `@artvip.ac.in`
- Format: Any valid email structure
- Examples: `john.doe@artvip.ac.in`, `faculty@artvip.ac.in`

**Rejected:**
- All public email domains (Gmail, Yahoo, Outlook, etc.)
- Any other institutional or private domains

### Security Features

- **Password hashing** using bcrypt with 10 salt rounds
- **JWT-based authentication** with 7-day expiration
- **Email verification** required for full platform access
- **Role-based access control** for admin functions
- **Server-side enforcement** of all security rules
- **Blocked user restrictions** applied at the API level
- **One-time use tokens** for email verification and password resets

### Authentication States

Every user exists in exactly one state:

1. **Unauthenticated** - Not logged in
2. **Authenticated, Not Verified** - Logged in but email not verified (restricted access)
3. **Authenticated, Verified** - Full platform access
4. **Blocked** - Account restricted by admin
5. **Admin** - Administrative privileges

---

## 👥 User Roles

### Regular Users (Students & Faculty)

- Sign up with institutional email
- Verify email address
- Create and manage product listings
- Browse marketplace
- Maintain wishlist
- Edit or delete own products
- View personal profile and activity

### Administrators

- Manage all users (view, verify, block/unblock)
- Moderate product listings
- Handle user reports
- Access admin dashboard
- Override ownership restrictions for moderation

---

## 📦 Core Features

### Marketplace

- **Product Listings**: Title, description, category, condition, price (or free), location
- **Public Feed**: Browse all active listings with pagination
- **Product Details**: View full listing with seller information
- **Categories**: Furniture, Electronics, Books, Kitchen Items, Hostel Essentials
- **Conditions**: New, Like New, Used
- **Status Management**: Active, Removed (soft delete), Under Review, Sold

### User Profile

- View personal information and verification status
- See all own listings with status indicators
- Edit or delete listings
- Access wishlist
- Account settings and logout

### Wishlist

- Save products for later
- User-specific storage
- Persistent across sessions
- Quick access from navigation

### Admin Panel

- User management dashboard
- Listing moderation tools
- Role enforcement
- Account restriction capabilities
- Activity monitoring (future enhancement)

---

## 🖼️ Image Handling

Images are handled through a clean separation of concerns:

1. **Frontend** uploads images to external storage (Cloudinary/S3-compatible)
2. **Storage service** returns public URLs
3. **Backend** stores URLs in MongoDB
4. **Frontend** displays images via stored URLs

**Why this approach?**
- MongoDB stores metadata, not binary data
- Scalable for thousands of images
- CDN-compatible for fast delivery
- Easy to migrate storage providers
- Reduces database size

---

## 🗄️ Database Structure

**Database Name:** `unithrift`

### Collections

#### `users`
```javascript
{
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

#### `authtokens`
```javascript
{
  userId: ObjectId (ref: users),
  tokenHash: String (indexed),
  type: "EMAIL_VERIFICATION" | "PASSWORD_RESET",
  expiresAt: Date (indexed),
  used: Boolean,
  createdAt: Date
}
```

#### `products`
```javascript
{
  title: String,
  description: String,
  price: Number,
  isFree: Boolean,
  category: String (enum),
  condition: String (enum),
  location: String,
  images: [String], // URLs only
  sellerId: ObjectId (ref: users, indexed),
  status: String (enum, indexed),
  createdAt: Date,
  updatedAt: Date
}
```

#### `wishlist`
```javascript
{
  userId: ObjectId (ref: users, indexed),
  productId: ObjectId (ref: products, indexed),
  createdAt: Date
}
```

---

## 🌐 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Create new account | No |
| GET | `/verify-email` | Verify email with token | No |
| POST | `/login` | Authenticate user | No |
| GET | `/me` | Get current user | Yes |
| POST | `/forgot-password` | Request password reset | No |
| POST | `/reset-password` | Reset password with token | No |
| POST | `/resend-verification` | Resend verification email | Yes |
| POST | `/logout` | Logout user | Yes |

### Products (`/api/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create product listing | Yes (Verified) |
| GET | `/` | Get marketplace feed | No |
| GET | `/my` | Get user's listings | Yes |
| GET | `/:id` | Get product details | No* |
| PUT | `/:id` | Update product | Yes (Owner/Admin) |
| DELETE | `/:id` | Remove product (soft delete) | Yes (Owner/Admin) |

*Visibility depends on product status and user role

### Wishlist (`/api/wishlist`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Add to wishlist | Yes |
| GET | `/` | Get user's wishlist | Yes |
| DELETE | `/:productId` | Remove from wishlist | Yes |

### Admin Routes (`/api/admin/*`)

All admin routes require authentication and admin role. Detailed documentation available in admin API docs.

---

## ⚙️ Environment Configuration

### Backend `.env`

```bash
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/unithrift

# Authentication
JWT_SECRET=your_strong_random_secret_key_here
JWT_EXPIRY=7d

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- MongoDB Atlas account (free tier works)
- Email service credentials (Gmail App Password recommended)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

Server will start on `http://localhost:5000` (or your configured PORT)

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with backend URL

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

### Verify Setup

1. Backend health check: `http://localhost:5000/health`
2. Frontend loads without errors
3. MongoDB connection successful in backend logs
4. Test signup/login flow

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Signup with valid institutional email
- [ ] Receive verification email
- [ ] Verify email and login
- [ ] Forgot password flow
- [ ] Blocked user restrictions

**Products:**
- [ ] Create product listing
- [ ] View marketplace feed
- [ ] Update own listing
- [ ] Delete own listing
- [ ] Cannot modify others' listings

**Wishlist:**
- [ ] Add product to wishlist
- [ ] View wishlist
- [ ] Remove from wishlist

**Admin (if applicable):**
- [ ] Access admin dashboard
- [ ] View all users
- [ ] Block/unblock users
- [ ] Moderate listings

---

## 📝 Development Notes

### Code Organization

- **Frontend and backend are fully decoupled** - can be deployed separately
- **Backend fails fast** on critical errors (e.g., database connection)
- **Frontend trusts nothing** - all data validation on backend
- **Component-based UI** with clear separation of concerns
- **Middleware pattern** for authentication, authorization, and validation

### Design Decisions

- **Soft deletes for products** - status-based visibility, not actual deletion
- **JWT in Authorization header** - not cookies (simpler, explicit)
- **Email verification mandatory** - ensures institutional identity
- **sellerId always from JWT** - prevents ownership manipulation
- **Admin role via backend only** - no frontend role assignment

### Scalability Considerations

- Database indexes on frequently queried fields
- Pagination for marketplace feed
- Separate collections for better query performance
- Image URLs instead of binary storage
- Stateless authentication (JWT)

---

## 🔮 Future Enhancements

**Phase 2 Planned Features:**
- Real-time chat between buyers and sellers
- Product reporting and admin review queue
- Advanced search and filtering
- User ratings and reviews
- Email/push notifications for activity
- Transaction history and analytics
- Mobile app (React Native)

**Infrastructure Improvements:**
- Redis caching layer
- Rate limiting per user
- Image compression pipeline
- Advanced admin analytics dashboard
- Automated spam detection

---

## 🤝 Contributing

This project was built as part of a campus marketplace initiative. While it's production-ready, contributions are welcome for:

- Bug fixes
- Documentation improvements
- Feature enhancements (aligned with roadmap)
- Performance optimizations

Please open an issue first to discuss proposed changes.

---

## 📄 License

This project is built for educational and institutional use. 

**Usage Terms:**
- Free for non-commercial, educational use
- Commercial deployment requires permission
- Attribution appreciated but not required

---

## 🙏 Acknowledgments

Built with care for campus communities. Special thanks to:
- The open-source community for excellent tools
- MongoDB Atlas for free tier database hosting
- Tailwind CSS for design system foundation
- React and Node.js communities for documentation

---

## 📞 Support & Contact

For questions, issues, or suggestions:
- Open an issue on GitHub
- Email: support@unithrift.example (update with actual contact)
- Check documentation in `/docs` folder

---

**Status:** ✅ Production-ready  
**Last Updated:** January 2025  
**Version:** 1.0.0
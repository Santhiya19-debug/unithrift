🟢 UniThrift

UniThrift is a campus-exclusive marketplace platform designed for students and faculty to buy, sell, reuse, and exchange items safely within their university ecosystem.

The platform enforces institutional email verification, admin moderation, and secure authentication to ensure trust, safety, and scalability for real-world usage.

📌 Key Objectives

Enable safe peer-to-peer trading within a university

Prevent external or anonymous access

Ensure admin oversight and moderation

Scale reliably for thousands of users

Maintain a clean, minimal, professional UI

🧱 Architecture Overview

UniThrift follows a modern full-stack architecture:

Frontend (React + Vite + Tailwind)
        ↓
Backend (Node.js + Express)
        ↓
Database (MongoDB Atlas)
        ↓
External Services (Email, Image Storage)

🖥️ Tech Stack
Frontend

React (Vite)

Tailwind CSS

React Router

Context API (Auth management)

Backend

Node.js

Express.js

MongoDB (Atlas)

Mongoose ODM

JWT Authentication

bcrypt (password hashing)

Infrastructure

MongoDB Atlas (free tier supported)

SMTP (Gmail App Password or similar)

Environment-based configuration

🔐 Authentication & Authorization
Email Restrictions (Strict)

Only institutional emails are allowed:

Students

letters[.letters]*YYYY@vitstudent.ac.in


Examples:

alex2024@vitstudent.ac.in

alex.s2023@vitstudent.ac.in

Faculty

*@artvip.ac.in


All other domains are rejected.

Auth States

Unauthenticated

Authenticated (Not Verified)

Authenticated (Verified)

Blocked

Admin

Security Features

Passwords hashed using bcrypt (10 rounds)

JWT-based authentication

Token expiration enforced

Role-based route protection

Blocked users denied server-side

Email verification mandatory

👤 User Roles
User (Student / Faculty)

Sign up with institutional email

Verify email

Create product listings

View own profile & listings

Add/remove wishlist items

Edit or delete own products

Admin

View all users

Verify accounts

Block / unblock users

Moderate listings

Handle reports

📦 Core Features
Marketplace

Product listing (title, description, category, condition, price, location)

Free and paid listings

Public browse feed

Product detail view

Seller visibility control

Profile

View user information

View user’s listings

Manage listings (edit / delete)

Account settings

Wishlist

Add/remove products to wishlist

User-specific storage

Persistent across sessions

Admin Panel

User management

Role enforcement

Moderation tools

Safety controls

🖼️ Image Handling (Design Intent)

Images are handled via a separate upload pipeline:

Frontend uploads images

Backend validates metadata

URLs are stored in MongoDB

Images are served via external storage (Cloudinary / S3-style service)

Images are never stored directly inside MongoDB.

🗄️ Database Structure
Database
unithrift

Collections
users
{
  email: String,
  passwordHash: String,
  role: "user" | "admin",
  isVerified: Boolean,
  isBlocked: Boolean,
  createdAt: Date
}

authtokens
{
  userId: ObjectId,
  tokenHash: String,
  type: "EMAIL_VERIFICATION" | "PASSWORD_RESET",
  expiresAt: Date,
  used: Boolean
}

products
{
  title: String,
  description: String,
  price: Number,
  isFree: Boolean,
  category: String,
  condition: String,
  location: String,
  images: [String],
  sellerId: ObjectId,
  status: "active" | "removed",
  createdAt: Date
}

wishlist
{
  userId: ObjectId,
  productId: ObjectId,
  createdAt: Date
}

🌐 API Overview
Auth

POST /api/auth/signup

GET /api/auth/verify-email

POST /api/auth/login

GET /api/auth/me

POST /api/auth/forgot-password

POST /api/auth/reset-password

POST /api/auth/logout

Products

POST /api/products

GET /api/products

GET /api/products/my

GET /api/products/:id

PUT /api/products/:id

DELETE /api/products/:id

Wishlist

POST /api/wishlist

GET /api/wishlist

DELETE /api/wishlist/:productId

(Admin routes are protected and role-restricted.)

⚙️ Environment Setup
Backend .env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_long_random_secret
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173

Frontend .env
VITE_API_BASE_URL=http://localhost:5000/api

▶️ Running the Application
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev

🧪 Development Notes

Frontend and backend are decoupled

Backend fails fast on DB connection errors

Frontend relies entirely on API responses

Mock data was used initially and later replaced with real APIs

Codebase is structured for future scalability

🚀 Future Enhancements

Chat between buyer and seller

Report system for listings

Advanced admin analytics

Push/email notifications

Pagination & search optimization

Mobile-first refinements

📜 License

This project is built for educational and institutional use.
Commercial use requires permission from the author(s)
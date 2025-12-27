# UniThrift - Campus Marketplace

A closed-campus marketplace platform for buying and selling pre-loved items within university communities.

## 🎨 Design Philosophy

- **Minimal & Premium**: Sage green + off-white color palette
- **Editorial Typography**: Playfair Display + Inter
- **Calm User Experience**: No flashy animations, just subtle interactions
- **Scalability-First**: Built for Phase 2 expansion without refactoring

## 🚀 Tech Stack

- **React 18** with Vite
- **Tailwind CSS** (config-driven styling)
- **React Router** for navigation
- **Mock data** (backend-ready architecture)

## 📁 Project Structure

```
unithrift/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   ├── layout/          # Header, Footer
│   │   └── marketplace/     # Product cards, filters, search
│   ├── pages/               # Route pages
│   ├── data/                # Mock data
│   ├── styles/              # Tailwind CSS + custom classes
│   ├── App.jsx              # Route configuration
│   └── main.jsx             # Entry point
├── index.html
├── tailwind.config.js       # Design system configuration
└── package.json
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Features (Phase 1)

### Core Functionality
- ✅ Browse marketplace with product grid
- ✅ Search products by name
- ✅ Filter by category, price (free/paid), location
- ✅ Product detail pages with image gallery
- ✅ Wishlist management
- ✅ Sell/List products with image upload
- ✅ User profile with listings management
- ✅ Authentication UI (Login/Signup)

### Design Features
- ✅ Responsive layout (mobile-first)
- ✅ Sage green + off-white color system
- ✅ Playfair Display + Inter typography
- ✅ Subtle hover effects (no scaling/bouncing)
- ✅ Verified seller badges
- ✅ Free/Paid tags
- ✅ Category browsing

## 🎨 Color Palette

```css
Off-white Background:  #F6F7F4
Card White:            #FFFFFF
Primary Sage:          #7A8F6A
Muted Sage:            #9EAD94
Dark Green (CTA):      #5F6F52
Text Primary:          #2F2F2F
Text Secondary:        #6B7280
Text Muted:            #9CA3AF
Border Soft:           #E5E7EB
```

## 📝 Typography

- **Headings**: Playfair Display (serif)
- **Body/UI**: Inter (sans-serif)

## 🔧 Customization

All design tokens are centralized in `tailwind.config.js`:
- Colors
- Fonts
- Shadows
- Spacing

To change the color scheme, update the `colors` object in the config file.

## 🚧 Phase 2 Readiness

The codebase is structured for easy Phase 2 expansion:
- Component-based architecture
- Service layer pattern (API-ready)
- Mock data separation
- No hardcoded business logic in UI
- Modular routing structure

### Planned Phase 2 Features
- Chat/messaging system
- Ratings & reviews
- Notifications
- Analytics dashboard
- Advanced filters
- Payment integration (if needed)

## 📦 Backend Integration

Frontend is ready for backend integration. Expected API structure:

```javascript
// Product endpoints
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

// Auth endpoints
POST   /api/auth/login
POST   /api/auth/signup
POST   /api/auth/verify-email

// User endpoints
GET    /api/users/:id
PUT    /api/users/:id

// Wishlist endpoints
GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:productId
```

## 🎯 Development Guidelines

### Code Quality
- Keep components small and focused
- Use semantic HTML
- Follow accessibility best practices
- Write meaningful commit messages

### Styling Rules
- Use Tailwind utility classes
- Define reusable classes in `index.css`
- Avoid inline styles
- Keep animations subtle (150-200ms transitions)

### Component Standards
- Props should be documented
- Use meaningful variable names
- Avoid deep nesting (max 3 levels)
- Handle loading/error states

## 📄 License

This project is built for educational purposes as part of a campus marketplace initiative.

## 🤝 Contributing

Phase 1 is feature-complete. Phase 2 contributions will follow after backend integration.

---

**Built with care for campus communities.**
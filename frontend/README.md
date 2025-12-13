# ⚛️ Frontend - Sports Travel Platform

Modern React 18 SPA built with Vite, Tailwind CSS, and React Router for fast, responsive user experience.

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                      # Reusable UI primitives
│   │   │   ├── Button.jsx           # Multi-variant button
│   │   │   ├── Card.jsx             # Content wrapper
│   │   │   ├── Input.jsx            # Form input with validation
│   │   │   ├── Textarea.jsx         # Multi-line input
│   │   │   ├── Modal.jsx            # Dialog/popup
│   │   │   └── Toast.jsx            # Notification system
│   │   ├── layout/                  # Page layout components
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── Footer.jsx           # Page footer
│   │   │   └── WhatsAppFloat.jsx    # Floating WhatsApp button
│   │   ├── forms/                   # Form components
│   │   │   ├── LeadForm.jsx         # Multi-step lead capture
│   │   │   └── LeadModal.jsx        # Modal wrapper for form
│   │   ├── sections/                # Landing page sections
│   │   │   ├── HeroSection.jsx
│   │   │   ├── TopEvents.jsx
│   │   │   ├── FeaturedEvent.jsx
│   │   │   ├── WhyChooseUs.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── SampleItinerary.jsx
│   │   │   ├── AddOnsSection.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   └── FAQ.jsx
│   │   └── admin/                   # Admin dashboard components
│   │       ├── AdminLogin.jsx       # Authentication form
│   │       ├── DashboardLayout.jsx  # Admin page wrapper
│   │       └── ProtectedRoute.jsx   # Auth guard
│   ├── pages/                       # Route pages
│   │   ├── LandingPage.jsx          # Home (public)
│   │   ├── EventDetails.jsx         # Event details (public)
│   │   ├── DashboardOverview.jsx    # Stats & metrics (admin)
│   │   ├── LeadsManagement.jsx      # Leads table (admin)
│   │   └── QuoteGeneration.jsx      # Quote builder (admin)
│   ├── services/
│   │   └── api.js                   # Axios API client
│   ├── hooks/
│   │   └── useEvents.js             # Events data hook
│   ├── contexts/
│   │   └── AuthContext.jsx          # Authentication state
│   ├── utils/
│   │   ├── constants.js             # App constants
│   │   └── validation.js            # Form validators
│   ├── App.jsx                      # Root component with routing
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Tailwind imports
├── public/                          # Static assets
├── index.html                       # HTML template
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind customization
└── postcss.config.js                # PostCSS setup
```

## 📦 Installation

```bash
npm install
```

## ⚙️ Environment Variables

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:8080/api
```

**Production:**
```env
VITE_API_URL=https://your-api-domain.vercel.app/api
```

## 🚀 Scripts

```bash
# Development server (hot reload on port 5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📱 Pages & Routes

### Public Routes
```
/                    # Landing page with all sections
/events/:id          # Event details page
```

### Admin Routes (Protected)
```
/admin/login         # Admin authentication
/admin/dashboard     # Overview with stats
/admin/leads         # Leads management table
/admin/quote         # Quote generation tool
```

## 🎨 Key Components

### UI Components

**Button** (`components/ui/Button.jsx`)
```jsx
<Button variant="primary" size="lg">Click Me</Button>
// Variants: primary, secondary, ghost
// Sizes: sm, md, lg
```

**Input** (`components/ui/Input.jsx`)
```jsx
<Input 
  type="email" 
  placeholder="Email" 
  error="Invalid email"
/>
```

**Modal** (`components/ui/Modal.jsx`)
```jsx
<Modal isOpen={true} onClose={handleClose} title="Title">
  {children}
</Modal>
```

### Form Components

**LeadForm** (`components/forms/LeadForm.jsx`)
- Multi-step form (Contact → Details → Verification)
- Event and package selection with auto-population
- Email verification integration
- Real-time validation
- Success/error toast notifications

**LeadModal** (`components/forms/LeadModal.jsx`)
- Wrapper for LeadForm in modal dialog
- Triggered by CTA buttons
- Auto-focus and escape key handling

### Admin Components

**DashboardLayout** (`components/admin/DashboardLayout.jsx`)
- Sidebar navigation
- Active route highlighting
- Logout functionality
- Responsive mobile menu

**ProtectedRoute** (`components/admin/ProtectedRoute.jsx`)
- Guards admin routes
- Redirects to login if unauthenticated
- Checks AuthContext for token

### Landing Sections

**HeroSection** - Full-width hero with CTA and video background  
**TopEvents** - Grid of featured events (3 cards)  
**FeaturedEvent** - Highlighted event with large image  
**WhyChooseUs** - 4 benefit cards with icons  
**HowItWorks** - 3-step process timeline  
**SampleItinerary** - Collapsible day-by-day schedule  
**AddOnsSection** - Optional services grid  
**Testimonials** - Customer reviews carousel  
**FAQ** - Expandable Q&A accordion  

## 🔧 Tech Stack

**Core:**
- React 18.2.0 (Concurrent features)
- Vite 5.0.8 (Build tool)
- React Router DOM 6.21.1 (Routing)

**Styling:**
- Tailwind CSS 4.0.0-alpha.25
- PostCSS with autoprefixer
- Lucide React (Icons)

**HTTP & State:**
- Axios 1.6.5 (API client)
- React Hot Toast (Notifications)
- Context API (Auth state)

**Utilities:**
- date-fns 3.0.6 (Date formatting)

## 📡 API Integration

Centralized API client in `src/services/api.js`:

```javascript
import api from './services/api';

// Events
const events = await api.getEvents();
const event = await api.getEventById(id);

// Leads
const lead = await api.createLead(formData);
const leads = await api.getLeads();
const actionableLeads = await api.getActionableLeads();
await api.updateLeadStatus(id, status);

// Quotes
const quote = await api.generateQuote(data);
await api.sendQuoteEmail(quoteId);

// Email Verification
await api.sendVerificationEmail(email);
await api.verifyEmail(token);
```

**Error Handling:**
- Axios interceptors for global error handling
- Toast notifications for errors
- Retry logic for network failures

## 🎣 Custom Hooks

**useEvents** (`hooks/useEvents.js`)
```javascript
const { events, loading, error, refetch } = useEvents();
```
- Fetches events on mount
- Caching to prevent duplicate requests
- Loading and error states
- Manual refetch function

## 🔐 Authentication

**AuthContext** (`contexts/AuthContext.jsx`)
```javascript
const { isAuthenticated, user, login, logout } = useAuth();
```

**Features:**
- Token storage in localStorage
- Auto-logout on token expiration
- Protected route wrapper
- Login/logout functions

**Login Flow:**
```
AdminLogin → AuthContext.login() → localStorage.setItem('token')
→ Navigate to /admin/dashboard
```

## 🎨 Styling & Theming

**Tailwind Configuration:**
```javascript
// Custom colors
colors: {
  'primary-red': '#DC143C',
  'dark-navy': '#0f172a',
  'light-gray': '#f8fafc'
}

// Custom fonts
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif']
}
```

**Responsive Breakpoints:**
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (laptop)
- `xl`: 1280px (desktop)
- `2xl`: 1536px (large desktop)

## 🎯 Features

### Customer-Facing
- **Event Discovery** - Browse events with filters
- **Lead Capture** - Multi-step form with validation
- **Email Verification** - Secure inquiry submission
- **WhatsApp Integration** - Direct customer support

### Admin Dashboard
- **Analytics** - Real-time stats (new leads, quotes sent, conversion rate)
- **Lead Management** - Filterable table with status updates
- **Quote Generation** - Dynamic pricing with auto-fill from lead data
- **Complete Price Breakdown** - Transparent pricing display

## ⚡ Performance Optimizations

- **Code Splitting** - Lazy loading for admin routes
- **Image Optimization** - WebP format with fallbacks
- **Bundle Size** - Tree shaking with Vite
- **Caching** - Events cached after first fetch
- **Debouncing** - Search inputs debounced (300ms)

## 📱 Responsive Design

**Mobile-First Approach:**
- Base styles for mobile (320px+)
- Progressive enhancement for larger screens
- Touch-friendly tap targets (44px minimum)
- Collapsible navigation menu
- Stacked layouts on small screens

**Testing Breakpoints:**
```bash
Mobile: 375px × 667px (iPhone SE)
Tablet: 768px × 1024px (iPad)
Desktop: 1920px × 1080px (Full HD)
```

## 🧪 Development Tips

```bash
# Start dev server
npm run dev

# Build and check bundle size
npm run build
npm run preview

# Check for build errors
npm run build -- --mode production
```

**Debugging:**
- React DevTools browser extension
- Vite's HMR for instant updates
- Console errors show file & line numbers

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod
```

**Environment Variables on Vercel:**
- Add `VITE_API_URL` in project settings
- Use production API URL

### Netlify
```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
VITE_API_URL=https://your-api.vercel.app/api
```

### Build Output
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js    # Main bundle
│   ├── index-[hash].css   # Styles
│   └── [images]           # Optimized images
```

## 🔍 SEO & Meta Tags

**index.html Configuration:**
- Page title and description
- Open Graph tags for social sharing
- Viewport meta for mobile
- Favicon and app icons

## 📄 License

MIT License

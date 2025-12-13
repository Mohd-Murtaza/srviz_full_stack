# 🏆 Sports Travel Platform

Full-stack MERN application for managing sports event travel packages with intelligent lead management, dynamic quote generation, and automated email workflows.

## 🚀 Tech Stack

**Frontend:** React 18 • Vite • Tailwind CSS • React Router • Axios  
**Backend:** Node.js • Express • MongoDB • Mongoose • Nodemailer  
**Architecture:** RESTful API with MVC pattern

## 📁 Project Structure

```
├── backend/          # Node.js API server (Port 8080)
├── frontend/         # React SPA (Port 5173)
└── README.md
```

## ✨ Core Features

### Customer-Facing
- **Event Discovery** - Browse sports events with package options
- **Lead Capture** - Email-verified inquiry form with package selection
- **Quote Acceptance** - Email-based quote approval/decline system

### Admin Dashboard
- **Lead Management** - 6-stage workflow (new → contacted → quote_sent → qualified → converted/lost)
- **Quote Generation** - Dynamic pricing with seasonal, early bird, group, and weekend adjustments
- **Analytics** - Real-time stats and lead pipeline visualization
- **Email Automation** - Professional quote emails with detailed price breakdowns

## ⚡ Quick Start

### Prerequisites
- Node.js 16+
- MongoDB running locally or MongoDB Atlas URI
- SMTP credentials (Gmail recommended)

### 1. Clone & Install
```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Setup

**Backend** (`backend/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/sports-travel
PORT=8080
NODE_ENV=development

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8080
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8080/api
```

### 3. Seed & Run
```bash
# Terminal 1 - Backend
cd backend
npm run seed    # Populate with sample events & packages
npm run dev     # Start API server

# Terminal 2 - Frontend
cd frontend
npm run dev     # Start React app
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- Health Check: http://localhost:8080/api/health

## 🔄 Lead Workflow

```
new → contacted → quote_sent → qualified → converted
                                        ↓
                                      lost
```

**Status Definitions:**
- `new` - Fresh inquiry, needs first contact
- `contacted` - Initial communication sent
- `quote_sent` - Quote generated and emailed
- `qualified` - Serious interest, actively negotiating
- `converted` - Quote accepted, booking confirmed ✅
- `lost` - Quote declined or opportunity lost ❌

## � Pricing Engine

**Base Calculation:** Package price × Number of travelers

**Dynamic Adjustments:**
- **Seasonal:** +20% peak (Jun/Jul/Dec), -15% off-season
- **Early Bird:** -10% when booking 60+ days ahead
- **Last Minute:** +15% when booking <14 days ahead
- **Group:** -5% (5-9 travelers), -8% (10-14), -10% (15+)
- **Weekend:** +8% for Friday-Sunday events

**Example:**
```
Base: ₹122,500 × 6 travelers = ₹735,000
+ Seasonal (High): +₹147,000 (+20%)
- Early Bird: -₹73,500 (-10%)
- Group (6 ppl): -₹58,800 (-8%)
+ Weekend: +₹58,800 (+8%)
────────────────────────────────
Final Price: ₹808,500
```

## 🌐 API Endpoints

```
Health
GET    /api/health

Events
GET    /api/events
GET    /api/events/:id

Leads
POST   /api/leads
GET    /api/leads
GET    /api/leads/actionable      # New/contacted only
GET    /api/leads/:id
PATCH  /api/leads/:id/status
DELETE /api/leads/:id

Quotes
POST   /api/quotes/generate
POST   /api/quotes/:id/send-email
GET    /api/quotes/:id/accept     # Email link
GET    /api/quotes/:id/decline    # Email link

Email Verification
POST   /api/email-verification/send
GET    /api/email-verification/verify/:token
```

## 🎨 Key Components

**Frontend:**
- `LeadForm` - Multi-step inquiry form with package selection
- `QuoteGeneration` - Admin quote builder with auto-fill
- `DashboardOverview` - Stats cards and recent activity
- `LeadsManagement` - Filterable leads table with status updates

**Backend:**
- `pricing.service.js` - Dynamic pricing calculations
- `leadWorkflow.service.js` - Status validation & history tracking
- `quoteEmail.service.js` - HTML email generation
- `error.middleware.js` - Centralized error handling

## 📦 Deployment

**Recommended Stack:**
- Backend: Vercel (configured via `vercel.json`)
- Frontend: Vercel/Netlify
- Database: MongoDB Atlas (free tier available)
- Email: Gmail SMTP with App Password

**Build Commands:**
```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm run build
```

## � Documentation

Detailed setup and API documentation:
- [Backend README](./backend/README.md) - API specs, models, services
- [Frontend README](./frontend/README.md) - Components, hooks, routing

## � Security Notes

- Email verification required for lead confirmation
- Token-based verification with expiration (24 hours)
- Input validation on all endpoints
- CORS configured for frontend domain
- Status transition validation prevents invalid workflows

## 🛠️ Development Tips

```bash
# Reset database with fresh seed data
cd backend && npm run seed

# Check API health
curl http://localhost:8080/api/health

# View all events
curl http://localhost:8080/api/events
```

## 📄 License

MIT License - feel free to use for commercial projects

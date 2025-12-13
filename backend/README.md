# 🔧 Backend API - Sports Travel Platform

RESTful API built with Node.js, Express, and MongoDB following MVC architecture with business logic services.

## 🏗️ Architecture

```
backend/
├── config/                           # Configuration & constants
│   ├── constants.js                  # Lead status, transitions, validation rules
│   └── db.js                        # MongoDB connection setup
├── controllers/                      # Request handlers
│   ├── health.controller.js         # Health check endpoint
│   ├── event.controller.js          # Event & package operations
│   ├── lead.controller.js           # Lead CRUD & status management
│   ├── quote.controller.js          # Quote generation & email sending
│   └── emailVerification.controller.js  # Email verification flow
├── models/                          # Mongoose schemas
│   ├── event.model.js               # Event schema
│   ├── package.model.js             # Package schema with pricing
│   ├── lead.model.js                # Lead schema with status workflow
│   ├── quote.model.js               # Quote schema with adjustments
│   ├── leadStatusHistory.model.js   # Audit trail for status changes
│   └── emailVerification.model.js   # Email verification tokens
├── routes/                          # API endpoint definitions
│   ├── health.routes.js             # Health check route
│   ├── event.routes.js              # Event routes
│   ├── lead.routes.js               # Lead routes
│   ├── quote.routes.js              # Quote routes
│   └── emailVerification.routes.js  # Email verification routes
├── services/                        # Business logic layer
│   ├── pricing.service.js           # Dynamic pricing calculations
│   ├── leadWorkflow.service.js      # Status validation & history tracking
│   └── quoteEmail.service.js        # Email template generation
├── middlewares/                     # Express middlewares
│   ├── error.middleware.js          # Global error handler
│   ├── logger.middleware.js         # Request/response logging
│   └── rateLimiter.middleware.js    # Rate limiting for emails
├── utils/                           # Helper functions
│   ├── response.js                  # Standardized API responses
│   └── dateHelpers.js               # Date manipulation utilities
├── scripts/                         # Database management
│   └── seed.js                      # Sample data seeding
├── server.js                        # Express app entry point
├── vercel.json                      # Vercel deployment config
└── package.json                     # Dependencies & scripts
```

## 📦 Installation

```bash
npm install
```

## ⚙️ Environment Variables

Create `.env` file in backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/sports-travel

# Server
PORT=8080
NODE_ENV=development

# SMTP Configuration (Gmail recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8080
```

**Gmail SMTP Setup:**
1. Enable 2-Step Verification in Google Account
2. Generate App Password (Account → Security → App Passwords)
3. Use App Password as `SMTP_PASS`

## 🚀 Scripts

```bash
# Development with auto-reload
npm run dev

# Production
npm start

# Seed database with sample data
npm run seed
```

## 🌐 API Endpoints

### Health Check
```
GET /api/health
Response: { status: "OK", timestamp, uptime }
```

### Events
```
GET    /api/events              # List all active events with packages
GET    /api/events/:id          # Get single event with packages
```

### Leads
```
POST   /api/leads               # Create new lead (requires email verification)
GET    /api/leads               # Get all leads (paginated)
GET    /api/leads/actionable    # Get new & contacted leads only
GET    /api/leads/:id           # Get lead by ID with populated refs
PATCH  /api/leads/:id/status    # Update lead status (validates transitions)
DELETE /api/leads/:id           # Delete lead
```

**Lead Status Workflow:**
```
new → contacted → quote_sent → qualified → converted
                                        ↓
                                      lost
```

### Quotes
```
POST   /api/quotes/generate                # Generate quote with pricing
POST   /api/quotes/:id/send-email          # Send quote email to customer
GET    /api/quotes/:id/accept              # Accept quote (email link)
GET    /api/quotes/:id/decline             # Decline quote (email link)
```

**Generate Quote Request:**
```json
{
  "leadId": "507f1f77bcf86cd799439011",
  "packageId": "507f191e810c19729de860ea",
  "travelers": 6,
  "travelDate": "2026-06-06"
}
```

**Generate Quote Response:**
```json
{
  "success": true,
  "data": {
    "_id": "quote-id",
    "basePrice": 735000,
    "finalPrice": 808500,
    "travelers": 6,
    "pricingBreakdown": {
      "basePrice": 735000,
      "pricePerPerson": 122500,
      "numberOfTravellers": 6,
      "adjustments": {
        "seasonal": {
          "amount": 147000,
          "percentage": 20,
          "reason": "High Season (Jun/Jul/Dec)"
        },
        "earlyBird": {
          "amount": -73500,
          "percentage": -10,
          "reason": "Early Bird (175 days ahead)"
        },
        "group": {
          "amount": -58800,
          "percentage": -8,
          "reason": "Group Discount (6 travellers)"
        },
        "weekend": {
          "amount": 58800,
          "percentage": 8,
          "reason": "Weekend Event"
        }
      },
      "totalAdjustments": 73500,
      "finalPrice": 808500
    }
  }
}
```

### Email Verification
```
POST   /api/email-verification/send              # Send verification email
GET    /api/email-verification/verify/:token     # Verify email token
```

## 📊 Data Models

### Event
```javascript
{
  name: String,
  description: String,
  location: String,
  startDate: Date,
  endDate: Date,
  image: String,
  featured: Boolean,
  active: Boolean,
  packages: [PackageId]  // populated
}
```

### Package
```javascript
{
  event: EventId,
  name: String,
  description: String,
  basePrice: Number,
  inclusions: [String],
  image: String,
  active: Boolean
}
```

### Lead
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  message: String,
  event: EventId,
  package: PackageId,
  numberOfTravellers: Number,
  preferredDate: Date,
  status: String (enum: new, contacted, quote_sent, qualified, converted, lost),
  emailVerified: Boolean
}
```

### Quote
```javascript
{
  lead: LeadId,
  package: PackageId,
  event: EventId,
  numberOfTravellers: Number,
  eventDate: Date,
  basePrice: Number,
  adjustments: {
    seasonal: Number,
    earlyBird: Number,
    lastMinute: Number,
    group: Number,
    weekend: Number
  },
  finalPrice: Number,
  validUntil: Date,
  emailSent: Boolean,
  userResponse: String (enum: pending, accepted, declined)
}
```

### Lead Status History
```javascript
{
  lead: LeadId,
  previousStatus: String,
  newStatus: String,
  changedBy: String,
  reason: String,
  timestamp: Date
}
```

## 🧮 Pricing Service

**Pricing Rules** (`services/pricing.service.js`):

```javascript
calculateQuotePrice(basePrice, travelers, travelDate)
```

**Adjustments Applied:**
1. **Seasonal** (month-based)
   - Peak Season (Jun/Jul/Dec): +20%
   - Off Season (Feb/Mar/Aug/Sep): -15%
   - Regular Season: No change

2. **Early Bird** (days ahead)
   - 60+ days: -10%
   - Otherwise: No discount

3. **Last Minute** (days ahead)
   - <14 days: +15%
   - Otherwise: No surcharge

4. **Group Size**
   - 5-9 travelers: -5%
   - 10-14 travelers: -8%
   - 15+ travelers: -10%

5. **Weekend** (travel date)
   - Friday/Saturday/Sunday: +8%
   - Otherwise: No surcharge

**Calculation Order:**
```
Base Price = Package Price × Travelers
Adjusted Price = Base × (1 + seasonal) × (1 - earlyBird) × (1 + lastMinute) × (1 - group) × (1 + weekend)
```

## 🔄 Lead Workflow Service

**Status Transitions** (`services/leadWorkflow.service.js`):

Valid transitions defined in `config/constants.js`:
```javascript
VALID_STATUS_TRANSITIONS = {
  new: ['contacted', 'lost'],
  contacted: ['quote_sent', 'lost'],
  quote_sent: ['qualified', 'converted', 'lost'],
  qualified: ['converted', 'lost'],
  converted: [],  // Terminal state
  lost: []        // Terminal state
}
```

**Functions:**
- `validateStatusTransition(currentStatus, newStatus)` - Validates if transition is allowed
- `createStatusHistory(leadId, oldStatus, newStatus, changedBy, reason)` - Creates audit trail

## � Email Service

**Quote Email** (`services/quoteEmail.service.js`):

Professional HTML email template with:
- Event details (name, location, date, travelers)
- Complete price breakdown with all adjustments
- Accept/Decline buttons (direct API links)
- Quote validity period
- Responsive design (mobile-friendly)

**Verification Email:**
- Token-based verification (24-hour expiry)
- Secure token generation
- Single-use tokens

## �️ Tech Stack

- **Runtime:** Node.js 16+ (ES Modules)
- **Framework:** Express.js 4.18
- **Database:** MongoDB 6.0 with Mongoose 8.0
- **Email:** Nodemailer 6.9
- **Date Utils:** date-fns 3.0
- **Dev Tools:** Nodemon

## 🔐 Security Features

- Input validation on all endpoints
- Email verification before lead processing
- Token expiration (24 hours)
- Status transition validation (prevents invalid workflows)
- Error handling middleware (no stack traces in production)
- CORS configuration
- Rate limiting on verification emails (1 per hour)

## 🧪 Testing

```bash
# Health check
curl http://localhost:8080/api/health

# Get all events
curl http://localhost:8080/api/events

# Create lead (requires verification)
curl -X POST http://localhost:8080/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"1234567890"}'

# Generate quote
curl -X POST http://localhost:8080/api/quotes/generate \
  -H "Content-Type: application/json" \
  -d '{"leadId":"...","packageId":"...","travelers":2,"travelDate":"2026-01-15"}'
```

## 🚀 Deployment

**Vercel Deployment** (configured via `vercel.json`):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod
```

**Environment Variables on Vercel:**
- Set all `.env` variables in Vercel dashboard
- Use MongoDB Atlas for production database
- Configure SMTP credentials

**MongoDB Atlas Setup:**
1. Create free cluster
2. Add database user
3. Whitelist IP (0.0.0.0/0 for Vercel)
4. Get connection string → `MONGODB_URI`

## 📝 Development Notes

**MVC Flow:**
```
Request → Route → Controller → Service → Model → Response
                     ↓
              Middleware (logging, errors)
```

**Error Handling:**
- Validation errors → 400 with field details
- Not found → 404 with resource type
- Server errors → 500 (stack trace only in dev mode)

**Database Seeding:**
- Clears existing data
- Creates 3 events (NBA Finals, Super Bowl, Wimbledon)
- 3 packages per event (Standard, Premium, VIP)
- No sample leads (clean slate)

## 📄 License

MIT License

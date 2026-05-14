# CineEvent

Premium cinema event platform with AI-assisted venue design, AI movie/event recommendations, Stripe-powered guest checkout, and full organizer/admin workflows.

## Highlights

- AI venue layout generation from natural language prompts (Ollama `qwen2.5:3b`).
- CineMate AI chat recommends real events from the catalog and can filter by budget.
- Role-based system for spectators, organizers, and admins.
- Organizer event submission, admin validation, and public event listing.
- Guest reservations with Stripe payment, QR ticket emails, and confirmation flow.
- Venue template library with seat zones, accessibility, and structure planning.
- Wallet, revenue, and payout management for organizers.

## Product Overview

**CineEvent** is a full-stack platform that connects spectators, organizers, and admins around premium cinema events (movie screenings or festivals). It combines an event catalog, curated experiences, secure payments, and AI assistance to streamline venue planning and event discovery.

### Core Modules

**AI & Chat**

- **Venue Layout AI**: Generates seat rows, zones, and structures from a text prompt. The response is normalized and validated for rows, zones, and accessibility.
- **CineMate AI Chat**: Conversational assistant that recommends **only** events that exist in the database, with optional budget awareness.

**Event Lifecycle**

- Organizers submit events with movie/festival details, pricing, venue snapshots, and media.
- Admins validate and publish events to the public catalog.
- Spectators browse, wishlist, and reserve seats.

**Payments & Tickets**

- Stripe-based guest checkout flow with payment intents.
- Confirmation page plus ticket email (QR code included).

**Venue Templates**

- Create and manage venue templates with seating zones, wheelchair seats, and layout structures.
- Published templates are available for organizers.

## Tech Stack

- **Frontend**: React 18 + Vite, Redux Toolkit, React Router
- **Backend**: Node.js + Express, MongoDB (Mongoose)
- **AI**: Ollama local model (`qwen2.5:3b`)
- **Payments**: Stripe
- **Auth**: JWT + optional Google Sign-In (Firebase Admin)
- **Email**: SMTP (Nodemailer) + QR code tickets

## Project Structure

```
backend/   Node.js API, AI, payments, auth, uploads
frontend/  React app, admin/organizer/spectator UI
```

## Local Development

### Prerequisites

- Node.js 18+
- MongoDB instance
- Stripe API keys (test mode for local)
- SMTP credentials (optional, for emails)
- Ollama running locally (optional, for AI)

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:5000`.

## Environment Variables

Create `.env` files for both `backend/` and `frontend/`.

### Backend (.env)

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/cineevent
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5174

STRIPE_SECRET_KEY=sk_test_...

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_pass
SMTP_FROM=no-reply@cineevent.com

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_SERVICE_ACCOUNT=...json...
# or
FIREBASE_SERVICE_ACCOUNT_BASE64=...base64...
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...

VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## AI Features

### Venue Layout Generation

Endpoint: `POST /api/ai/generate-layout`

Request body:

```json
{
  "prompt": "Generate 10 rows, 16 seats per row, VIP on rows 1-2, premium 3-6..."
}
```

Notes:

- Uses Ollama at `http://127.0.0.1:11434` with model `qwen2.5:3b`.
- Returns a validated layout: rows, zones, wheelchair seats, structures.

### CineMate Event Recommendations

Endpoint: `POST /api/ai/movie-recommendations`

Request body:

```json
{
  "userInput": "I want something romantic under 20 TND",
  "conversationHistory": []
}
```

Response:

- Conversational response
- Array of recommended events from the real database

## API Surface (Backend)

Base URL: `/api`

- **Auth**: `/auth` (email, Google, password reset, profile)
- **Movies**: `/movies` (admin CRUD)
- **Events**: `/events` (public listing + organizer/admin actions)
- **Reservations**: `/reservations` (auth + guest checkout)
- **Venue Templates**: `/venue-templates` (admin CRUD + published list)
- **AI**: `/ai` (layout generator + recommendations)
- **Wishlist**: `/wishlist` (spectator favorites)
- **Wallets**: `/wallets` (organizer balance + admin payouts)

## Roles & Workflows

**Spectators**

- Browse events, view details, and manage wishlists
- Reserve seats (authenticated or guest)

**Organizers**

- Submit events, add media, and define pricing
- Track reservations and revenue
- Access published venue templates

**Admins**

- Validate organizers and events
- Manage users, templates, and payouts
- Monitor revenue and platform activity

## Payments (Stripe)

Guest checkout uses Stripe Payment Intents:

- `POST /api/reservations/payment/intent`
- `POST /api/reservations/guest/confirm`

See [STRIPE_INTEGRATION_GUIDE.md](STRIPE_INTEGRATION_GUIDE.md) for full details.

## Email Notifications

- Password reset emails
- Organizer approval or rejection emails
- Ticket confirmation emails with QR code

## Scripts

**Backend**

```bash
npm run dev
npm start
```

**Frontend**

```bash
npm run dev
npm run build
npm run preview
```

## Notes

- Uploads are stored under [backend/uploads](backend/uploads) (event posters, legal docs).
- Rate limiting is enabled on `/api` and auth routes.
- Stripe charges use USD for processing, while UI displays TND.

## Roadmap Ideas

- Webhooks for Stripe payment status updates
- Richer AI summaries and personalization
- Advanced analytics dashboards for organizers and admins

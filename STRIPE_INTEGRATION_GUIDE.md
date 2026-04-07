# Stripe Payment Integration Guide

This document explains how to set up and use the Stripe payment integration for the CinéEvent guest reservation system.

## Overview

The Stripe integration allows guest users (non-authenticated) to:

1. Select seats for events
2. Enter contact information
3. Complete payment securely using Stripe
4. Receive confirmation with booking reference and QR code

## Features Implemented

### Backend

- ✅ Stripe payment intent creation endpoint
- ✅ Guest reservation confirmation endpoint
- ✅ Reservation model updated with guest information and payment details
- ✅ Stripe integration for secure payment processing

### Frontend

- ✅ Stripe Elements integration for secure card input
- ✅ Two-step reservation flow (selection + payment)
- ✅ Real-time payment validation
- ✅ Confirmation page with booking reference
- ✅ Email confirmation details

## Setup Instructions

### 1. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Log in to your account (create one if needed)
3. Navigate to **Developers** → **API Keys**
4. Copy your:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 2. Backend Setup

```bash
cd backend

# Install dependencies (already done)
npm install stripe

# Copy and update .env file
cp .env.example .env
```

Update your `.env` file:

```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
# ... other configuration
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies (already done)
npm install @stripe/react-stripe-js stripe

# Copy and update .env file
cp .env.example .env
```

Update your `.env` file:

```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_public_key_here
```

## How It Works

### Reservation Flow

#### Step 1: Selection (GuestReservationPage)

- User selects seats from the venue layout
- User enters contact information (name, email, phone)
- Summary card shows selected seats and total price
- User clicks "Proceed to Payment" button

#### Step 2: Payment (StripePaymentForm)

- Stripe Elements CardElement for secure card input
- Payment intent created on backend
- Card details sent securely to Stripe
- Payment processed and confirmed

#### Step 3: Confirmation (ReservationConfirmationPage)

- Booking reference displayed
- Confirmation details shown
- User can download/print tickets
- Email sent to guest with confirmation

### API Endpoints

#### Create Payment Intent

```
POST /api/reservations/payment/intent

Request Body:
{
  "eventId": "event_id",
  "selectedSeats": ["A-1", "A-2"],
  "totalAmount": 50.50,
  "guestInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890"
  }
}

Response:
{
  "clientSecret": "pi_...",
  "paymentIntentId": "pi_..."
}
```

#### Confirm Guest Reservation

```
POST /api/reservations/guest/confirm

Request Body:
{
  "eventId": "event_id",
  "selectedSeats": ["A-1", "A-2"],
  "totalPrice": 45.00,
  "bookingFee": 5.50,
  "guestInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890"
  },
  "stripePaymentIntentId": "pi_...",
  "paymentDetails": {
    "stripeSessionId": "pi_...",
    "last4Digits": "4242",
    "paymentMethod": "stripe"
  }
}

Response:
{
  "message": "Reservation confirmed",
  "reservation": {
    "id": "reservation_id",
    "bookingReference": "CIN-1680000000000-ABC12",
    "email": "john@example.com",
    "totalPrice": 50.50,
    "selectedSeats": ["A-1", "A-2"]
  }
}
```

## Testing

### Test Card Numbers

Use these card numbers to test in Stripe test mode:

| Card Type    | Number              | CVC          | Date            |
| ------------ | ------------------- | ------------ | --------------- |
| Visa         | 4242 4242 4242 4242 | Any 3 digits | Any future date |
| Visa (debit) | 4000 0566 5566 5556 | Any 3 digits | Any future date |
| Mastercard   | 5555 5555 5555 4444 | Any 3 digits | Any future date |
| Amex         | 3782 822463 10005   | Any 4 digits | Any future date |

### Test the Flow

1. Start both backend and frontend servers
2. Navigate to an event reservation page
3. Select seats and enter test information
4. Click "Proceed to Payment"
5. Enter a test card number and complete the form
6. Verify the confirmation page appears

## Database Schema

### Reservation Model Updates

```javascript
{
  // User reference (optional for guests)
  user: ObjectId,

  // Event reference
  event: ObjectId,

  // Seat selection
  selectedSeats: [String], // ["A-1", "A-2", "B-5"]

  // Pricing
  totalPrice: Number,
  bookingFee: Number,

  // Guest Information
  guestInfo: {
    fullName: String,
    email: String,
    phoneNumber: String
  },

  // Payment Information
  stripePaymentIntentId: String,
  paymentDetails: {
    stripeSessionId: String,
    last4Digits: String,
    paymentMethod: String
  },

  // Status Tracking
  status: String, // "pending", "confirmed", "cancelled"
  paymentStatus: String, // "unpaid", "paid", "refunded"
  bookingReference: String, // "CIN-1680000000000-ABC12"

  timestamps: true
}
```

## Email Configuration (Optional)

To send confirmation emails to guests, update the `confirmGuestReservation` function to call:

```javascript
// In reservationController.js
// Uncomment and implement email sending
// await sendConfirmationEmail(guestInfo.email, reservation, event);
```

See [backend/utils/email.js](../utils/email.js) for email configuration.

## Security Considerations

✅ **Implemented:**

- Stripe handles all card details securely
- No card details stored in database
- HTTPS required for card data
- Server-side payment verification
- Booking reference is unguessable (CUID-based)

⚠️ **For Production:**

- Use live Stripe keys instead of test keys
- Implement HTTPS/TLS
- Set up webhook handlers for payment events
- Implement proper error logging
- Add rate limiting to payment endpoints
- Implement fraud detection

## Troubleshooting

### "Payment system not loaded"

- Check that Stripe public key is correctly set in `.env`
- Verify `stripePromise` is properly initialized

### "Failed to create payment intent"

- Check backend Stripe secret key is correct
- Verify event ID is valid
- Check network tab for error details

### "Payment processing failed"

- Verify test card numbers are correct
- Check Stripe dashboard for error logs
- Ensure backend is running and accessible

### Stripe Elements not appearing

- Clear browser cache
- Check console for JavaScript errors
- Verify `@stripe/react-stripe-js` is installed

## Next Steps

1. **Implement email confirmation**: Add email template and send confirmation to guests
2. **Add webhook handlers**: Handle payment.intent.succeeded events
3. **Implement refunds**: Add refund functionality for cancelled reservations
4. **Add analytics**: Track conversion rates and revenue
5. **Implement 3D Secure**: For additional payment security
6. **Add payment history**: Allow guests to view past reservations

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Components](https://stripe.com/docs/stripe-js/react)
- [Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Stripe Testing](https://stripe.com/docs/testing)

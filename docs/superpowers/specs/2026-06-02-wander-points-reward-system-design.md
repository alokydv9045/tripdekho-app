# Wander Points Referral & Reward System

This document outlines the architecture and design for the Wander Points referral and reward system in TripDekho.

## Core Rules
- **Currency**: Wander Points
- **Value**: 1 Wander Point = ₹1 INR
- **Initial Rewards**: 
  - New referred user gets 50 Wander Points (₹50) upon signing up.
  - The referrer gets 100 Wander Points (₹100) when the new user signs up.
- **Ongoing Rewards**: Referrers can earn additional points based on activity milestones of the referred user (e.g. completing a 3rd booking, leaving a review).

## Architecture Approach
The system uses an **Event-Driven Reward Engine** built on top of the existing CQRS + `EventEmitter2` architecture. 
- Business logic (auth, bookings) remains clean and simply emits events (`user.registered`, `booking.completed`).
- A new listener (`rewards.listener.ts`) catches these events, evaluates rules stored in the database (`reward_rules`), and credits points to the `loyalty_points` ledger.

## Database Schema Additions

1. **`referral_codes`**: Unique alphanumeric code for each user (e.g., `ANKUR7X3K`), generated automatically on signup.
2. **`referrals`**: Maps a `referrerId` to a `referredUserId` when someone signs up using a code.
3. **`loyalty_points`**: Holds the current balance and lifetime earned/redeemed points for a user.
4. **`point_transactions`**: A double-entry style ledger tracking every single credit/debit of Wander Points, including `referenceId` for idempotency.
5. **`reward_rules`**: Admin-configurable triggers (e.g., event: `referral_signup`, points: `100`, userType: `customer`).
6. **`reward_redemptions`**: Tracks when a user applies their points to a booking for a discount.

## Application Modules

### Backend
- **Referrals Module**: API endpoints for validating a referral code and fetching personal referral stats.
- **Rewards Module**: API endpoints for fetching point balances, transaction history, and redeeming points.
- **Admin Module Extensions**: Admin APIs for configuring reward rules, manually adjusting points, and viewing platform-wide referral graphs.

### Frontend
- **Signup Flow**: Adds a "Referral Code (Optional)" field.
- **Profile Dashboard**: New section displaying the user's Wander Points balance, their personal referral code, and a history of transactions.
- **Checkout Flow**: Allows users to apply their Wander Points directly against the booking total at checkout.

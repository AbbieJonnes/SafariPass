# SafariPass

Digital Commuter Subscription and Fare Validation Platform

## Overview

SafariPass is a full-stack platform that allows commuters to subscribe to weekly or monthly transport plans on a specific route, pay via M-Pesa, and validate their rides through a QR pass scanned by conductors. Fares are managed centrally by transport companies and can change over time without affecting historical pricing for existing subscribers.

## Tech Stack

### Backend
- Django
- Django REST Framework
- PostgreSQL
- Celery and Celery Beat (scheduled background tasks)
- Redis (via Memurai for local Windows development)
- Brevo (transactional email delivery)
- Safaricom Daraja API (M-Pesa integration)

### Frontend
- React (Vite)

### Deployment
- Render (web service and PostgreSQL database)

## Core Features

### Authentication
Token-based authentication supporting registration, login, logout, password change, and password reset.

### Role-Based Access Control
Four user roles: Super Admin, Company Admin, Conductor, and Passenger. Each role has distinct permissions enforced at the API level.

### Company and Route Management
Super Admins create transport companies. Company Admins manage routes, fares, and subscription plan types for their company.

### Fare Management with Historical Pricing
Fares can be updated at any time. Previous fares are automatically preserved with an effective date range, so existing subscribers are not affected by price changes made after they subscribed.

### Subscriptions
Passengers subscribe to a route and plan type. Subscription price, expiry date, and a unique QR code token are calculated automatically at the point of subscription.

### Conductor Validation
Conductors scan a passenger's QR code. The system automatically determines whether the pass is active, expired, or invalid based on subscription dates and plan type rules, without manual input.

### Unused-Day Rollover
A scheduled daily task checks whether a passenger boarded on a given day. If not, their subscription expiry date is automatically extended by one day.

### Temporary Route Shifting
Passengers can temporarily shift their subscription to a different route for a specified duration. The shift automatically reverts once the duration ends.

### Fare Change Notifications
When a fare is updated, passengers and conductors associated with that company are automatically notified by email.

### Analytics
Endpoints providing revenue totals, active subscription counts, route popularity, and boarding validation statistics.

### Payments
Integration with the Safaricom Daraja API for M-Pesa STK Push payments, including callback handling to confirm payment status.

## Project Structure
SafariPass/
backend/
accounts/
companies/
subscriptions/
payments/
analytics/
config/
frontend/


## Local Setup

### Backend

1. Create and activate a virtual environment
2. Install dependencies: `pip install -r requirements.txt`
3. Create a `.env` file in the `backend` directory with the required environment variables (database credentials, Brevo credentials, M-Pesa credentials)
4. Run migrations: `python manage.py migrate`
5. Start the development server: `python manage.py runserver`

### Background Tasks

Two additional processes are required for scheduled tasks:

celery -A config worker --loglevel=info --pool=solo
celery -A config beat --loglevel=info


A Redis-compatible service (such as Memurai on Windows) must be running for Celery to function.

### Frontend

1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Deployment

The backend is deployed on Render as a web service connected to a Render-managed PostgreSQL database. Environment variables are configured directly in the Render dashboard.

## API Overview

The API is organized by app, with authentication required for all endpoints except registration, login, password reset, and the M-Pesa callback endpoint.

- `/api/accounts/` — user accounts, registration, login, logout, password management
- `/api/companies/` — companies, routes, fares, plan types
- `/api/subscriptions/` — subscriptions and route shifts
- `/api/payments/` — payments, M-Pesa integration, conductor validations
- `/api/analytics/` — revenue, active subscriptions, route popularity, boarding validation statistics

## Author

Abigael Mwangi

GitHub: AbbieJonnes

Email: abigaelmwangi534@gmail.com
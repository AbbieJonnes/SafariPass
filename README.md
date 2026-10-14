# SafariPass

### Smart Transport Payment and Passenger Management System

**SafariPass** is a full-stack web application designed to modernize public transport payments and improve the passenger journey through digital subscriptions, route discovery, payment management, and QR-code-based ticket validation.

The platform connects passengers, conductors, transport companies, and system administrators through a centralized digital transport management system.

Built with **React, Django REST Framework, and PostgreSQL**, SafariPass demonstrates full-stack development, REST API integration, authentication, role-based access control, payment workflow design, and cloud deployment.

**Live Application:** [SafariPass](https://safari-pass.vercel.app/)

**Backend API:** [SafariPass API](https://safaripass-mwts.onrender.com/api)

**GitHub Repository:** [AbbieJonnes/SafariPass](https://github.com/AbbieJonnes/SafariPass)

---

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [System Workflow](#system-workflow)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Authentication and Security](#authentication-and-security)
- [Background Tasks and Notifications](#background-tasks-and-notifications)
- [Payment Integration](#payment-integration)
- [Deployment](#deployment)
- [Testing and Quality Assurance](#testing-and-quality-assurance)
- [Challenges and Engineering Considerations](#challenges-and-engineering-considerations)
- [Future Improvements](#future-improvements)
- [What This Project Demonstrates](#what-this-project-demonstrates)
- [Author](#author)
- [License](#license)

---

## Overview

Public transport systems often depend on manual payment processes, physical tickets, and fragmented passenger management procedures. These approaches can make it difficult for passengers to manage their travel plans and for transport operators to monitor daily operations.

SafariPass introduces a digital approach to transport payment and passenger management.

The application provides a platform where users can explore transport routes, review available subscription plans, manage their accounts, and access digital transport services. Authorized conductors can validate passenger travel credentials, while transport company administrators and system administrators have access to management functionality appropriate to their roles.

The project combines a modern React frontend with a Django REST Framework backend and a PostgreSQL database to deliver an integrated full-stack application.

## The Problem

Traditional public transport payment and passenger management processes can present several challenges:

- Dependence on manual payment and ticket verification.
- Limited visibility into available routes and transport services.
- Difficulty managing passenger subscriptions and payment records.
- Time-consuming passenger validation procedures.
- Limited access to centralized operational information.
- Challenges maintaining consistent records across transport operations.

These challenges create an opportunity for a centralized digital platform that improves convenience, traceability, and operational efficiency.

## The Solution

SafariPass provides a web-based platform that connects passengers and transport operators through digital workflows.

The system is designed to support:

- Digital passenger registration and authentication.
- Route and transport service discovery.
- Subscription plan management.
- Payment workflow integration.
- QR-code-based passenger validation.
- Role-specific dashboards and access permissions.
- Transport company and system administration.
- Email notifications and automated background tasks.
- Operational information and analytics.

The goal is to make public transport interactions more organized, accessible, and manageable through a single application.

## Key Features

### 1. Authentication and User Management

- User registration and login.
- Token-based authentication.
- Role-based access control.
- Protected application routes.
- Role-specific dashboard redirection.
- User profile management.

### 2. Route Discovery and Transport Management

- Browse available transport routes.
- Access transport service information.
- Organize transport services by company.
- Manage route and fare information.
- Support route-related subscription functionality.

### 3. Subscription Management

- Access available subscription plans.
- Manage passenger subscription information.
- Associate subscriptions with applicable transport services.
- Support subscription-related travel workflows.
- Accommodate route changes within the defined subscription rules.

### 4. Digital Payments

- Payment workflow integration.
- M-Pesa payment integration support.
- Payment record management.
- Association of payments with relevant subscriptions.
- Support for payment status tracking.

Payment confirmation and subscription activation should depend on verified payment results rather than a frontend success message alone.

### 5. QR Code Validation

- Support QR-code-based passenger validation.
- Provide a digital mechanism for checking passenger travel credentials.
- Connect validation workflows to relevant subscription information.
- Support conductor-facing validation functionality.

### 6. Role-Specific Dashboards

Each user role receives access to the functionality relevant to its responsibilities.

### 7. Notifications

- Email communication through Brevo SMTP.
- Support for account-related and application notifications.
- Configurable email delivery through environment variables.

### 8. Background Processing

- Celery for background task execution.
- Redis as a task broker or supporting service where configured.
- Support for scheduled or asynchronous application operations.

### 9. User Experience

- Responsive React interface.
- Dashboard navigation based on user roles.
- Interactive onboarding guidance.
- Passenger dashboard tour.
- Loading and error feedback for application requests.
- Integrated chatbot interface where configured.

## User Roles

SafariPass is designed around four primary user roles.

### Passenger

Passengers use SafariPass to:

- Register and access their accounts.
- Browse transport routes.
- Explore subscription plans.
- Manage subscription information.
- Access payment functionality.
- Present digital credentials for validation.
- View relevant account and travel information.

### Conductor

Conductors use the platform to:

- Access conductor-specific functionality.
- Validate passenger QR codes.
- Check relevant passenger travel credentials.
- Support the digital passenger verification process.

### Company Admin

Company administrators are responsible for transport company operations within their authorized scope.

Their functionality can include:

- Managing company information.
- Managing routes and fares.
- Reviewing relevant subscriptions and payment records.
- Accessing company-level operational information.

### Super Admin

The super administrator oversees the wider application.

Administrative functionality can include:

- Managing system users.
- Overseeing transport companies.
- Managing system-wide configuration.
- Monitoring platform information and activity.

Access to administrative functionality is controlled by the application's authorization rules.

## System Workflow

The core passenger journey follows these steps:

### Step 1: Registration and Authentication

A passenger creates an account or logs in. The frontend communicates with the backend authentication endpoints, and the application establishes the authenticated session using the configured token-based authentication mechanism.

### Step 2: Route Discovery

The passenger accesses the dashboard and explores available transport routes and relevant service information.

### Step 3: Subscription Selection

The passenger reviews available subscription options and selects a plan applicable to their travel needs.

### Step 4: Payment

The passenger proceeds through the supported payment workflow. Where M-Pesa is configured, the backend handles the relevant payment integration and status processing.

### Step 5: Digital Validation

The passenger uses the applicable QR-code-based travel credential, which an authorized conductor can validate through the system.

### Step 6: Management and Monitoring

Authorized company administrators and system administrators access management functionality and relevant operational information.


## Technology Stack

SafariPass combines frontend development, backend engineering, database management, API integration, and deployment technologies.

### Frontend

- **React** — Component-based user interface development.
- **Vite** — Frontend development server and production build tooling.
- **Tailwind CSS v4** — Utility-first styling.
- **React Router** — Client-side routing and navigation.
- **Axios** — HTTP requests and backend API communication.
- **Font Awesome** — Interface icons.
- **React Joyride** — Guided onboarding and dashboard tours.

### Backend

- **Python** — Backend programming language.
- **Django** — Backend web framework.
- **Django REST Framework** — REST API development.
- **Token Authentication** — API authentication.
- **Celery** — Asynchronous background task processing.
- **Redis** — Background task infrastructure where configured.

### Database

- **PostgreSQL** — Relational database management.

### Integrations and Services

- **M-Pesa** — Payment integration.
- **Brevo SMTP** — Email delivery.
- **Render** — Backend deployment.
- **Vercel** — Frontend deployment.
- **Git and GitHub** — Version control and source code hosting.

## System Architecture

SafariPass follows a client-server architecture.

### Frontend Layer

The React application provides the user interface, manages navigation, collects user input, and sends HTTP requests to the backend API.

### Backend Layer

Django REST Framework handles incoming API requests, authentication, authorization, business logic, data validation, and communication with external services.

### Database Layer

PostgreSQL stores the application's structured information, including records associated with users, transport companies, routes, fares, subscriptions, and payments.

### External Services Layer

External services support specific application responsibilities:

- M-Pesa for payment processing.
- Brevo SMTP for email delivery.
- Redis and Celery for background processing.
- A configured chatbot provider for conversational functionality.


## Project Structure

The project is organized into separate frontend and backend applications to keep interface development and server-side responsibilities distinct.

A representative high-level structure is shown below. Individual filenames may differ from the current repository.

```text
SafariPass/
|
|-- backend/
|   |-- manage.py
|   |-- requirements.txt
|   |-- config/
|   |-- apps/
|   |-- tests/
|   |-- .env.example
|   |
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- api/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |-- package.json
|   |-- vite.config.js
|   |
|-- README.md
|-- LICENSE
```

### Frontend Responsibilities

- Rendering application pages and components.
- Managing client-side navigation.
- Handling authentication state.
- Communicating with the backend API.
- Presenting dashboards and user feedback.
- Providing role-specific user experiences.

### Backend Responsibilities

- Exposing REST API endpoints.
- Authenticating users and enforcing permissions.
- Applying business rules.
- Managing database operations.
- Handling payment-related workflows.
- Supporting QR validation and notifications.
- Integrating external services.


## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

Install the following tools before starting:

- Git.
- Python and pip.
- Node.js and npm.
- PostgreSQL.
- A code editor such as Visual Studio Code.

Python, Node.js, and PostgreSQL versions should be compatible with the project's installed dependencies and configuration.

### 1. Clone the Repository

```bash
git clone https://github.com/AbbieJonnes/SafariPass.git
cd SafariPass
```

### 2. Set Up the Backend

Navigate to the backend directory. Adjust the path if the repository uses a different backend folder name.

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows using Command Prompt:

```bash
venv\Scripts\activate
```

Or use Git Bash:

```bash
source venv/Scripts/activate
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure the Backend Environment

Create a `.env` file using the project's environment variable template, if one exists.

Configure the database credentials, Django secret key, allowed hosts, email settings, and other required values.

Do not commit real credentials or secret keys to GitHub.

### 4. Prepare the Database

Create a PostgreSQL database and configure the connection settings in the backend environment.

Run the Django migrations:

```bash
python manage.py migrate
```

Create an administrator account if required:

```bash
python manage.py createsuperuser
```

### 5. Start the Backend Server

```bash
python manage.py runserver
```

The default Django development server runs at:

```text
http://127.0.0.1:8000/
```

The API is available under the API prefix configured by the backend.

### 6. Set Up the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the Node.js dependencies:

```bash
npm install
```

### 7. Configure the Frontend Environment

Create a `.env` file in the frontend directory and set the backend API URL.

For example:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

The variable name must match the one actually used by the frontend API configuration. If the project uses a different variable name or API prefix, retain the existing implementation's configuration.

### 8. Start the Frontend

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

### 9. Build the Frontend for Production

```bash
npm run build
```

Vite generates the production build in the configured output directory, typically `dist/`.


## Environment Variables

SafariPass uses environment variables to separate application configuration from source code.

The following table describes common configuration values. Not every variable is required in every environment, and the exact names must match those referenced by the code.

| Variable | Purpose |
|---|---|
| `SECRET_KEY` | Django cryptographic secret |
| `DEBUG` | Enables or disables Django debug mode |
| `ALLOWED_HOSTS` | Hosts permitted to serve the backend |
| `DATABASE_URL` | PostgreSQL connection URL, if supported |
| `DB_NAME` | PostgreSQL database name, if using separate settings |
| `DB_USER` | PostgreSQL database user |
| `DB_PASSWORD` | PostgreSQL database password |
| `DB_HOST` | PostgreSQL server host |
| `DB_PORT` | PostgreSQL server port |
| `BREVO_EMAIL` | Configured sender email address |
| `BREVO_SMTP_KEY` | Brevo SMTP credential |
| `VITE_API_URL` | Frontend API base URL, if used by the application |
| `REDIS_URL` | Redis connection URL, if required by the deployment |

### Brevo SMTP Configuration

The application uses the following SMTP configuration where enabled:

```text
SMTP Host: smtp-relay.brevo.com
SMTP Port: 587
TLS: Enabled
```

The sender address and SMTP credential should be supplied through environment variables.

**Security note:** Never publish database passwords, Django secret keys, SMTP credentials, M-Pesa credentials, access tokens, or other private configuration values in the README or source repository.

## API Overview

The backend exposes REST API endpoints consumed by the React frontend.

The production API base URL is:

[https://safaripass-mwts.onrender.com/api](https://safaripass-mwts.onrender.com/api)

### API Responsibilities

| API Area | Responsibility |
|---|---|
| Authentication | Registration, login, and authentication-related operations |
| Users | User profiles and account information |
| Companies | Transport company management |
| Routes | Route information and management |
| Fares | Transport fare information |
| Subscriptions | Subscription creation and management |
| Payments | Payment initiation, status, and record management |
| QR Validation | Passenger travel credential verification |
| Administration | Role-specific management operations |
| Analytics | Relevant operational information |


## Authentication and Security

Security is an important consideration in a platform that handles user accounts, payment-related records, and transport access credentials.

SafariPass incorporates or is designed to support the following security practices:

- Token-based authentication for API requests.
- Role-based authorization.
- Protected frontend routes.
- Backend permission checks.
- Server-side data validation.
- Environment-based secret management.
- Secure communication with external services.
- Separation of frontend and backend responsibilities.

Frontend route protection improves navigation and user experience, but it is not a substitute for backend authorization. Sensitive operations must be protected by server-side permissions.

Payment and QR-validation workflows should also verify relevant records and authorization on the backend rather than relying solely on client-side values.

In production, the application should use HTTPS, secure environment variables, appropriate database access controls, and debug settings suitable for deployment.

### Celery and Redis

Celery supports background task execution, while Redis can serve as the task broker or supporting infrastructure.

This architecture allows tasks to be processed outside the main request-response cycle when appropriate.

### Brevo SMTP

Brevo SMTP provides email delivery for configured application notifications.

Email functionality depends on valid environment variables, correct sender configuration, network availability, and the provider's delivery requirements.

## Payment Integration

SafariPass incorporates an M-Pesa-oriented payment workflow for transport subscriptions and related payment records.

The payment integration generally follows this process:

1. A passenger initiates a payment.
2. The backend validates the request.
3. The payment provider processes the transaction.
4. The backend verifies the provider's response or callback.
5. The application updates the payment status.
6. Relevant subscription functionality is enabled only after the required payment confirmation.

The exact flow depends on the configured M-Pesa integration.

## Deployment

SafariPass separates frontend and backend deployment.

### Frontend Deployment

The frontend is deployed on Vercel.

Live application:

[https://safari-pass.vercel.app/](https://safari-pass.vercel.app/)

Frontend deployment involves configuring the production API URL, installing dependencies, generating the production build, and ensuring that client-side routes work correctly.

### Backend Deployment

The backend is deployed on Render.

Backend API:

[https://safaripass-mwts.onrender.com/api](https://safaripass-mwts.onrender.com/api)

Backend deployment requires suitable Python dependencies, environment variables, database connectivity, migration management, and production server configuration.

### Database Deployment

PostgreSQL provides persistent relational data storage. The production database connection must be configured securely through the backend's environment settings.

### Deployment Considerations

- Configure production environment variables.
- Disable Django debug mode in production.
- Restrict allowed hosts appropriately.
- Use HTTPS for application traffic.
- Protect database and email credentials.
- Apply database migrations during deployment.
- Configure CORS for the intended frontend origin.
- Verify external service configuration.
- Test the production API and frontend integration.

## Testing and Quality Assurance

Testing is essential for maintaining application reliability.

Important areas for testing include:

### Authentication

- Successful registration and login.
- Invalid credentials.
- Missing or invalid authentication tokens.
- Access restrictions for protected endpoints.

### Authorization

- Passenger access restrictions.
- Conductor-specific permissions.
- Company administrator permissions.
- Super administrator permissions.

### Subscription and Payment Workflows

- Valid and invalid subscription requests.
- Payment initiation and failure handling.
- Payment status updates.
- Duplicate payment callbacks.
- Subscription activation after verified payment.

### QR Validation

- Valid passenger credentials.
- Invalid or malformed QR data.
- Unauthorized validation requests.
- Expired, inactive, or otherwise ineligible subscriptions where applicable.

### Frontend

- Form validation.
- Navigation and dashboard redirection.
- API loading and error states.
- Responsive layouts.
- Production build verification.

Run the backend's automated tests using:

```bash
python manage.py test
```

Run the frontend production build using:

```bash
npm run build
```

These commands provide starting points for verification. They do not, by themselves, establish that every workflow has automated test coverage.

## Challenges

Building SafariPass involves more than creating individual pages. The application must coordinate several components that depend on each other.

### 1. Frontend and Backend Integration

The React frontend and Django API must agree on request formats, authentication headers, response structures, and error handling.

### 2. Role-Based Access Control

Different users require different permissions. The application must enforce these distinctions consistently across frontend navigation and backend endpoints.

### 3. Payment Reliability

Payment workflows require careful handling of asynchronous responses, failed transactions, and repeated notifications to avoid inconsistent payment records.

### 4. Passenger Validation

QR-based validation must be linked to backend records and checked against the applicable passenger and subscription rules.

### 5. External Service Configuration

Email, payment, chatbot, and background-processing integrations require appropriate credentials, environment settings, and error handling.

### 6. Deployment and Configuration

Deploying the frontend and backend separately requires correct API URLs, CORS settings, database connectivity, and production environment configuration.

These engineering considerations make SafariPass a practical project for exploring how full-stack systems are designed, integrated, and deployed.


## Future Improvements

Potential future enhancements include:

- Expanded transport operator integrations.
- Enhanced passenger journey history.
- More detailed transport company analytics.
- Improved monitoring and operational reporting.
- Additional accessibility improvements.
Future enhancements would depend on user feedback, implementation priorities, and the needs of transport operators and passengers.

## What This Project Demonstrates

- **Frontend development:** Building interactive interfaces with React and Vite.
- **Backend development:** Creating server-side functionality with Django and Django REST Framework.
- **API integration:** Connecting frontend components to REST endpoints.
- **Database management:** Working with PostgreSQL and relational data.
- **Authentication and authorization:** Supporting authenticated requests and role-specific access.
- **Payment workflow design:** Integrating payment-related functionality.
- **QR-based validation:** Supporting digital passenger verification.
- **Third-party integrations:** Configuring services such as Brevo SMTP and other enabled providers.
- **Background processing:** Working with Celery and Redis where configured.
- **Deployment:** Publishing frontend and backend applications to cloud hosting platforms.
- **Version control:** Managing source code using Git and GitHub.
- **System design:** Connecting multiple application components into a cohesive platform.

SafariPass represents an applied full-stack development project focused on solving a practical transport management problem.


## Author

**Abigael Mwangi**

Full-Stack Software Developer

GitHub: [AbbieJonnes](https://github.com/AbbieJonnes)

Project Repository: [SafariPass](https://github.com/AbbieJonnes/SafariPass)

Live Application: [SafariPass](https://safari-pass.vercel.app/)

Backend API: [SafariPass API](https://safaripass-mwts.onrender.com/api)

Email: [abigaelmwangi534@gmail.com](mailto:abigaelmwangi534@gmail.com)


## License

This project is licensed under the MIT License.

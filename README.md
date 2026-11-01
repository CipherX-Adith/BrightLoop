<div align="center">
  <img src="docs/images/brightloop-banner.jpg" alt="BrightLoop subscription and billing platform" width="760" />

  # BrightLoop

  **Subscription management and recurring billing for service businesses.**

  Manage products, plan pricing, subscriptions, invoices, payment verification, and customer billing profiles in one workspace.
</div>

---

## What BrightLoop does

BrightLoop helps a business offer recurring services and manage the billing lifecycle around them.

1. An administrator creates products and their variants or add-ons.
2. Administrators and operations staff configure plan tiers, features, and billing prices.
3. Customers browse products, choose a plan and billing interval, and request a subscription.
4. Operations staff review payment claims and activate subscriptions after verification.
5. The billing service generates invoices for subscriptions when their billing dates arrive. Staff can issue, cancel, print, and record payments against invoices.

A product can have several plan tiers, such as **Starter**, **Professional**, and **Enterprise**. Each tier can have its own weekly, monthly, quarterly, half-yearly, or yearly price options. Optional product variants can add a recurring amount to a selected plan.

## Workspaces

| Role | Main responsibilities |
| --- | --- |
| **Administrator** | Manage the catalog, accounts and roles, staff, billing and tax rules, subscriptions, invoices, and reports. Only administrators can create products. |
| **Operations staff** | Review subscription and payment requests, manage subscriptions and invoices, and add, edit, or archive plan prices. |
| **Customer** | Maintain billing details, browse products and plans, request subscriptions, submit payment claims, and review subscriptions, invoices, and payments. |

## Billing lifecycle

- Recurring invoices are generated from active subscriptions when their next billing date is due.
- A billing period is unique per subscription. Repeated or concurrent billing runs do not create duplicate invoices for that period.
- Invoice line items, discounts, tax rules, totals, billing period, and customer billing information are calculated by the server.
- Generated invoices begin as **Draft**. Authorized staff or administrators can confirm and issue them; verified payments update the invoice to **Paid** when the balance is settled.
- Daily billing runs use the configured business timezone. Administrators can also preview and manually run billing from the invoice workspace.

Invoice confirmation records the issue date and status. The application does not currently send invoice emails automatically; printing is available from the invoice detail view.

## Technology

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **API:** Node.js, Express, Prisma
- **Database:** PostgreSQL (configured for Neon)
- **Authentication:** Firebase Authentication with server-side role checks
- **Money:** Integer paise values stored as PostgreSQL `BIGINT`

## Local development

### Requirements

- Node.js and npm versions compatible with the packages in the lockfiles
- A PostgreSQL database
- Firebase project credentials for authentication

### 1. Install dependencies

From the repository root:

```bash
npm install
npm --prefix frontend install
npm --prefix brightloop-billing/server install
```

### 2. Configure the API

Copy `brightloop-billing/server/.env.example` to `brightloop-billing/server/.env` and set the database and Firebase values. Keep credentials private; do not commit `.env` files.

```env
DATABASE_URL="postgresql://...pooled-connection..."
DATABASE_URL_UNPOOLED="postgresql://...direct-connection..."
PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173
FIREBASE_PROJECT_ID=your-firebase-project-id
BUSINESS_STATE_CODE=KA
BUSINESS_TIMEZONE=Asia/Kolkata
BILLING_WORKER_ENABLED=true
BILLING_RUN_UTC_HOUR=0
BILLING_RUN_UTC_MINUTE=5
```

`BUSINESS_STATE_CODE` is the business location used by tax rules. Set `BILLING_WORKER_ENABLED=false` to pause scheduled runs. The scheduler uses the configured UTC hour and minute, then determines the billing date in `BUSINESS_TIMEZONE`.

### 3. Prepare the database

Generate the Prisma client:

```bash
npm --prefix brightloop-billing/server run prisma:generate
```

The customer profile stores country in `customers.billing_country`. Apply the additive SQL in `brightloop-billing/server/prisma/manual-migrations/20261101_add_customer_billing_country.sql` to the database before using country selection in the profile form.

If you are setting up an empty database, create its schema from `brightloop-billing/server/prisma/schema.prisma` using your normal Prisma deployment process before seeding data.

### 4. Start the application

Run each command in a separate terminal from the repository root:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173). The API defaults to [http://localhost:5000](http://localhost:5000), with versioned routes under `/api/v1`.

To build the frontend for production:

```bash
npm run build
```

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev:frontend` | Start the Vite development server. |
| `npm run dev:backend` | Start the API in watch mode. |
| `npm run build` | Type-check and build the frontend. |
| `npm run lint` | Run frontend ESLint checks. |
| `npm run start:backend` | Start the API server. |
| `npm run seed:demo` | Run the backend demo seed script. |
| `npm --prefix brightloop-billing/server run prisma:validate` | Validate the Prisma schema. |

## API overview

All API routes use the `/api/v1` prefix. Protected routes require a Firebase bearer token; authorization is enforced by the API using the account role.

| Area | Example routes |
| --- | --- |
| Authentication and profile | `POST /auth/signup`, `POST /auth/login`, `GET /me`, `GET /portal`, `PATCH /portal/profile` |
| Catalog | `GET /products`, `POST /products`, `GET /plans`, `POST /plans`, `PATCH /plans/:id` |
| Subscriptions | `GET /subscriptions`, `POST /subscriptions`, `POST /subscriptions/:id/transition` |
| Billing | `POST /billing/preview`, `POST /billing/run`, `GET /invoices`, `POST /invoices/:id/confirm`, `POST /invoices/:id/cancel` |
| Payments | `GET /payment-claims`, `POST /payment-claims`, `POST /payment-claims/:id/verify` |
| Reports | `GET /analytics/dashboard`, `GET /analytics/revenue`, `GET /analytics/overdue` |

## Repository layout

```text
management_system/
├── frontend/                   # React application
│   └── src/
│       ├── components/         # Shared layout and UI components
│       ├── data/               # Location choices for billing profiles
│       ├── pages/              # Customer, staff, and admin workspaces
│       └── services/           # API and Firebase clients
├── brightloop-billing/server/  # Express API and Prisma schema
│   ├── prisma/                 # Database schema and SQL changes
│   └── src/
│       ├── jobs/               # Scheduled billing worker
│       ├── middleware/         # Authentication and authorization
│       └── modules/            # Catalog, billing, payments, and other domains
└── docs/images/                # Project screenshots and brand assets
```

## Screenshots

- [Landing page](docs/images/landing-page.png)
- [Plans and pricing](docs/images/plans-pricing.jpg)
- [Sign-in](docs/images/auth-login.png)
- [Account directory](docs/images/account-directory.png)

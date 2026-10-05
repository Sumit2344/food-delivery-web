# Tomato — Food Delivery

Discover restaurants, browse menus, and order food across multiple Indian cities. Tomato is a JavaScript full-stack demo built with Next.js, React, Express, and MongoDB.

> **Demo data:** The catalogue contains 20 sample restaurants across Hyderabad, Mumbai, Delhi, Bengaluru, Chennai, Pune, Jaipur, and Kolkata. Restaurants, menus, ratings, and seeded reviews are demonstration content—not verified businesses or customer reviews.

## Features

- Search restaurants, cuisines, and dishes; filter listings by city.
- Browse restaurant pages, menus, item details, and sample ratings.
- Sign up and sign in with email and password; passwords are hashed and sessions use signed tokens.
- Place authenticated orders using cash on delivery or a configured UPI intent.
- Save restaurants, write restaurant reviews, follow other registered users, and search for people.
- View order notifications and save account notification preferences.
- Persist data in MongoDB, with a local JSON-file fallback for development.

**Integration notes:** Notification preferences are saved, but push, email, and WhatsApp delivery are not connected. UPI intents require merchant details; payments are not automatically verified. Phone OTP and Google sign-in are not implemented.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | Next.js 15, React 18, React Router |
| API | Node.js, Express |
| Database | MongoDB; local JSON fallback |
| Authentication | Email/password, scrypt password hashing, signed seven-day session tokens |

## Get started

Requirements: Node.js and npm.

```sh
git clone https://github.com/Sumit2344/food-delivery-web.git
cd food-delivery-web
npm install
npm run dev
```

The frontend starts at [http://localhost:4173](http://localhost:4173), and the API starts at [http://localhost:4000](http://localhost:4000). The frontend proxies `/api` requests to the backend.

To use MongoDB locally, copy `backend/.env.example` to `backend/.env` and set `MONGO_URI` and (optionally) `MONGO_DB_NAME`. Leave `MONGO_URI` empty to use `backend/data/db.json`. Keep `.env` files and the local database out of version control.

## Configuration

| Variable | Purpose |
| --- | --- |
| `PORT` | API port; defaults to `4000`. |
| `MONGO_URI` | MongoDB connection string. Required in production. |
| `MONGO_DB_NAME` | MongoDB database name; defaults to `tomato`. |
| `AUTH_SECRET` | Private signing secret for login sessions. Required in production; use a long, randomly generated value. |
| `UPI_VPA` | Merchant UPI address; leave unset to keep UPI checkout disabled. |
| `UPI_PAYEE_NAME` | Merchant name displayed in the UPI payment intent. |
| `API_SERVER_URL` | Express API base URL used by the frontend proxy. Defaults to localhost for development and the deployed Tomato API on Vercel. |

Never commit or share database credentials, signing secrets, or completed connection strings. If a credential is exposed, rotate it immediately.

## Production deployment

### Deploy both services on Render

The repository includes a [`render.yaml`](render.yaml) Blueprint for the `tomato-api` and `tomato-web` web services.

1. In Render, create a new Blueprint from this repository and select the `main` branch.
2. When prompted, provide `MONGO_URI` as a secret. Use an Atlas database user with database access and ensure the connection string has the correct username, password, and database name.
3. Apply the Blueprint and wait for both services to finish deploying. Render generates `AUTH_SECRET`; the Blueprint connects the frontend to the API over Render's private network.
4. Open the public URL shown on the `tomato-web` service. The `tomato-api` URL is for API endpoints, not the customer website.

The API health endpoint is `/api/health`; restaurant listings are available at `/api/restaurants`. For Atlas connectivity, configure the Atlas Network Access list appropriately. Free Render services may have changing outbound IPs; use a strong, unique database password if broad IP access is necessary.

### Deploy the frontend on Vercel (optional)

Import this repository into Vercel with `frontend` as the project root and set `API_SERVER_URL` to the public HTTPS URL of the deployed Render API. The frontend proxy uses this setting to send `/api/*` requests to Express.

### Payments

To enable UPI intents, configure `UPI_VPA` and `UPI_PAYEE_NAME` on the API service. A submitted UPI transaction reference is marked for manual verification; this demo does not verify payments with a bank or payment gateway.

## Build

```sh
npm run build
```

This builds the production frontend. For local development, run both frontend and API together with `npm run dev`.

## Repository layout

```text
frontend/
  app/                 Next.js route shell
  public/              Images, icons, and other static assets
  src/                 React pages, components, styles, and API client
backend/
  server.js            Express API, authentication, and persistence
  data/                Seed catalogues and ignored local JSON database
render.yaml             Render Blueprint for API and web services
```

# Tomato food delivery app

JavaScript food delivery app organized as a Next.js/React frontend and a Node.js/Express backend. MongoDB is supported; when `MONGO_URI` is not configured, the API uses `backend/data/db.json` for local development.

The local demo catalog includes 20 restaurants across Hyderabad, Mumbai, Delhi, Bengaluru, Chennai, Pune, Jaipur, and Kolkata. Paraside has 100 dishes; every restaurant has its own menu with descriptions and clearly labeled sample reviews. These restaurant listings and reviews are demo records, not verified businesses or customer reviews.

## Project layout

```text
frontend/
  app/                 Next.js app entry and route shell
  public/              Static images and assets
  src/                 React pages, components, styles, and API client
backend/
  server.js            Express API and MongoDB integration
  data/db.json         Local JSON database fallback
  .env.example         Backend environment variable template
package.json           Workspace scripts for running both apps
```

## Run locally

Install dependencies from the repository root, then start both apps:

```sh
npm install
npm run dev
```

The frontend runs at `http://localhost:4173` and the API at `http://localhost:4000`. The frontend proxies `/api` requests to the backend.

The home page includes nearby discovery when location permission is available, plus a city directory that can filter by city and search restaurant names, cuisines, and dishes. Seeded restaurant data is merged into the JSON fallback on API reads and into MongoDB when the database is initialized.

## Account features

Signed-in users can save restaurants, submit restaurant reviews, follow other registered users, view order notifications, and persist notification preferences. Profile data is private to the authenticated account and is stored in MongoDB when configured or in the local JSON database otherwise. Notification preferences are stored, but external push, email, and WhatsApp delivery providers are not configured.

## MongoDB

Copy `backend/.env.example` to `backend/.env`. Set `MONGO_URI` to a MongoDB connection string and optionally set `MONGO_DB_NAME`. Keep `MONGO_URI` empty to use the JSON file fallback. Never commit `backend/.env`.

To enable direct UPI intents, set `UPI_VPA` to your real merchant UPI ID and `UPI_PAYEE_NAME` in `backend/.env`. UPI orders remain pending until a transaction reference is submitted; this demo does not verify bank payments automatically, so a merchant must confirm them manually. For automatic payment confirmation, integrate a payment gateway with server-side verification and webhooks.

## Accounts and sign-in

Accounts use email and password. Passwords are hashed before storage, sign-in returns a signed seven-day session token, and order placement requires a valid token for the signed-in account. Set a long, private `AUTH_SECRET` and a persistent `MONGO_URI` in `backend/.env` before production; backend startup fails if either is missing. Phone OTP and Google sign-in are not configured, so the app does not claim to send or verify SMS codes.

## Deployment (Vercel + Render)

The backend Blueprint is in `render.yaml`. Connect the GitHub repository to Render and create a Blueprint deployment; provide a MongoDB connection string when prompted. Render generates `AUTH_SECRET`. After the API is live, import the repository into Vercel with the frontend root directory set to `frontend`, and set `API_SERVER_URL` to the Render API's HTTPS URL before deploying. Production builds intentionally fail if the API URL is missing. Optional UPI credentials can be set in the Render service environment.

## Build

```sh
npm run build
```

# Authentication Project

Full-stack authentication app with:

- Express + MongoDB backend
- React + Vite frontend
- JWT-based auth with refresh-token cookie
- email OTP verification after registration
- forgot-password flow with OTP
- protected frontend routes

## Project Structure

```text
Authentication/
├─ Backend/
│  ├─ server.js
│  ├─ package.json
│  ├─ .env.example
│  └─ src/
│     ├─ app.js
│     ├─ config/
│     ├─ controller/
│     ├─ models/
│     ├─ routes/
│     ├─ services/
│     └─ utils/
├─ Frontend/
│  ├─ package.json
│  ├─ .env.example
│  └─ src/
│     ├─ App.jsx
│     ├─ app.routes.jsx
│     └─ features/
└─ README.md
```

## Features

- Register with username, email, and password
- Email verification with OTP before reaching the protected home page
- Login for verified users only
- Session refresh using refresh-token cookie
- Forgot-password flow with OTP before allowing password reset
- Protected frontend routes for authenticated pages
- Public-only routes for login, register, verify, and reset pages

## Auth Flow

### Registration

1. User registers.
2. Backend creates the account and sends an email OTP.
3. Frontend redirects to `/verify-email`.
4. User submits OTP.
5. Frontend refreshes auth, loads the user, and sends the user to `/`.

### Login

1. Verified user logs in.
2. Backend returns an access token and sets a refresh-token cookie.
3. Frontend stores the access token and loads protected pages.

### Forgot Password

1. User enters email on `/forgot-password`.
2. If the email exists, backend sends an OTP.
3. Frontend moves to `/reset-password`.
4. User enters OTP first.
5. Only after OTP entry does the UI allow setting a new password.

## Backend Setup

### Prerequisites

- Node.js 18+
- MongoDB instance
- Gmail account configured for OAuth2 mail sending

### Install

```bash
cd Backend
npm install
```

### Environment Variables

Create `Backend/.env` from `Backend/.env.example`.

Required variables:

- `MONGO_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_USER`

### Run Backend

```bash
cd Backend
npm run dev
```

Backend runs on `http://localhost:3000`.

## Frontend Setup

### Install

```bash
cd Frontend
npm install
```

### Environment Variables

Create `Frontend/.env` from `Frontend/.env.example`.

Right now the frontend works with a relative API base path (`/api/auth`), so no frontend env variable is required by default. The example file is there if you want to move API config into env later.

### Run Frontend

```bash
cd Frontend
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Local Development

Run backend and frontend in two terminals:

```bash
cd Backend
npm run dev
```

```bash
cd Frontend
npm run dev
```

Current local setup assumes:

- backend: `http://localhost:3000`
- frontend: `http://localhost:5173`

## Serving Frontend From Backend

If you move the built frontend into the backend `public` folder and serve both from the same origin:

- keep frontend API base URL as `/api/auth`
- you do not need `http://localhost:3000/api/auth` in axios
- cookies and API calls will work on the same origin more cleanly

Typical deploy flow:

```bash
cd Frontend
npm run build
```

Then copy the built frontend assets into `Backend/public`.

You may also need to update the Express app to serve `index.html` for frontend routes in production.

## API Notes

Main auth routes:

- `POST /api/auth/register`
- `POST /api/auth/verify-email`
- `POST /api/auth/login`
- `GET /api/auth/get-me`
- `GET /api/auth/refresh-token`
- `GET /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

## Important Notes

- The backend currently listens on port `3000` directly in `Backend/server.js`.
- CORS in `Backend/src/app.js` is currently set for `http://localhost:5173`.
- If you deploy the frontend from the backend, you should revisit the CORS config.
- The forgot-password controller now returns an error when the email does not exist, so the frontend stays on the same page.

## Example Setup Summary

1. Create `Backend/.env` from `Backend/.env.example`
2. Create `Frontend/.env` from `Frontend/.env.example`
3. Start MongoDB
4. Run backend with `npm run dev`
5. Run frontend with `npm run dev`
6. Register a user
7. Verify email with OTP
8. Log in and access the protected home page

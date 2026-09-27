# Full-Stack Authentication System

A complete authentication project using React, Node.js, Express, MongoDB, JWT access tokens, bcrypt password hashing, and secure refresh-token cookies.

## Features

- Signup and login forms with polished React UI
- JWT access token authentication
- HTTP-only refresh-token cookie
- Refresh token rotation with hashed token storage in MongoDB
- Password hashing with bcrypt
- Protected backend routes
- Protected frontend dashboard route
- User profile viewing and editing
- Logout with server-side refresh token invalidation

## Project Structure

```text
client/   React + Vite frontend
server/   Express + MongoDB backend
```

## Setup

1. Install dependencies:

```bash
npm install
npm run install:all
```

2. Create backend environment:

```bash
cp server/.env.example server/.env
```

3. Update `server/.env` with your MongoDB connection string and strong JWT secrets.

4. Start both apps:

```bash
npm run dev
```

Frontend: `http://localhost:9000`

Backend: `http://localhost:5000`

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/users/me`
- `PATCH /api/users/me`

𝐂𝐨𝐩𝐲𝐫𝐢𝐠𝐡𝐭 (𝐜) 𝟐𝟎𝟐𝟔-𝐩𝐫𝐞𝐬𝐞𝐧𝐭 𝐎𝐦𝐞𝐬𝐡 𝐍𝐢𝐠𝐚𝐦. 𝐀𝐥𝐥 𝐫𝐢𝐠𝐡𝐭𝐬 𝐫𝐞𝐬𝐞𝐫𝐯𝐞𝐝.

𝐍𝐨 𝐨𝐧𝐞 𝐦𝐚𝐲 𝐮𝐬𝐞, 𝐝𝐢𝐬𝐭𝐫𝐢𝐛𝐮𝐭𝐞, 𝐨𝐫 𝐦𝐨𝐝𝐢𝐟𝐲 𝐭𝐡𝐢𝐬 𝐜𝐨𝐝𝐞 𝐰𝐢𝐭𝐡𝐨𝐮𝐭 𝐚𝐧 𝐞𝐱𝐩𝐥𝐢𝐜𝐢𝐭 𝐩𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐚𝐮𝐭𝐡𝐨𝐫.

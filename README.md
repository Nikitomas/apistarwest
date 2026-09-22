# apistarwest

## Description

`apistarwest` is a small e-commerce REST API built with Node.js and Express. It lets a consumer register, log in to receive a JWT token, and perform a checkout with either cash or credit card. All data (users and products) lives in memory — there is no database, so data resets whenever the server restarts.

## Installation

Requirements: Node.js 18+ and npm.

```bash
npm install
```

The repo ships with a working `.env` file. If you need to recreate it, copy `.env.example`:

```bash
cp .env.example .env
```

Environment variables:

| Variable         | Description                        | Default   |
|-------------------|-------------------------------------|-----------|
| `PORT`            | Port the server listens on          | `3000`    |
| `JWT_SECRET`      | Secret used to sign JWT tokens      | `change-me` |
| `JWT_EXPIRES_IN`  | JWT token expiration                | `1h`      |

## How to Run

```bash
npm start
```

For development with auto-restart on file changes:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`, and the Swagger UI at `http://localhost:3000/api-docs`.

## Rules

- The checkout accepts only two payment methods: `cash` or `credit_card`.
- Paying with `cash` gives a **10% discount** on the subtotal.
- Only **authenticated** users (valid JWT in the `Authorization` header) can perform a checkout.
- The API exposes exactly 4 business endpoints: `register`, `login`, `checkout`, and `health`.
- Everything runs in memory — no database is used, and data resets on restart.

## Existent Data

### Seeded Users

| ID | Name          | Email               | Password  | Role     |
|----|---------------|---------------------|-----------|----------|
| 1  | Alice Johnson | alice@example.com   | alice123  | customer |
| 2  | Bob Smith     | bob@example.com     | bob123    | customer |
| 3  | Carol White   | carol@example.com   | carol123  | admin    |

Passwords are stored as bcrypt hashes in memory; the plaintext values above are only valid for local testing via `/api/auth/login`.

### Seeded Products

| ID | Name                | Price   |
|----|---------------------|---------|
| 1  | Wireless Mouse      | $25.99  |
| 2  | Mechanical Keyboard | $79.99  |
| 3  | USB-C Hub           | $34.50  |

## How to Use the REST API

### 1. Healthcheck

```bash
curl http://localhost:3000/api/health
```

### 2. Register a new user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Dana Lee","email":"dana@example.com","password":"dana123"}'
```

### 3. Login to get a JWT token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"alice123"}'
```

Response:

```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

### 4. Checkout (requires the token from step 3)

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "items": [
      { "productId": 1, "quantity": 2 },
      { "productId": 2, "quantity": 1 }
    ],
    "paymentMethod": "cash"
  }'
```

Response:

```json
{
  "items": [
    { "productId": 1, "name": "Wireless Mouse", "unitPrice": 25.99, "quantity": 2, "lineTotal": 51.98 },
    { "productId": 2, "name": "Mechanical Keyboard", "unitPrice": 79.99, "quantity": 1, "lineTotal": 79.99 }
  ],
  "paymentMethod": "cash",
  "subtotal": 131.97,
  "discount": 13.2,
  "total": 118.77
}
```

### 5. Swagger documentation

Open `http://localhost:3000/api-docs` in a browser to explore and try out all endpoints interactively. The raw spec is also available at the repo root as [`swagger.yaml`](./swagger.yaml).

# Loan Management System Backend

A REST API for managing the lifecycle of a loan, from borrower registration and
application through sanction, disbursement, collection, and closure. The API
includes JWT authentication, role-based access control, MongoDB persistence,
salary-slip uploads to Cloudflare R2, and a basic business rules engine (BRE).

## Features

- Borrower registration and JWT-based login
- Loan applications with eligibility validation
- Fixed-rate repayment calculation
- Operational queues for sanction, disbursement, and collection
- Payment tracking with automatic loan closure after full repayment
- Salary-slip uploads to Cloudflare R2
- Seeded staff accounts for each operational role

## Tech Stack

- Node.js and TypeScript
- Express 5
- MongoDB and Mongoose
- JSON Web Tokens (JWT)
- bcrypt password hashing
- Multer file uploads
- Cloudflare R2 via the AWS S3 SDK

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- MongoDB, either locally or through a hosted MongoDB service
- A Cloudflare R2 bucket with public access configured

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

3. Fill in the values in `.env`.

4. Optionally seed the staff users:

   ```bash
   npm run seed
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Check that the API is running:

   ```bash
   curl http://localhost:3000/health
   ```

   Replace `3000` if you configured a different `PORT`.

## Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | Port used by the Express server |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify authentication tokens |
| `R2_ENDPOINT` | Cloudflare R2 S3-compatible endpoint |
| `R2_ACCESS_KEY_ID` | R2 access key ID |
| `R2_SECRET_ACCESS_KEY` | R2 secret access key |
| `R2_BUCKET_NAME` | Name of the R2 bucket used for salary slips |
| `R2_PUBLIC_URL` | Public base URL for uploaded files |

All variables are required when the application starts.

Example:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/lms
JWT_SECRET=replace-with-a-long-random-secret

R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<access-key-id>
R2_SECRET_ACCESS_KEY=<secret-access-key>
R2_BUCKET_NAME=<bucket-name>
R2_PUBLIC_URL=https://<public-bucket-domain>
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with `tsx` |
| `npm run seed` | Recreate the predefined non-borrower staff users |
| `npm test` | Placeholder script; automated tests are not configured yet |

> **Warning:** `npm run seed` deletes all existing non-borrower users before
> inserting the predefined staff accounts. Do not run it against production
> data.

## Seeded Staff Accounts

The seed script creates the following users. Each account initially uses the
password `Password@123`.

| Role | Email |
| --- | --- |
| `ADMIN` | `admin@test.com` |
| `SALES` | `sales@test.com` |
| `SANCTION` | `sanction@test.com` |
| `DISBURSEMENT` | `disbursement@test.com` |
| `COLLECTION` | `collection@test.com` |

Change these credentials before using the project outside local development.

## Authentication

Registering through the public API creates a user with the `BORROWER` role.
After logging in, pass the returned JWT in the `Authorization` header for
protected endpoints:

```http
Authorization: Bearer <token>
```

Supported roles are:

- `ADMIN`
- `SALES`
- `SANCTION`
- `DISBURSEMENT`
- `COLLECTION`
- `BORROWER`

## Loan Lifecycle

```text
APPLIED -> SANCTIONED -> DISBURSED -> CLOSED
   |
   +-> REJECTED
```

Loan applications are evaluated by the BRE before being saved:

- Applicant age must be between 23 and 50.
- Monthly salary must be at least `25000`.
- PAN must match the format `ABCDE1234F`.
- Applicants with employment mode `UNEMPLOYED` are rejected.
- Loan amount must be between `50000` and `500000`.
- Tenure must be between 30 and 365 days.
- Interest is calculated at a fixed annual rate of 12%.

## API Reference

Base URL:

```text
http://localhost:<PORT>
```

### Health

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | Public | Check whether the server is running |

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a borrower |
| `POST` | `/api/auth/login` | Public | Log in and receive a JWT |

Register request:

```json
{
  "name": "Asha Sharma",
  "email": "asha@example.com",
  "password": "secret123"
}
```

Login request:

```json
{
  "email": "asha@example.com",
  "password": "secret123"
}
```

### Uploads

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/uploads/salary-slip` | Authenticated user | Upload a salary slip |

Send the file as `multipart/form-data` using the field name `file`. Accepted
formats are PDF, PNG, and JPG/JPEG, with a maximum size of 5 MB. The response
contains the public file URL to use as `salarySlipUrl` in a loan application.

### Loans

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/loans/apply` | Authenticated user | Submit a loan application |
| `GET` | `/api/loans/my-loans` | Authenticated user | List the current user's loans |
| `GET` | `/api/loans/applied` | Authenticated user | List loans with `APPLIED` status |
| `GET` | `/api/loans/leads` | `SALES`, `ADMIN` | List borrowers without an application |
| `GET` | `/api/loans/sanction` | Authenticated user | List loans awaiting sanction |
| `PATCH` | `/api/loans/:id/approve` | Authenticated user | Mark a loan as `SANCTIONED` |
| `PATCH` | `/api/loans/:id/reject` | Authenticated user | Mark a loan as `REJECTED` |
| `GET` | `/api/loans/disbursement` | Authenticated user | List sanctioned loans |
| `PATCH` | `/api/loans/:id/disburse` | Authenticated user | Mark a loan as `DISBURSED` |
| `GET` | `/api/loans/collection` | Authenticated user | List disbursed loans |

Loan application request:

```json
{
  "personalDetails": {
    "fullName": "Asha Sharma",
    "pan": "ABCDE1234F",
    "dob": "1995-04-18",
    "monthlySalary": 60000,
    "employmentMode": "SALARIED"
  },
  "salarySlipUrl": "https://<public-bucket-domain>/lms/<uploaded-file>",
  "amount": 150000,
  "tenureDays": 180
}
```

Supported employment modes are `SALARIED`, `SELF_EMPLOYED`, and `UNEMPLOYED`.

Reject loan request:

```json
{
  "reason": "Eligibility requirements were not met"
}
```

### Payments

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/payments` | `COLLECTION`, `ADMIN` | Record a payment for a disbursed loan |
| `GET` | `/api/payments/:loanId` | `COLLECTION`, `ADMIN`, `SANCTION`, `DISBURSEMENT`, `BORROWER` | List payments for a loan |

Payment request:

```json
{
  "loanId": "<loan-id>",
  "utrNumber": "12345678901234567",
  "amount": 25000,
  "paymentDate": "2026-05-31"
}
```

The UTR number must contain exactly 17 digits. A payment cannot exceed the
outstanding balance. When the total paid amount reaches the repayment total,
the loan status changes to `CLOSED`.

## Response Format

Successful responses follow this shape:

```json
{
  "success": true,
  "data": {}
}
```

Errors follow this shape:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Project Structure

```text
src/
├── config/          # Environment validation and MongoDB connection
├── middleware/      # Authentication, authorization, validation, error handling
├── modules/
│   ├── auth/        # Registration and login
│   ├── loans/       # Loan applications and lifecycle operations
│   ├── payments/    # Repayment recording and history
│   ├── uploads/     # Salary-slip uploads to Cloudflare R2
│   └── users/       # User model and user queries
├── seeds/           # Staff user seed script
├── utils/           # Eligibility rules, constants, and enums
├── app.ts           # Express application setup
└── server.ts        # Database connection and server startup
```

## Notes

- The API currently stores the returned public salary-slip URL in the loan
  application.
- The endpoint table documents the authorization checks currently implemented
  in the routes.
- Automated tests and a production build script have not been configured yet.

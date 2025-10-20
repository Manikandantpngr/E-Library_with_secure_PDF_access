
# E-Library Secure Backend

This repository contains a secure backend for an E-Library platform. It provides user authentication/authorization, book and category management, uploads for PDFs and cover images, a borrowing system, and protected downloads with download statistics.

Tech stack
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication + bcryptjs
- Multer for uploads
- express-validator, helmet, cors, express-rate-limit for security and validation

Quick setup
1. Install dependencies

```powershell
npm install
```

2. Create `.env` from `.env.example` and set your values (JWT_SECRET, MONGO_URI)

3. Seed the database (creates admin/librarian/user)

```powershell
node seeder.js
```

4. Start dev server

```powershell
npm run dev
```

Folder structure
- `models/` - Mongoose schemas (User, Book, Category, Borrow, Download)
- `routes/` - Express route handlers (auth, users, books, categories, upload, download)
- `middleware/` - auth, role, upload, validation, error handlers
- `public/` - static test client and reader
- `uploads/` - `pdfs/`, `images/`, `temp/`

Main endpoints
- Auth
	- POST `/auth/register` - register user
	- POST `/auth/login` - login and receive JWT

- Users
	- GET `/users/me` - get profile (auth)
	- PUT `/users/me` - update profile (auth)
	- GET `/users` - list users (admin)
	- DELETE `/users/:id` - delete user (admin)

- Categories
	- GET `/categories`
	- POST `/categories` (admin)
	- PUT `/categories/:id` (admin)
	- DELETE `/categories/:id` (admin)

- Books
	- GET `/books` - list with search/filter
	- GET `/books/:id` - metadata
	- POST `/books` (admin) - create record (or use upload route)
	- PUT `/books/:id` (admin)
	- DELETE `/books/:id` (admin)
	- POST `/books/:id/borrow` (auth) - borrow book
	- GET `/books/:id/stats` (admin) - book stats

- Uploads
	- POST `/upload/book` - multipart upload (pdf + optional cover image)

- Download
	- GET `/download/:id` - protected PDF download (auth required) — watermarked and stats recorded

Security notes
- Use a strong `JWT_SECRET` and run the server behind HTTPS in production.
- Offload file storage to S3 or a secure object store for scale and durability.
- Review multer configuration and scan uploads for malware in production.

Further work
- Add PDF.js reader integration for an in-browser reading experience
- Add annotation/bookmark APIs and sync reading positions
- Implement signed, time-limited download URLs for more secure access
- Add integration tests and CI pipeline


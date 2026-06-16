# Shopify

A full-stack MERN e-commerce application with user authentication, product browsing, cart checkout, order management, and admin dashboards.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Backend Structure](#backend-structure)
- [Frontend Structure](#frontend-structure)
- [Database Seeding](#database-seeding)
- [Admin and User Workflows](#admin-and-user-workflows)
- [Deployment Notes](#deployment-notes)
- [License](#license)

## Overview

This repository contains a Shopify-style e-commerce application built using:

- `Node.js` + `Express` for the backend API
- `MongoDB` with `Mongoose` for data persistence
- `React` with `Redux Toolkit` for the frontend
- `React Bootstrap`, `Tailwind`, and `Framer Motion` for UI and animations
- `PayPal` integration for payment flow

## Features

- User registration, login, profile management
- Product listing, product details, search, and pagination
- Cart management and checkout flow
- Shipping, payment selection, and order placement
- Admin dashboard for managing users, products, and orders
- Image upload support via uploads endpoint
- Protected routes for authenticated and admin-only pages
- Error handling and async middleware for robust API responses

## Tech Stack

- Backend: `Node.js`, `Express`, `MongoDB`, `Mongoose`
- Frontend: `React`, `Redux Toolkit`, `React Router v6`, `React Bootstrap`
- Authentication: `JWT`, `bcryptjs`, `cookie-parser`
- Payments: `PayPal React SDK`
- File upload: `Multer`

## Architecture

The project is split into two main folders:

- `backend/` - API server, database connection, routes, controllers, models, middleware
- `frontend/` - React application, pages, components, Redux slices, styles

Root-level scripts coordinate both backend and frontend development workflows.

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd ProShop
   ```

2. Install root dependencies:

   ```bash
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   npm install --prefix frontend
   ```

4. Create a `.env` file in `backend/` with the required variables.

5. Start the app in development mode:

   ```bash
   npm run dev
   ```

6. Open the front-end at `http://localhost:3000`.

## Environment Variables

Create `backend/.env` and configure at least the following:

```env
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PAYPAL_CLIENT_ID=<your-paypal-client-id>
NODE_ENV=development
PORT=5000
``` 

> If `frontend/package.json` proxy is left as `http://localhost:5000`, API calls from React will be forwarded to the backend.

## Available Scripts

From the root directory:

- `npm run dev` - Run backend with `nodemon` and frontend with `react-scripts start`
- `npm run server` - Run only the backend server
- `npm run client` - Run only the React frontend
- `npm run build` - Install dependencies and build frontend production bundle
- `npm run data:import` - Seed sample data into MongoDB
- `npm run data:destroy` - Remove seeded data from MongoDB

Frontend scripts (inside `frontend/`):

- `npm start` - Start React development server
- `npm run build` - Build production-ready frontend
- `npm test` - Run React tests

## Backend Structure

Key backend folders and files:

- `backend/server.js` - Express app entry point
- `backend/config/db.js` - MongoDB connection helper
- `backend/controllers/` - Route handlers for users, products, and orders
- `backend/models/` - Mongoose models for `User`, `Product`, and `Order`
- `backend/routes/` - API routes grouped by domain
- `backend/middleware/` - Auth, error handling, async wrapper, ObjectId validation
- `backend/utils/` - Token generation, price calculations, PayPal config
- `backend/seeder.js` - Seed script for sample products and users

## Frontend Structure

Key frontend folders and files:

- `frontend/src/App.js` - Main React app router and layout
- `frontend/src/index.js` - React entry point
- `frontend/src/store.js` - Redux store setup
- `frontend/src/slices/` - Redux Toolkit slices and API slices
- `frontend/src/screens/` - Page-level views for user flows
- `frontend/src/components/` - Shared UI components
- `frontend/src/utils/cartUtils.js` - Cart helper utilities
- `frontend/src/context/ThemeContext.jsx` - Theme support context

## Database Seeding

Use the seed script to populate the database with sample users, products, and orders.

- Import sample data:

  ```bash
  npm run data:import
  ```

- Destroy seeded data:

  ```bash
  npm run data:destroy
  ```

## Admin and User Workflows

- Admin users can view and manage products, orders, and users.
- Normal users can register, login, update profile data, browse products, add to cart, and checkout.
- Protected frontend routes ensure only authenticated users and admins can access certain pages.

## Deployment Notes

- Build the frontend with `npm run build --prefix frontend`.
- Serve the generated `frontend/build` output from the backend or a static host.
- Set production environment variables for `MONGO_URI`, `JWT_SECRET`, and `PAYPAL_CLIENT_ID`.
- Ensure backend runs on a server such as Heroku, Vercel (serverless backend), Railway, or any Node-compatible host.

## License

This project is licensed under the MIT License.


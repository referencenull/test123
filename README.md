# Inventory Manager

A full-stack inventory management web application built with React, Vite, Express, and SQLite.

## Features

- 📦 View and manage 20+ pre-loaded products across 5 categories
- 🔍 Search products by name or SKU
- 🏷️ Filter by category (Electronics, Clothing, Food & Beverages, Sports, Home & Garden)
- 📊 Sort by name, price, quantity, or category
- ➕ Add new products with full details
- ✏️ Edit product quantities with +/- controls
- 🗑️ Delete products with confirmation
- ⚠️ Low stock indicators (red < 5, orange < 20, green ≥ 20)
- 🔔 Toast notifications for actions

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
# Clone the repository
git clone <repo-url>
cd test123

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Running the Application

### Start the Backend
```bash
cd backend
npm start
# Server runs on http://localhost:3001
```

### Start the Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

## API Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/products | List all products (supports ?search=, ?category=, ?sort=) |
| POST | /api/products | Add a new product |
| PATCH | /api/products/:id/quantity | Update product quantity |
| DELETE | /api/products/:id | Delete a product |

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: SQLite (via better-sqlite3)
# 🔗 Complete Backend Integration Guide

This document describes how the drvyn-dashboard integrates with your drvyn-backend MongoDB API.

## ✅ **Integration Status: COMPLETE**

Your dashboard is now fully connected to your drvyn-backend API with real-time data fetching from MongoDB.

## 🔧 Configuration

The dashboard automatically connects to your backend API. The API base URL is configured in `src/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://drvyn-backend.onrender.com';
```

## Environment Variables

To configure the backend URL, you can set the environment variable:

- `NEXT_PUBLIC_API_BASE_URL`: The base URL of your drvyn-backend API
  - Development: `http://localhost:8000`
  - Production: `https://drvyn-backend.onrender.com` (default)

### For Local Development

If you want to use your local backend instead of the production one, create a `.env.local` file in the dashboard root:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Then restart your Next.js dev server.

## API Endpoints Used

The dashboard integrates with the following backend endpoints:

### Authentication
- `POST /admin/login` - Admin login

### Bookings
- `GET /admin/bookings` - Get all bookings (with pagination and filtering)
- `PUT /admin/bookings/{id}/status` - Update booking status

### Insurance Requests
- `GET /admin/insurance-requests` - Get all insurance requests
- `PUT /admin/insurance-requests/{id}/status` - Update insurance request status

### General Requests
- `GET /admin/car-requests` - Get all car requests

### Dashboard Stats
- `GET /admin/dashboard/stats` - Get dashboard statistics

## Features

1. **Real-time Data**: All dashboard pages now fetch live data from your MongoDB database through the backend API.

2. **Authentication**: The dashboard uses JWT tokens for authentication with the backend.

3. **Error Handling**: Proper error handling with loading states and error messages.

4. **Data Tables**: All tables display real data from the backend with proper pagination support.

## 🚀 How to Use

### **Option 1: Production Backend (Recommended)**
```bash
cd drvyn-dashboard
npm run dev
```
- Opens at: `http://localhost:3001`
- Connects to: `https://drvyn-backend.onrender.com`
- Login: `admin` / `admin123`

### **Option 2: Local Backend**
1. Create `.env.local` file:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```
2. Start your backend: `cd drvyn-backend && python -m uvicorn app.main:app --reload`
3. Start dashboard: `cd drvyn-dashboard && npm run dev`

## 🔐 Authentication

- **Username**: `admin`
- **Password**: `admin123` (default from your backend)
- Uses JWT tokens for secure API access
- Automatic token refresh and logout on expiry

## Authentication Flow

1. Login page authenticates against `/admin/login`
2. JWT token is stored in localStorage
3. All subsequent API calls include the Bearer token
4. Unauthorized requests redirect to login page

## Data Flow

```
Dashboard UI → API Layer (src/lib/api.ts) → drvyn-backend → MongoDB
```

## 📊 **Real Data Integration**

Your dashboard now fetches live data from MongoDB through these endpoints:

### **Dashboard Overview** (`/dashboard`)
- `GET /admin/dashboard/stats` → Statistics and metrics
- `GET /admin/bookings` → Recent bookings for charts
- `GET /admin/insurance-requests` → Insurance data for charts
- `GET /admin/car-requests` → Request data for charts

### **Bookings Page** (`/dashboard/bookings`)
- `GET /admin/bookings` → All service bookings from MongoDB
- `PUT /admin/bookings/{id}/status` → Update booking status

### **Insurance Requests** (`/dashboard/insurance-requests`)
- `GET /admin/insurance-requests` → All insurance claims from MongoDB
- `PUT /admin/insurance-requests/{id}/status` → Update request status

### **General Requests** (`/dashboard/requests`)
- `GET /admin/car-requests` → All car service requests from MongoDB

## 🎯 **Features Working**

✅ **Real-time data** from your MongoDB database  
✅ **JWT Authentication** with your backend  
✅ **Error handling** and loading states  
✅ **Responsive design** works on all devices  
✅ **Data tables** with sorting and filtering  
✅ **Status updates** for bookings and requests  
✅ **Dashboard charts** with live data  

The dashboard is now fully integrated with your backend API and MongoDB database!

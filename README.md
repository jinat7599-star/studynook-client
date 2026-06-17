# StudyNook – Library Study Room Booking

**Live Site:** [https://studynook.vercel.app](https://studynook.vercel.app)

A full-stack web application where students and library users can browse, search, filter, and book private study rooms, while room owners can manage their listings from a personal dashboard.

## Features

- 🔐 **Clerk Authentication** — Secure sign-in and registration with Google OAuth support and private route protection.
- 🏠 **Room Listings** — Browse, search, and filter available study rooms by name, amenities, floor, and price range.
- 📅 **Smart Booking System** — Book any room for a specific date and time slot; real-time conflict detection prevents double bookings automatically.
- ✏️ **Room Management** — Add, edit, and delete your own study room listings with full CRUD operations.
- 📋 **Personal Dashboard** — Track all your bookings and listings, cancel upcoming bookings, and manage your hosted rooms.
- 🌓 **Dark / Light Mode** — Toggle between themes with localStorage persistence for a comfortable experience any time of day.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_API_URL=https://server-1-two.vercel.app
```

## Tech Stack

- **Next.js 14** (App Router) — React framework with file-based routing
- **Clerk** — Authentication and user management
- **Tailwind CSS** — Utility-first styling with dark mode support
- **react-hot-toast** — Non-blocking toast notifications
- **Lucide React** — Clean, consistent icon set

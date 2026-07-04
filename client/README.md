![CI](https://github.com/nhienbernie/chicago-events/actions/workflows/ci.yml/badge.svg)
[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black)](https://chicago-events-psi.vercel.app)
[![Backend on Railway](https://img.shields.io/badge/backend-Railway-purple)](https://chicago-events-production.up.railway.app/api/health)

# Chicago Events

> Browse Chicago events by category, location, and price. Post your own.

**[Live Demo](https://chicago-events-psi.vercel.app)** · **[API Health](https://chicago-events-production.up.railway.app/api/health)**

---

## What It Does

Chicago Events helps people — especially newcomers — discover what's happening in the city and share their own events. Filter by category, price, and date. View events on a map or in a list. Post a yard sale, pickup game, or community meetup in under a minute.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express |
| Database | Supabase (PostgreSQL + PostGIS) |
| Auth | Supabase Auth (email + password) |
| Storage | AWS S3 (presigned URL uploads) |
| Data | Ticketmaster API (auto-synced daily) |
| Testing | Jest + Supertest (28 tests) |
| CI/CD | GitHub Actions → Vercel + Railway |

---

## Key Features

- **Geospatial radius search** using PostGIS `ST_DWithin` — events filtered by distance from any point in Chicago
- **Automated event sync** — Ticketmaster API synced every night at midnight via cron job
- **User-generated events** — any logged-in user can post with photo upload to S3
- **Save events** — bookmark events to your profile with saved events section
- **Edit and delete** — full CRUD for your own posted events
- **Search** — filter by keyword, venue name, category, price, and date range

---

## Architecture
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│              Next.js 14 (Vercel)                        │
│         React + TypeScript + Tailwind CSS               │
└───────────────────┬─────────────────────────────────────┘
│ REST API
┌───────────────────▼─────────────────────────────────────┐
│                        Server                           │
│              Node.js + Express (Railway)                │
│                                                         │
│   ┌─────────────────┐    ┌──────────────────────────┐  │
│   │  Sync Job (24h) │    │     API Routes           │  │
│   │  Ticketmaster   │    │  GET  /api/events        │  │
│   └────────┬────────┘    │  POST /api/events        │  │
│            │             │  GET  /api/events/:id    │  │
└────────────┼─────────────┴──────────────────────────────┘
│
┌────────────▼──────────────┐    ┌────────────────────┐
│   Supabase (PostgreSQL)   │    │      AWS S3        │
│   + PostGIS extension     │    │   Event photos     │
│   + Row Level Security    │    │   Presigned URLs   │
│   + Supabase Auth         │    └────────────────────┘
└───────────────────────────┘
---

## Design Decisions

**Why PostGIS for radius search?**
Filtering by radius must happen in the database — not client-side. `ST_DWithin` with a spatial index runs in milliseconds regardless of dataset size. Sending the full dataset to the client and filtering there doesn't scale.

**Why Supabase over raw PostgreSQL?**
Supabase provides PostgreSQL (with PostGIS), authentication, and row-level security out of the box. The underlying database is standard PostgreSQL — migrating to RDS later requires only a connection string change.

**Why presigned S3 URLs?**
Files go directly from the browser to S3. The server generates a short-lived signed URL but never handles binary data. This keeps server memory usage low and is faster for the user.

**Why separate client and server in one repo?**
Clean separation of concerns without the overhead of managing two repos. The sync job runs independently of the frontend. Either can be scaled or replaced without touching the other.

---

## Local Setup

```bash
# 1. Clone
git clone https://github.com/nhienbernie/chicago-events.git
cd chicago-events

# 2. Install dependencies
cd client && npm install
cd ../server && npm install

# 3. Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env.local
# Fill in your API keys in both files

# 4. Run schema in Supabase SQL editor
# Copy contents of supabase-schema.sql and run in Supabase dashboard

# 5. Seed events from Ticketmaster
cd server && node jobs/syncEvents.js

# 6. Start development
cd .. && npm run dev
# Client: http://localhost:3000
# Server: http://localhost:4000
```

---

## Environment Variables

**server/.env**
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
TICKETMASTER_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=
PORT=4000
CLIENT_URL=http://localhost:3000

---

## Testing

```bash
cd server && npm test
```

28 tests covering:
- API validation (missing fields, contact method requirements)
- Filter behavior (category, radius, price, edge cases)
- Security (SQL injection, XSS, event ownership)
- Sync job deduplication logic

---

## Known Limitations

- User-posted events default to Chicago city center coordinates (no geocoding in MVP)
- Pagination filtering is client-side — moving to server-side in v1.1
- Email reminders for saved events deferred to v2
- Venue scraping (Metro Chicago, Music Box Theatre) deferred to v2

---

## Roadmap

- [ ] Meetup API integration for community groups and social events
- [ ] AI-powered event recommendations (Claude API)
- [ ] Flyer scanner — upload an Instagram flyer, Claude Vision extracts event details
- [ ] Color themes and vibe tags for posted events (Partiful-inspired)
- [ ] Email reminders for saved events
- [ ] Radius filter exposed to user
- [ ] Venue scraping for iconic Chicago spots without API coverage

---

## License

MIT
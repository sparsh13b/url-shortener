# 🔗 URL Shortener with Analytics

A production-ready full-stack URL shortener built to learn **real backend engineering** concepts like caching, analytics, database modelling, Docker, and deployment debugging.



---

##  Features

- Shorten long URLs into compact links
- Fast redirects using Redis caching
- Click analytics with total click count
- Dockerized frontend, backend, database, and Redis
- Production deployment ready

---

## Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM

### Database & Caching 
- PostgreSQL
- Redis

### Infrastructure
- Docker
- Docker Compose
- Render (deployment)

---

## 📂 Project Structure

```
url-shortener/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── lib/
│   │   │   ├── prisma.ts
│   │   │   └── redis.ts
│   │   ├── utils/
│   │   │   ├── generateSlug.ts
│   │   │   └── parseUserAgent.ts
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── config.ts
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🧠 System Design Overview

- PostgreSQL stores URLs and analytics data
- Redis caches slug → original URL mappings for fast redirects
- Prisma manages schema, migrations, and type-safe database access
- Express exposes APIs for URL creation, redirection, and analytics
- React frontend consumes backend APIs
- Docker Compose orchestrates all services locally

Redis is being used **only for read optimization** and never skips analytics logic.

---

## 🗄 Database Schema (Prisma)

```prisma
model Url {
  id          String   @id @default(uuid())
  originalUrl String
  slug        String   @unique
  expiresAt  DateTime?
  createdAt  DateTime @default(now())
  clicks      Click[]
}

model Click {
  id        String   @id @default(uuid())
  urlId     String
  device    String?
  browser   String?
  os        String?
  referrer  String?
  createdAt DateTime @default(now())

  url Url @relation(fields: [urlId], references: [id])
}
```

---

## 🔁 Redirect Flow

1. User visits `/slug`
2. Backend checks Redis cache
3. Cache hit → instant redirect
4. Cache miss → DB lookup → cache result
5. Click analytics recorded
6. User redirected to original URL

---

## 📊 Analytics Flow

- Each redirect logs a click entry
- Analytics endpoint returns total click count
- Frontend fetches analytics on load and refresh

---

## 🚀 API Endpoints

### Create Short URL

```
POST /api/shorten
```

Request:
```json
{
  "url": "https://example.com"
}
```

Response:
```json
{
  "id": "uuid",
  "originalUrl": "https://example.com",
  "slug": "abc123",
  "shortUrl": "https://backend-domain/abc123"
}
```

---

### Redirect Short URL

```
GET /:slug
```

Redirects to the original URL and records analytics.

---

### Fetch Analytics

```
GET /api/analytics/:slug
```

Response:
```json
{
  "totalClicks": 5
}
```

---

## 🐳 Docker Setup

Run the entire stack locally:

```bash
docker compose up --build
```

Services:
- Frontend → http://localhost:5173
- Backend → http://localhost:4000
- PostgreSQL → localhost:5432
- Redis → localhost:6379

---

## ⚙️ Environment Variables

### Backend

```env
DATABASE_URL=postgres://postgres:postgres@postgres:5432/url_shortener
REDIS_HOST=redis
PORT=4000
```

### Frontend

```env
VITE_API_BASE_URL=https://your-backend-url
```

---

##  Testing

- APIs tested using Postman and browser.
- Analytics verified using Prisma Studio.
- Network calls inspected via browser DevTools.
- Redis hit/miss behavior tested manually.

---

##  Key Learnings

- Redis should optimize reads, not bypass business logic.
- Analytics endpoints must never be cached.
- Async DB writes must be awaited before responding.
- Frontend and backend origins must be handled explicitly.
- Docker simplifies multi-service development.
- Production debugging differs from local debugging.

---

##  Author

**Sparsh Birla**  
 GitHub: https://github.com/sparsh13b

---



# 🏢 PrimeEstate - Enterprise MERN Real Estate Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini%202.5-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

A full-stack, enterprise-grade real estate property listing and marketplace platform built on the MERN stack with real-time direct messaging, intelligent conversational AI property assistance, comprehensive search and filtering, and production-hardened system architecture.

---

## 📑 Table of Contents

- [System Architecture](#-system-architecture)
  - [High-Level Architecture](#high-level-architecture)
  - [Tiered System Design](#tiered-system-design)
  - [Sequence & Data Flow Diagrams](#sequence--data-flow-diagrams)
- [Database Schema & Data Models](#-database-schema--data-models)
- [Production Engineering & Security Hardening](#-production-engineering--security-hardening)
- [Scalability & High Availability Strategy](#-scalability--high-availability-strategy)
- [API Reference](#-api-reference)
- [Environment Configuration](#-environment-configuration)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Docker & Containerized Deployment](#-docker--containerized-deployment)
- [Health Monitoring & Observability](#-health-monitoring--observability)
- [License](#-license)

---

## 🏛 System Architecture

The PrimeEstate application is designed following a **decoupled, multi-tier micro-service-ready architecture**. It combines synchronous RESTful HTTP APIs with asynchronous, event-driven WebSocket connections for real-time interactions, backed by indexed MongoDB collections and AI integration.

### High-Level Architecture

```mermaid
graph TB
    subgraph Client Tier
        Browser["Modern Browser / Mobile Web Client"]
        SPA["React 18 SPA (Vite + Redux Toolkit)"]
        Browser --> SPA
    end

    subgraph Edge & Ingress Tier
        ReverseProxy["Reverse Proxy / Cloudflare CDN / Nginx"]
        SPA -->|"HTTPS / WSS"| ReverseProxy
    end

    subgraph Application Server Tier
        ExpressApp["Express.js Application Server"]
        SocketServer["Socket.io WebSocket Server"]
        ReverseProxy -->|"REST /api/*"| ExpressApp
        ReverseProxy -->|"WebSocket Upgrade"| SocketServer
        
        subgraph Middlewares & Security
            SecHeaders["Security Headers (CSP, HSTS, X-Frame)"]
            RateLimiter["Sliding Window Rate Limiters"]
            AuthGuard["JWT / HttpOnly Cookie Authenticator"]
            Sanitizer["ReDoS & Query Sanitizer"]
        end
        
        ExpressApp --> SecHeaders --> RateLimiter --> AuthGuard --> Sanitizer
    end

    subgraph External & AI Services
        GeminiAI["Google Gemini 2.5 Flash API"]
        Firebase["Firebase Auth & Cloud Storage"]
    end

    subgraph Data & Storage Tier
        MongoDB[("MongoDB 6.0+ Cluster (Indexed Collections)")]
        RedisCache[("Redis Pub/Sub & Query Cache (Optional Scaler)")]
    end

    ExpressApp -->|"Mongoose Connection Pool"| MongoDB
    ExpressApp -->|"AI Property Assistant Queries"| GeminiAI
    SPA -->|"OAuth Google / Assets"| Firebase
    SocketServer -.->|"Cross-node sync (Adapter)"| RedisCache
```

---

### Tiered System Design

| Tier | Component | Responsibilities & Design Patterns |
| :--- | :--- | :--- |
| **Presentation Tier** | React 18, Redux Toolkit, Tailwind CSS | Single Page Application (SPA), optimistic UI updates, persistent client auth state via `redux-persist`, responsive layout with dark mode toggle, interactive property carousels via Swiper. |
| **Transport & Real-Time Tier** | Socket.IO Client & Server | Full-duplex bidirectional event bus for instant 1-to-1 messaging, user presence tracking (online/offline heartbeat), automatic reconnection and socket lifecycle handling. |
| **API & Gateway Tier** | Express 4.18 REST Engine | Centralized routing, request validation, cookie-based JWT token verification, centralized error interception, rate limiting per IP and route classification. |
| **Service & Business Tier** | Controllers & Sanitizers | User account lifecycle, listing management, multi-criteria filtering, text and compound query building, AI prompt engineering and graceful fallback mechanisms. |
| **Persistence Tier** | MongoDB & Mongoose ODM | Connection pooling, compound index lookups, schema validation, cascading updates, timestamp audit logging. |

---

### Sequence & Data Flow Diagrams

#### 1. Authentication & Session Flow (HttpOnly, Secure Cookies)

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant API as Auth Controller (/api/auth)
    participant DB as MongoDB (User Collection)

    User->>API: POST /api/auth/signin { email, password }
    API->>API: Rate Limiter Check (15 req/15min)
    API->>DB: User.findOne({ email })
    DB-->>API: User record (with bcrypt hash)
    API->>API: bcrypt.compare(password, hash)
    API->>API: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
    API-->>User: Set-Cookie: access_token=JWT; HttpOnly; SameSite; Secure + User Profile JSON
```

#### 2. Real-Time 1-on-1 Messaging Flow

```mermaid
sequenceDiagram
    autonumber
    actor Alice as Alice (Client A)
    participant Socket as Socket.io Server
    participant MsgAPI as Message Controller (/api/messages)
    participant DB as MongoDB (Message & Conversation)
    actor Bob as Bob (Client B)

    Alice->>Socket: Socket Connect (query: { userId: Alice_ID })
    Bob->>Socket: Socket Connect (query: { userId: Bob_ID })
    Socket-->>Alice: emit("getOnlineUsers", [Alice_ID, Bob_ID])
    Socket-->>Bob: emit("getOnlineUsers", [Alice_ID, Bob_ID])
    
    Alice->>MsgAPI: POST /api/messages { recipientId: Bob_ID, message: "Is property available?" }
    MsgAPI->>DB: Save Message & Update Conversation.lastMessage
    MsgAPI->>Socket: Lookup getReceiverSocketId(Bob_ID)
    Socket->>Bob: emit("newMessage", messageData)
    MsgAPI-->>Alice: HTTP 201 Created (messageData)
```

#### 3. Property Search & Compound Filter Flow

```mermaid
sequenceDiagram
    autonumber
    actor Client as Web Client
    participant API as Listing Controller (/api/listing/get)
    participant Sanitizer as Regex & Input Sanitizer
    participant DB as MongoDB (Listing Index)

    Client->>API: GET /api/listing/get?searchTerm=villa&type=sale&offer=true&limit=9
    API->>Sanitizer: escapeRegex(searchTerm) + clamp(limit, 1, 50)
    Sanitizer-->>API: Sanitized parameters (safe from ReDoS)
    API->>DB: Listing.find(query).sort().limit().skip().lean()
    Note over DB: Uses Compound Index { type: 1, offer: 1, createdAt: -1 }
    DB-->>API: Array of matching listings
    API-->>Client: HTTP 200 JSON Response
```

#### 4. AI Property Assistant Flow (Google Gemini 2.5 Flash)

```mermaid
sequenceDiagram
    autonumber
    actor User as Client User
    participant Route as Chatbot Route (/api/chatbot/ask)
    participant Controller as Chatbot Controller
    participant Gemini as Google Gemini Generative AI

    User->>Route: POST /api/chatbot/ask { message: "What are typical closing costs?" }
    Route->>Route: Chatbot Rate Limiter (25 req/15min)
    Route->>Controller: Process validated prompt
    alt Gemini API Key Available
        Controller->>Gemini: model.generateContent(realEstatePrompt)
        Gemini-->>Controller: AI response text
        Controller-->>User: HTTP 200 { text: "...", isFallback: false }
    else Gemini Offline or Key Missing
        Controller-->>User: HTTP 200 { text: "Fallback response...", isFallback: true }
    end
```

---

## 🗄 Database Schema & Data Models

The persistence layer uses optimized MongoDB schemas structured for low-latency queries and scalable relationship references.

```mermaid
erDiagram
    USER ||--o{ LISTING : owns
    USER ||--o{ CONVERSATION : participates
    USER ||--o{ MESSAGE : sends
    CONVERSATION ||--o{ MESSAGE : contains

    USER {
        ObjectId _id PK
        string username "Unique, Indexed"
        string email "Unique, Indexed"
        string password "Bcrypt hashed"
        string avatar
        date createdAt
        date updatedAt
    }

    LISTING {
        ObjectId _id PK
        string name "Text Indexed"
        string description "Text Indexed"
        string address "Text Indexed"
        number regularPrice "Indexed"
        number discountPrice
        number bathrooms
        number bedrooms
        boolean furnished
        boolean parking
        string type "enum: ['sale', 'rent']"
        boolean offer
        string[] imageUrls
        string userRef "Indexed"
        date createdAt "Indexed"
        date updatedAt
    }

    CONVERSATION {
        ObjectId _id PK
        ObjectId[] participants "Indexed"
        object lastMessage
        date createdAt
        date updatedAt "Indexed"
    }

    MESSAGE {
        ObjectId _id PK
        ObjectId conversationId "Indexed"
        ObjectId sender "Indexed"
        string text
        boolean seen
        string img
        date createdAt "Indexed"
        date updatedAt
    }
```

### Database Indexing Strategy

To guarantee sub-50ms query times even with tens of thousands of properties and messages:

1. **`Listing` Collection**:
   - `listingSchema.index({ type: 1, offer: 1, createdAt: -1 })`: Powers landing page feeds and filtered search result sorting.
   - `listingSchema.index({ name: 'text', address: 'text', description: 'text' })`: Enables multi-field text search.
   - `listingSchema.index({ regularPrice: 1 })`: Optimizes price-range queries.
   - `listingSchema.index({ userRef: 1 })`: Instantly retrieves a user's own listings.
2. **`Conversation` Collection**:
   - `conversationSchema.index({ participants: 1 })`: Fast user thread lookup.
   - `conversationSchema.index({ updatedAt: -1 })`: Orders inbox conversations by latest message activity.
3. **`Message` Collection**:
   - `messageSchema.index({ conversationId: 1, createdAt: 1 })`: Chronological retrieval of conversation history.

---

## 🛡 Production Engineering & Security Hardening

This codebase contains enterprise-grade defenses against common vulnerabilities:

### 1. Security Headers & Defense in Depth
- **Strict-Transport-Security (HSTS)**: Automatically activated in production (`max-age=31536000; includeSubDomains; preload`).
- **X-Frame-Options: SAMEORIGIN**: Defends against Clickjacking attacks.
- **X-Content-Type-Options: nosniff**: Defends against MIME-type sniffing exploits.
- **X-XSS-Protection: 1; mode=block**: Browser XSS auditor protection.
- **Referrer-Policy: strict-origin-when-cross-origin**: Prevents URL parameter leakage to external domains.

### 2. Rate Limiting (Sliding Window Algorithm)
- **Global API Limiter**: Max 300 requests / 15 minutes per IP.
- **Authentication Limiter**: Max 15 attempts / 15 minutes on `/api/auth/*` to prevent credential stuffing and brute force attacks.
- **Chatbot AI Limiter**: Max 25 queries / 15 minutes on `/api/chatbot/ask` to protect Gemini API quotas and manage compute costs.
- Standard HTTP 429 response headers: `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`.

### 3. Safe Query Sanitization (Anti-ReDoS & Anti-NoSQL Injection)
- Search inputs are escaped using `escapeRegex()` before insertion into Mongoose queries, neutralizing catastrophic regular expression backtracking and unauthorized regex wildcards.
- MongoDB pagination limits are strictly clamped between 1 and 50 records to prevent memory exhaustion from oversized queries.

### 4. Resilient MongoDB Connection Lifecycle
- Built with automatic connection pooling (`maxPoolSize: 10`, `serverSelectionTimeoutMS: 5000`).
- Runtime event listeners for `disconnected`, `reconnected`, and `error` events.
- Graceful shutdown handles `SIGINT` and `SIGTERM`, draining in-flight requests, closing socket connections, and closing database pools cleanly.

### 5. Production Cookie Hardening
- Authentication JWTs are transmitted in **`HttpOnly` cookies**, preventing JavaScript access and neutralizing XSS token theft.
- Dynamic environment toggles: `secure: true` in production (requires HTTPS) and `sameSite: 'none'` (cross-site secure) or `'lax'`.

---

## 📈 Scalability & High Availability Strategy

For high-traffic production deployments, this architecture readily scales as follows:

```mermaid
flowchart LR
    LB["Load Balancer (AWS ALB / Cloudflare)"] --> App1["App Node 1"]
    LB --> App2["App Node 2"]
    LB --> AppN["App Node N"]

    App1 <--> Redis[("Redis Adapter (Socket.io & Cache)")]
    App2 <--> Redis
    AppN <--> Redis

    App1 --> MongoPrimary[("MongoDB Primary")]
    App2 --> MongoSecondary[("MongoDB Read Replicas")]
    AppN --> MongoSecondary
```

1. **Horizontal App Scaling**:
   The Express application is stateless. Multiple instances can run behind Nginx or an AWS Application Load Balancer.
2. **WebSocket Cluster Synchronization**:
   By attaching `@socket.io/redis-adapter`, multi-instance Node servers publish and subscribe to chat messages across containers seamlessly.
3. **Read/Write Database Separation**:
   Listing queries and read operations can be directed to MongoDB secondary replicas, reserving the primary replica for writes.
4. **Media CDN**:
   Property imagery is hosted via Firebase Storage / S3 with CDN caching, keeping app server bandwidth overhead minimal.

---

## 📡 API Reference

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required | Rate Limited |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/api/auth/signup` | Register new user account | ❌ | ✅ (15 / 15m) |
| `POST` | `/api/auth/signin` | Authenticate user & issue HttpOnly JWT | ❌ | ✅ (15 / 15m) |
| `POST` | `/api/auth/google` | Google OAuth token verification / upsert | ❌ | ✅ (15 / 15m) |
| `GET` | `/api/auth/signout` | Clear authentication cookie | ❌ | ❌ |

### 🏠 Property Listings (`/api/listing`)

| Method | Endpoint | Description | Auth Required | Query / Body Params |
| :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/listing/create` | Create a property listing | ✅ | `{ name, regularPrice, type, imageUrls... }` |
| `GET` | `/api/listing/get` | Search and filter listings | ❌ | `?searchTerm=&type=&offer=&sort=&limit=` |
| `GET` | `/api/listing/get/:id` | Retrieve single listing by ID | ❌ | `id` (MongoDB ObjectId) |
| `POST` | `/api/listing/update/:id` | Update property listing | ✅ | Partial or full listing update body |
| `DELETE`| `/api/listing/delete/:id` | Delete listing (owner only) | ✅ | `id` (MongoDB ObjectId) |
| `GET` | `/api/listing/seed` | Seed initial dummy properties | ❌ | Development utility |

### 💬 Real-Time Messaging (`/api/messages`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/messages/conversations` | Get all active conversations for current user | ✅ |
| `GET` | `/api/messages/:otherUserId` | Retrieve message history with a specific user | ✅ |
| `POST` | `/api/messages` | Send message and broadcast via Socket.IO | ✅ |

### 🤖 AI Property Assistant (`/api/chatbot`)

| Method | Endpoint | Description | Auth Required | Rate Limited |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/api/chatbot/ask` | Ask real estate AI assistant question | ❌ | ✅ (25 / 15m) |

### 💓 Operational Health (`/api/health`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service status, uptime, MongoDB state, memory consumption |

---

## ⚙ Environment Configuration

Create a `.env` file in the project root based on [`.env.example`](.env.example):

```env
# Application Environment
NODE_ENV=development
PORT=3000

# MongoDB Connection String
MONGO=mongodb://127.0.0.1:27017/mern-estate

# JSON Web Token Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Google Gemini AI API Key (Optional)
GEMINI_API_KEY=your_gemini_api_key_here

# Allowed CORS Origins (comma-separated)
CLIENT_ORIGIN=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [MongoDB](https://www.mongodb.com/) running locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI
- [npm](https://www.npmjs.com/) v9.0.0 or higher

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/real-estate-property-listing-website.git
cd real-estate-property-listing-website

# Install root & backend dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and supply your MongoDB URI and JWT_SECRET
```

### 3. Seed Sample Data (Optional)

```bash
npm run seed
```

### 4. Run Development Servers

Run backend and frontend concurrently:

```bash
# Terminal 1: Start backend server with hot-reload (Port 3000)
npm run dev

# Terminal 2: Start frontend client development server (Port 5173)
npm run client
```

Navigate to `http://localhost:5173` to explore the application.

---

## 🐳 Docker & Containerized Deployment

A production-optimized, multi-stage `Dockerfile` and `docker-compose.yml` are provided.

### Run with Docker Compose

Launch the complete stack (Node.js API Server + MongoDB with persistent storage):

```bash
docker-compose up -d --build
```

- **App Server**: accessible at `http://localhost:3000`
- **MongoDB**: running on port `27017` with persistent volume `mongo-data`
- **Health Check**: automatically checks container health every 30 seconds

To inspect logs:
```bash
docker-compose logs -f app
```

To stop containers:
```bash
docker-compose down
```

---

## 🩺 Health Monitoring & Observability

The application includes an automated health probe at `/api/health`.

### Sample Health Check Response (`GET /api/health`):

```json
{
  "status": "healthy",
  "service": "mern-estate-api",
  "environment": "production",
  "uptime": "8432s",
  "database": {
    "state": "connected",
    "isConnected": true
  },
  "system": {
    "memoryRssMB": 48,
    "heapUsedMB": 22,
    "nodeVersion": "v20.18.0"
  },
  "timestamp": "2026-09-27T18:30:00.000Z"
}
```

This endpoint can be directly plugged into AWS Route53 health checks, Kubernetes liveness/readiness probes, Docker HEALTHCHECK, Datadog, or Uptime Kuma.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

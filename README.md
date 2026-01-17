# Ticket Routing Microservice

A backend ingestion service designed to handle high-volume webhook traffic. It processes, validates, and queues support tickets for database persistence.

The project moves beyond basic CRUD by implementing **write-behind buffering** to maximize throughput and **optimistic concurrency control** to ensure data consistency during parallel updates.

## Engineering Features

* **High-Throughput Ingestion:** Implemented an in-memory batching strategy (`insertMany`) to reduce database round-trips, increasing write throughput by ~300% compared to synchronous operations.
* **Concurrency Control:** Uses MongoDB versioning (`__v`) to detect and handle race conditions when multiple webhooks update the same ticket simultaneously.
* **Resilient Architecture:** Containerized using **Docker** (multi-stage builds) for consistent deployment environments.
* **Automated Quality Assurance:** Integrated **GitHub Actions** CI pipeline to run integration tests against an ephemeral MongoDB instance on every commit.

## Tech Stack

* **Runtime:** Node.js (v20)
* **Database:** MongoDB (Mongoose ODM)
* **Validation:** Joi
* **Infrastructure:** Docker, GitHub Actions
* **Testing:** Autocannon (Load Testing), Axios (Integration Testing)

## Performance Benchmarks

Benchmarks run using `autocannon` on a local development environment (100 concurrent connections).

| Optimization Strategy | Throughput (RPS) | Latency (Avg) |
|:----------------------|:-----------------|:--------------|
| **Synchronous Write (Baseline)** | ~850 RPS | 128 ms |
| **Batched Write (Current)** | **~2,860 RPS** | **32 ms** |

> *Note: Throughput limited by local hardware. Production deployment would scale horizontally using Node.js Clustering.*

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/kevilgs/ticket-routing-service.git
cd ticket-routing-service
```

### 2. Run with Docker (Recommended)

No Node.js or MongoDB installation required.
```bash
docker build -t ticket-service .
docker run -p 3000:3000 ticket-service
```

### 3. Run Locally (Manual)

Requires Node.js v20+ and a running MongoDB instance.
```bash
# Install dependencies
npm install

# Create .env file
echo "PORT=3000" > .env
echo "MONGO_URI=mongodb://localhost:27017/ticket_db" >> .env

# Start server
npm start
```

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration.

* **Trigger:** Push to `main` branch
* **Process:**
  1. Spins up a MongoDB Service Container
  2. Installs dependencies
  3. Runs the server in the background
  4. Executes `tests/test-load.js` to verify API stability under load

## Future Enhancements

* **Rate Limiting:** Implement token bucket algorithm to prevent abuse
* **Dead Letter Queue:** Add retry mechanism for failed database operations
* **Observability:** Integrate Prometheus metrics for monitoring throughput/latency
* **Horizontal Scaling:** Deploy behind NGINX load balancer with PM2 clustering

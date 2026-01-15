# Simple Ticket Routing Microservice
A high-performance backend microservice designed to ingest, validate, and prioritize support tickets via webhooks. Built with Node.js and MongoDB, this service automates the classification of incidents based on urgency and content analysis.

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (via Mongoose)
* **Validation:** Joi
* **Logging:** Winston (Structured JSON logging)
* **Testing:** Autocannon (Load Testing)

## Performance Benchmarks

System performance was verified using `autocannon` on a local development environment.

| Metric | Result |
| :--- | :--- |
| **Throughput** | ~864 Requests/Sec (51,000+ RPM) |
| **Avg Latency** | 114 ms |
| **Uptime** | 99.9% during stress testing |

> *Note: Benchmarks reflect synchronous database writes to ensure strict data persistence.*

## Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/kevilgs/ticket-routing-service.git](https://github.com/kevilgs/ticket-routing-service.git)
    cd ticket-routing-service
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    MONGO_URI=mongodb://127.0.0.1:27017/ticket-system
    PORT=3000
    ```

4.  **Start the Server**
    ```bash
    npm start
    ```

## How to Run Load Tests

This project includes a built-in load testing script to verify performance metrics.

1.  Ensure the server is running (`npm start`).
2.  Open a new terminal and run:
    ```bash
    node loadtest.js
    ```
3.  The script will simulate **100 concurrent users** for 10 seconds and output the request throughput and latency stats.

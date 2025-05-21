# Todo API with Node.js, MongoDB, Docker, and Testing

This is a complete RESTful API for a Todo application with full CRUD functionality, built with Node.js, Express, and MongoDB. It includes Docker configuration and comprehensive tests covering unit, integration, and performance testing scenarios.

## Prerequisites

- Node.js (v14+)
- Docker and Docker Compose
- npm or yarn

## Project Structure

```
todo-api/
  ├── src/
  │   ├── config/       # Database and app configuration
  │   ├── controllers/  # Request handlers
  │   ├── models/       # Data models (mongoose schemas)
  │   ├── routes/       # API routes
  │   ├── tests/        # Test files
  │   │   ├── unit/     # Unit tests
  │   │   ├── integration/ # Integration tests
  │   │   └── performance/ # Performance tests
  │   ├── app.js        # Express app setup
  │   └── server.js     # Server entry point
  ├── .env              # Environment variables
  ├── .gitignore        # Git ignore file
  ├── docker-compose.yml # Docker compose configuration
  ├── Dockerfile        # Docker configuration
  └── package.json      # Project dependencies and scripts
```

## Getting Started

### 1. Clone the repository or create the directory structure as shown above

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following content:

```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://admin:password@localhost:27017/todo_db?authSource=admin
```

### 4. Start the application

#### Option 1: Using Docker (recommended)

Start MongoDB and the API in Docker containers:

```bash
npm run docker:up
```

This command starts both the MongoDB database and the API service in Docker containers.

#### Option 2: Running locally (requires MongoDB installed)

Start the application in development mode:

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint        | Description           |
|--------|-----------------|------------------------|
| GET    | /api/todos      | Get all todos         |
| GET    | /api/todos/:id  | Get a specific todo   |
| POST   | /api/todos      | Create a new todo     |
| PUT    | /api/todos/:id  | Update a todo         |
| DELETE | /api/todos/:id  | Delete a todo         |

## Running Tests

### Unit Tests (Test Case A)

Run unit tests with Jest:

```bash
npm test -- src/tests/unit
```

This command runs the unit tests and shows the coverage report.

### Integration Tests (Test Case B)

Run API integration tests:

```bash
npm test -- src/tests/integration
```

### Performance Tests (Test Case C)

First, make sure your API is running:

```bash
npm run dev
```

Then, in a separate terminal, run the performance test:

```bash
node src/tests/performance/loadTest.js
```

This will simulate different user loads (100, 200, 500, 1000, 2000, 5000, 10000) and measure the API's response time.

## View Test Coverage

After running tests, you can view the coverage report:

```bash
npm test
```

This will generate a coverage report in the `/coverage` directory. Open `/coverage/lcov-report/index.html` in your browser to see the detailed coverage report.

## Docker Commands

- Start containers: `npm run docker:up` or `docker-compose up -d`
- Stop containers: `npm run docker:down` or `docker-compose down`
- View logs: `docker-compose logs -f`
- Access MongoDB shell: `docker exec -it todo_mongodb mongosh -u admin -p password`

## Technical Details

- **Express**: Web framework for Node.js
- **Mongoose**: MongoDB object modeling for Node.js
- **Jest & Supertest**: Testing framework
- **Docker & Docker Compose**: Containerization
- **MongoDB**: NoSQL database# todo-api-class

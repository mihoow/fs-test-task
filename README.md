
# Recruitment Full Stack Test Task

## Project structure

The repository is organized as a Yarn workspace monorepo:
- **fe/** — frontend (Vite + React)
- **be/** — backend (Node.js + Express + MongoDB)
- **shared/** — shared code used by both frontend and backend

---

## Requirements
- **Node.js >= 18**
- **Yarn >= 1.22**
- **Docker Compose >= 2.22** (required for `docker compose watch`, alternatively you can manually run docker compose up (it just won't track code changes))

## Running frontend locally:
```bash
yarn install
yarn dev:fe
```

## Running backend locally:
```bash
yarn dev:be
```
This will start a local instance of mongo DB database.

### To connect to remote MongoDB (replica set), run:
```bash
cd be
yarn install
cp .env.test .env
# manually replace MONGO_URI with the remote URI
yarn dev
```

## A few words about backend
- it exposes a single API endpoint: GET /api/v1/products; it also accepts filters, search, sort and page via query params;
- MongoDB is setup via mongoose with products collection and a few base indexes for search and sorting;
- Mock data is seeded on server boot when products collection is empty.

## CORS
Frontend communicates with backend using a vite proxy which bypasses CORS.
At the same time, backend includes a cors() middleware that can be setup if needed


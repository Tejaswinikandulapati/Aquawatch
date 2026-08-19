# AquaWatch - Smart Aquaculture Management System

Full-stack app: React (frontend) + FastAPI (backend) + MySQL (database).
Ready to run with **Docker** — no manual MySQL setup, no password issues.

## Prerequisites (one time only)

Install **Docker Desktop**: https://www.docker.com/products/docker-desktop/
(Just install it and open it once so Docker is running in the background.)

## How to run (1 command)

Open terminal inside the `aquawatch` folder and run:

```
docker-compose up --build
```

Wait ~1-2 minutes on the very first run (downloading images + installing packages).
After that, next time you run it, it starts in a few seconds.

## Once it's running

- Frontend (dashboard): http://localhost:3000
- Backend API docs: http://localhost:8000/docs
- MySQL: exposed on port 3307 (in case you want to connect with a MySQL client)

Seed data (3 ponds, sensor readings, alerts, feeding logs) loads automatically —
dashboard won't be empty on first open.

## To stop

Press `Ctrl + C` in the terminal, then run:

```
docker-compose down
```

To stop AND wipe the database (fresh start next time):

```
docker-compose down -v
```

## Project structure

```
aquawatch/
├── docker-compose.yml     <- one file that runs everything
├── backend/
│   ├── main.py             <- FastAPI routes
│   ├── models.py           <- DB tables (SQLAlchemy)
│   ├── schemas.py          <- request/response validation
│   ├── database.py         <- DB connection
│   ├── init.sql            <- schema + seed data (auto-loads into MySQL)
│   ├── requirements.txt
│   └── Dockerfile
└── frontend/
    ├── src/
    │   ├── App.js           <- dashboard UI (dark ocean theme)
    │   └── index.js
    ├── public/index.html
    ├── package.json
    └── Dockerfile
```

## Features included

- Pond management (name, location, species, area)
- Live sensor readings: temperature, pH, dissolved oxygen, ammonia
- "Simulate Reading" button per pond (great for demo/viva — generates a realistic reading instantly)
- Automatic alert generation when a reading crosses a safe threshold (pH, low oxygen, high ammonia)
- Resolve alerts from the dashboard
- Feeding logs (feed type, quantity, notes)
- Dashboard summary cards (total ponds, active alerts, average temp, average dissolved O₂)
- Auto-refreshes every 8 seconds

## If something doesn't work

**"port already in use" error** → something else on your machine is using port 3000, 8000, or 3307.
Stop that other app, or tell me and I'll change the ports for you.

**Docker not installed / not running** → open Docker Desktop app first, wait till it says "running", then try the command again.

**Want to add a real ESP32/Arduino sensor feed later?**
Point your device to `POST http://localhost:8000/api/readings` with JSON:
```json
{ "pond_id": 1, "temperature": 28.5, "ph": 7.6, "dissolved_oxygen": 5.1, "ammonia": 0.3 }
```


# DropLater (Pinsaar Take-Home Assignment)



## 🎥 Demo Video

👉 [Watch the demo video here](https://drive.google.com/file/d/1QRZowrrAbxZpd0ebooYeguk29wBlqw_B/view?usp=drive_link)

---

## How to Run

No installation steps needed. Just clone and run:

```bash
git clone <your-repo-url>
cd <your-repo-folder>
docker compose up
```

That’s it. All environment variables are already configured inside the `docker-compose.yml` (⚠️ only for simplicity in this test setup).

Services that will start:

* **api** → Node/Express API
* **worker** → Processes scheduled notes
* **mongo** → MongoDB storage
* **redis** → Redis for queues
* **sink** → Webhook receiver (`http://sink:4000/sink`)
* **react-admin** → Tiny React admin panel

---

## Authentication

All API requests require an **admin token**:

```
Authorization: Bearer PINSAAR
```

---

## API Endpoints

### Health check

```bash
curl http://localhost:3000/health
```

### Create a Note

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Authorization: Bearer PINSAAR" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hello",
    "body": "Ship me later",
    "releaseAt": "2020-01-01T00:00:10.000Z",
    "webhookUrl": "http://sink:4000/sink"
  }'
```

### List Notes

```bash
curl -H "Authorization: Bearer PINSAAR" \
"http://localhost:3000/api/notes?status=pending&page=1"
```

### Replay a Note

```bash
curl -X POST \
  -H "Authorization: Bearer PINSAAR" \
"http://localhost:3000/api/notes/<id>/replay"
```

---

## Admin UI

Runs alongside the API on port 5173.
It provides:

* A form to create new notes
* A table to list notes with status
* A replay button for failed/dead notes in the table actions

---

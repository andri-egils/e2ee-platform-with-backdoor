# Whistleblower Platform — Setup

## Prerequisites

- Python 3.9+
- Node.js 18+
- npm

---

## Authority Server

```bash
cd authority-server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env — set SECRET_KEY and ADMIN_PASSWORD
```

```bash
make run      # start server on port 5001
make install  # reinstall from requirements.txt
make freeze   # update requirements.txt after pip install
```

---

## Operator Server

```bash
cd operator-server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env — set SECRET_KEY, JWT_SECRET_KEY
# Ensure AUTHORITY_SERVER_URL=http://localhost:5001
```

```bash
make run      # start server on port 5050
make install  # reinstall from requirements.txt
make freeze   # update requirements.txt after pip install
```

> Authority server must be running before starting the operator server.

---

## User Client

```bash
cd user-client
npm install
cp .env.example .env.local
# Edit .env.local — set VITE_API_URL=http://localhost:5050
```

```bash
npm run dev   # start on http://localhost:5173
npm run build # production build
```

---

## Authority Client

```bash
cd authority-client
npm install
cp .env.example .env.local
# Edit .env.local — set VITE_API_URL=http://localhost:5001
```

```bash
npm run dev   # start on http://localhost:5174
npm run build # production build
```

---

## Start order

```
1. authority-server
2. operator-server
3. user-client
4. authority-client
```
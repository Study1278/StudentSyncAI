# AppointAI — Project Journal & Backend Developer Reference

**Project:** AI-Powered Appointment Management System with Voice Assistant
**Stack:** Python (FastAPI) + PostgreSQL (Neon) + React (frontend, upcoming) + SQLAlchemy ORM
**Student:** B.Tech CSE (Data Science), 2nd year
**Goal:** Learn real backend development end-to-end, not just submit a working demo

---

## ✅ What's actually built and working right now

- [x] Local dev environment: Python, VS Code, Git, GitHub, virtual environment (`venv`)
- [x] Free cloud PostgreSQL database (Neon) created and connected
- [x] FastAPI project restructured into a proper multi-file layout (`app/` with `routers/`, `models.py`, `schemas.py`, `database.py`)
- [x] `.env` + `python-dotenv` used to keep the database connection string out of code and out of GitHub
- [x] `User` table defined via SQLAlchemy ORM and created in the real database
- [x] **Registration endpoint** (`POST /users/register`) — validates input, checks for duplicate email, hashes password with bcrypt, saves to DB
- [x] **Login endpoint** (`POST /users/login`) — verifies email + password against the stored hash, returns 401 on failure without revealing *which* part was wrong
- [x] Project version-controlled with Git, pushed to GitHub (`Study1278/AppointAI`), with commits after every working milestone

**This is a real, working authentication backend.** Not a toy — this is the same pattern (minus JWT, coming next) used in production systems.

---

## 🧠 Core backend concepts you now understand (not just typed)

### 1. The request-response cycle
```
Client (browser/frontend) → HTTP Request → Backend route → Function runs → Response (JSON) → Client
```
Every single feature you build is some version of this loop.

### 2. Why we split code into files
- `main.py` — just wires everything together, no real logic
- `database.py` — the only file that knows how to connect to the DB
- `models.py` — defines database tables as Python classes (ORM)
- `schemas.py` — defines what data looks like coming in/out of the API (separate from the DB shape, on purpose)
- `routers/` — groups related endpoints instead of dumping everything in `main.py`

This separation is what makes large codebases maintainable — a random 500-line `main.py` is a red flag in any real project.

### 3. ORM (Object-Relational Mapping)
SQLAlchemy lets you write Python classes (`class User(Base):`) instead of raw SQL, and it translates your code into actual SQL behind the scenes (`CREATE TABLE`, `INSERT`, `SELECT`, etc.).

### 4. Dependency Injection (`Depends(get_db)`)
Each API request gets its **own** fresh database session, used, then properly closed — even if an error happens (`finally: db.close()`). This prevents leaking connections, which is a real production bug category.

### 5. Pydantic schemas & validation
FastAPI automatically validates incoming data against your `schemas.py` classes *before* your function even runs. Bad data (missing field, invalid email) gets auto-rejected with a clear error — you don't write manual validation code for this.

### 6. Password hashing vs. encryption (important — you asked about this)
- **Encryption is reversible** (with a key). **Hashing is one-way, permanently.**
- bcrypt hashes are **salted** — same password typed by two users produces two totally different hashes.
- bcrypt is **intentionally slow**, making brute-force attacks impractical.
- "Online decrypters" don't decrypt hashes — they guess-and-check against weak/common passwords. A leaked bcrypt hash of a decent password is not practically crackable.
- **Never store plain passwords. Ever. In any project, for the rest of your career.**

### 7. Why login returns the same error for "wrong email" and "wrong password"
Prevents **user enumeration attacks** — if error messages differed, an attacker could figure out which emails are registered on your system.

---

## 🐛 Real bugs you personally debugged (this is the actual skill)

| Bug | Root cause | Lesson |
|---|---|---|
| `ModuleNotFoundError: app.routers` | Folder named `router` instead of `routers` | Import paths must match folder names **exactly** |
| `NameError: name 'engine' is not defined` | Typo/missing import | Always check what's actually imported at the top of the file |
| `TypeError` on `SessionLocal` | `autoFlush` instead of `autoflush` | Python keyword arguments are case-sensitive |
| `ImportError: email-validator` | Missing dependency for `EmailStr` | Some features need extra packages beyond the main one |
| `KeyError: unknown CryptContext keyword 'schemas'` | Typed `schemas=` instead of `schemes=` | Easy to typo when you *just* made a file called `schemas.py` |
| `AttributeError: 'FastAPI' object has no attribute 'include_routers'` | Typed plural instead of singular | Python often suggests the fix directly in the error — read it closely |
| `NameError: name 'app' is not defined` | Used `app` before `app = FastAPI()` ran | Python executes top to bottom — order matters |
| `AttributeError: module 'app.models' has no attribute 'User'` | Class was defined as `class user` (lowercase) | Python is case-sensitive: `User` ≠ `user` |
| `.has()` vs `.hash()` | Simple typo | Always double check method names against docs |
| `bcrypt` / `passlib` version mismatch | `bcrypt` 5.0.0 incompatible with `passlib` 1.7.4 | Real backend devs constantly deal with **library version conflicts** — pinning versions (`bcrypt==4.0.1`) is a standard fix |

**Pattern to notice:** almost every bug was a small, exact-spelling issue. Backend development is unforgiving about precision — this is completely normal, not a sign you're bad at this. Reading the *last line* of a traceback and the *exact file/line number* is 90% of debugging.

---

## 🔑 Things to keep remembering going forward

1. **Commit after every working feature** — `git add . && git commit -m "..." && git push`. Small, frequent commits > one giant commit at the end.
2. **`.env` never goes to GitHub.** Already handled via `.gitignore`, but always double-check before pushing.
3. **Read tracebacks from the bottom up** — the last few lines usually tell you the real error and exact file/line.
4. **Case sensitivity matters everywhere** in Python — file names, class names, keyword arguments.
5. **You're using `create_all()` for tables now** — fine for learning, but real teams use **Alembic** (database migrations) once schemas need to change safely without losing data. We'll switch to this later.
6. **Never store plain passwords** — always hash. This is non-negotiable in any project you ever build.

---

## 🚀 What's next in the roadmap

1. **JWT authentication** — issue a token on login so the frontend can prove "this user is logged in" on future requests without resending their password
2. **Protected routes** — endpoints that require a valid token (e.g. "view my profile")
3. **Provider model** + availability system
4. **Appointment model** — the core booking logic, including preventing double-booking
5. **React frontend** — connecting the UI to these APIs
6. Later: AI assistant + voice booking layer

---

*This document is a living reference — update it as the project grows, and re-read the "bugs you debugged" table whenever you hit something that feels familiar.*

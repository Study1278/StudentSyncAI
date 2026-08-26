from fastapi import FastAPI
from app.database import engine, Base
from app import models
from app.routers import subjects, assignments, users, exams, skills, career_goals, internships
from sqlalchemy import text
from app.routers import admin
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users.router)

app.include_router(admin.router)

app.include_router(subjects.router)

app.include_router(assignments.router)

app.include_router(exams.router)

app.include_router(skills.router)

app.include_router(career_goals.router)

app.include_router(internships.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AppointAI backend is running!"}

@app.get("/test-db")
def test_db():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"database_connected": True, "result" : result.scalar()}
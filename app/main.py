from fastapi import FastAPI
from app.database import engine, Base
from app import models
from sqlalchemy import text

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "AppointAI backend is running!"}

@app.get("/test-db")
def test_db():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"database_connected": True, "result" : result.scalar()}
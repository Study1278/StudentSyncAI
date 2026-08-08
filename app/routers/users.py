from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.auth import create_access_token
from app.auth import verify_token

from app.database import SessionLocal
from app import models, schemas

router = APIRouter(prefix="/users", tags=["Users"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=schemas.UserOut)
def register_user(user: schemas.UserCreate, db: Session= Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email Already Registered")

    hashed_password = pwd_context.hash(user.password)

    new_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post("/login")
def login_user(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()

    if not user :
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not pwd_context.verify(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"user_id": user.id, "role": user.role})


    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_current_user(payload:dict =Depends(verify_token), db: Session = Depends(get_db)):
    user_id = payload.get("user_id")
    user = db.query(models.User).filter(models.User.id ==user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return{
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }
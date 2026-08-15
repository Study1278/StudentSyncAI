from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.auth import create_access_token
from app.auth import verify_token
import random
from datetime import datetime, timedelta, timezone
from app.email_utils import send_otp_email

from app.database import SessionLocal
from app import models, schemas

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

GOOGLE_CLIENT_ID = "58766295749-ndtv46el8t9aeio60ij5pfrbofqkmlv9.apps.googleusercontent.com"

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

@router.post("/google-login")
def google_login(payload: schemas.GoogleLogin, db: Session = Depends(get_db)):
    try:
        idinfo = id_token.verify_oauth2_token(
            payload.token, google_requests.Request(), GOOGLE_CLIENT_ID
        )
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    email = idinfo["email"]
    name = idinfo.get("name", email.split("@")[0])

    user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        user = models.User(
            name=name,
            email=email,
            hashed_password=None,
            oauth_provider="google"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(data={"user_id": user.id, "role": user.role})

    return {"access_token": access_token, "token_type": "bearer"}

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

@router.post("/forgot-password")
def forgot_password(request: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()

    if not user:
        return {"message": "If that email exists, an OTP has been sent."}

    otp_code = str(random.randint(100000, 999999))
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    db.query(models.PasswordResetOTP).filter(
        models.PasswordResetOTP.email == request.email
    ).delete()

    new_otp = models.PasswordResetOTP(
        email=request.email,
        otp_code=otp_code,
        expires_at=expires_at
    )
    db.add(new_otp)
    db.commit()

    send_otp_email(request.email, otp_code)

    return {"message": "If that email exists, an OTP has been sent."}


@router.post("/verify-otp")
def verify_otp(request: schemas.VerifyOTPRequest, db: Session = Depends(get_db)):
    record = db.query(models.PasswordResetOTP).filter(
        models.PasswordResetOTP.email == request.email,
        models.PasswordResetOTP.otp_code == request.otp_code
    ).first()

    if not record:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if record.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="OTP has expired")

    return {"message": "OTP verified"}


@router.post("/reset-password")
def reset_password(request: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    record = db.query(models.PasswordResetOTP).filter(
        models.PasswordResetOTP.email == request.email,
        models.PasswordResetOTP.otp_code == request.otp_code
    ).first()

    if not record:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if record.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="OTP has expired")

    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = pwd_context.hash(request.new_password)

    db.delete(record)
    db.commit()

    return {"message": "Password reset successful"}
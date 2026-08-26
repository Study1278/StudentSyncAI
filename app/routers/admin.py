from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models, schemas
from app.auth import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), payload: dict = Depends(require_admin)):
    return {
        "total_users": db.query(models.User).count(),
        "total_subjects": db.query(models.Subject).count(),
        "total_assignments": db.query(models.Assignment).count(),
        "total_exams": db.query(models.Exam).count(),
        "total_skills": db.query(models.Skill).count(),
        "total_internships": db.query(models.Internship).count(),
    }

@router.get("/users", response_model=list[schemas.UserOut])
def get_all_users(db: Session = Depends(get_db), payload: dict = Depends(require_admin)):
    return db.query(models.User).order_by(models.User.created_at.desc()).all()

@router.delete("/users/{user_id}")
def admin_delete_user(user_id: int, db: Session = Depends(get_db), payload: dict = Depends(require_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == payload.get("user_id"):
        raise HTTPException(status_code=400, detail="You cannot delete your own admin account")

    db.delete(user)
    db.commit()
    return {"detail": "User deleted"}
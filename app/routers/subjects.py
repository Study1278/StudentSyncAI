from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models, schemas
from app.auth import verify_token

router = APIRouter(prefix="/subjects", tags=["subjects"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=schemas.SubjectOut)
def create_subject(
    subject: schemas.SubjectCreate,
    db: Session = Depends(get_db),
    payload: dict = Depends(verify_token)
):
    user_id = payload.get("user_id")

    new_subject = models.Subject(
        user_id=user_id,
        name=subject.name,
        code=subject.code,
        credits=subject.credits,
        faculty_name=subject.faculty_name
    )

    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)

    return new_subject

@router.get("/", response_model=list[schemas.SubjectOut])
def get_my_subjects(
    db: Session = Depends(get_db),
    payload: dict = Depends(verify_token)
):
    user_id =payload.get("user_id")
    subjects = db.query(models.Subject).filter(models.Subject.user_id == user_id).all()
    return subjects

@router.patch("/{subject_id}", response_model=schemas.SubjectOut)
def update_subject(
    subject_id: int,
    updates: schemas.SubjectUpdate,
    db: Session = Depends(get_db),
    payload: dict = Depends(verify_token)
):
    user_id = payload.get("user_id")

    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id,
        models.Subject.user_id == user_id
    ).first()

    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(subject, field, value)

    db.commit()
    db.refresh(subject)
    return subject

@router.delete("/{subject_id}")
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    payload: dict = Depends(verify_token)
):
    user_id = payload.get("user_id")

    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id,
        models.Subject.user_id == user_id
    ).first()

    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    db.delete(subject)
    db.commit()
    return {"detail": "Subject deleted"}
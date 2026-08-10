from fastapi import  APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models, schemas
from app.auth import verify_token

router = APIRouter(prefix="/assignments", tags=["Assignments"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.AssignmentOut)
def create_assignment(
    assignment: schemas.AssignmentCreate,
    db: Session = Depends(get_db),
    payload: dict = Depends(verify_token)
):
    user_id = payload.get("user_id")

    subject = db.query(models.Subject).filter(
        models.Subject.id == assignment.subject_id,
        models.Subject.user_id == user_id
    ).first()

    if not subject: 
        raise HTTPException(status_code=404, detail="Subject not found")

    new_assignment = models.Assignment(
        subject_id=assignment.subject_id,
        title=assignment.title,
        description=assignment.description,
        due_date=assignment.due_date
    )

    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)

    return new_assignment


@router.get("/{subject_id}", response_model=list[schemas.AssignmentOut])
def get_assignment_for_subject(
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

    assignments = db.query(models.Assignment).filter(
        models.Assignment.subject_id == subject_id
    ).all()

    return assignments


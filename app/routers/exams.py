from fastapi import  APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models, schemas
from app.auth import verify_token

router = APIRouter(prefix="/exams" , tags=["Exams"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.ExamOut)
def create_exam(
    exam: schemas.ExamCreate,
    db: Session = Depends(get_db),
    payload: dict = Depends(verify_token)
):
    user_id = payload.get("user_id")

    subject = db.query(models.Subject).filter(
        models.Subject.id == exam.subject_id,
        models.Subject.user_id == user_id
    ).first()

    if not subject: 
        raise HTTPException(status_code=404, detail="Subject not found")

    new_exam = models.Exam(
        subject_id=exam.subject_id,
        title=exam.title,
        exam_date=exam.exam_date,
        syllabus=exam.syllabus,
    )

    db.add(new_exam)
    db.commit()
    db.refresh(new_exam)

    return new_exam


@router.get("/{subject_id}", response_model=list[schemas.ExamOut])
def get_exam_for_subject(
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

    exam = db.query(models.Exam).filter(
        models.Exam.subject_id == subject_id
    ).all()

    return exam


@router.patch("/{exam_id}", response_model=schemas.ExamOut)
def update_exam(
    exam_id: int,
    updates: schemas.ExamUpdate,
    db: Session = Depends(get_db),
    payload: dict = Depends(verify_token)
):
    user_id = payload.get("user_id")

    exam = db.query(models.Exam).join(models.Subject).filter(
        models.Exam.id == exam_id,
        models.Subject.user_id == user_id
    ).first()

    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(exam, field, value)

    db.commit()
    db.refresh(exam)
    return exam

@router.delete("/{exam_id}")
def delete_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    payload: dict = Depends(verify_token)
):
    user_id = payload.get("user_id")

    exam = db.query(models.Exam).join(models.Subject).filter(
        models.Exam.id == exam_id,
        models.Subject.user_id == user_id
    ).first()

    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    db.delete(exam)
    db.commit()
    return {"detail": "Exam deleted"}


@router.get("/", response_model=list[schemas.ExamOut])
def get_all_my_exams(
    db: Session = Depends(get_db),
    payload: dict = Depends(verify_token)
):
    user_id = payload.get("user_id")

    exams = db.query(models.Exam).join(models.Subject).filter(
        models.Subject.user_id == user_id
    ).all()

    return exams
        




    
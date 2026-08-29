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

# ---------- Stats ----------

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

# ---------- Users ----------

@router.get("/users", response_model=list[schemas.UserOut])
def get_all_users(db: Session = Depends(get_db), payload: dict = Depends(require_admin)):
    return db.query(models.User).order_by(models.User.created_at.desc()).all()

@router.patch("/users/{user_id}", response_model=schemas.UserOut)
def admin_update_user(
    user_id: int,
    updates: schemas.AdminUserUpdate,
    db: Session = Depends(get_db),
    payload: dict = Depends(require_admin)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = updates.model_dump(exclude_unset=True)

    if "role" in update_data and user.id == payload.get("user_id"):
        raise HTTPException(status_code=400, detail="You cannot change your own role")

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user

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

# ---------- Subjects ----------

@router.get("/subjects")
def admin_get_subjects(db: Session = Depends(get_db), payload: dict = Depends(require_admin)):
    subjects = db.query(models.Subject).all()
    return [
        {
            "id": s.id, "name": s.name, "code": s.code, "credits": s.credits,
            "owner_name": s.owner.name, "owner_email": s.owner.email
        } for s in subjects
    ]

@router.delete("/subjects/{subject_id}")
def admin_delete_subject(subject_id: int, db: Session = Depends(get_db), payload: dict = Depends(require_admin)):
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(subject)
    db.commit()
    return {"detail": "Subject deleted"}

# ---------- Assignments ----------

@router.get("/assignments")
def admin_get_assignments(db: Session = Depends(get_db), payload: dict = Depends(require_admin)):
    assignments = db.query(models.Assignment).all()
    return [
        {
            "id": a.id, "title": a.title, "status": a.status,
            "subject_name": a.subject.name,
            "owner_name": a.subject.owner.name, "owner_email": a.subject.owner.email
        } for a in assignments
    ]

@router.delete("/assignments/{assignment_id}")
def admin_delete_assignment(assignment_id: int, db: Session = Depends(get_db), payload: dict = Depends(require_admin)):
    assignment = db.query(models.Assignment).filter(models.Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    db.delete(assignment)
    db.commit()
    return {"detail": "Assignment deleted"}

# ---------- Exams ----------

@router.get("/exams")
def admin_get_exams(db: Session = Depends(get_db), payload: dict = Depends(require_admin)):
    exams = db.query(models.Exam).all()
    return [
        {
            "id": e.id, "title": e.title, "exam_date": e.exam_date,
            "subject_name": e.subject.name,
            "owner_name": e.subject.owner.name, "owner_email": e.subject.owner.email
        } for e in exams
    ]

@router.delete("/exams/{exam_id}")
def admin_delete_exam(exam_id: int, db: Session = Depends(get_db), payload: dict = Depends(require_admin)):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    db.delete(exam)
    db.commit()
    return {"detail": "Exam deleted"}

# ---------- Skills ----------

@router.get("/skills")
def admin_get_skills(db: Session = Depends(get_db), payload: dict = Depends(require_admin)):
    skills = db.query(models.Skill).all()
    return [
        {
            "id": s.id, "name": s.name, "proficiency": s.proficiency,
            "owner_name": s.owner.name, "owner_email": s.owner.email
        } for s in skills
    ]

@router.delete("/skills/{skill_id}")
def admin_delete_skill(skill_id: int, db: Session = Depends(get_db), payload: dict = Depends(require_admin)):
    skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(skill)
    db.commit()
    return {"detail": "Skill deleted"}

# ---------- Internships ----------

@router.get("/internships")
def admin_get_internships(db: Session = Depends(get_db), payload: dict = Depends(require_admin)):
    internships = db.query(models.Internship).all()
    return [
        {
            "id": i.id, "company_name": i.company_name, "role": i.role, "status": i.status,
            "owner_name": i.owner.name, "owner_email": i.owner.email
        } for i in internships
    ]

@router.delete("/internships/{internship_id}")
def admin_delete_internship(internship_id: int, db: Session = Depends(get_db), payload: dict = Depends(require_admin)):
    internship = db.query(models.Internship).filter(models.Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    db.delete(internship)
    db.commit()
    return {"detail": "Internship deleted"}
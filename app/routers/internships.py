from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models, schemas
from app.auth import verify_token

router = APIRouter(prefix="/internships", tags=["Internships"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.InternshipOut)
def create_internship(
    internship: schemas.InternshipCreate,
    db: Session = Depends(get_db),
    payload: dict = Depends(verify_token)
):
    user_id = payload.get("user_id")

    new_internship = models.Internship(
        user_id=user_id,
        company_name=internship.company_name,
        role=internship.role,
        status=internship.status
    )

    db.add(new_internship)
    db.commit()
    db.refresh(new_internship)

    return new_internship

@router.get("/", response_model=list[schemas.InternshipOut])
def get_my_internships(
    db: Session = Depends(get_db),
    payload: dict = Depends(verify_token)
):
    user_id = payload.get("user_id")
    internships = db.query(models.Internship).filter(models.Internship.user_id == user_id).all()
    return internships

@router.patch("/{internship_id}", response_model=schemas.InternshipOut)
def update_internship(
    internship_id: int,
    updates: schemas.InternshipUpdate,
    db: Session = Depends(get_db),
    payload: dict = Depends(verify_token)
):
    user_id = payload.get("user_id")

    internship = db.query(models.Internship).filter(
        models.Internship.id == internship_id,
        models.Internship.user_id == user_id
    ).first()

    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    update_data = updates.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(internship, field, value)

    db.commit()
    db.refresh(internship)

    return internship

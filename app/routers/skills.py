from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models, schemas
from app.auth import verify_token


router = APIRouter(prefix="/skills", tags=["Skills"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.SkillOut)
def create_skill(
    skill: schemas.SkillCreate,
    db: Session = Depends(get_db),
    payload:dict = Depends(verify_token)
):
    user_id = payload.get("user_id")

    new_skill = models.Skill(
        user_id= user_id,
        name=skill.name,
        proficiency= skill.proficiency
    )

    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)

    return new_skill

@router.get("/", response_model=list[schemas.SkillOut])
def get_my_skill(
    db: Session = Depends(get_db),
    payload:dict = Depends(verify_token)
):
    user_id = payload.get("user_id")
    skills = db.query(models.Skill).filter(models.Skill.user_id == user_id).all()
    return skills

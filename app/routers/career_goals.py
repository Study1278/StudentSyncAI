from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models, schemas
from app.auth import verify_token


router = APIRouter(prefix="/career-goals", tags=["Career-Goals"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=schemas.CareerGoalOut)
def create_career_goal(
    career_goal: schemas.CareerGoalCreate,
    db: Session = Depends(get_db),
    payload:dict = Depends(verify_token)
):
    user_id = payload.get("user_id")

    new_career_goal = models.CareerGoal(
        user_id= user_id,
        target_role=career_goal.target_role,
        description=career_goal.description
    )

    db.add(new_career_goal)
    db.commit()
    db.refresh(new_career_goal)

    return new_career_goal

@router.get("/", response_model=list[schemas.CareerGoalOut])
def get_my_career_goal(
    db: Session = Depends(get_db),
    payload:dict = Depends(verify_token)
):
    user_id = payload.get("user_id")
    career_goal = db.query(models.CareerGoal).filter(models.CareerGoal.user_id == user_id).all()
    return career_goal

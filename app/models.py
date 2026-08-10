from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship

class Subject(Base):
   __tablename__ = "subjects"

   id = Column(Integer, primary_key=True, index=True)
   user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
   name  = Column (String, nullable=False)
   code = Column(String, nullable=True)
   credits = Column(Integer, nullable=True)
   faculty_name = Column(String, nullable=True)
   created_at =Column(DateTime(timezone=True), server_default=func.now())

   owner = relationship("User")
   
class User(Base):
   __tablename__ = "users"

   id = Column(Integer, primary_key=True, index=True)
   name = Column(String, nullable=False)
   email = Column(String, unique=True, index=True, nullable=False)
   hashed_password = Column(String, nullable=False)
   role = Column(String, default="user")
   created_at = Column(DateTime(timezone=True), server_default=func.now())


class Assignment(Base):
   __tablename__ = "assignments"
   id = Column(Integer, primary_key=True, index=True)
   subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
   title = Column(String, nullable=False)
   description = Column(String, nullable=True)
   due_date = Column(DateTime(timezone=True), nullable=True)
   status = Column(String, default="pending")
   created_at = Column(DateTime(timezone=True), server_default=func.now())

   subject = relationship("Subject")

class Exam(Base):
   __tablename__ = "exams"
   id = Column(Integer, primary_key=True, index=True)
   subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
   title = Column(String, nullable=False)
   exam_date= Column(DateTime(timezone=True), nullable=False)
   syllabus= Column(String, nullable=True)
   created_at = Column(DateTime(timezone=True), server_default=func.now())

   exam = relationship("Subject")

class Skill(Base):
   __tablename__ = "skills"

   id = Column(Integer, primary_key=True, index=True)
   user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
   name= Column(String, nullable=False)
   proficiency = Column(String, default="beginner")
   created_at = Column(DateTime(timezone=True), server_default=func.now())

   owner = relationship("User")


class CareerGoal(Base):
    __tablename__ = "career_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_role = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User")
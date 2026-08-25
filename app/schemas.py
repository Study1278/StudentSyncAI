from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.models import ApplicationStatus

class UserCreate(BaseModel):
    name : str
    email : EmailStr
    password : str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    avatar_url: str | None

    class Config:
        from_attributes = True

class Config:
   from_attributes =True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class SubjectCreate(BaseModel):
    name: str
    code: str | None = None
    credits: int | None = None
    faculty_name: str | None = None

class SubjectOut(BaseModel):
    id: int
    name: str | None
    code: str | None
    credits: int | None
    faculty_name: str | None

class Config:
    from_attributes = True

class AssignmentCreate(BaseModel):
    subject_id: int
    title: str
    description: str | None=None
    due_date: datetime |None=None

class AssignmentOut(BaseModel):
    id: int
    subject_id: int
    title: str
    description: str | None
    due_date: datetime | None
    status: str

    class Config:
        from_attributes = True


class ExamCreate(BaseModel):
    subject_id:int 
    title:str
    exam_date: datetime 
    syllabus:str | None=None


class ExamOut(BaseModel):
    id: int
    subject_id: int
    title: str
    exam_date: datetime |None
    syllabus:str

    class Config:
        from_attributes = True

class SkillCreate(BaseModel):
    name:str
    proficiency:str | None= "beginner"

class SkillOut(BaseModel):
    id: int
    name:str
    proficiency:str

    class Config:
        from_attributes = True


class CareerGoalCreate(BaseModel):
    target_role: str
    description: str | None = None

class CareerGoalOut(BaseModel):
    id: int
    target_role: str
    description: str | None

    class Config:
        from_attributes = True

class InternshipCreate(BaseModel):
    company_name: str
    role: str
    status: ApplicationStatus | None = ApplicationStatus.applied

class InternshipOut(BaseModel):
    id: int
    company_name: str
    role: str
    status: ApplicationStatus
    applied_date: datetime

    class Config:
        from_attributes = True

class InternshipUpdate(BaseModel):
    company_name: str | None = None
    role: str | None = None
    status: ApplicationStatus | None = None

class SubjectUpdate(BaseModel):
    name: str | None = None
    code: str | None = None
    credits: int | None = None
    faculty_name: str | None = None

class SkillUpdate(BaseModel):
    name: str | None = None
    proficiency: str | None = None

class CareerGoalUpdate(BaseModel):
    target_role: str | None = None
    description: str | None = None

class AssignmentUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    due_date: datetime | None = None
    status: str | None = None

class ExamUpdate(BaseModel):
    title: str | None = None
    exam_date: datetime | None = None
    syllabus: str | None = None

class GoogleLogin(BaseModel):
    token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp_code: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp_code: str
    new_password: str

class UserUpdate(BaseModel):
    name: str | None = None
    avatar_url: str | None = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str



class MicrosoftLogin(BaseModel):
    token: str
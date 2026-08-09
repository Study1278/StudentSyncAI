from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name : str
    email : EmailStr
    password : str

class UserOut(BaseModel):
    id : int
    name : str
    email : str
    role : str

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
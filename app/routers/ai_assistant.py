import os
import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.auth import verify_token

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

# Configure the API key from your .env file
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# Initialize the model (gemini-1.5-flash is fast and great for text)
model = genai.GenerativeModel("gemini-1.5-flash")

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat_with_ai(payload: ChatRequest, current_user: dict = Depends(verify_token)):
    user_message = payload.message
    
    try:
        # Send the user's message to Gemini
        response = model.generate_content(user_message)
        
        # Return Gemini's text response to your React frontend
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
import os
import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.auth import verify_token

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

# Configure the API key from your .env file
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize the model with a generation config for faster, shorter replies
model = genai.GenerativeModel(
    "gemini-3.6-flash",
    generation_config=genai.GenerationConfig(
        max_output_tokens=300,   # caps reply length so it generates faster
        temperature=0.7,
    )
)

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
        print("AI CHAT ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))
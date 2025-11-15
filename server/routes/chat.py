from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime
import uuid

from ..services.ai_service import generate_ai_response
from ..services.emotion_service import detect_emotion

router = APIRouter(prefix="/api/chat", tags=["chat"])

sessions = {}
class ChatMessage(BaseModel):
    message: str
    study_mode: str = "active-learning"
    language: str = "en"
    session_id: Optional[str] = "demo-session"

class MessageResponse(BaseModel):
    success: bool
    response: str
    emotion: dict
    study_mode: str
    language: str
    timestamp: str
    session_id: str

class HistoryResponse(BaseModel):
    success: bool
    session_id: str
    messages: List[dict]
    study_mode: str
    language: str

@router.post("/message", response_model=MessageResponse)
async def send_message(chat_msg: ChatMessage):
    try:
        session_id = chat_msg.session_id
        if session_id not in sessions:
            sessions[session_id] = {
                "id": session_id,
                "messages": [],
                "study_mode": chat_msg.study_mode,
                "language": chat_msg.language
            }
        
        session = sessions[session_id]
        
        # Detect emotion from user message
        emotion_analysis = detect_emotion(chat_msg.message)
        print(f"📊 Emotion detected: {emotion_analysis}")
        
        # Save user message
        user_message = {
            "role": "user",
            "content": chat_msg.message,
            "timestamp": datetime.utcnow().isoformat(),
            "emotion": emotion_analysis["emotion"]
        }
        session["messages"].append(user_message)
        
        # Get conversation history (last 10 messages)
        conversation_history = session["messages"][-10:]
        
        # Generate AI response
        ai_response = await generate_ai_response(
            message=chat_msg.message,
            study_mode=chat_msg.study_mode,
            language=chat_msg.language,
            session_id=session_id
        )
        
        # Save AI response
        assistant_message = {
            "role": "assistant",
            "content": ai_response,
            "timestamp": datetime.utcnow().isoformat()
        }
        session["messages"].append(assistant_message)
        
        return MessageResponse(
            success=True,
            response=ai_response,
            emotion=emotion_analysis,
            study_mode=chat_msg.study_mode,
            language=chat_msg.language,
            timestamp=datetime.utcnow().isoformat(),
            session_id=session_id
        )
        
    except Exception as e:
        print(f" Chat error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate response: {str(e)}"
        )

@router.get("/history/{session_id}", response_model=HistoryResponse)
async def get_chat_history(session_id: str):
    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )
    
    session = sessions[session_id]
    return HistoryResponse(
        success=True,
        session_id=session_id,
        messages=session["messages"],
        study_mode=session["study_mode"],
        language=session["language"]
    )

@router.delete("/session/{session_id}")
async def clear_session(session_id: str):
    if session_id in sessions:
        del sessions[session_id]
        return {"success": True, "message": "Session cleared"}
    
    raise HTTPException(
        status_code=404,
        detail="Session not found"
    )

@router.get("/test")
async def test_ai_service():
    try:
        test_response = await generate_ai_response(
            message="Hello! Can you help me study?",
            study_mode="active-learning",
            language="en"
        )
        
        return {
            "success": True,
            "message": "AI service is working!",
            "test_response": test_response
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI service test failed: {str(e)}"
        )

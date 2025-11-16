import os
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Import Python services
from services.ai_service import generate_ai_response, initialize_gemini
from services.emotion_service import detect_emotion
from services.progress_service import track_progress, get_user_progress_stats
class ChatMessageRequest(BaseModel):
    """Chat message request"""
    message: str
    study_mode: str = "active-learning"
    language: str = "en"
    session_id: Optional[str] = None
    user_id: Optional[str] = None


class ChatMessageResponse(BaseModel):
    """Chat message response"""
    success: bool
    response: str
    timestamp: str
    study_mode: str
    language: str
    emotion: Optional[dict] = None


class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str
    timestamp: str
    gemini: bool
    database: bool


app = FastAPI(
    title="Study Buddy API",
    description="AI-powered learning platform with emotion and progress tracking",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "name": "Study Buddy API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/api/health", response_model=HealthCheckResponse, tags=["Health"])
async def health_check():
    gemini_key = bool(os.getenv("GEMINI_API_KEY"))
    database_url = bool(os.getenv("DATABASE_URL"))
    
    return HealthCheckResponse(
        status="ok",
        timestamp=datetime.now().isoformat(),
        gemini=gemini_key,
        database=database_url
    )


import uuid

@app.post("/api/chat/message", tags=["Chat"])
async def chat_message(request: ChatMessageRequest):
    # Validate message
    if not request.message or not isinstance(request.message, str):
        raise HTTPException(
            status_code=400,
            detail="Message is required and must be a string"
        )

    # Validate study mode
    valid_study_modes = ['active-learning', 'break-mode', 'focused', 'review']
    study_mode = request.study_mode if request.study_mode in valid_study_modes else 'active-learning'

    # Validate language
    valid_languages = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'hi', 'ar']
    language = request.language if request.language in valid_languages else 'en'
    if not request.session_id:
        request.session_id = str(uuid.uuid4())

    try:
        ai_response = await generate_ai_response(
            message=request.message,
            study_mode=study_mode,
            language=language,
            session_id=request.session_id,
            user_id=request.user_id
        )
        emotion_analysis = detect_emotion(request.message)

        return {
            "success": True,
            "message": request.message,
            "response": ai_response,
            "emotion": emotion_analysis,
            "study_mode": study_mode,
            "language": language,
            "session_id": request.session_id,
            "user_id": request.user_id,
            "timestamp": datetime.now().isoformat(),
        }
    except Exception as e:
        print("Chat error:", str(e))
        raise HTTPException(status_code=500, detail="AI failed")

@app.get("/api/chat/search", tags=["Chat - Phase 1"])
async def search_messages(
    query: str,
    session_id: Optional[str] = None,
    user_id: Optional[str] = None
):
    raise HTTPException(
        status_code=501,
        detail="Search requires database connection. Check DATABASE_URL in .env"
    )


@app.get("/api/emotion/trends", tags=["Analytics - Phase 5"])
async def get_emotion_trends(
    session_id: Optional[str] = None,
    user_id: Optional[str] = None
):
    raise HTTPException(
        status_code=501,
        detail="Trends requires database connection. Check DATABASE_URL in .env"
    )


@app.post("/api/messages/{message_id}/delete", tags=["Messages - Phase 4"])
async def delete_message(message_id: str):
    raise HTTPException(
        status_code=501,
        detail="Delete requires database connection. Check DATABASE_URL in .env"
    )


@app.put("/api/messages/{message_id}", tags=["Messages - Phase 4"])
async def edit_message(message_id: str, message: str):
    raise HTTPException(
        status_code=501,
        detail="Edit requires database connection. Check DATABASE_URL in .env"
    )


@app.post("/api/sessions/{session_id}/export", tags=["Sessions - Phase 6"])
async def export_session(session_id: str, format: str = "json"):
    raise HTTPException(
        status_code=501,
        detail="Export requires database connection. Check DATABASE_URL in .env"
    )


@app.get("/api/progress/{user_id}", tags=["Progress"])
async def get_progress(user_id: str):
    raise HTTPException(
        status_code=501,
        detail="Progress requires database connection. Check DATABASE_URL in .env"
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    return {
        "success": False,
        "error": exc.detail,
        "status_code": exc.status_code
    }


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    print(f"Error: {str(exc)}")
    return {
        "success": False,
        "error": "Internal server error",
        "status_code": 500
    }


@app.on_event("startup")
async def startup_event():
    """Run on startup"""
    print("=" * 50)
    print("=" * 50)
    print(f"✓ Gemini API Key: {bool(os.getenv('GEMINI_API_KEY'))}")
    print(f"✓ Database URL: {bool(os.getenv('DATABASE_URL'))}")
    print(f"✓ JWT Secret: {bool(os.getenv('JWT_SECRET'))}")
    print(f"✓ Port: {os.getenv('PORT', 5000)}")
    print("=" * 50)
    print(" Available Services:")
    print("  • AI Service (Gemini) - ✓")
    print("  • Emotion Detection - ✓")
    print("  • Progress Tracking - ✓")
    print("  • Multi-language (8 langs) - ✓")
    print("  • 4 Study Modes - ✓")
    print("=" * 50)


@app.on_event("shutdown")
async def shutdown_event():
    """Run on shutdown"""
    print("Shutting down Study Buddy API...")



if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )

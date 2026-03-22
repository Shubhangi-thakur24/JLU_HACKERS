from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from engine import QuestionEngine

# Initialize FastAPI app
app = FastAPI(title="Adaptive Question System", version="1.0.0")

# Initialize question engine
engine = QuestionEngine()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request/response
class AnswerSubmission(BaseModel):
    """Model for answer submission"""
    topic: str
    is_correct: bool
    time_taken: float


class DifficultyUpdate(BaseModel):
    """Model for difficulty update"""
    difficulty: str


@app.get("/question")
async def get_question(topic: Optional[str] = None, difficulty: Optional[str] = None):
    """
    GET /question - Returns the next adaptive question
    
    Query Parameters:
    - topic (optional): Specific topic to get question for
    - difficulty (optional): easy, medium, or hard
    
    Returns:
    {
        "id": int,
        "topic": str,
        "question": str,
        "difficulty": str,
        "correct_answer": str
    }
    """
    try:
        if difficulty:
            engine.set_difficulty(difficulty)
        
        question = engine.generate_question(topic=topic, difficulty=difficulty)
        print(f"[GET /question] Generated question: ID={question['id']}, Topic={question['topic']}")
        return question
    except Exception as e:
        print(f"[ERROR] Failed to get question: {str(e)}")
        return {"error": str(e)}, 500


@app.post("/answer")
async def submit_answer(submission: AnswerSubmission):
    """
    POST /answer - Submit user answer and receive feedback
    
    Request Body:
    {
        "topic": "Algebra",
        "is_correct": true,
        "time_taken": 15.5
    }
    
    Returns:
    {
        "success": bool,
        "message": str,
        "weak_areas": dict,
        "next_topic": str
    }
    """
    try:
        # Record the answer
        engine.record_answer(
            topic=submission.topic,
            is_correct=submission.is_correct,
            time_taken=submission.time_taken
        )
        
        # Detect weak areas
        weak_areas = engine.detect_weak_areas()
        
        # Determine next topic based on adaptive algorithm
        next_topic = weak_areas["weakest_topic"]
        
        print(f"[POST /answer] Topic: {submission.topic}, Correct: {submission.is_correct}, Time: {submission.time_taken}s")
        
        return {
            "success": True,
            "message": "Answer recorded successfully",
            "weak_areas": weak_areas,
            "next_topic": next_topic,
        }
    except Exception as e:
        print(f"[ERROR] Failed to submit answer: {str(e)}")
        return {"success": False, "error": str(e)}, 500


@app.post("/difficulty")
async def update_difficulty(update: DifficultyUpdate):
    """
    POST /difficulty - Update the question difficulty level
    
    Request Body:
    {
        "difficulty": "easy|medium|hard"
    }
    
    Returns:
    {
        "success": bool,
        "message": str,
        "current_difficulty": str
    }
    """
    try:
        engine.set_difficulty(update.difficulty)
        return {
            "success": True,
            "message": f"Difficulty updated to {update.difficulty}",
            "current_difficulty": engine.current_difficulty,
        }
    except Exception as e:
        print(f"[ERROR] Failed to update difficulty: {str(e)}")
        return {"success": False, "error": str(e)}, 500


@app.get("/stats")
async def get_stats():
    """
    GET /stats - Get user performance statistics
    
    Returns:
    {
        "weak_areas": dict,
        "history": list,
        "total_questions": int,
        "accuracy": float
    }
    """
    try:
        weak_areas = engine.detect_weak_areas()
        history = engine.get_user_history()
        
        return {
            "weak_areas": weak_areas,
            "history": history,
            "total_questions": len(history),
            "accuracy": weak_areas.get("accuracy", 0),
        }
    except Exception as e:
        print(f"[ERROR] Failed to get stats: {str(e)}")
        return {"error": str(e)}, 500


@app.get("/reset")
async def reset_session():
    """
    GET /reset - Reset the entire session (clear history and scores)
    
    Returns:
    {
        "success": bool,
        "message": str
    }
    """
    try:
        global engine
        engine = QuestionEngine()
        return {
            "success": True,
            "message": "Session reset successfully",
        }
    except Exception as e:
        print(f"[ERROR] Failed to reset session: {str(e)}")
        return {"success": False, "error": str(e)}, 500


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Adaptive Question Generation System",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    print("[START] Starting Adaptive Question System Backend...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

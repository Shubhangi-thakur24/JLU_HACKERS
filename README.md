# Adaptive Practice & Question Generation System

A complete full-stack adaptive learning system with FastAPI backend and React frontend. This system generates unlimited practice questions, analyzes user performance, detects weak areas, and automatically generates targeted questions.

## 🎯 Features

### Core Features
- **Unlimited Question Generation**: Automatically generates questions topic-wise and concept-wise
- **Adaptive Learning**: Analyzes user performance and detects weak areas
- **Performance Tracking**: Tracks correct/incorrect answers and time taken per question
- **Weak Area Detection**: Identifies and focuses on weak topics
- **Difficulty Adjustment**: Easy, Medium, and Hard difficulty levels
- **Real-time Statistics**: View performance metrics and topic scores

### Supported Topics
- **Algebra**: Linear equations with random coefficients
- **Geometry**: Area calculations for shapes
- **Calculus**: Derivative problems
- **Statistics**: Mean and median calculations
- **Logic**: Boolean logic operations

### Technology Stack
- **Backend**: FastAPI (Python) with CORS middleware
- **Frontend**: React with Axios for API calls
- **Architecture**: REST API with in-memory data storage

---

## 📁 Project Structure

```
DevClash/
├── backend/
│   ├── main.py                 # FastAPI server with endpoints
│   ├── engine.py              # Question generation & weak area detection
│   └── requirements.txt        # Python dependencies
└── frontend/
    ├── package.json           # React dependencies
    ├── public/
    │   └── index.html         # HTML entry point
    └── src/
        ├── App.js             # Main React component
        ├── App.css            # Styling
        └── index.js           # React entry point
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.8+** installed
- **Node.js 14+** and npm installed
- Git (optional)

### Step 1: Setup Backend

#### 1a. Open Terminal/PowerShell

#### 1b. Navigate to backend folder
```powershell
cd "c:\Users\LENOVO\Desktop\aditya project sql\DevClash\backend"
```

#### 1c. Create a Python Virtual Environment (Recommended)
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

If you get a PowerShell execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 1d. Install Python Dependencies
```powershell
pip install -r requirements.txt
```

#### 1e. Start the FastAPI Server
```powershell
python main.py
```

**Expected Output:**
```
[START] Starting Adaptive Question System Backend...
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

✅ **Backend is running on**: http://localhost:8000

#### 1f. Test Backend Health Check (Optional)
Open browser and visit: http://localhost:8000/health

You should see:
```json
{
  "status": "healthy",
  "service": "Adaptive Question Generation System",
  "version": "1.0.0"
}
```

---

### Step 2: Setup Frontend

#### 2a. Open a New Terminal/PowerShell Window

#### 2b. Navigate to frontend folder
```powershell
cd "c:\Users\LENOVO\Desktop\aditya project sql\DevClash\frontend"
```

#### 2c. Install React Dependencies
```powershell
npm install
```

This will download and install all required packages (~200MB, takes 2-5 minutes).

#### 2d. Start the React Development Server
```powershell
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view adaptive-question-system in the browser.

Local:            http://localhost:3000
```

The React app will automatically open in your default browser.

✅ **Frontend is running on**: http://localhost:3000

---

## 🎮 Using the Application

### Main Features

1. **Select Difficulty**
   - Click "Easy", "Medium", or "Hard" to adjust difficulty
   - The system adapts based on your selection

2. **Answer Questions**
   - Read the question carefully
   - Click "✓ Correct" if you got it right
   - Click "✗ Incorrect" if you got it wrong
   - A timer tracks how long you spent on each question

3. **View Statistics**
   - Click "📊 View Statistics" button
   - See your total questions, accuracy, average time, and weakest topic
   - View topic scores visualization (higher = weaker in that topic)

4. **Reset Session**
   - Click "🔄 Reset Session" to start fresh
   - All history and scores will be cleared

5. **Check Answer** (Optional)
   - Click "Show Answer" to verify correct answers

### Adaptive Algorithm

The system tracks:
- **Wrong Answers**: +5 points to topic weakness
- **Slow Responses (>30s)**: +3 points to topic weakness
- **Quick Correct Answers (<15s)**: -2 points to topic weakness

The weakest topic (highest score) will be focused on automatically.

---

## 🔌 API Endpoints

### 1. Get Next Question
```
GET /question
Parameters: topic (optional), difficulty (optional)

Response:
{
  "id": 1,
  "topic": "Algebra",
  "question": "Solve: x - 5 = 3",
  "difficulty": "medium",
  "correct_answer": "8"
}
```

### 2. Submit Answer
```
POST /answer
Body:
{
  "topic": "Algebra",
  "is_correct": true,
  "time_taken": 15.5
}

Response:
{
  "success": true,
  "message": "Answer recorded successfully",
  "weak_areas": {...},
  "next_topic": "Geometry"
}
```

### 3. Update Difficulty
```
POST /difficulty
Body:
{
  "difficulty": "hard"
}

Response:
{
  "success": true,
  "message": "Difficulty updated to hard",
  "current_difficulty": "hard"
}
```

### 4. Get Statistics
```
GET /stats

Response:
{
  "weak_areas": {...},
  "history": [...],
  "total_questions": 10,
  "accuracy": 80.0
}
```

### 5. Reset Session
```
GET /reset

Response:
{
  "success": true,
  "message": "Session reset successfully"
}
```

### 6. Health Check
```
GET /health

Response:
{
  "status": "healthy",
  "service": "Adaptive Question Generation System",
  "version": "1.0.0"
}
```

---

## 🐛 Debugging & Troubleshooting

### Backend Issues

**Issue: "Port 8000 already in use"**
```powershell
# Find and kill process on port 8000
Get-Process | Where-Object {$_.Id -eq (Get-NetTCPConnection -LocalPort 8000).OwningProcess}
Stop-Process -Id <PID> -Force
```

**Issue: "ModuleNotFoundError"**
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` again

**Issue: CORS errors in frontend**
- Check if backend is running on http://localhost:8000
- Backend has CORS enabled for all origins

### Frontend Issues

**Issue: "Cannot find module 'react'"**
```powershell
npm install
```

**Issue: Blank white page**
- Open browser DevTools (F12)
- Check Console tab for errors
- Ensure backend is running on port 8000

**Issue: "Connection refused" error**
- Make sure backend is running: http://localhost:8000/health
- Check firewall settings

### Debug Console Logs

Open browser DevTools (Press **F12**):
- **Console Tab**: Shows all debug logs from frontend
- **Network Tab**: Shows API requests and responses
- **Application Tab**: Shows stored data

All API calls are logged with `[FRONTEND]` prefix.
All backend operations are logged with `[RECORD]`, `[ADAPTIVE]`, `[GET]`, `[POST]` prefixes.

---

## 📊 Example Session

```
1. User opens application
2. System generates: "Algebra Easy: Solve x - 3 = 2"
3. User clicks "Correct" after 12 seconds
4. System records: Algebra +0 points (quick & correct)
5. Next question from weakest topic (maybe Geometry)
6. User clicks "Incorrect" after 25 seconds
7. System records: Geometry +5 points (wrong answer)
8. Continue... more questions generated
9. After 10 questions, user clicks "View Statistics"
10. Shows: Accuracy 70%, Avg time 18s, Weakest: Geometry
11. Geometry questions become priority
```

---

## 🎨 UI Features

- **Clean, Centered Layout**: Modern gradient background
- **Real-time Timer**: Tracks question duration
- **Color-coded Feedback**: Green for correct, Red for incorrect
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Visual Statistics**: Bar charts showing topic weakness scores
- **Smooth Animations**: Professional transitions and effects

---

## 🔧 Configuration

### Change Backend Port
Edit `main.py`, line ~124:
```python
uvicorn.run(app, host="0.0.0.0", port=8000)  # Change 8000 to desired port
```

### Change Frontend Port
```powershell
$env:PORT=3000; npm start
```

### Adjust Question Difficulty
Edit `engine.py` to modify question generation ranges.

### Modify Weak Area Detection
Edit `engine.py` in the `record_answer()` method:
```python
# Current scoring:
# Wrong answer: +5
# Slow response: +3
# Quick correct: -2
```

---

## 📈 Performance Tips

- **For Hackathon Demo**: Start fresh session, answer ~15-20 questions
- **Show Statistics**: View stats after 10+ questions for better insights
- **Mix Difficulties**: Toggle between easy/medium/hard to show adaptation
- **Explain Algorithm**: Point out how weakest topic changes as you progress

---

## 🚢 Deployment (Future)

To deploy this application:

**Backend**:
- Use Heroku, PythonAnywhere, or AWS Lambda
- Set environment variable `BACKEND_URL` in frontend

**Frontend**:
- Build: `npm run build`
- Deploy to Vercel, Netlify, or GitHub Pages

---

## 📝 License

Open source - feel free to modify and use!

---

## ✨ Future Enhancements

- Database persistence (PostgreSQL/MongoDB)
- User authentication and accounts
- Leaderboard system
- AI-powered question difficulty adjustment
- Multi-language support
- Mobile app version
- WebSocket for real-time updates
- Video explanations for answers
- Spaced repetition algorithm

---

## 📞 Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Open browser DevTools (F12) and check Console
3. Verify both backend and frontend are running
4. Try resetting the session with the "Reset & Start Over" button

---

**Enjoy your adaptive learning journey! 🚀**

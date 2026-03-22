# Code Architecture & Detailed Explanation

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER (Frontend)                      │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ React App (App.js)                                    │ │
│  │  - State Management (useState hooks)                  │ │
│  │  - Timer & Performance Tracking                       │ │
│  │  - UI Rendering & User Interaction                   │ │
│  │  - Styling (App.css)                                 │ │
│  └───────────────────────────────────────────────────────┘ │
│                           ↕                                 │
│              Axios HTTP Calls (JSON)                       │
└─────────────────────────────────────────────────────────────┘
                          ↕
              [Network - HTTP/REST]
                          ↕
┌─────────────────────────────────────────────────────────────┐
│                  FastAPI Server (Port 8000)                │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ main.py - API Endpoints                               │ │
│  │  • GET /question → Question Generation               │ │
│  │  • POST /answer → Performance Recording              │ │
│  │  • POST /difficulty → Settings                       │ │
│  │  • GET /stats → Analytics                            │ │
│  │  • GET /reset → Session Reset                        │ │
│  │  • GET /health → Health Check                        │ │
│  └───────────────────────────────────────────────────────┘ │
│                           ↕                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ engine.py - Core Logic                                │ │
│  │  • QuestionEngine Class                              │ │
│  │    - Question Generation (5 topics, 3 difficulties)  │ │
│  │    - Performance Recording                           │ │
│  │    - Weak Area Detection Algorithm                   │ │
│  │    - Adaptive Topic Selection                        │ │
│  │    - Statistics Calculation                          │ │
│  │  • In-Memory Data Storage                            │ │
│  │    - user_history: List[Dict]                        │ │
│  │    - topic_scores: Dict[str, float]                 │ │
│  └───────────────────────────────────────────────────────┘ │
│                           ↕                                 │
│              Python Data Structures (RAM)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Backend Deep Dive

### engine.py - Core Logic

#### QuestionEngine Class
```python
class QuestionEngine:
    def __init__(self):
        self.question_counter = 0        # Question ID counter
        self.user_history = []           # All answers history
        self.topic_scores = {            # Weakness tracking
            "Algebra": 0,
            "Geometry": 0,
            # ... more topics
        }
        self.current_difficulty = "medium"
```

**Key Components:**

1. **Question Generation** (Lines 24-42)
   ```python
   def generate_question(self, topic=None, difficulty=None):
       # Step 1: Get adaptive topic if not specified
       if topic is None:
           topic = self._get_adaptive_topic()
       
       # Step 2: Set difficulty
       if difficulty is None:
           difficulty = self.current_difficulty
       
       # Step 3: Route to topic-specific generator
       if topic == "Algebra":
           return self._generate_algebra_question(difficulty)
   ```

   **Flow:**
   - User requests question → API calls generate_question()
   - If no topic specified, system picks weakest topic
   - Question object created with random values
   - Returned to frontend

2. **Algebra Question Generation** (Lines 46-65)
   ```python
   def _generate_algebra_question(self, difficulty):
       if difficulty == "easy":
           a = random.randint(1, 5)      # Random 1-5
           b = random.randint(1, 5)      # Random 1-5
           x_answer = a + b              # Correct answer
           question_text = f"Solve: x - {a} = {b}"
       elif difficulty == "hard":
           a = random.randint(10, 20)    # Random 10-20
           b = random.randint(10, 20)    # Random 10-20
           c = random.randint(5, 10)     # Random 5-10
           x_answer = (b + c) / a        # More complex
           question_text = f"Solve: {a}x - {c} = {b}"
   ```

   **Randomization Strategy:**
   - Easy: Small numbers (1-5) → Simple arithmetic
   - Medium: Medium numbers (2-8) → Normal difficulty
   - Hard: Large numbers (10-20) → Complex calculations

3. **Performance Recording** (Lines 144-177)
   ```python
   def record_answer(self, topic, is_correct, time_taken):
       # Step 1: Store in history
       self.user_history.append({
           "topic": topic,
           "is_correct": is_correct,
           "time_taken": time_taken,
           "timestamp": time.time()
       })
       
       # Step 2: Calculate weakness score change
       score_change = 0
       if not is_correct:
           score_change += 5        # Wrong answer penalty
       if time_taken > 30:
           score_change += 3        # Slow response penalty
       if is_correct and time_taken <= 15:
           score_change -= 2        # Quick correct bonus
       
       # Step 3: Update topic score
       self.topic_scores[topic] += score_change
   ```

   **Weak Area Detection Logic:**
   - Wrong Answer: +5 points to topic weakness
   - Slow Response (>30s): +3 points extra
   - Quick Correct (<15s): -2 points (improve this topic)
   - Result: Topics with more wrong/slow answers get higher scores

4. **Adaptive Topic Selection** (Lines 179-189)
   ```python
   def _get_adaptive_topic(self):
       if not self.topic_scores:
           return "Algebra"  # Default
       
       # Find topic with HIGHEST weakness score
       weakest_topic = max(self.topic_scores, key=self.topic_scores.get)
       return weakest_topic
   ```

   **Logic:**
   - Scores higher = Topic weaker
   - System focuses on highest score topic
   - Auto-selection is the adaptive magic!

### main.py - API Endpoints

#### Endpoint 1: GET /question
```python
@app.get("/question")
async def get_question(topic: Optional[str] = None, difficulty: Optional[str] = None):
    # Called by: Frontend periodically
    # Purpose: Return next question
    # Response: Question object with 5 fields
    return {
        "id": question_id,
        "topic": "Algebra",
        "question": "Solve: x - 5 = 3",
        "difficulty": "medium",
        "correct_answer": "8"
    }
```

**Request Flow:**
```
Frontend Click → axios.get("/question") 
→ Matches route → Calls QuestionEngine.generate_question()
→ Returns JSON → Frontend displays question
```

#### Endpoint 2: POST /answer
```python
@app.post("/answer")
async def submit_answer(submission: AnswerSubmission):
    # Called by: Frontend after user clicks Correct/Incorrect
    # Purpose: Record answer, detect weak areas
    # Response: Success + weak areas + next topic
    
    engine.record_answer(
        topic=submission.topic,
        is_correct=submission.is_correct,
        time_taken=submission.time_taken
    )
    
    weak_areas = engine.detect_weak_areas()
    return {
        "success": True,
        "weak_areas": weak_areas,
        "next_topic": weak_areas["weakest_topic"]
    }
```

**Request Flow:**
```
Frontend Click → axios.post("/answer", {topic, is_correct, time_taken})
→ Matches route → Calls QuestionEngine.record_answer()
→ Weak areas detected → Calculates next topic
→ Returns weak areas + next topic → Frontend knows what's weak
```

**Key Insight:**
- Weak area detection happens server-side
- Frontend doesn't need to know the algorithm
- System decides next direction automatically

---

## 🎨 Frontend Deep Dive

### App.js - React Component Structure

#### State Variables (Lines 10-15)
```javascript
const [question, setQuestion] = useState(null);           // Current question
const [loading, setLoading] = useState(false);            // Loading state
const [timeElapsed, setTimeElapsed] = useState(0);        // Seconds elapsed
const [questionStartTime, setQuestionStartTime] = useState(null); // Start time
const [difficulty, setDifficulty] = useState('medium');   // Current difficulty
const [stats, setStats] = useState(null);                 // Stats cache
const [showStats, setShowStats] = useState(false);        // Show stats view
const [submitted, setSubmitted] = useState(false);        // Answer submitted?
```

**State Management Pattern:**
- State variables track all data
- Re-render triggers when state changes
- useEffect hooks trigger side effects
- Axios for API calls

#### Effect: Fetch Question on Mount (Lines 22-24)
```javascript
useEffect(() => {
    fetchQuestion();  // Called when component mounts
}, []);  // Empty dependency = runs once on load
```

**Purpose:** Load first question when app starts

#### Effect: Timer (Lines 26-38)
```javascript
useEffect(() => {
    if (!submitted && questionStartTime) {
        const interval = setInterval(() => {
            // Every 100ms, update time elapsed
            setTimeElapsed(Math.round((Date.now() - questionStartTime) / 1000));
        }, 100);
        
        return () => clearInterval(interval);
    }
}, [submitted, questionStartTime]);  // Re-run when these change
```

**Logic:**
- Calculate current time: `Date.now()`
- Subtract question start time: `Date.now() - questionStartTime`
- Convert to seconds and round
- Stop timer when submitted (stop effect)
- Cleanup interval on unmount

**Timeline Example:**
```
Question loaded at: 15:23:45.100 (questionStartTime)
Current time: 15:23:50.200
Elapsed: 50.200 - 45.100 = 5100ms = 5.1 seconds → displays "5s"
```

#### Function: fetchQuestion (Lines 40-60)
```javascript
const fetchQuestion = async (topic = null, diff = difficulty) => {
    try {
        setLoading(true);
        setSubmitted(false);
        setTimeElapsed(0);
        setQuestionStartTime(Date.now());  // Reset timer
        
        const response = await axios.get(`${BACKEND_URL}/question`, { params });
        
        setQuestion(response.data);  // Update state with new question
    } catch (error) {
        alert('Failed to fetch question. Is backend running?');
    } finally {
        setLoading(false);
    }
};
```

**Flow:**
```
1. Set loading = true (show spinner)
2. Reset previous question state
3. Record current time as start time
4. Make axios GET request to backend
5. Backend returns question
6. Update state with new question (triggers re-render)
7. Question displays to user
```

#### Function: submitAnswer (Lines 62-97)
```javascript
const submitAnswer = async (isCorrect) => {
    try {
        setSubmitted(true);  // Stop timer
        const timeTaken = timeElapsed || 1;  // Get elapsed time
        
        // POST to backend
        const response = await axios.post(`${BACKEND_URL}/answer`, {
            topic: question.topic,
            is_correct: isCorrect,
            time_taken: timeTaken
        });
        
        // Show feedback
        alert(`${isCorrect ? '✓ Correct' : '✗ Incorrect'}! Time: ${timeTaken}s`);
        
        // Fetch next question after 500ms delay
        setTimeout(() => {
            fetchQuestion(response.data.next_topic, difficulty);
        }, 500);
    } catch (error) {
        alert('Failed to submit answer');
    }
};
```

**Sequence:**
```
1. User clicks Correct/Incorrect
2. submitAnswer called with true/false
3. Timer stopped (submitted = true)
4. POST request sent with topic, correctness, time
5. Backend processes, detects weak areas
6. Response includes next_topic
7. Show feedback alert to user
8. Wait 500ms for user to read feedback
9. Fetch next question from next_topic
10. Loop continues!
```

#### Rendering Logic (Lines 138-185)
```javascript
{!showStats && question && (
    <div className="question-container">
        {/* Show question if not in stats view and question exists */}
    </div>
)}

{showStats && stats && (
    <div className="stats-container">
        {/* Show stats if stats view is active */}
    </div>
)}
```

**Conditional Rendering:**
- Show question container if: NOT in stats view AND question loaded
- Show stats container if: in stats view AND stats loaded
- Only one section visible at a time

### App.css - Styling Strategy

#### Gradient Background
```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

**Creates:**
- Purple to darker purple gradient
- 135-degree angle (top-left to bottom-right)
- Professional, modern look

#### Responsive Grid
```css
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}
```

**Behavior:**
- Desktop: 4 columns (if space)
- Tablet: 2 columns
- Mobile: 1 column (auto-adjusts)

#### Animation Example
```css
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.container {
    animation: fadeIn 0.5s ease-out 0.2s both;
}
```

**Creates smooth fade-in effect:**
- Starts invisible and 20px lower
- Animates over 0.5 seconds
- Starts 0.2s after page load
- Ends visible and at original position

---

## 🔄 Data Flow Example

### Complete User Journey

```
╔═════════════════════════════════════════════════════════════════════╗
║                    USER OPENS APP                                   ║
╚═════════════════════════════════════════════════════════════════════╝
                              ↓
         App.js component mounts
         useEffect triggers fetchQuestion()
                              ↓
    ┌─────────────────────────────────────┐
    │ Frontend: axios.get("/question")     │
    └─────────────────────────────────────┘
                              ↓
    ┌─────────────────────────────────────┐
    │ Backend: GET /question endpoint      │
    │ 1. Calls engine._get_adaptive_topic()│
    │    (Returns "Algebra" - random start)│
    │ 2. Calls engine.generate_question()  │
    │ 3. Creates: "Solve: x - 5 = 3"      │
    │ 4. Returns JSON                      │
    └─────────────────────────────────────┘
                              ↓
    ┌─────────────────────────────────────┐
    │ Frontend: setQuestion(response.data) │
    │ State updated → Component re-renders │
    │ Question displays on screen          │
    └─────────────────────────────────────┘
                              ↓
         ╔══════════════════════════════╗
         ║  USER READS QUESTION         ║
         ║  Timer starts automatically  ║
         ║  Every 100ms: update display ║
         ║  "⏱️ Time: 3s"               ║
         ╚══════════════════════════════╝
                              ↓
         USER CLICKS "✓ CORRECT"
         submitAnswer(true) called
                              ↓
    ┌─────────────────────────────────────┐
    │ Frontend: setSubmitted(true)         │
    │ (Timer stops - no more updates)     │
    │ timeTaken = 15 seconds              │
    └─────────────────────────────────────┘
                              ↓
    ┌─────────────────────────────────────┐
    │ Frontend: axios.post("/answer")      │
    │ Payload: {                           │
    │   "topic": "Algebra",                │
    │   "is_correct": true,                │
    │   "time_taken": 15                   │
    │ }                                    │
    └─────────────────────────────────────┘
                              ↓
    ┌─────────────────────────────────────┐
    │ Backend: POST /answer endpoint       │
    │ 1. Calls engine.record_answer()      │
    │    - Saves to history                │
    │    - Updates topic_scores:           │
    │      Algebra score: 0 + (-2) = -2    │
    │      (Correct + quick = -2)          │
    │ 2. Calls engine.detect_weak_areas()  │
    │    - Finds max score topic           │
    │    - Say "Geometry" has score 5      │
    │ 3. Returns JSON:                     │
    │    {                                 │
    │      "weak_areas": {...},            │
    │      "next_topic": "Geometry"        │
    │    }                                 │
    └─────────────────────────────────────┘
                              ↓
    ┌─────────────────────────────────────┐
    │ Frontend: receive response           │
    │ Show alert: "✓ Correct! Time: 15s"  │
    │ Wait 500ms for user to read         │
    └─────────────────────────────────────┘
                              ↓
    ┌─────────────────────────────────────┐
    │ Frontend: fetchQuestion("Geometry") │
    │ Axios GET /question?topic=Geometry   │
    └─────────────────────────────────────┘
                              ↓
    ┌─────────────────────────────────────┐
    │ Backend: Generate GEOMETRY question  │
    │ Creates: "Find area of rectangle..." │
    │ Returns JSON                         │
    └─────────────────────────────────────┘
                              ↓
    ┌─────────────────────────────────────┐
    │ Frontend: Display new question       │
    │ Timer resets to 0                    │
    │ New question displayed               │
    └─────────────────────────────────────┘
                              ↓
         🔄 LOOP CONTINUES...
         Next question from Geometry topic
         (because it's the weakest area!)
```

---

## 📊 Weak Area Detection Algorithm Visualization

### Score Tracking Table

```
┌─────────────┬────────┬──────────┬────────────┬────────────┐
│ Topic       │ Start  │ Question │ Change     │ Total      │
│             │ Score  │ Details  │            │ Score      │
├─────────────┼────────┼──────────┼────────────┼────────────┤
│ Algebra     │ 0      │ ✓ Fast   │ -2         │ -2         │
│             │        │ (12s)    │            │            │
├─────────────┼────────┼──────────┼────────────┼────────────┤
│ Geometry    │ 0      │ ✗ Slow   │ +5 +3      │ 8          │
│             │        │ (45s)    │            │            │
├─────────────┼────────┼──────────┼────────────┼────────────┤
│ Calculus    │ 0      │ ✓ Slow   │ +3 -2      │ 1          │
│             │        │ (35s)    │            │            │
├─────────────┼────────┼──────────┼────────────┼────────────┤
│ Statistics  │ 0      │ ✗ Fast   │ +5         │ 5          │
│             │        │ (10s)    │            │            │
├─────────────┼────────┼──────────┼────────────┼────────────┤
│ Logic       │ 0      │ ✓ Fast   │ -2         │ -2         │
│             │        │ (8s)     │            │            │
└─────────────┴────────┴──────────┴────────────┴────────────┘

RESULT: Geometry is WEAKEST (score 8)
        Next questions will focus on Geometry!
```

### Score Interpretation

```
Negative Score (-2)   → Good performance, this topic is strong
0-2 Score           → Average performance
3-5 Score           → Weaker, needs focus
6+ Score            → Weakest, system prioritizes this
```

---

## 🔌 API Communication Details

### Request/Response Cycle

#### GET /question Request
```
GET /question?topic=Algebra&difficulty=easy

Headers:
  Accept: application/json
  Content-Type: application/json
  Origin: http://localhost:3000
```

#### GET /question Response
```json
HTTP/1.1 200 OK

{
  "id": 5,
  "topic": "Algebra",
  "question": "Solve: x - 3 = 7",
  "difficulty": "easy",
  "correct_answer": "10"
}
```

#### POST /answer Request
```
POST /answer

Headers:
  Content-Type: application/json
  Origin: http://localhost:3000

Body:
{
  "topic": "Algebra",
  "is_correct": true,
  "time_taken": 12.5
}
```

#### POST /answer Response
```json
HTTP/1.1 200 OK

{
  "success": true,
  "message": "Answer recorded successfully",
  "weak_areas": {
    "weakest_topic": "Geometry",
    "topic_scores": {
      "Algebra": -2,
      "Geometry": 8,
      "Calculus": 1,
      "Statistics": 5,
      "Logic": -2
    },
    "total_questions": 5,
    "total_correct": 3,
    "accuracy": 60.0,
    "average_time": 20.4
  },
  "next_topic": "Geometry"
}
```

---

## 🎯 Key Design Patterns Used

### 1. **Async/Await Pattern** (Frontend)
```javascript
const fetchQuestion = async () => {
    try {
        const response = await axios.get(url);
        setQuestion(response.data);
    } catch (error) {
        alert('Error!');
    }
};
```

**Benefit:** Clean, readable async code

### 2. **Pydantic Models** (Backend)
```python
class AnswerSubmission(BaseModel):
    topic: str
    is_correct: bool
    time_taken: float
```

**Benefit:** Auto validation, type hints

### 3. **React Hooks** (Frontend)
```javascript
const [question, setQuestion] = useState(null);
useEffect(() => { /* side effect */ }, []);
```

**Benefit:** Modern state management, side effects

### 4. **Separation of Concerns** (Backend)
- `main.py`: API endpoints & routing
- `engine.py`: Business logic & algorithms
- Clear separation makes code testable

### 5. **CSS Grid & Flexbox** (Frontend)
```css
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

**Benefit:** Responsive without media queries

---

## 💡 Why This Architecture Works

1. **Scalability**
   - Backend: Easy to add database
   - Frontend: Easy to add pages
   - API is clearly defined

2. **Maintainability**
   - Clean code structure
   - Single responsibility principle
   - Easy to debug and modify

3. **Performance**
   - In-memory data (fast for hackathon)
   - Simple calculations
   - Minimal network overhead

4. **User Experience**
   - Responsive UI
   - Real-time feedback
   - Smooth animations
   - Mobile-friendly

---

This architecture is beginner-friendly yet production-ready!

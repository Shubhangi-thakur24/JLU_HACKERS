import random
import time
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict


@dataclass
class Question:
    """Represents a single question"""
    id: int
    topic: str
    question: str
    correct_answer: str
    difficulty: str


class QuestionEngine:
    """Core engine for generating adaptive questions and detecting weak areas"""

    def __init__(self):
        """Initialize the question engine"""
        self.question_counter = 0
        self.user_history: List[Dict] = []
        self.topic_scores: Dict[str, float] = {
            "Algebra": 0,
            "Geometry": 0,
            "Calculus": 0,
            "Statistics": 0,
            "Logic": 0,
        }
        self.current_difficulty = "medium"

    def generate_question(self, topic: Optional[str] = None, difficulty: Optional[str] = None) -> Dict:
        """Generate a random question based on topic and difficulty"""
        if topic is None:
            topic = self._get_adaptive_topic()
        if difficulty is None:
            difficulty = self.current_difficulty

        self.question_counter += 1

        # Question generation based on topic
        if topic == "Algebra":
            return self._generate_algebra_question(difficulty)
        elif topic == "Geometry":
            return self._generate_geometry_question(difficulty)
        elif topic == "Calculus":
            return self._generate_calculus_question(difficulty)
        elif topic == "Statistics":
            return self._generate_statistics_question(difficulty)
        elif topic == "Logic":
            return self._generate_logic_question(difficulty)
        else:
            return self._generate_algebra_question(difficulty)

    def _generate_algebra_question(self, difficulty: str) -> Dict:
        """Generate algebra questions with random values"""
        if difficulty == "easy":
            a = random.randint(1, 5)
            b = random.randint(1, 5)
            x_answer = a + b
            question_text = f"Solve: x - {a} = {b}"
        elif difficulty == "hard":
            a = random.randint(10, 20)
            b = random.randint(10, 20)
            c = random.randint(5, 10)
            x_answer = (b + c) / a
            question_text = f"Solve: {a}x - {c} = {b}"
        else:  # medium
            a = random.randint(2, 8)
            b = random.randint(2, 8)
            x_answer = a + b
            question_text = f"Solve: x - {a} = {b}"

        return {
            "id": self.question_counter,
            "topic": "Algebra",
            "question": question_text,
            "difficulty": difficulty,
            "correct_answer": str(x_answer),
        }

    def _generate_geometry_question(self, difficulty: str) -> Dict:
        """Generate geometry questions"""
        if difficulty == "easy":
            side = random.randint(1, 5)
            area = side * side
            question_text = f"Find the area of a square with side = {side}"
        elif difficulty == "hard":
            radius = random.randint(5, 10)
            area = round(3.14159 * radius * radius, 2)
            question_text = f"Find the area of a circle with radius = {radius} (use π ≈ 3.14159)"
        else:  # medium
            length = random.randint(2, 8)
            width = random.randint(2, 8)
            area = length * width
            question_text = f"Find the area of a rectangle with length = {length} and width = {width}"

        return {
            "id": self.question_counter,
            "topic": "Geometry",
            "question": question_text,
            "difficulty": difficulty,
            "correct_answer": str(area),
        }

    def _generate_calculus_question(self, difficulty: str) -> Dict:
        """Generate calculus questions (simplified)"""
        if difficulty == "easy":
            a = random.randint(1, 5)
            question_text = f"Find the derivative of f(x) = {a}x²"
            answer = f"{2 * a}x"
        elif difficulty == "hard":
            a = random.randint(3, 7)
            b = random.randint(2, 5)
            question_text = f"Find the derivative of f(x) = {a}x³ + {b}x"
            answer = f"{3 * a}x² + {b}"
        else:  # medium
            a = random.randint(2, 6)
            question_text = f"Find the derivative of f(x) = {a}x³"
            answer = f"{3 * a}x²"

        return {
            "id": self.question_counter,
            "topic": "Calculus",
            "question": question_text,
            "difficulty": difficulty,
            "correct_answer": answer,
        }

    def _generate_statistics_question(self, difficulty: str) -> Dict:
        """Generate statistics questions"""
        if difficulty == "easy":
            numbers = [random.randint(1, 10) for _ in range(3)]
            mean = sum(numbers) / len(numbers)
            question_text = f"Find the mean of: {numbers}"
        elif difficulty == "hard":
            numbers = [random.randint(1, 100) for _ in range(5)]
            sorted_nums = sorted(numbers)
            median = sorted_nums[len(sorted_nums) // 2]
            question_text = f"Find the median of: {numbers}"
            mean = median
        else:  # medium
            numbers = [random.randint(1, 50) for _ in range(4)]
            mean = sum(numbers) / len(numbers)
            question_text = f"Find the mean of: {numbers}"

        return {
            "id": self.question_counter,
            "topic": "Statistics",
            "question": question_text,
            "difficulty": difficulty,
            "correct_answer": str(round(mean, 2)),
        }

    def _generate_logic_question(self, difficulty: str) -> Dict:
        """Generate logic questions"""
        logic_questions = [
            {"q": "If A is true and B is false, what is A AND B?", "a": "false"},
            {"q": "If A is true and B is false, what is A OR B?", "a": "true"},
            {"q": "If A is true, what is NOT A?", "a": "false"},
            {"q": "If A is false and B is false, what is A OR B?", "a": "false"},
            {"q": "If A is true and B is true, what is A AND B?", "a": "true"},
        ]
        selected = random.choice(logic_questions)

        return {
            "id": self.question_counter,
            "topic": "Logic",
            "question": selected["q"],
            "difficulty": difficulty,
            "correct_answer": selected["a"],
        }

    def record_answer(self, topic: str, is_correct: bool, time_taken: float) -> None:
        """Record user answer and update scores"""
        self.user_history.append({
            "topic": topic,
            "is_correct": is_correct,
            "time_taken": time_taken,
            "timestamp": time.time(),
        })

        # Update topic scores based on performance
        score_change = 0

        # Penalize wrong answers
        if not is_correct:
            score_change += 5  # Increase weakness score for wrong answer

        # Penalize slow responses (>30 seconds)
        if time_taken > 30:
            score_change += 3  # Increase weakness score for slow response

        # Reward correct quick answers
        if is_correct and time_taken <= 15:
            score_change -= 2  # Decrease weakness score for quick correct answer

        self.topic_scores[topic] += score_change

        # Ensure scores don't go below 0
        if self.topic_scores[topic] < 0:
            self.topic_scores[topic] = 0

        print(f"[RECORD] Topic: {topic}, Correct: {is_correct}, Time: {time_taken}s, Score Change: {score_change}")

    def _get_adaptive_topic(self) -> str:
        """Get the weakest topic to focus on"""
        if not self.topic_scores:
            return "Algebra"

        # Find topic with highest weakness score
        weakest_topic = max(self.topic_scores, key=self.topic_scores.get)
        print(f"[ADAPTIVE] Weakest topic: {weakest_topic} with score {self.topic_scores[weakest_topic]}")
        return weakest_topic

    def set_difficulty(self, difficulty: str) -> None:
        """Update the current difficulty level"""
        if difficulty in ["easy", "medium", "hard"]:
            self.current_difficulty = difficulty
            print(f"[DIFFICULTY] Changed to: {difficulty}")

    def detect_weak_areas(self) -> Dict:
        """Detect and return weak areas with detailed analysis"""
        if not self.user_history:
            return {
                "weakest_topic": "Algebra",
                "topic_scores": self.topic_scores,
                "total_questions": 0,
                "total_correct": 0,
                "average_time": 0,
            }

        total_questions = len(self.user_history)
        total_correct = sum(1 for h in self.user_history if h["is_correct"])
        average_time = sum(h["time_taken"] for h in self.user_history) / total_questions

        return {
            "weakest_topic": self._get_adaptive_topic(),
            "topic_scores": self.topic_scores.copy(),
            "total_questions": total_questions,
            "total_correct": total_correct,
            "accuracy": round(total_correct / total_questions * 100, 2),
            "average_time": round(average_time, 2),
        }

    def get_user_history(self) -> List[Dict]:
        """Get complete user history"""
        return self.user_history.copy()

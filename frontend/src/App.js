import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const BACKEND_URL = 'http://localhost:8000';

function App() {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch next question on component mount
  useEffect(() => {
    fetchQuestion();
  }, []);

  // Timer effect
  useEffect(() => {
    if (!submitted && questionStartTime) {
      const interval = setInterval(() => {
        setTimeElapsed(Math.round((Date.now() - questionStartTime) / 1000));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [submitted, questionStartTime]);

  const fetchQuestion = async (topic = null, diff = difficulty) => {
    try {
      setLoading(true);
      setSubmitted(false);
      setTimeElapsed(0);
      setQuestionStartTime(Date.now());

      const params = {};
      if (topic) params.topic = topic;
      if (diff) params.difficulty = diff;

      const response = await axios.get(`${BACKEND_URL}/question`, { params });
      
      console.log('[FRONTEND] Question received:', response.data);
      setQuestion(response.data);
    } catch (error) {
      console.error('[ERROR] Failed to fetch question:', error);
      alert('Failed to fetch question. Is the backend running on port 8000?');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (isCorrect) => {
    if (!question) return;

    try {
      setSubmitted(true);
      const timeTaken = timeElapsed || 1;

      console.log('[FRONTEND] Submitting answer:', {
        topic: question.topic,
        is_correct: isCorrect,
        time_taken: timeTaken,
      });

      const response = await axios.post(`${BACKEND_URL}/answer`, {
        topic: question.topic,
        is_correct: isCorrect,
        time_taken: timeTaken,
      });

      console.log('[FRONTEND] Answer response:', response.data);

      // Show feedback
      const feedback = isCorrect 
        ? `✓ Correct! Time: ${timeTaken}s` 
        : `✗ Incorrect! Time: ${timeTaken}s`;
      
      alert(feedback + `\n\nNext focus: ${response.data.next_topic}`);

      // Fetch next question
      setTimeout(() => {
        fetchQuestion(response.data.next_topic, difficulty);
      }, 500);
    } catch (error) {
      console.error('[ERROR] Failed to submit answer:', error);
      alert('Failed to submit answer.');
    }
  };

  const handleDifficultyChange = async (newDifficulty) => {
    try {
      setDifficulty(newDifficulty);
      
      const response = await axios.post(`${BACKEND_URL}/difficulty`, {
        difficulty: newDifficulty,
      });

      console.log('[FRONTEND] Difficulty updated:', response.data);
      fetchQuestion(null, newDifficulty);
    } catch (error) {
      console.error('[ERROR] Failed to update difficulty:', error);
    }
  };

  const handleViewStats = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/stats`);
      console.log('[FRONTEND] Stats received:', response.data);
      setStats(response.data);
      setShowStats(true);
    } catch (error) {
      console.error('[ERROR] Failed to fetch stats:', error);
    }
  };

  const handleReset = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/reset`);
      console.log('[FRONTEND] Session reset:', response.data);
      setStats(null);
      setShowStats(false);
      setTimeElapsed(0);
      setQuestionStartTime(Date.now());
      fetchQuestion();
      alert('Session reset! Starting fresh...');
    } catch (error) {
      console.error('[ERROR] Failed to reset:', error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎓 Adaptive Practice System</h1>
        <p>Machine-learning powered intelligent question generation</p>
      </header>

      <div className="container">
        {/* Difficulty Selector */}
        <div className="difficulty-selector">
          <label htmlFor="difficulty">Difficulty Level:</label>
          <div className="button-group">
            {['easy', 'medium', 'hard'].map((level) => (
              <button
                key={level}
                className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
                onClick={() => handleDifficultyChange(level)}
              >
                {level.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Question Display */}
        {!showStats && question && (
          <div className="question-container">
            <div className="question-header">
              <div className="question-meta">
                <span className="topic-badge">{question.topic}</span>
                <span className="difficulty-badge">{question.difficulty.toUpperCase()}</span>
              </div>
              <div className="timer">
                <span className="timer-label">⏱️ Time:</span>
                <span className="timer-value">{timeElapsed}s</span>
              </div>
            </div>

            <div className="question-text">
              <h2>Q{question.id}: {question.question}</h2>
            </div>

            <div className="button-container">
              <button
                className="answer-btn correct-btn"
                onClick={() => submitAnswer(true)}
                disabled={submitted || loading}
              >
                ✓ Correct
              </button>
              <button
                className="answer-btn incorrect-btn"
                onClick={() => submitAnswer(false)}
                disabled={submitted || loading}
              >
                ✗ Incorrect
              </button>
            </div>

            <div className="hint">
              <details>
                <summary>Show Answer (for verification)</summary>
                <p><strong>Answer:</strong> {question.correct_answer}</p>
              </details>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading">
            <p>📚 Generating next question...</p>
          </div>
        )}

        {/* Stats View */}
        {showStats && stats && (
          <div className="stats-container">
            <h2>📊 Your Performance Statistics</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Questions</h3>
                <p className="stat-value">{stats.total_questions}</p>
              </div>
              <div className="stat-card">
                <h3>Accuracy</h3>
                <p className="stat-value">{stats.accuracy}%</p>
              </div>
              <div className="stat-card">
                <h3>Avg Time/Question</h3>
                <p className="stat-value">{stats.weak_areas.average_time}s</p>
              </div>
              <div className="stat-card">
                <h3>Weakest Topic</h3>
                <p className="stat-value">{stats.weak_areas.weakest_topic}</p>
              </div>
            </div>

            <div className="topic-scores">
              <h3>Topic Scores (Higher = Weaker)</h3>
              <div className="scores-list">
                {Object.entries(stats.weak_areas.topic_scores).map(([topic, score]) => (
                  <div key={topic} className="score-item">
                    <span className="topic-name">{topic}</span>
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ width: `${Math.min(score / 2, 100)}%` }}
                      ></div>
                    </div>
                    <span className="score-value">{Math.round(score)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="button-container">
              <button 
                className="nav-btn"
                onClick={() => setShowStats(false)}
              >
                ← Back to Practice
              </button>
              <button 
                className="reset-btn"
                onClick={handleReset}
              >
                🔄 Reset & Start Over
              </button>
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <footer className="footer">
          <button 
            className="nav-btn"
            onClick={handleViewStats}
          >
            📊 View Statistics
          </button>
          <button 
            className="nav-btn"
            onClick={handleReset}
          >
            🔄 Reset Session
          </button>
          <p className="footer-text">
            Backend: {question ? '✓ Connected' : '⊘ Connecting...'}
          </p>
        </footer>
      </div>

      {/* Debug Console */}
      <div className="debug-console">
        <p>💡 Check browser console (F12) for detailed debug logs</p>
      </div>
    </div>
  );
}

export default App;

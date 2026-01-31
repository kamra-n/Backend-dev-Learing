import { useState } from 'react';
import { useDeepgramTTS } from './hooks/useDeepgramTTS';
import './App.css';

function App() {
  const [text, setText] = useState(
    "Hello! Welcome to Deepgram's text to speech service. This audio is streaming in real-time as it's being generated."
  );

  const { play, status, isPlaying, isError, isSuccess } = useDeepgramTTS();

  const handlePlay = () => {
    play(text);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="url(#gradient)" strokeWidth="2" />
              <path d="M10 16 L14 20 L22 12" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>Text to Speech</h1>
          <p className="subtitle">Powered by Deepgram AI</p>
        </div>

        <div className="input-section">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert to speech..."
            rows={4}
          />
        </div>

        <button
          className={`play-button ${isPlaying ? 'loading' : ''}`}
          onClick={handlePlay}
          disabled={isPlaying}
        >
          <span className="button-content">
            <svg className="play-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            <span className="button-text">Play Audio</span>
          </span>
          <span className="loading-content">
            <div className="spinner"></div>
            <span className="button-text">Streaming...</span>
          </span>
        </button>

        <div className={`audio-visualizer ${isPlaying ? 'active' : ''}`}>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bar"></div>
          ))}
        </div>

        <div className={`status ${isError ? 'error' : ''} ${isSuccess ? 'success' : ''}`}>
          {status}
        </div>
      </div>
    </div>
  );
}

export default App;

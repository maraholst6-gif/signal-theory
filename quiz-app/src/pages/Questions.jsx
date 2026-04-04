import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import { questions } from '../data/questions.js';
import { calculateScores, getProfile } from '../utils/scoring.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Questions() {
  const navigate = useNavigate();
  const location = useLocation();
  const isReview = location.state?.reviewMode === true;
  const reviewAnswers = location.state?.reviewAnswers;

  const [shuffledQuestions] = useState(() =>
    isReview ? questions : shuffle(questions)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(reviewAnswers || Array(15).fill(null));
  const [selected, setSelected] = useState(
    isReview ? (reviewAnswers?.[0] ?? null) : null
  );

  const currentQuestion = shuffledQuestions[currentIndex];
  const isLast = currentIndex === shuffledQuestions.length - 1;

  const handleSelect = (option) => {
    setSelected(option);
  };

  const handleNext = () => {
    if (!selected && !isReview) return;

    const newAnswers = [...answers];
    if (selected) newAnswers[currentIndex] = selected;
    setAnswers(newAnswers);

    if (isLast) {
      if (isReview) {
        navigate(-1);
      } else {
        const scores = calculateScores(newAnswers);
        const profileId = getProfile(scores);
        navigate(`/results?profile=${profileId}`, { state: { scores, answers: newAnswers } });
      }
    } else {
      setSelected(newAnswers[currentIndex + 1]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      if (isReview) {
        navigate(-1);
      } else {
        navigate('/');
      }
      return;
    }
    setSelected(answers[currentIndex - 1]);
    setCurrentIndex(currentIndex - 1);
  };

  const canAdvance = !!selected || isReview;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-4 pt-4 pb-3 max-w-2xl mx-auto w-full flex-shrink-0">
        {isReview && (
          <p className="text-xs text-muted uppercase tracking-widest text-center mb-2">Reviewing Your Answers</p>
        )}
        <ProgressBar current={currentIndex + 1} total={shuffledQuestions.length} />
      </header>

      {/* Main - Scrollable content area with padding for fixed footer */}
      <main className="flex-1 flex flex-col items-center px-4 pb-24 overflow-y-auto">
        <div className="max-w-2xl w-full">
          <QuestionCard
            question={currentQuestion}
            selectedValue={selected?.value}
            onSelect={handleSelect}
            readOnly={isReview}
          />
        </div>
      </main>

      {/* Navigation - FIXED at bottom */}
      <footer className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-bg border-t border-border/20 z-50">
        <div className="flex gap-3">
          <button
            onClick={handleBack}
            className="flex-1 py-3 rounded-lg border border-border bg-surface text-muted hover:text-text hover:border-muted transition-all duration-200 font-medium"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canAdvance}
            className={`
              flex-2 flex-grow-[2] py-3 rounded-lg font-bold transition-all duration-200
              ${canAdvance
                ? 'bg-accent hover:bg-accent-hover text-white cursor-pointer'
                : 'bg-secondary text-muted cursor-not-allowed opacity-50'
              }
            `}
          >
            {isLast ? (isReview ? '← Back to Results' : 'See My Results →') : 'Next →'}
          </button>
        </div>
      </footer>
    </div>
  );
}

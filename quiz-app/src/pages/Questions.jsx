import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import { questions } from '../data/questions.js';
import { calculateScores, getProfile } from '../utils/scoring.js';

export default function Questions() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(15).fill(null));
  const [selected, setSelected] = useState(null);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleSelect = (option) => {
    setSelected(option);
  };

  const handleNext = () => {
    if (!selected) return;

    const newAnswers = [...answers];
    newAnswers[currentIndex] = selected;
    setAnswers(newAnswers);

    if (isLast) {
      const scores = calculateScores(newAnswers);
      const profileId = getProfile(scores);
      navigate(`/results?profile=${profileId}`, { state: { scores, answers: newAnswers } });
    } else {
      setSelected(answers[currentIndex + 1]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      navigate('/');
      return;
    }
    setSelected(answers[currentIndex - 1]);
    setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 max-w-2xl mx-auto w-full">
        <ProgressBar current={currentIndex + 1} total={questions.length} />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-4 py-6">
        <div className="max-w-2xl w-full">
          <QuestionCard
            question={currentQuestion}
            selectedValue={selected?.value}
            onSelect={handleSelect}
          />
        </div>
      </main>

      {/* Navigation */}
      <footer className="px-4 py-6 max-w-2xl mx-auto w-full">
        <div className="flex gap-3">
          <button
            onClick={handleBack}
            className="flex-1 py-3 rounded-lg border border-border bg-surface text-muted hover:text-text hover:border-muted transition-all duration-200 font-medium"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!selected}
            className={`
              flex-2 flex-grow-[2] py-3 rounded-lg font-bold transition-all duration-200
              ${selected
                ? 'bg-accent hover:bg-accent-hover text-white cursor-pointer'
                : 'bg-secondary text-muted cursor-not-allowed opacity-50'
              }
            `}
          >
            {isLast ? 'See My Results →' : 'Next →'}
          </button>
        </div>
      </footer>
    </div>
  );
}

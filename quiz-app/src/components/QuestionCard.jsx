export default function QuestionCard({ question, selectedValue, onSelect }) {
  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold leading-relaxed text-text mb-8">
        {question.text}
      </h2>
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onSelect(option)}
              className={`
                w-full text-left p-4 rounded-lg border transition-all duration-200
                ${isSelected
                  ? 'border-accent bg-accent/10 text-text'
                  : 'border-border bg-surface text-text hover:border-accent/50 hover:bg-surface/80'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5
                  ${isSelected ? 'border-accent bg-accent' : 'border-secondary'}
                `}>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-base leading-relaxed">{option.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

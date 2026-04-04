export default function QuestionCard({ question, selectedValue, onSelect, readOnly }) {
  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-2xl font-bold leading-snug text-text mb-3">
        {question.text}
      </h2>
      <div className="space-y-2">
        {question.options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <button
              key={option.value}
              onClick={() => !readOnly && onSelect(option)}
              className={`
                w-full text-left p-3 rounded-lg border transition-all duration-200
                ${isSelected
                  ? 'border-accent bg-accent/15 text-[#1a1a1a]'
                  : 'border-[#d0d0d0] bg-white text-[#1a1a1a] hover:border-accent/50 hover:bg-[#f9f9f9]'
                }
                ${readOnly ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5
                  ${isSelected ? 'border-accent bg-accent' : 'border-[#aaa]'}
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

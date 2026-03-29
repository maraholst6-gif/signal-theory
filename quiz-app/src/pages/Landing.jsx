import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-2xl w-full text-center space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-sm text-muted">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Free · No Email · Instant Results
          </div>

          {/* Headline */}
          <div className="space-y-5">
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight text-text">
              Are You Actually Ready<br />
              <span className="text-accent">to Date Again —</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted font-medium">
              Or Just Telling Yourself You Are?
            </p>
            <div className="text-lg sm:text-xl text-muted leading-relaxed max-w-lg mx-auto text-left inline-block">
              <p className="mb-2">Find out if you're:</p>
              <ul className="space-y-1">
                <li>• Misreading politeness as romantic interest</li>
                <li>• Still comparing new people to your ex</li>
                <li>• Chasing too hard—or playing it too safe</li>
              </ul>
            </div>
          </div>

          {/* Body Text */}
          <div className="text-base text-muted leading-relaxed max-w-lg mx-auto space-y-3">
            <p>Take this 4-minute assessment and discover your dating blind spots.</p>
            <div className="text-left inline-block">
              <p className="mb-2 font-semibold text-text">You'll find out:</p>
              <ul className="space-y-1 text-sm">
                <li>→ How many signals you've already missed (and what they cost you)</li>
                <li>→ The one pattern from your marriage that's silently repeating</li>
                <li>→ Whether your "strategy" is actually repelling the women you want</li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/questions')}
            className="inline-block px-10 py-4 bg-accent hover:bg-accent-hover text-white font-bold text-lg rounded-lg transition-all duration-200 hover:scale-105 active:scale-100 shadow-lg shadow-accent/25"
          >
            Find Out What She's Actually Thinking →
          </button>

          {/* Social proof */}
          <p className="text-sm text-muted">
            8 personalized profiles · Takes 4 minutes · No email to start
          </p>

          {/* What you'll learn */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {[
              {
                icon: '👻',
                label: 'The Ghost',
                desc: "You think you're playing it cool. She thinks you disappeared."
              },
              {
                icon: '🔬',
                label: 'The Interrogator',
                desc: "You think you're showing interest. She feels cross-examined."
              },
              {
                icon: '⚖️',
                label: 'The Comparer',
                desc: "You think you have standards. She can tell she's being measured."
              },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-lg bg-surface border border-border text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-semibold text-sm text-text mb-1">{item.label}</div>
                <div className="text-xs text-muted leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center border-t border-border">
        <p className="text-sm text-muted">
          Based on the Signal Theory™ framework
        </p>
        <p className="text-xs text-muted mt-1">
          Learn more in the book:{' '}
          <a
            href="#"
            className="text-accent hover:underline"
            title="Coming soon"
          >
            Signal Theory
          </a>
          {' '}(Amazon link - coming soon)
        </p>
      </footer>
    </div>
  );
}

import { useState } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import ScoreBadge from '../components/ScoreBadge.jsx';
import { profiles } from '../data/profiles.js';
import { profileContent } from '../data/profileContent.js';
import { saveQuizSubmission } from '../utils/supabase.js';

export default function Results() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const profileId = searchParams.get('profile') || 'self-aware-learner';
  const profile = profiles[profileId] || profiles['self-aware-learner'];
  const content = profileContent[profileId] || profileContent['self-aware-learner'];
  const scores = location.state?.scores || {};
  const answers = location.state?.answers || [];

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setSubmitError('');

    if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    console.log('[Signal Theory Quiz] Email submitted:', email.trim(), '| Profile:', profileId);

    try {
      // Submit to ConvertKit
      const response = await fetch(`https://api.convertkit.com/v3/forms/9264094/subscribe?api_key=z9c_QCm0VIwY74gbl-AxAg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          tags: [profileId] // Tag with profile type (e.g., 'self-aware-learner')
        })
      });

      const data = await response.json();

      if (response.ok && data.subscription) {
        setSubmitted(true);
        console.log('[ConvertKit] Subscription success:', data);
      } else {
        console.error('[ConvertKit] Subscription failed:', data);
        setSubmitError('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('[ConvertKit] Network error:', error);
      setSubmitError('Something went wrong. Please try again.');
    }

    setSubmitting(false);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.origin + '/signal-theory/quiz/' : '/signal-theory/quiz/';
  const shareText = `I just took the Signal Theory Dating Readiness Quiz and got "${profile.name}". Find out your profile:`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert('Link copied!'))
      .catch(() => {});
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 space-y-12">

        {/* ═══════════════════════════════════════════════
            SECTION 1: THE GIVE
            Full profile analysis — no gate
        ════════════════════════════════════════════════ */}

        {/* Header */}
        <div className="text-center space-y-3">
          <p className="text-sm text-muted uppercase tracking-widest font-medium">Your Dating Readiness Profile</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-text">{profile.name}</h1>
          <p className="text-xl font-semibold text-accent leading-snug max-w-lg mx-auto">{content.intro}</p>
          <p className="text-base text-muted leading-relaxed max-w-lg mx-auto">{content.introDetail}</p>
        </div>

        {/* Action Plan Tease */}
        <div className="px-4 py-3 rounded-xl border border-border bg-surface text-sm text-muted leading-relaxed" style={{ borderLeft: '3px solid var(--color-accent)', background: 'rgba(255,255,255,0.03)' }}>
          <a
            href="#action-plan"
            onClick={e => { e.preventDefault(); document.getElementById('action-plan')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="font-semibold text-text hover:text-accent transition-colors cursor-pointer"
            style={{ textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >Your results + your roadmap.</a> Below you'll see your full breakdown — scores, patterns, what they mean. At the end, I'll show you exactly what to do about it.
        </div>

        {/* Score Breakdowns */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-text">Your Scores</h2>
          <div className="space-y-4">

            {/* Signal Reading */}
            <div className="p-5 rounded-xl bg-surface border border-border space-y-3">
              <ScoreBadge
                label="Signal Reading"
                value={profile.signalLabel}
                icon={profile.signalIcon}
                description={profile.signalDesc}
              />
              <div className="pt-1">
                <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-2">What this looks like:</p>
                <ul className="space-y-1.5">
                  {content.scoreDetails.signal.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted leading-relaxed">
                      <span className="text-accent mt-0.5 flex-shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Emotional Readiness */}
            <div className="p-5 rounded-xl bg-surface border border-border space-y-3">
              <ScoreBadge
                label="Emotional Readiness"
                value={profile.readinessLabel}
                icon={profile.readinessIcon}
                description={profile.readinessDesc}
              />
              <div className="pt-1">
                <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-2">What this looks like:</p>
                <ul className="space-y-1.5">
                  {content.scoreDetails.readiness.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted leading-relaxed">
                      <span className="text-accent mt-0.5 flex-shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Dating Strategy */}
            <div className="p-5 rounded-xl bg-surface border border-border space-y-3">
              <ScoreBadge
                label="Dating Strategy"
                value={profile.strategyLabel}
                icon={profile.strategyIcon}
                description={profile.strategyDesc}
              />
              <div className="pt-1">
                <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-2">What this looks like:</p>
                <ul className="space-y-1.5">
                  {content.scoreDetails.strategy.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted leading-relaxed">
                      <span className="text-accent mt-0.5 flex-shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* What This Means */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-text">{content.whatThisMeansTitle}</h2>
          <div className="p-5 rounded-xl bg-surface border border-border space-y-3">
            {content.whatThisMeans.map((para, i) => (
              <p key={i} className="text-base leading-relaxed text-muted">{para}</p>
            ))}
          </div>
        </div>

        {/* Strengths / Blind Spots / Patterns */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-text">{content.strengthsTitle}</h2>
          <div className="space-y-3">
            {content.strengths.map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-surface border border-border">
                <p className="font-semibold text-text mb-1">{i + 1}. {item.title}</p>
                <p className="text-sm text-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Consequences */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-text">{content.consequencesTitle}</h2>
          <div className="p-5 rounded-xl bg-surface border border-border space-y-3">
            <p className="text-base text-muted leading-relaxed">{content.consequencesIntro}</p>
            <ul className="space-y-1.5 pl-1">
              {content.consequences.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted leading-relaxed">
                  <span className="text-accent mt-0.5 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {content.consequencesCoda && (
              <p className="text-sm text-muted leading-relaxed italic border-t border-border pt-3">
                {content.consequencesCoda}
              </p>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 2: THE GATE
            Email capture — action plan
        ════════════════════════════════════════════════ */}

        <div id="action-plan" className="rounded-2xl border-2 border-accent/40 bg-accent/5 p-6 sm:p-8 space-y-5">

          <div className="space-y-2">
            <p className="text-xs text-accent uppercase tracking-widest font-semibold">Your Personalized Plan</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-text leading-snug">{content.gateHeadline}</h2>
            <p className="text-muted text-base leading-relaxed">{content.gateIntro}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-text">Your action plan includes:</p>
            <ul className="space-y-1.5">
              {content.gatePlanItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted leading-relaxed">
                  <span className="text-accent mt-0.5 flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {submitted ? (
            <div className="text-center py-6 space-y-2">
              <div className="text-4xl">✓</div>
              <p className="font-bold text-text text-lg">Your action plan is on the way.</p>
              <p className="text-muted text-sm">Check your email in the next few minutes.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                  required
                  className={`w-full px-4 py-3 rounded-lg bg-bg border text-text placeholder-muted focus:outline-none transition-colors text-base
                    ${emailError ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-accent'}`}
                />
                {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
              </div>
              {submitError && <p className="text-red-400 text-sm">{submitError}</p>}
              <button
                type="submit"
                disabled={submitting || !email.trim()}
                className={`
                  w-full py-4 rounded-lg font-bold text-lg transition-all duration-200
                  ${submitting || !email.trim()
                    ? 'bg-secondary text-muted cursor-not-allowed opacity-50'
                    : 'bg-accent hover:bg-accent-hover text-white hover:scale-[1.02] active:scale-100 shadow-lg shadow-accent/25'
                  }
                `}
              >
                {submitting ? 'Sending...' : 'Send My Action Plan'}
              </button>
              <p className="text-center text-xs text-muted">{content.gatePrivacyNote} I don't sell data.</p>
            </form>
          )}
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 3: THE BRIDGE
            App/book mention + social share
        ════════════════════════════════════════════════ */}

        <div className="space-y-6 pb-4">

          {/* App + Book */}
          <div className="p-5 rounded-xl bg-surface border border-border space-y-4">
            <div>
              <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-1">Coming Soon</p>
              <p className="font-semibold text-text">The Signal Theory App</p>
              <p className="text-sm text-muted mt-1">40+ real-world dating scenarios with instant feedback. Pattern recognition training. Progress tracking for your specific blind spots. Early access opens next month.</p>
            </div>
            <div className="border-t border-border pt-4">
              <p className="font-semibold text-text">The Book</p>
              <p className="text-sm text-muted mt-1">
                <em>Signal Theory</em> — the complete framework in depth. Optional read if you want the full system.
              </p>
            </div>
          </div>

          {/* Share */}
          <div className="text-center space-y-3">
            <p className="text-sm text-muted">{content.bridgeShareText}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-border bg-surface text-muted hover:text-text hover:border-muted transition-all text-sm font-medium"
              >
                Share on X
              </a>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-lg border border-border bg-surface text-muted hover:text-text hover:border-muted transition-all text-sm font-medium"
              >
                Copy Link
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 rounded-lg border border-border bg-surface text-muted hover:text-text hover:border-muted transition-all text-sm font-medium"
              >
                Retake Quiz
              </button>
            </div>
          </div>

        </div>

      </main>

      <footer className="py-6 text-center border-t border-border">
        <p className="text-sm text-muted">
          Based on the <span className="text-text font-medium">Signal Theory</span> framework
        </p>
      </footer>
    </div>
  );
}

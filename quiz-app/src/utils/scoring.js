import { profiles } from '../data/profiles.js';

export function calculateScores(answers) {
  // answers is an array of 15 answer objects: { questionId, value, scoring }

  let signalGood = 0;
  let readinessHigh = 0;
  let strategyCalibrated = 0;

  // Questions 1-5: Signal Reading
  for (let i = 0; i < 5; i++) {
    const answer = answers[i];
    if (answer && answer.scoring && answer.scoring.signal === 'GOOD') {
      signalGood++;
    }
  }

  // Questions 6-10: Emotional Readiness
  for (let i = 5; i < 10; i++) {
    const answer = answers[i];
    if (answer && answer.scoring && answer.scoring.readiness === 'HIGH') {
      readinessHigh++;
    }
  }

  // Questions 11-15: Dating Strategy
  for (let i = 10; i < 15; i++) {
    const answer = answers[i];
    if (answer && answer.scoring && answer.scoring.strategy === 'CALIBRATED') {
      strategyCalibrated++;
    }
  }

  const signal = signalGood >= 4 ? 'STRONG' : signalGood >= 2 ? 'DEVELOPING' : 'WEAK';
  const readiness = readinessHigh >= 4 ? 'READY' : readinessHigh >= 2 ? 'IN_TRANSITION' : 'NOT_READY';
  const strategy = strategyCalibrated >= 4 ? 'CALIBRATED' : strategyCalibrated >= 2 ? 'LEARNING' : 'MISALIGNED';

  // Also check for special strategy patterns
  let strategyType = strategy;
  if (strategy === 'MISALIGNED') {
    const passiveCount = [answers[10], answers[11], answers[12], answers[13], answers[14]]
      .filter(a => a && a.scoring && (a.scoring.strategy === 'PASSIVE' || a.scoring.strategy === 'CONDITIONAL'))
      .length;
    const anxiousCount = [answers[10], answers[11], answers[12], answers[13], answers[14]]
      .filter(a => a && a.scoring && a.scoring.strategy === 'ANXIOUS')
      .length;
    const outcomeCount = [answers[10], answers[11], answers[12], answers[13], answers[14]]
      .filter(a => a && a.scoring && a.scoring.strategy === 'OUTCOME_FOCUSED')
      .length;

    if (anxiousCount >= 2) strategyType = 'ANXIOUS';
    else if (outcomeCount >= 2) strategyType = 'OUTCOME_FOCUSED';
    else if (passiveCount >= 2) strategyType = 'PASSIVE';
  }

  return {
    signal,
    readiness,
    strategy: strategyType,
    signalScore: signalGood,
    readinessScore: readinessHigh,
    strategyScore: strategyCalibrated,
  };
}

export function getProfile(scores) {
  const { signal, readiness, strategy } = scores;

  // Exact matches first
  if (signal === 'STRONG' && readiness === 'READY' && strategy === 'CALIBRATED') return 'ready-navigator';
  if (signal === 'WEAK' && readiness === 'READY' && strategy === 'CALIBRATED') return 'rusty-romantic';
  if (signal === 'STRONG' && readiness === 'READY' && strategy === 'PASSIVE') return 'cautious-observer';
  if (signal === 'STRONG' && readiness === 'READY' && (strategy === 'LEARNING' || strategy === 'MISALIGNED')) return 'cautious-observer';
  if (readiness === 'NOT_READY' && strategy === 'ANXIOUS') return 'wounded-analyst';
  if (readiness === 'IN_TRANSITION' && strategy === 'ANXIOUS') return 'wounded-analyst';
  if (signal === 'WEAK' && readiness === 'IN_TRANSITION') return 'wounded-analyst';
  if (readiness === 'NOT_READY' && strategy === 'OUTCOME_FOCUSED') return 'pattern-repeater';
  if (readiness === 'NOT_READY' && signal === 'DEVELOPING') return 'eager-rebuilder';
  if (readiness === 'NOT_READY') return 'eager-rebuilder';
  if (readiness === 'READY' && strategy === 'CALIBRATED') return 'ready-navigator';
  if (readiness === 'READY' && signal === 'DEVELOPING') return 'inconsistent-dater';
  if (readiness === 'IN_TRANSITION' && signal === 'DEVELOPING') return 'self-aware-learner';

  // Fallback
  return 'self-aware-learner';
}

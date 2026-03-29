export default function ScoreBadge({ label, value, icon, description }) {
  const iconColorMap = {
    '✅': 'text-green-400 border-green-400/30 bg-green-400/10',
    '⚠️': 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    '❌': 'text-red-400 border-red-400/30 bg-red-400/10',
  };

  const colorClass = iconColorMap[icon] || 'text-muted border-border bg-surface';

  return (
    <div className={`p-4 rounded-lg border ${colorClass}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="font-semibold text-sm uppercase tracking-wide opacity-80">{label}</span>
      </div>
      <div className="font-bold text-lg mb-1">{value}</div>
      {description && (
        <p className="text-sm leading-relaxed opacity-80">{description}</p>
      )}
    </div>
  );
}

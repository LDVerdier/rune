interface StatsRowProps {
  stats: Array<{ label: string; value: string }>;
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {stats.map(({ label, value }) => (
        <span key={label} className="text-xs text-gray-500">
          <span className="uppercase tracking-wide">{label}</span>{" "}
          <span className="text-gray-300 font-mono">{value}</span>
        </span>
      ))}
    </div>
  );
}

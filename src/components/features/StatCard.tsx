interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  index: number;
}

export default function StatCard({ label, value, sub, index }: StatCardProps) {
  const colors = [
    "from-gold/20 to-gold/5",
    "from-blue-500/20 to-blue-500/5",
    "from-gold/20 to-gold/5",
    "from-emerald-500/20 to-emerald-500/5",
    "from-purple-500/20 to-purple-500/5",
    "from-gold/20 to-gold/5",
  ];

  const borderColors = [
    "border-gold/30",
    "border-blue-500/30",
    "border-gold/30",
    "border-emerald-500/30",
    "border-purple-500/30",
    "border-gold/30",
  ];

  const textColors = [
    "gold-text",
    "text-blue-400",
    "gold-text",
    "text-emerald-400",
    "text-purple-400",
    "gold-text",
  ];

  return (
    <div
      className={`bg-gradient-to-br ${colors[index % colors.length]} border ${borderColors[index % borderColors.length]} rounded-lg p-5 text-center hover:scale-105 transition-transform duration-300`}
    >
      <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-2xl sm:text-3xl font-serif font-bold mb-1 ${textColors[index % textColors.length]}`}>
        {value}
      </p>
      <p className="text-muted-foreground text-xs">{sub}</p>
    </div>
  );
}

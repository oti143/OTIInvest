import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Users } from "lucide-react";

const TOTAL_SEATS = 6000;

function getSubmittedCount(): number {
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("oti_app_")) count++;
  }
  const submitted = localStorage.getItem("oti_submitted");
  if (submitted && count === 0) count = 1;
  return count;
}

const RADIAN = Math.PI / 180;

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: LabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.04) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700}>
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export default function CommunityPieChart() {
  const filled = useMemo(() => getSubmittedCount(), []);
  const remaining = TOTAL_SEATS - filled;

  const data = [
    { name: "Members Joined", value: filled, color: "#c9a84c" },
    { name: "Seats Remaining", value: remaining, color: "#1e2a45" },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-3">Community</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">OTI Member Allocation</h2>
        <p className="text-muted-foreground text-sm mt-3 max-w-md mx-auto">
          Live snapshot of how many investors have joined the OTI community and seats still available.
        </p>
        <div className="w-16 h-0.5 gold-gradient mx-auto mt-4" />
      </div>

      <div className="navy-card rounded-xl border-gold/20 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Chart */}
          <div className="w-full lg:w-1/2 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0d1428",
                    border: "1px solid rgba(201,168,76,0.3)",
                    borderRadius: "8px",
                    color: "#f5d78a",
                  }}
                  formatter={(value: number, name: string) => [
                    value.toLocaleString("en-IN"),
                    name,
                  ]}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  formatter={(value) => (
                    <span style={{ color: "#94a3b8", fontSize: "13px" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="w-full lg:w-1/2 space-y-5">
            {/* Center donut label */}
            <div className="text-center lg:text-left">
              <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Total Capacity</p>
              <p className="font-serif text-5xl font-bold gold-text">{TOTAL_SEATS.toLocaleString("en-IN")}</p>
              <p className="text-muted-foreground text-sm">Applications Worldwide</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-gold/25 bg-gold/5 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-gold" />
                  <p className="text-muted-foreground text-xs">Members Joined</p>
                </div>
                <p className="font-serif text-3xl font-bold gold-text">{filled.toLocaleString("en-IN")}</p>
                <p className="text-muted-foreground text-xs mt-1">
                  {((filled / TOTAL_SEATS) * 100).toFixed(2)}% of total
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-secondary/20 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-[#1e2a45] border border-border" />
                  <p className="text-muted-foreground text-xs">Seats Remaining</p>
                </div>
                <p className="font-serif text-3xl font-bold text-foreground">{remaining.toLocaleString("en-IN")}</p>
                <p className="text-muted-foreground text-xs mt-1">
                  {((remaining / TOTAL_SEATS) * 100).toFixed(2)}% available
                </p>
              </div>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Fill Rate</span>
                <span className="text-gold font-semibold">{((filled / TOTAL_SEATS) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2.5 bg-secondary/50 rounded-full overflow-hidden">
                <div
                  className="h-full gold-gradient rounded-full transition-all duration-1000"
                  style={{ width: `${Math.max((filled / TOTAL_SEATS) * 100, 0.5)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded border border-border bg-secondary/20">
              <Users size={13} className="text-gold flex-shrink-0" />
              <span>Data reflects live applications submitted through the OTI portal.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

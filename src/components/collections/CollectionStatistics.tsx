import { motion } from "motion/react";
import { CountUp } from "@/components/landing/CountUp";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip } from "recharts";
import type { Collection } from "@/lib/mock";

const COLORS = [
  "oklch(0.72 0.18 255)",
  "oklch(0.65 0.22 295)",
  "oklch(0.78 0.16 50)",
  "oklch(0.72 0.16 160)",
  "oklch(0.7 0.18 25)",
];

export function CollectionStatistics({ collection: c }: { collection: Collection }) {
  const genres = [
    { name: "Sci-Fi", value: 38 },
    { name: "Drama", value: 24 },
    { name: "Action", value: 18 },
    { name: "Fantasy", value: 12 },
    { name: "Other", value: 8 },
  ];
  const years = Array.from({ length: 8 }, (_, i) => ({
    y: 2017 + i,
    v: 1 + Math.round(Math.abs(Math.sin(i * 1.1)) * 5),
  }));
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card label="Completion">
        <div className="font-display text-4xl tracking-tight tabular-nums">
          <CountUp to={c.completion ?? 70} />%
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${c.completion ?? 70}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full"
            style={{ background: c.accent }}
          />
        </div>
      </Card>
      <Card label="Average rating">
        <div className="font-display text-4xl tracking-tight tabular-nums">
          <CountUp to={c.avgRating ?? 4.6} decimals={1} />
        </div>
        <div className="mt-3 text-xs text-muted-foreground">across {c.count} items</div>
      </Card>
      <Card label="Genres">
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={genres} dataKey="value" innerRadius={28} outerRadius={48} stroke="none">
                {genres.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "oklch(0.17 0.015 270)",
                  border: "1px solid oklch(1 0 0 / 0.1)",
                  borderRadius: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card label="By year">
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={years}>
              <XAxis
                dataKey="y"
                tick={{ fill: "oklch(0.68 0.012 270)", fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.17 0.015 270)",
                  border: "1px solid oklch(1 0 0 / 0.1)",
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="v" fill={c.accent} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl p-5"
    >
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-3">{children}</div>
    </motion.div>
  );
}

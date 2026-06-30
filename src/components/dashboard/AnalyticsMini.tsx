import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Flame, TrendingUp, Target } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Pie, PieChart, Cell, Bar, BarChart } from "recharts";
import { CountUp } from "@/components/landing/CountUp";
import { ACTIVITY_30D, STATS, UNIVERSE } from "@/lib/mock";

export function AnalyticsMini() {
  const pie = UNIVERSE.slice(0, 5).map((u) => ({ name: u.kind, value: u.count, color: u.accent }));
  const monthly = Array.from({ length: 12 }, (_, i) => ({
    m: i,
    v: 4 + Math.round(Math.sin(i / 1.6) * 3 + Math.abs(Math.cos(i * 1.3)) * 3),
  }));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Watch time */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative overflow-hidden rounded-3xl p-6 md:col-span-2"
      >
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Watch time · 30 days
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <div className="font-display text-5xl tracking-tight">
                <CountUp to={STATS.totalHours} />h
              </div>
              <div className="inline-flex items-center gap-1 text-xs text-success">
                <TrendingUp className="h-3.5 w-3.5" /> +12%
              </div>
            </div>
          </div>
          <Link
            to="/app/analytics"
            className="glass-subtle inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground press-scale hover:text-foreground"
          >
            Open analytics <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="relative mt-5 h-32">
          <ResponsiveContainer>
            <AreaChart data={ACTIVITY_30D}>
              <defs>
                <linearGradient id="dashWt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.18 255)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.72 0.18 255)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="hours"
                stroke="oklch(0.78 0.18 255)"
                strokeWidth={2}
                fill="url(#dashWt)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Streak */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative overflow-hidden rounded-3xl p-6"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-400/30 blur-3xl" />
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Current streak
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="font-display text-5xl tracking-tight">
              <CountUp to={STATS.streak} />
            </div>
            <div className="text-xs text-muted-foreground">days</div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-300">
            <Flame className="h-3.5 w-3.5" /> Personal best
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.2, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
                className="h-3 rounded-sm"
                style={{ background: `oklch(0.72 0.18 ${30 + i * 4} / ${0.35 + (i % 4) * 0.15})` }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Completion */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative overflow-hidden rounded-3xl p-6"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/25 blur-3xl" />
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Completion rate
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="font-display text-5xl tracking-tight">
              <CountUp to={82} suffix="%" />
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-success">
            <Target className="h-3.5 w-3.5" /> On pace
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "82%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-success to-primary"
            />
          </div>
        </div>
      </motion.div>

      {/* Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative overflow-hidden rounded-3xl p-6"
      >
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Media mix
        </div>
        <div className="mt-2 flex items-center gap-4">
          <div className="h-24 w-24">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pie}
                  dataKey="value"
                  innerRadius={26}
                  outerRadius={44}
                  stroke="none"
                  paddingAngle={2}
                >
                  {pie.map((p, i) => (
                    <Cell key={i} fill={p.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex-1 space-y-1.5 text-xs">
            {pie.map((p) => (
              <li key={p.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                <span className="capitalize text-muted-foreground">{p.name}</span>
                <span className="ml-auto text-foreground/90">{p.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Monthly */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative overflow-hidden rounded-3xl p-6"
      >
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Monthly progress
        </div>
        <div className="mt-3 h-24">
          <ResponsiveContainer>
            <BarChart data={monthly}>
              <Bar dataKey="v" radius={[6, 6, 0, 0]} fill="oklch(0.7 0.2 295)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-1 text-[10px] text-muted-foreground">Jan → Dec</div>
      </motion.div>
    </div>
  );
}

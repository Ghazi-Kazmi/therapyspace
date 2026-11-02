import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Heart, Brain, TrendingUp, Users, Sparkles, Shield, Wind, BookOpen, Award,
} from "lucide-react";

const features = [
  { icon: Brain,     title: "AI Companion",        description: "Chat with Aria, our Gemini-powered AI companion — always available for thoughtful, empathetic support." },
  { icon: Heart,     title: "Mood Tracking",        description: "Log and visualize your emotional patterns with simple, intuitive tracking tools." },
  { icon: Wind,      title: "Calm Zone",            description: "Guided breathing exercises, meditation timers, and grounding techniques." },
  { icon: Sparkles,  title: "Daily Affirmations",   description: "Personalized AI-generated affirmations to start every day with intention." },
  { icon: TrendingUp,title: "Progress Analytics",   description: "Insightful charts that show your wellness journey over days and weeks." },
  { icon: BookOpen,  title: "Guided Journal",       description: "A private space to reflect, write freely, and document your healing." },
  { icon: Users,     title: "Community Stories",    description: "Anonymous stories of hope and recovery from people on the same path." },
  { icon: Award,     title: "Achievements",         description: "Celebrate streaks and milestones that keep you showing up for yourself." },
  { icon: Shield,    title: "Private & Secure",     description: "Your data stays with you. No ads, no tracking, no compromises." },
];

const stats = [
  { value: "9+",   label: "Wellness Tools" },
  { value: "24/7", label: "Always Available" },
  { value: "100%", label: "Private & Secure" },
  { value: "Free", label: "No Hidden Costs" },
];

function StatItem({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-1.5 py-2"
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <p
        className="text-3xl font-bold tracking-tight md:text-4xl"
        style={{ color: "hsl(var(--primary))" }}
      >
        {value}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

export function FeatureHighlights() {
  return (
    <section className="py-24">
      <div className="container px-5 md:px-8">

        {/* Section header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "hsl(var(--primary))" }}
          >
            Features
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Tools built for your wellbeing
          </h2>
          <p className="mx-auto max-w-md text-base text-muted-foreground">
            Comprehensive, evidence-informed tools designed with empathy and accessibility.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              whileHover={{ y: -3 }}
              className="group rounded-xl border p-6 transition-shadow duration-250"
              style={{
                background: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                boxShadow: "var(--shadow-sm)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
              }}
            >
              {/* Icon */}
              <div
                className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors duration-200 group-hover:border-primary/30 group-hover:bg-primary/5"
                style={{
                  background: "hsl(var(--muted))",
                  borderColor: "hsl(var(--border))",
                }}
              >
                <f.icon className="h-5 w-5 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
              </div>

              <h3 className="mb-2 text-sm font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          className="mt-20 grid grid-cols-2 divide-x divide-y divide-border rounded-2xl border md:grid-cols-4 md:divide-y-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{
            background: "hsl(var(--card))",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {stats.map((s) => (
            <StatItem key={s.label} value={s.value} label={s.label} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

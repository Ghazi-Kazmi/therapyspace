import { motion } from "framer-motion";
import { Heart, ArrowRight, Shield, Star, Clock } from "lucide-react";
import { Button } from "./ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const stats = [
  { value: "9+",   label: "Wellness Tools", icon: Star },
  { value: "24/7", label: "Always Available", icon: Clock },
  { value: "100%", label: "Private & Free",   icon: Shield },
];

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.5,
        }}
      />
      {/* Soft top vignette to blend with header */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 15%, hsl(var(--background)) 45%, transparent 100%)",
        }}
      />

      <div className="container px-5 py-24 md:px-8 md:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
              style={{
                borderColor: "hsl(var(--primary) / 0.35)",
                color: "hsl(var(--primary))",
                background: "hsl(var(--primary) / 0.06)",
              }}
            >
              <Heart className="h-3 w-3" fill="currentColor" />
              Mental Wellness Companion
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"
            style={{ color: "hsl(var(--foreground))", lineHeight: 1.1 }}
          >
            Grow through{" "}
            <span style={{ color: "hsl(var(--primary))" }}>what you</span>
            <br />
            go through
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-muted-foreground"
          >
            A calm, private space for your mental wellness — with AI that listens,
            tools that help, and no pressure whatsoever.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Button
              id="get-started-btn"
              size="lg"
              onClick={onGetStarted}
              className="h-12 gap-2 rounded-xl px-7 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                border: "none",
                boxShadow: "var(--shadow-md)",
              }}
            >
              Start Your Journey
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-xl px-7 text-sm font-medium"
              onClick={() =>
                document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Find Resources
            </Button>
          </motion.div>

          {/* Floating heart */}
          <motion.div
            className="mt-14 flex justify-center"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="rounded-2xl border p-5"
              style={{
                background: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <Heart
                className="h-9 w-9"
                style={{ color: "hsl(var(--primary))" }}
                fill="currentColor"
              />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-3 divide-x divide-border rounded-2xl border"
            style={{
              background: "hsl(var(--card))",
              boxShadow: "var(--shadow-sm)",
              borderColor: "hsl(var(--border))",
            }}
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 px-4 py-6">
                <p
                  className="text-2xl font-bold tracking-tight md:text-3xl"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {s.value}
                </p>
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 text-xs text-muted-foreground/60"
          >
            Not a replacement for professional care. In crisis? Please call a helpline.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

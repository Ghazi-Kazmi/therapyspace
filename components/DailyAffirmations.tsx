import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles, Heart, RefreshCw, Share2, Bookmark, Bot } from "lucide-react";
import { toast } from "sonner";
import { aiAPI } from "../src/services/api";

const affirmations = [
  "I am worthy of love and respect, exactly as I am.",
  "My feelings are valid, and it's okay to express them.",
  "I choose to focus on what I can control.",
  "Every day, I am becoming a stronger version of myself.",
  "I deserve peace, happiness, and good things in life.",
  "My mental health matters, and I prioritize it.",
  "I am resilient and capable of overcoming challenges.",
  "It's okay to take things one step at a time.",
  "I am enough, just as I am right now.",
  "I choose to be kind to myself today.",
  "My journey is unique, and I honor my own pace.",
  "I release what I cannot change and embrace what I can.",
  "I am allowed to take up space and speak my truth.",
  "Today, I choose hope over fear.",
  "I am proud of myself for showing up, even when it's hard.",
  "My mistakes do not define me; they help me grow.",
  "I trust myself to make the right decisions.",
  "I am deserving of rest and self-care.",
  "I celebrate my small victories along the way.",
  "I am learning to love and accept myself more each day.",
];

const categories = ["All", "Self-Love", "Strength", "Peace", "Growth"];

export function DailyAffirmations() {
  const [current, setCurrent] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isAI, setIsAI] = useState(false);

  useEffect(() => {
    setCurrent(affirmations[new Date().getDate() % affirmations.length]);
  }, []);

  const getNew = () => {
    setIsAnimating(true);
    setIsAI(false);
    setTimeout(() => {
      const i = Math.floor(Math.random() * affirmations.length);
      setCurrent(affirmations[i]);
      setIsAnimating(false);
    }, 280);
  };

  const generateAI = async () => {
    setIsLoadingAI(true);
    try {
      const data = await aiAPI.getAffirmation();
      setCurrent(data.text);
      setIsAI(true);
      toast.success("New AI affirmation generated");
    } catch {
      toast.error("Couldn't generate affirmation right now");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const saveAffirmation = () => {
    if (!saved.includes(current)) {
      setSaved([...saved, current]);
      toast.success("Saved to your collection");
    } else {
      toast.info("Already in your collection");
    }
  };

  const share = () => {
    if (navigator.share) navigator.share({ title: "Daily Affirmation", text: current });
    else { navigator.clipboard.writeText(current); toast.success("Copied to clipboard"); }
  };

  const speak = () => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(current);
      u.rate = 0.82; u.pitch = 1.05;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" style={{ color: "hsl(var(--primary))" }} />
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            Daily Affirmations
            {isAI && (
              <span
                className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium"
                style={{ borderColor: "hsl(var(--primary) / 0.3)", color: "hsl(var(--primary))" }}
              >
                <Bot className="h-2.5 w-2.5" /> AI
              </span>
            )}
          </CardTitle>
        </div>
        <CardDescription className="text-xs">Positive reminders to nurture your mind and spirit</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 p-5">
        {/* Affirmation display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
          >
            <div
              className="rounded-xl border p-6 text-center"
              style={{
                background: "hsl(var(--primary) / 0.04)",
                borderColor: "hsl(var(--primary) / 0.15)",
              }}
            >
              <div className="mb-4 flex justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Heart
                    className="h-7 w-7"
                    fill="currentColor"
                    style={{ color: "hsl(var(--primary))" }}
                  />
                </motion.div>
              </div>
              <p className="text-base font-medium leading-relaxed">"{current}"</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Actions row */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={getNew} className="gap-1.5 rounded-lg text-xs" disabled={isAnimating}>
            <RefreshCw className={`h-3.5 w-3.5 ${isAnimating ? "animate-spin" : ""}`} />
            New
          </Button>
          <Button variant="outline" size="sm" onClick={speak} className="gap-1.5 rounded-lg text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Listen
          </Button>
          <Button variant="outline" size="sm" onClick={saveAffirmation} className="gap-1.5 rounded-lg text-xs">
            <Bookmark className="h-3.5 w-3.5" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={share} className="gap-1.5 rounded-lg text-xs">
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        </div>

        {/* AI generate */}
        <Button
          onClick={generateAI}
          disabled={isLoadingAI}
          variant="outline"
          className="w-full gap-2 rounded-lg text-sm font-medium"
          style={{ borderColor: "hsl(var(--primary) / 0.4)", color: "hsl(var(--primary))" }}
        >
          <Bot className={`h-4 w-4 ${isLoadingAI ? "animate-spin" : ""}`} />
          {isLoadingAI ? "Generating with Gemini AI..." : "Generate AI Affirmation"}
        </Button>

        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={getNew}
              className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Saved */}
        <div className="border-t pt-4" style={{ borderColor: "hsl(var(--border))" }}>
          <button
            onClick={() => setShowSaved(v => !v)}
            className="mb-3 flex w-full items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <span>Saved ({saved.length})</span>
            <span>{showSaved ? "−" : "+"}</span>
          </button>

          <AnimatePresence>
            {showSaved && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="max-h-48 space-y-2 overflow-y-auto"
              >
                {saved.length === 0 ? (
                  <p className="py-3 text-center text-xs text-muted-foreground">Nothing saved yet</p>
                ) : (
                  saved.map((a, i) => (
                    <div key={i} className="rounded-lg border p-3 text-sm text-muted-foreground">
                      "{a}"
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-muted-foreground/60">
          💫 Say it aloud each morning for the best effect
        </p>
      </CardContent>
    </Card>
  );
}

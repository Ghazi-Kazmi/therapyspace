import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { RefreshCw, Share2, Volume2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { aiAPI } from "../src/services/api";

const quotes = [
  { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
  { text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.", author: "Noam Shpancer" },
  { text: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein" },
  { text: "Healing takes time, and asking for help is a courageous step.", author: "Mariska Hargitay" },
  { text: "Having feelings doesn't make you a negative person. It makes you human.", author: "Lori Deschene" },
  { text: "Self-care is how you take your power back.", author: "Lalah Delia" },
  { text: "You are allowed to be both a masterpiece and a work in progress simultaneously.", author: "Sophia Bush" },
  { text: "Sometimes the most important thing in a whole day is the rest between two deep breaths.", author: "Etty Hillesum" },
  { text: "Your mental health is a priority. Your happiness is essential.", author: "Unknown" },
  { text: "Be patient with yourself. Nothing in nature blooms all year.", author: "Unknown" },
  { text: "The only way out is through.", author: "Robert Frost" },
  { text: "Recovery is a lifelong journey that takes place one day, one step at a time.", author: "Unknown" },
];

export function QuoteOfTheDay() {
  const [current, setCurrent] = useState(quotes[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isAI, setIsAI] = useState(false);

  useEffect(() => {
    setCurrent(quotes[new Date().getDate() % quotes.length]);
  }, []);

  const refresh = () => {
    setIsRefreshing(true);
    setIsAI(false);
    setTimeout(() => {
      setCurrent(quotes[Math.floor(Math.random() * quotes.length)]);
      setIsRefreshing(false);
    }, 280);
  };

  const generateAI = async () => {
    setIsLoadingAI(true);
    try {
      const data = await aiAPI.getQuote();
      setCurrent({ text: data.text, author: data.author });
      setIsAI(true);
      toast.success("New AI quote generated");
    } catch {
      toast.error("Couldn't generate quote right now");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const share = () => {
    const text = `"${current.text}" — ${current.author}`;
    if (navigator.share) navigator.share({ title: "Quote of the Day", text });
    else { navigator.clipboard.writeText(text); toast.success("Copied to clipboard"); }
  };

  const speak = () => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(`${current.text}. By ${current.author}`);
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-0.5 rounded-full" style={{ background: "hsl(var(--primary))" }} />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Quote of the Day
              </span>
              {isAI && (
                <span
                  className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs"
                  style={{ borderColor: "hsl(var(--primary) / 0.3)", color: "hsl(var(--primary))" }}
                >
                  <Sparkles className="h-2.5 w-2.5" /> AI
                </span>
              )}
            </div>
            <div className="flex gap-0.5">
              <Button variant="ghost" size="icon" onClick={speak} className="h-7 w-7 rounded-lg">
                <Volume2 className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={refresh} className="h-7 w-7 rounded-lg" disabled={isRefreshing}>
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={share} className="h-7 w-7 rounded-lg">
                <Share2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current.text}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="space-y-2"
            >
              <p className="text-base font-medium italic leading-relaxed">"{current.text}"</p>
              <footer className="text-sm text-muted-foreground">— {current.author}</footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="mt-4 border-t pt-4" style={{ borderColor: "hsl(var(--border))" }}>
            <Button
              onClick={generateAI}
              disabled={isLoadingAI}
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-lg text-xs font-medium"
              style={{ borderColor: "hsl(var(--primary) / 0.4)", color: "hsl(var(--primary))" }}
            >
              <Sparkles className={`h-3 w-3 ${isLoadingAI ? "animate-spin" : ""}`} />
              {isLoadingAI ? "Generating..." : "Generate AI Quote"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Moon, Sun, Volume2, VolumeX, Menu, X } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  isSpeechEnabled: boolean;
  toggleSpeech: () => void;
}

export function Header({
  isDarkMode,
  toggleDarkMode,
  isSpeechEnabled,
  toggleSpeech,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full"
      style={{
        background: isDarkMode
          ? scrolled ? "rgba(14,16,22,0.96)" : "rgba(14,16,22,0.70)"
          : scrolled ? "rgba(252,251,249,0.96)" : "rgba(252,251,249,0.80)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: scrolled
          ? `1px solid hsl(var(--border))`
          : "1px solid transparent",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div className="container flex h-16 items-center justify-between px-5 md:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2.5 select-none cursor-default">
          <Heart
            className="h-5 w-5"
            fill="currentColor"
            style={{ color: "hsl(var(--primary))" }}
          />
          <span className="text-base font-semibold tracking-tight">
            Therapy Space
          </span>
        </div>

        {/* Desktop controls */}
        <div className="hidden items-center gap-1.5 sm:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSpeech}
            aria-label="Toggle text-to-speech"
            className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
          >
            {isSpeechEnabled
              ? <Volume2 className="h-4 w-4" />
              : <VolumeX className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDarkMode ? (
                <motion.div key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          <div className="ml-1 h-4 w-px bg-border" />

          <Button
            size="sm"
            className="ml-1 h-9 rounded-lg px-4 text-sm font-medium"
            style={{
              background: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
              border: "none",
            }}
            onClick={() => document.getElementById("get-started-btn")?.click()}
          >
            Get Started
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 sm:hidden">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="h-9 w-9 rounded-lg">
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(v => !v)} className="h-9 w-9 rounded-lg">
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t sm:hidden"
            style={{ background: "hsl(var(--card))" }}
          >
            <div className="container flex flex-col gap-2 px-5 py-4">
              <Button variant="ghost" onClick={toggleSpeech} className="w-full justify-start gap-2 rounded-lg text-sm">
                {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                {isSpeechEnabled ? "Disable Speech" : "Enable Speech"}
              </Button>
              <Button
                className="w-full rounded-lg text-sm font-medium"
                style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", border: "none" }}
                onClick={() => { setMobileOpen(false); document.getElementById("get-started-btn")?.click(); }}
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

import { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { FeatureHighlights } from "./components/FeatureHighlights";
import { Dashboard } from "./components/Dashboard";
import { CommunityStories } from "./components/CommunityStories";
import { Resources } from "./components/Resources";
import { FloatingActionButton } from "./components/FloatingActionButton";
import { OnboardingWelcome } from "./components/OnboardingWelcome";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { preferencesAPI } from "./src/services/api";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState("normal");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Load user preferences from backend
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await preferencesAPI.get();
      setIsDarkMode(prefs.dark_mode || false);
      setFontSize(prefs.font_size || "normal");
      setIsSpeechEnabled(prefs.speech_enabled || false);
      if (!prefs.onboarded) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
      // Fallback to localStorage for onboarding
      const hasOnboarded = localStorage.getItem("therapy-space-onboarded");
      if (!hasOnboarded) {
        setShowOnboarding(true);
      }
    }
  };

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Apply font size
  useEffect(() => {
    document.documentElement.classList.remove(
      "font-small",
      "font-large",
      "font-xlarge"
    );
    if (fontSize !== "normal") {
      document.documentElement.classList.add(`font-${fontSize}`);
    }
  }, [fontSize]);

  // Text-to-speech for page elements
  useEffect(() => {
    if (!isSpeechEnabled || !('speechSynthesis' in window)) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const text = target.textContent || target.getAttribute("aria-label");
      
      if (text && (target.tagName === "BUTTON" || target.tagName === "A")) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.volume = 0.7;
        window.speechSynthesis.speak(utterance);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isSpeechEnabled]);

  const toggleDarkMode = async () => {
    const newState = !isDarkMode;
    setIsDarkMode(newState);
    try {
      await preferencesAPI.update({ dark_mode: newState });
      toast.success(
        newState ? "Dark mode activated" : "Light mode activated"
      );
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const toggleSpeech = async () => {
    const newState = !isSpeechEnabled;
    setIsSpeechEnabled(newState);
    
    try {
      await preferencesAPI.update({ speech_enabled: newState });
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          newState ? "Text to speech enabled" : "Text to speech disabled"
        );
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
      toast.success(
        newState ? "Text-to-speech enabled" : "Text-to-speech disabled"
      );
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const handleGetStarted = () => {
    setShowDashboard(true);
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleFontSizeChange = async (size: string) => {
    setFontSize(size);
    try {
      await preferencesAPI.update({ font_size: size });
      const sizeNames: Record<string, string> = {
        small: "Small",
        normal: "Normal",
        large: "Large",
        xlarge: "Extra Large",
      };
      toast.success(`Font size: ${sizeNames[size]}`);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const handleFloatingAction = (action: string) => {
    setShowDashboard(true);
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
      
      // Find and click the appropriate tab
      const tabButton = document.querySelector(`[value="${action}"]`) as HTMLElement;
      if (tabButton) {
        tabButton.click();
      }
    }, 100);
  };

  const handleOnboardingClose = async () => {
    setShowOnboarding(false);
    try {
      await preferencesAPI.update({ onboarded: true });
    } catch (error) {
      console.error('Failed to update onboarding status:', error);
      // Fallback to localStorage
      localStorage.setItem("therapy-space-onboarded", "true");
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        fontSize={fontSize}
        setFontSize={handleFontSizeChange}
        isSpeechEnabled={isSpeechEnabled}
        toggleSpeech={toggleSpeech}
      />

      <main>
        <HeroSection onGetStarted={handleGetStarted} />
        
        <FeatureHighlights />
        
        <div ref={dashboardRef}>
          {showDashboard && <Dashboard />}
        </div>

        <CommunityStories />

        <Resources />
      </main>

      <footer className="border-t py-10">
        <div className="container px-5 md:px-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" fill="currentColor" style={{ color: "hsl(var(--primary))" }} />
              <span className="text-sm font-semibold">Therapy Space</span>
            </div>
            <p className="max-w-sm text-xs text-muted-foreground">
              Your AI-powered companion for mental wellness — built with care, empathy, and you in mind.
            </p>
            <p className="text-xs text-muted-foreground/50">
              Not a substitute for professional care. Always seek professional help when needed.
            </p>
            <p className="text-xs text-muted-foreground/40">
              © 2025 Therapy Space · Powered by Gemini AI
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      {showDashboard && <FloatingActionButton onAction={handleFloatingAction} />}

      {/* Onboarding */}
      <OnboardingWelcome isOpen={showOnboarding} onClose={handleOnboardingClose} />

      <Toaster position="bottom-right" />
    </div>
  );
}

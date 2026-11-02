import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Heart, Sparkles, Wind, BookOpen, TrendingUp, Bell, Check } from "lucide-react";

interface OnboardingWelcomeProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: Heart,
    title: "Welcome to Therapy Space",
    description: "Your safe, judgment-free companion for mental wellness. We're here to support you on your journey to better mental health.",
    features: [
      "Track your mood and emotions",
      "Reflect through journaling",
      "Practice mindfulness exercises",
    ],
  },
  {
    icon: Sparkles,
    title: "Your Wellness Tools",
    description: "Access a variety of features designed to support your mental health journey.",
    features: [
      "AI Chat Companion for emotional support",
      "Gratitude Journal to cultivate positivity",
      "Daily Affirmations for encouragement",
    ],
  },
  {
    icon: Wind,
    title: "Calm Zone",
    description: "Find peace with guided breathing exercises, meditation, and calming soundscapes.",
    features: [
      "4-4-4 breathing technique",
      "Guided meditation timer",
      "Soothing nature sounds",
    ],
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description: "Visualize your journey with analytics, achievements, and streak tracking.",
    features: [
      "Mood trends and insights",
      "Achievement badges",
      "Daily streak counter",
    ],
  },
  {
    icon: Bell,
    title: "Accessible & Private",
    description: "Your data stays private. Customize accessibility features to fit your needs.",
    features: [
      "Text-to-speech support",
      "Adjustable font sizes",
      "Dark mode for comfort",
    ],
  },
];

export function OnboardingWelcome({ isOpen, onClose }: OnboardingWelcomeProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      localStorage.setItem("therapy-space-onboarded", "true");
    }
  };

  const skipOnboarding = () => {
    onClose();
    localStorage.setItem("therapy-space-onboarded", "true");
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];
  const StepIcon = step.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-4">
            <Progress value={progress} className="h-1" />
            <p className="mt-2 text-xs text-muted-foreground text-right">
              {currentStep + 1} of {steps.length}
            </p>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 p-6">
                <StepIcon className="h-12 w-12 text-primary" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="text-center">
              <DialogTitle className="mb-2 text-xl">{step.title}</DialogTitle>
              <DialogDescription className="text-base">
                {step.description}
              </DialogDescription>
            </div>

            {/* Features */}
            <div className="space-y-2 rounded-lg bg-muted/50 p-4">
              {step.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm">{feature}</p>
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={skipOnboarding}
                className="flex-1"
              >
                Skip
              </Button>
              <Button onClick={nextStep} className="flex-1">
                {currentStep < steps.length - 1 ? "Next" : "Get Started"}
              </Button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? "w-6 bg-primary"
                      : "w-2 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

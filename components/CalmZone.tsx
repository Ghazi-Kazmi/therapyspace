import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Cloud, Waves, Wind, Music, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const breathingPatterns = {
  "4-4-4": {
    name: "Box Breathing",
    description: "Equal timing for calm and focus",
    phases: [
      { phase: "inhale" as const, duration: 4000, text: "Breathe in..." },
      { phase: "hold" as const, duration: 4000, text: "Hold..." },
      { phase: "exhale" as const, duration: 4000, text: "Breathe out..." },
      { phase: "hold" as const, duration: 4000, text: "Hold..." },
    ],
  },
  "4-7-8": {
    name: "Relaxing Breath",
    description: "Great for sleep and anxiety",
    phases: [
      { phase: "inhale" as const, duration: 4000, text: "Breathe in..." },
      { phase: "hold" as const, duration: 7000, text: "Hold..." },
      { phase: "exhale" as const, duration: 8000, text: "Breathe out..." },
    ],
  },
  "5-5": {
    name: "Equal Breathing",
    description: "Simple and effective",
    phases: [
      { phase: "inhale" as const, duration: 5000, text: "Breathe in..." },
      { phase: "exhale" as const, duration: 5000, text: "Breathe out..." },
    ],
  },
};

export function CalmZone() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathCount, setBreathCount] = useState(0);
  const [breathPattern, setBreathPattern] = useState<keyof typeof breathingPatterns>("4-4-4");
  const [meditationTime, setMeditationTime] = useState(0);
  const [isMeditating, setIsMeditating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Breathing Exercise
  useEffect(() => {
    if (!isBreathing) return;

    const phases = breathingPatterns[breathPattern].phases;
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const runCycle = () => {
      const current = phases[currentIndex];
      setBreathPhase(current.phase);

      // Text to speech
      if ('speechSynthesis' in window && soundEnabled) {
        const utterance = new SpeechSynthesisUtterance(current.text);
        utterance.rate = 0.8;
        utterance.volume = 0.7;
        window.speechSynthesis.speak(utterance);
      }

      timeoutId = setTimeout(() => {
        currentIndex = (currentIndex + 1) % phases.length;
        if (currentIndex === 0) {
          setBreathCount((prev) => prev + 1);
        }
        runCycle();
      }, current.duration);
    };

    runCycle();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isBreathing, breathPattern, soundEnabled]);

  // Meditation Timer
  useEffect(() => {
    if (!isMeditating) return;

    const interval = setInterval(() => {
      setMeditationTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isMeditating]);

  const toggleBreathing = () => {
    setIsBreathing(!isBreathing);
    if (isBreathing) {
      setBreathCount(0);
    }
  };

  const toggleMeditation = () => {
    setIsMeditating(!isMeditating);
    if (isMeditating) {
      setMeditationTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getBreathScale = () => {
    switch (breathPhase) {
      case "inhale":
        return 1.3;
      case "hold":
        return 1.3;
      case "exhale":
        return 1;
      default:
        return 1;
    }
  };

  const soundscapes = [
    { id: "rain", name: "Rain Sounds", icon: Cloud },
    { id: "ocean", name: "Ocean Waves", icon: Waves },
    { id: "wind", name: "Gentle Wind", icon: Wind },
    { id: "music", name: "Calm Music", icon: Music },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Calm Zone</CardTitle>
        <CardDescription>
          Find peace with breathing exercises, meditation, and calming sounds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="breathing" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="breathing">Breathing</TabsTrigger>
            <TabsTrigger value="meditation">Meditation</TabsTrigger>
            <TabsTrigger value="sounds">Sounds</TabsTrigger>
          </TabsList>

          {/* Breathing Exercise */}
          <TabsContent value="breathing" className="space-y-6">
            {/* Pattern Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">Breathing Pattern</label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="h-8 w-8"
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Select
                value={breathPattern}
                onValueChange={(value: any) => setBreathPattern(value)}
                disabled={isBreathing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(breathingPatterns).map(([key, pattern]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex flex-col items-start">
                        <span>{pattern.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {pattern.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col items-center gap-6 py-8">
              <motion.div
                animate={{
                  scale: getBreathScale(),
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"
              >
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/30 backdrop-blur-sm">
                  <p className="text-center capitalize">
                    {isBreathing ? breathPhase : "Ready"}
                  </p>
                </div>
              </motion.div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isBreathing
                    ? `Cycles completed: ${breathCount}`
                    : "Click start to begin the 4-4-4 breathing technique"}
                </p>
              </div>

              <Button onClick={toggleBreathing} size="lg" className="gap-2">
                {isBreathing ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start Breathing
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Guided Meditation */}
          <TabsContent value="meditation" className="space-y-6">
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted/50 p-6 text-center">
                <h3 className="mb-2">Mindfulness Meditation</h3>
                <p className="text-sm text-muted-foreground">
                  Find a comfortable position. Close your eyes if you'd like.
                  Focus on your breath, notice your thoughts without judgment.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="text-4xl" style={{ fontWeight: 300 }}>
                  {formatTime(meditationTime)}
                </div>
                
                {isMeditating && (
                  <Progress value={(meditationTime % 60) * (100 / 60)} className="w-full" />
                )}

                <Button onClick={toggleMeditation} size="lg" className="gap-2">
                  {isMeditating ? (
                    <>
                      <Pause className="h-4 w-4" />
                      End Session
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Begin Meditation
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-2 rounded-lg border p-4">
                <h4>Quick Tips:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Start with just 5 minutes</li>
                  <li>• Focus on your natural breathing</li>
                  <li>• It's normal for your mind to wander</li>
                  <li>• Gently return focus when it does</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Calming Sounds */}
          <TabsContent value="sounds" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose a soundscape to help you relax
            </p>
            <div className="grid grid-cols-2 gap-3">
              {soundscapes.map((sound) => (
                <Button
                  key={sound.id}
                  variant="outline"
                  className="h-auto flex-col gap-2 py-6"
                  onClick={() => {
                    // In a real app, this would play actual sounds
                    if ('speechSynthesis' in window) {
                      const utterance = new SpeechSynthesisUtterance(
                        `Playing ${sound.name}`
                      );
                      utterance.rate = 0.9;
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                >
                  <sound.icon className="h-8 w-8" />
                  <span>{sound.name}</span>
                </Button>
              ))}
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
              🎵 Tip: Use headphones for the best experience
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

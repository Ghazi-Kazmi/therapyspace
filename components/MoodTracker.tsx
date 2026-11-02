import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import { Calendar } from "lucide-react";
import { moodAPI } from "../src/services/api";
import { toast } from "sonner";

interface MoodEntry {
  id?: number;
  date?: string;
  created_at?: string;
  mood: number;
  emoji?: string;
  note?: string;
}

const moodEmojis = [
  { value: 1, emoji: "😢", label: "Very Sad" },
  { value: 2, emoji: "😕", label: "Sad" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😊", label: "Great" },
];

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number>(3);
  const [moodNote, setMoodNote] = useState("");
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentEmoji = moodEmojis.find((m) => m.value === selectedMood) || moodEmojis[2];

  useEffect(() => {
    loadMoodHistory();
  }, []);

  const loadMoodHistory = async () => {
    try {
      const entries = await moodAPI.getAll();
      const formattedEntries = entries.map((entry: any) => ({
        ...entry,
        date: new Date(entry.created_at).toLocaleString(),
      }));
      setMoodHistory(formattedEntries);
    } catch (error) {
      console.error('Failed to load mood history:', error);
      // Show error to user
      toast.error("Failed to load mood history. Please check if the server is running.");
    }
  };

  const saveMood = async () => {
    setLoading(true);
    try {
      const entry = await moodAPI.create({
        mood: selectedMood,
        emoji: currentEmoji.emoji,
        note: moodNote || null,
      });

      const formattedEntry: MoodEntry = {
        ...entry,
        date: new Date(entry.created_at).toLocaleString(),
      };
      
      setMoodHistory([formattedEntry, ...moodHistory]);
      setMoodNote("");
      
      // Speak confirmation
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `Mood saved. You're feeling ${currentEmoji.label.toLowerCase()}.`
        );
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }

      toast.success("Mood saved successfully!");
    } catch (error) {
      console.error('Failed to save mood:', error);
      toast.error("Failed to save mood. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{currentEmoji.emoji}</span>
          How are you feeling today?
        </CardTitle>
        <CardDescription>
          Track your emotions and reflect on what's influencing your mood
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emoji Selector */}
        <div className="flex justify-center gap-4">
          {moodEmojis.map((mood) => (
            <motion.button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`rounded-full p-3 text-4xl transition-all hover:scale-110 ${
                selectedMood === mood.value
                  ? "bg-primary/20 ring-2 ring-primary"
                  : "bg-muted hover:bg-muted/80"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={mood.label}
            >
              {mood.emoji}
            </motion.button>
          ))}
        </div>

        {/* Mood Slider */}
        <div className="space-y-2">
          <label className="text-sm">Intensity Level</label>
          <Slider
            value={[selectedMood]}
            onValueChange={(value) => setSelectedMood(value[0])}
            min={1}
            max={5}
            step={1}
            className="w-full"
          />
          <p className="text-center text-sm text-muted-foreground">
            {currentEmoji.label}
          </p>
        </div>

        {/* Note */}
        <div className="space-y-2">
          <label htmlFor="mood-note" className="text-sm">
            What's on your mind? (Optional)
          </label>
          <Textarea
            id="mood-note"
            placeholder="Share your thoughts..."
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={saveMood} className="flex-1" disabled={loading}>
            {loading ? "Saving..." : "Save Mood"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            History
          </Button>
        </div>

        {/* Mood History */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-3 border-t pt-4"
          >
            <h4>Recent Moods</h4>
            {moodHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No mood entries yet. Start tracking!
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {moodHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg bg-muted p-3 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{entry.emoji}</span>
                      <span className="text-xs text-muted-foreground">
                        {entry.date || new Date(entry.created_at || '').toLocaleString()}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="mt-2 text-muted-foreground">{entry.note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

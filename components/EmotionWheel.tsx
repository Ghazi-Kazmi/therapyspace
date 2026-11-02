import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Compass, Save } from "lucide-react";
import { toast } from "sonner";
import { emotionAPI } from "../src/services/api";

const emotionCategories = {
  joy: {
    color: "#FFD700",
    emotions: ["Happy", "Excited", "Peaceful", "Content", "Grateful"],
  },
  sadness: {
    color: "#4682B4",
    emotions: ["Sad", "Lonely", "Disappointed", "Hurt", "Vulnerable"],
  },
  anger: {
    color: "#DC143C",
    emotions: ["Angry", "Frustrated", "Annoyed", "Bitter", "Critical"],
  },
  fear: {
    color: "#9370DB",
    emotions: ["Anxious", "Worried", "Scared", "Insecure", "Overwhelmed"],
  },
  disgust: {
    color: "#8FBC8F",
    emotions: ["Disgusted", "Disapproving", "Uncomfortable", "Detached"],
  },
  surprise: {
    color: "#FF8C00",
    emotions: ["Surprised", "Amazed", "Confused", "Startled"],
  },
};

export function EmotionWheel() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<Array<{
    id?: number;
    category: string;
    emotion: string;
    timestamp: Date;
    created_at?: string;
  }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmotionHistory();
  }, []);

  const loadEmotionHistory = async () => {
    try {
      const data = await emotionAPI.getAll();
      const formatted = data.slice(0, 5).map((entry: any) => ({
        id: entry.id,
        category: entry.category,
        emotion: entry.emotion,
        timestamp: new Date(entry.created_at),
      }));
      setEmotionHistory(formatted);
    } catch (error) {
      console.error('Failed to load emotion history:', error);
    }
  };

  const saveEmotion = async () => {
    if (!selectedCategory || !selectedEmotion || loading) return;

    setLoading(true);
    try {
      const entry = await emotionAPI.create({
        category: selectedCategory,
        emotion: selectedEmotion,
      });

      setEmotionHistory([
        {
          id: entry.id,
          category: entry.category,
          emotion: entry.emotion,
          timestamp: new Date(entry.created_at),
        },
        ...emotionHistory,
      ]);
      toast.success(`Emotion logged: ${selectedEmotion}`);
      setSelectedCategory(null);
      setSelectedEmotion(null);
    } catch (error) {
      console.error('Failed to save emotion:', error);
      toast.error("Failed to save emotion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" />
          Emotion Wheel
        </CardTitle>
        <CardDescription>
          Identify and understand your emotions with greater depth
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emotion Categories */}
        <div>
          <h4 className="mb-4 text-center">
            {selectedCategory
              ? "Now, choose a specific emotion:"
              : "First, select an emotion category:"}
          </h4>
          
          {!selectedCategory ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {Object.entries(emotionCategories).map(([key, category]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(key)}
                  className="rounded-lg border-2 p-4 text-center capitalize transition-all hover:shadow-lg"
                  style={{
                    borderColor: category.color,
                    backgroundColor: `${category.color}20`,
                  }}
                >
                  <p style={{ fontWeight: 600 }}>{key}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {category.emotions.length} emotions
                  </p>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="capitalize"
                  style={{
                    borderColor: emotionCategories[selectedCategory as keyof typeof emotionCategories].color,
                  }}
                >
                  {selectedCategory}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedEmotion(null);
                  }}
                >
                  Change Category
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {emotionCategories[selectedCategory as keyof typeof emotionCategories].emotions.map(
                  (emotion) => (
                    <motion.button
                      key={emotion}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedEmotion(emotion)}
                      className={`rounded-lg border-2 p-4 text-center transition-all ${
                        selectedEmotion === emotion
                          ? "shadow-lg"
                          : "hover:shadow-md"
                      }`}
                      style={{
                        borderColor:
                          selectedEmotion === emotion
                            ? emotionCategories[selectedCategory as keyof typeof emotionCategories].color
                            : "var(--border)",
                        backgroundColor:
                          selectedEmotion === emotion
                            ? `${emotionCategories[selectedCategory as keyof typeof emotionCategories].color}30`
                            : "transparent",
                      }}
                    >
                      <p>{emotion}</p>
                    </motion.button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        {selectedEmotion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button onClick={saveEmotion} className="w-full gap-2" disabled={loading}>
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : `Save: I'm feeling ${selectedEmotion}`}
            </Button>
          </motion.div>
        )}

        {/* Emotion History */}
        {emotionHistory.length > 0 && (
          <div className="space-y-3 border-t pt-4">
            <h4>Recent Emotions</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {emotionHistory.map((entry) => (
                <div
                  key={entry.id || entry.timestamp.getTime()}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          emotionCategories[entry.category as keyof typeof emotionCategories].color,
                      }}
                    />
                    <div>
                      <p className="text-sm" style={{ fontWeight: 600 }}>
                        {entry.emotion}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {entry.category}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {entry.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
          💡 Understanding your emotions in detail helps you process them better
          and communicate more effectively.
        </div>
      </CardContent>
    </Card>
  );
}

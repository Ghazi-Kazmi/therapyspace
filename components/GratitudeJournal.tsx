import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Heart, Plus, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { gratitudeAPI } from "../src/services/api";

interface GratitudeEntry {
  id: number;
  date?: string;
  created_at?: string;
  items: string[];
}

export function GratitudeJournal() {
  const [gratitudeItems, setGratitudeItems] = useState<string[]>(["", "", ""]);
  const [pastEntries, setPastEntries] = useState<GratitudeEntry[]>([]);
  const [showPast, setShowPast] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await gratitudeAPI.getAll();
      const formattedEntries = data.map((entry: any) => ({
        ...entry,
        date: new Date(entry.created_at).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }));
      setPastEntries(formattedEntries);
    } catch (error) {
      console.error('Failed to load gratitude entries:', error);
    }
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...gratitudeItems];
    newItems[index] = value;
    setGratitudeItems(newItems);
  };

  const addItem = () => {
    setGratitudeItems([...gratitudeItems, ""]);
  };

  const removeItem = (index: number) => {
    if (gratitudeItems.length > 1) {
      const newItems = gratitudeItems.filter((_, i) => i !== index);
      setGratitudeItems(newItems);
    }
  };

  const saveGratitude = async () => {
    const filledItems = gratitudeItems.filter((item) => item.trim() !== "");
    
    if (filledItems.length === 0) {
      toast.error("Please add at least one thing you're grateful for");
      return;
    }

    setLoading(true);
    try {
      const entry = await gratitudeAPI.create({ items: filledItems });

      const formattedEntry: GratitudeEntry = {
        ...entry,
        date: new Date(entry.created_at).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      setPastEntries([formattedEntry, ...pastEntries]);
      setGratitudeItems(["", "", ""]);
      toast.success("Gratitude saved! 🌟");
      
      // Text to speech
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          "Your gratitude has been saved. Thank you for taking time to appreciate the good things in your life."
        );
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Failed to save gratitude:', error);
      toast.error("Failed to save gratitude. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTotalGratitudeCount = () => {
    return pastEntries.reduce((sum, entry) => sum + entry.items.length, 0);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" fill="currentColor" />
              Gratitude Journal
            </CardTitle>
            <CardDescription>
              Cultivate positivity by recognizing the good in your life
            </CardDescription>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Star className="h-3 w-3" />
            {getTotalGratitudeCount()} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Today's Gratitude */}
        <div className="space-y-4">
          <div className="rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
            <h4 className="mb-2">What are you grateful for today?</h4>
            <p className="text-sm text-muted-foreground">
              List 3 things - big or small - that bring you joy or appreciation
            </p>
          </div>

          <div className="space-y-3">
            {gratitudeItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <span className="text-sm">{index + 1}</span>
                </div>
                <Input
                  placeholder={`I'm grateful for...`}
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  className="flex-1"
                />
                {gratitudeItems.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={addItem}
              className="gap-2"
              disabled={gratitudeItems.length >= 10}
            >
              <Plus className="h-4 w-4" />
              Add More
            </Button>
            <Button onClick={saveGratitude} className="flex-1" disabled={loading}>
              {loading ? "Saving..." : "Save Today's Gratitude"}
            </Button>
          </div>
        </div>

        {/* Past Entries */}
        <div className="border-t pt-4">
          <Button
            variant="ghost"
            onClick={() => setShowPast(!showPast)}
            className="mb-3 w-full justify-between"
          >
            <span>Past Gratitude Entries ({pastEntries.length})</span>
            <span>{showPast ? "−" : "+"}</span>
          </Button>

          {showPast && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3 max-h-96 overflow-y-auto"
            >
              {pastEntries.length === 0 ? (
                <div className="py-8 text-center">
                  <Heart className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    Start your gratitude practice today
                  </p>
                </div>
              ) : (
                pastEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border bg-card p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {entry.date || new Date(entry.created_at || '').toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <Badge variant="outline" className="gap-1">
                        <Heart className="h-3 w-3" fill="currentColor" />
                        {entry.items.length}
                      </Badge>
                    </div>
                    <ul className="space-y-2">
                      {entry.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="mt-1 text-primary">✦</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </div>

        {/* Benefits */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <h4 className="mb-2 flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 text-primary" />
            Why Practice Gratitude?
          </h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Improves mood and overall happiness</li>
            <li>• Reduces stress and anxiety</li>
            <li>• Strengthens relationships</li>
            <li>• Promotes better sleep</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

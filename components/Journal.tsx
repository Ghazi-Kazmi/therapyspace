import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { BookOpen, Save, Sparkles } from "lucide-react";
import { journalAPI } from "../src/services/api";
import { toast } from "sonner";

interface JournalEntry {
  id: number;
  date?: string;
  created_at?: string;
  content: string;
  prompts: string[];
}

const journalPrompts = [
  "Three things I'm grateful for today...",
  "What made me smile today?",
  "A challenge I faced and how I handled it...",
  "What I learned about myself today...",
  "Something I want to let go of...",
  "A moment I felt proud of myself...",
  "What I need more of in my life...",
  "How I showed kindness today...",
];

export function Journal() {
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showEntries, setShowEntries] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(
    journalPrompts[Math.floor(Math.random() * journalPrompts.length)]
  );

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await journalAPI.getAll();
      const formattedEntries = data.map((entry: any) => ({
        ...entry,
        date: new Date(entry.created_at).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }));
      setEntries(formattedEntries);
    } catch (error) {
      console.error('Failed to load journal entries:', error);
    }
  };

  const saveEntry = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      const entry = await journalAPI.create({
        content,
        prompts: [currentPrompt],
      });

      const formattedEntry: JournalEntry = {
        ...entry,
        date: new Date(entry.created_at).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      setEntries([formattedEntry, ...entries]);
      setContent("");
      
      // New prompt for next entry
      setCurrentPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)]);
      
      // Speak confirmation
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance("Your journal entry has been saved.");
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }

      toast.success("Journal entry saved!");
    } catch (error) {
      console.error('Failed to save journal entry:', error);
      toast.error("Failed to save journal entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getNewPrompt = () => {
    setCurrentPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Daily Reflection Journal
        </CardTitle>
        <CardDescription>
          Express your thoughts and feelings in a private, safe space
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Writing Prompt */}
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Today's Prompt
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={getNewPrompt}
              className="h-auto p-1 text-xs"
            >
              New Prompt
            </Button>
          </div>
          <p className="text-sm italic text-muted-foreground">{currentPrompt}</p>
        </div>

        {/* Journal Textarea */}
        <div className="space-y-2">
          <label htmlFor="journal-content" className="text-sm">
            Write your thoughts
          </label>
          <Textarea
            id="journal-content"
            placeholder="Start writing... There's no right or wrong way to journal."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[250px]"
          />
          <p className="text-xs text-muted-foreground">
            {content.length} characters
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={saveEntry} className="flex-1 gap-2" disabled={!content.trim() || loading}>
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save Entry"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowEntries(!showEntries)}
          >
            {showEntries ? "Hide" : "View"} Past Entries ({entries.length})
          </Button>
        </div>

        {/* Past Entries */}
        {showEntries && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-3 border-t pt-4"
          >
            <h4>Your Journal Entries</h4>
            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No entries yet. Start journaling to build your reflection history.
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-lg border bg-card p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {entry.date || new Date(entry.created_at || '').toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {entry.prompts && entry.prompts[0] ? entry.prompts[0] : "Journal Entry"}
                      </Badge>
                    </div>
                    <p className="whitespace-pre-wrap text-sm">{entry.content}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

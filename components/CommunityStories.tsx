import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Users, MessageCircle, Send, Plus, X, Heart } from "lucide-react";
import { toast } from "sonner";

interface Story {
  id: number;
  author: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  timestamp: Date;
  liked?: boolean;
}

const initialStories: Story[] = [
  { id: 1, author: "Anonymous Hero", title: "I finally asked for help", content: "After years of struggling alone, I reached out to a therapist. It was the hardest and best decision I've ever made. If you're reading this and hesitating — you deserve support.", category: "Recovery", likes: 142, comments: 23, timestamp: new Date(Date.now() - 86400000) },
  { id: 2, author: "Hope Keeper", title: "30 days of journaling", content: "I committed to writing just 5 minutes every day. It's been a month now, and I can see patterns in my thoughts I never noticed before. Small steps lead to big insights.", category: "Self-Discovery", likes: 98, comments: 15, timestamp: new Date(Date.now() - 172800000) },
  { id: 3, author: "Mindful Soul", title: "Meditation changed my anxiety", content: "I was skeptical at first, but daily meditation for just 10 minutes has reduced my anxiety significantly. I'm calmer, sleep better, and feel more present.", category: "Mindfulness", likes: 256, comments: 41, timestamp: new Date(Date.now() - 259200000) },
  { id: 4, author: "Rising Phoenix", title: "One year later", content: "A year ago today, I was at my lowest point. Today, I'm celebrating small victories and feeling hopeful. Recovery isn't linear, but it's possible. Keep going.", category: "Inspiration", likes: 387, comments: 67, timestamp: new Date(Date.now() - 345600000) },
];

const categories = ["All", "Recovery", "Self-Discovery", "Mindfulness", "Inspiration", "Support"];

const getTimeAgo = (date: Date) => {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  const d = Math.floor(s / 86400);
  if (d > 0) return `${d}d ago`;
  const h = Math.floor(s / 3600);
  if (h > 0) return `${h}h ago`;
  const m = Math.floor(s / 60);
  if (m > 0) return `${m}m ago`;
  return "Just now";
};

const initials = (name: string) =>
  name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

export function CommunityStories() {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [selected, setSelected] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "Inspiration" });

  const filtered = selected === "All" ? stories : stories.filter(s => s.category === selected);

  const submit = () => {
    if (!form.title.trim() || !form.content.trim()) { toast.error("Please fill in both fields"); return; }
    const s: Story = {
      id: Date.now(), author: `Anonymous ${Math.floor(Math.random() * 999)}`,
      title: form.title, content: form.content, category: form.category,
      likes: 0, comments: 0, timestamp: new Date(),
    };
    setStories([s, ...stories]);
    setForm({ title: "", content: "", category: "Inspiration" });
    setShowForm(false);
    toast.success("Shared anonymously 💙");
  };

  const like = (id: number) =>
    setStories(stories.map(s =>
      s.id === id ? { ...s, likes: s.liked ? s.likes - 1 : s.likes + 1, liked: !s.liked } : s
    ));

  return (
    <section className="py-16">
      <div className="container px-5 md:px-8">
        <Card>
          <CardHeader className="border-b pb-5">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" style={{ color: "hsl(var(--primary))" }} />
              <CardTitle className="text-base font-semibold">Community Stories</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Anonymous stories of hope, recovery, and inspiration
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 p-5">
            {/* Category filter */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelected(cat)}
                  className="rounded-full border px-3 py-1 text-xs font-medium transition-all"
                  style={{
                    background: selected === cat ? "hsl(var(--primary))" : "transparent",
                    borderColor: selected === cat ? "hsl(var(--primary))" : "hsl(var(--border))",
                    color: selected === cat ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Add story */}
            {!showForm && (
              <Button
                variant="outline"
                onClick={() => setShowForm(true)}
                className="w-full gap-2 rounded-xl border-dashed text-sm text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                Share Your Story (Anonymous)
              </Button>
            )}

            {/* Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden rounded-xl border p-4"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Share Your Story</p>
                    <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Title..."
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    style={{ borderColor: "hsl(var(--border))" }}
                  />
                  <Textarea
                    placeholder="Your story (posted anonymously)..."
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    className="min-h-[100px] text-sm"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {categories.slice(1).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setForm({ ...form, category: cat })}
                        className="rounded-full border px-3 py-1 text-xs font-medium transition-all"
                        style={{
                          background: form.category === cat ? "hsl(var(--primary))" : "transparent",
                          borderColor: form.category === cat ? "hsl(var(--primary))" : "hsl(var(--border))",
                          color: form.category === cat ? "white" : "hsl(var(--muted-foreground))",
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={submit}
                      size="sm"
                      className="flex-1 gap-2 rounded-lg text-sm"
                      style={{ background: "hsl(var(--primary))", color: "white", border: "none" }}
                    >
                      <Send className="h-3.5 w-3.5" />
                      Share Story
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowForm(false)} className="rounded-lg text-sm">
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stories */}
            <div className="space-y-3">
              <AnimatePresence>
                {filtered.map((story, i) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="rounded-xl border p-4 transition-shadow hover:shadow-sm"
                    style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
                  >
                    {/* Author */}
                    <div className="mb-3 flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback
                          className="text-xs font-semibold"
                          style={{
                            background: "hsl(var(--primary) / 0.1)",
                            color: "hsl(var(--primary))",
                          }}
                        >
                          {initials(story.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-semibold">{story.author}</p>
                        <p className="text-xs text-muted-foreground">{getTimeAgo(story.timestamp)}</p>
                      </div>
                      <span
                        className="ml-auto rounded-full border px-2 py-0.5 text-xs font-medium"
                        style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
                      >
                        {story.category}
                      </span>
                    </div>

                    <h4 className="mb-1.5 text-sm font-semibold">{story.title}</h4>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{story.content}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <button
                        onClick={() => like(story.id)}
                        className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                        style={{ color: story.liked ? "hsl(var(--primary))" : undefined }}
                      >
                        <Heart
                          className="h-3.5 w-3.5"
                          fill={story.liked ? "currentColor" : "none"}
                        />
                        {story.likes}
                      </button>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {story.comments}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <p className="text-center text-xs text-muted-foreground/60">
              Community-shared experiences. Always consult a professional for personal advice.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

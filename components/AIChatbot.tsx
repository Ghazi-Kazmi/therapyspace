import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Send, Trash2, Bot, Sparkles } from "lucide-react";
import { chatAPI } from "../src/services/api";
import { toast } from "sonner";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const greetings = [
  "Hello! I'm Aria, your AI wellness companion. How are you feeling today?",
  "Hi there! I'm Aria — here to listen without judgment. What's on your mind?",
  "Welcome. I'm Aria, powered by Gemini AI. This is your safe space. How can I help?",
];

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement | null;
    if (viewport) viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);
  useEffect(() => { loadMessages(); }, []);

  const loadMessages = async () => {
    try {
      const data = await chatAPI.getAll();
      if (data.length === 0) {
        setMessages([{ id: 0, text: greetings[Math.floor(Math.random() * greetings.length)], sender: "bot", timestamp: new Date() }]);
      } else {
        setMessages(data.map((msg: any) => ({
          id: msg.id, text: msg.text, sender: msg.sender, timestamp: new Date(msg.created_at),
        })));
      }
    } catch {
      setMessages([{ id: 0, text: greetings[Math.floor(Math.random() * greetings.length)], sender: "bot", timestamp: new Date() }]);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || loading) return;
    setLoading(true);
    setIsTyping(true);
    const userText = inputValue;
    setInputValue("");

    const tempMsg: Message = { id: Date.now(), text: userText, sender: "user", timestamp: new Date() };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const response = await chatAPI.create({ text: userText, sender: "user" });
      setIsTyping(false);
      if (response.userMessage && response.botMessage) {
        setMessages(prev => [
          ...prev.slice(0, -1),
          { id: response.userMessage.id, text: response.userMessage.text, sender: "user", timestamp: new Date(response.userMessage.created_at) },
          { id: response.botMessage.id, text: response.botMessage.text, sender: "bot", timestamp: new Date(response.botMessage.created_at) },
        ]);
      }
    } catch {
      setIsTyping(false);
      toast.error("Couldn't reach Aria right now. Please try again.");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  };

  const clearChat = async () => {
    try {
      await chatAPI.clear();
      setMessages([{ id: 0, text: greetings[Math.floor(Math.random() * greetings.length)], sender: "bot", timestamp: new Date() }]);
      toast.success("Conversation cleared");
    } catch {
      toast.error("Couldn't clear the chat");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <Card className="w-full overflow-hidden">
      {/* Header */}
      <CardHeader className="border-b pb-4 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg border"
              style={{ background: "hsl(var(--primary) / 0.08)", borderColor: "hsl(var(--primary) / 0.2)" }}
            >
              <Bot className="h-4 w-4" style={{ color: "hsl(var(--primary))" }} />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                Aria
                <span
                  className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium"
                  style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  Gemini AI
                </span>
              </CardTitle>
              <CardDescription className="text-xs">AI mental wellness companion</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            className="h-8 w-8 rounded-lg text-muted-foreground/60 hover:text-muted-foreground"
            title="Clear conversation"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        {/* Messages */}
        <ScrollArea
          ref={scrollAreaRef}
          className="h-[420px] rounded-lg border"
          style={{ background: "hsl(var(--muted) / 0.4)" }}
        >
          <div className="space-y-3 p-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <div
                      className="mr-2 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border"
                      style={{
                        background: "hsl(var(--primary) / 0.08)",
                        borderColor: "hsl(var(--primary) / 0.2)",
                      }}
                    >
                      <Bot className="h-3.5 w-3.5" style={{ color: "hsl(var(--primary))" }} />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-xl px-3.5 py-2.5 ${
                      msg.sender === "user" ? "rounded-tr-sm" : "rounded-tl-sm"
                    }`}
                    style={
                      msg.sender === "user"
                        ? {
                            background: "hsl(var(--foreground))",
                            color: "hsl(var(--background))",
                          }
                        : {
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            color: "hsl(var(--foreground))",
                          }
                    }
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span className="mt-1 block text-xs opacity-40">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <div
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border"
                    style={{ background: "hsl(var(--primary) / 0.08)", borderColor: "hsl(var(--primary) / 0.2)" }}
                  >
                    <Bot className="h-3.5 w-3.5" style={{ color: "hsl(var(--primary))" }} />
                  </div>
                  <div
                    className="flex items-center gap-1.5 rounded-xl rounded-tl-sm border px-3.5 py-2.5"
                    style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                  >
                    <span className="typing-dot" style={{ color: "hsl(var(--muted-foreground))" }} />
                    <span className="typing-dot" style={{ color: "hsl(var(--muted-foreground))" }} />
                    <span className="typing-dot" style={{ color: "hsl(var(--muted-foreground))" }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Input */}
        <div
          className="flex items-center gap-2 rounded-xl border bg-card p-1.5"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <Input
            ref={inputRef}
            placeholder="Share what's on your mind..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="flex-1 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !inputValue.trim()}
            size="icon"
            className="h-8 w-8 flex-shrink-0 rounded-lg transition-all"
            style={{
              background: inputValue.trim() ? "hsl(var(--primary))" : "hsl(var(--muted))",
              color: inputValue.trim() ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
              border: "none",
            }}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground/60">
          Aria is an AI, not a licensed therapist. Seek professional help when needed.
        </p>
      </CardContent>
    </Card>
  );
}

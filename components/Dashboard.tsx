import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MoodTracker } from "./MoodTracker";
import { AIChatbot } from "./AIChatbot";
import { Journal } from "./Journal";
import { CalmZone } from "./CalmZone";
import { ProgressAnalytics } from "./ProgressAnalytics";
import { DailyAffirmations } from "./DailyAffirmations";
import { GratitudeJournal } from "./GratitudeJournal";
import { AchievementsStreak } from "./AchievementsStreak";
import { SelfCareReminders } from "./SelfCareReminders";
import { QuoteOfTheDay } from "./QuoteOfTheDay";
import { EmotionWheel } from "./EmotionWheel";
import {
  MessageCircle, BookOpen, Wind, Smile, TrendingUp, Sparkles,
  Heart, Award, Bell, Compass,
} from "lucide-react";

const tabs = [
  { value: "mood",         icon: Smile,         label: "Mood" },
  { value: "emotions",     icon: Compass,        label: "Emotions" },
  { value: "chat",         icon: MessageCircle,  label: "Chat" },
  { value: "journal",      icon: BookOpen,       label: "Journal" },
  { value: "calm",         icon: Wind,           label: "Calm" },
  { value: "analytics",    icon: TrendingUp,     label: "Analytics" },
  { value: "affirmations", icon: Sparkles,       label: "Affirm" },
  { value: "gratitude",    icon: Heart,          label: "Gratitude" },
  { value: "achievements", icon: Award,          label: "Achievements" },
  { value: "reminders",    icon: Bell,           label: "Reminders" },
];

export function Dashboard() {
  return (
    <motion.section
      className="py-16"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container px-5 md:px-8">
        {/* Section header */}
        <div className="mb-8 border-b pb-6" style={{ borderColor: "hsl(var(--border))" }}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: "hsl(var(--primary))" }}>
            Dashboard
          </p>
          <h2 className="text-2xl font-bold tracking-tight">Your Wellness Space</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose a tool to support your journey</p>
        </div>

        {/* Quote of the day */}
        <div className="mb-8">
          <QuoteOfTheDay />
        </div>

        <Tabs defaultValue="mood" className="w-full">
          {/* Tab bar */}
          <div className="mb-6 overflow-x-auto">
            <TabsList
              className="inline-flex h-auto min-w-max gap-0.5 rounded-xl border p-1"
              style={{ background: "hsl(var(--muted))", borderColor: "hsl(var(--border))" }}
            >
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  <tab.icon className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab content */}
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {tab.value === "mood"         && <MoodTracker />}
                {tab.value === "emotions"     && <EmotionWheel />}
                {tab.value === "chat"         && <AIChatbot />}
                {tab.value === "journal"      && <Journal />}
                {tab.value === "calm"         && <CalmZone />}
                {tab.value === "analytics"    && <ProgressAnalytics />}
                {tab.value === "affirmations" && <DailyAffirmations />}
                {tab.value === "gratitude"    && <GratitudeJournal />}
                {tab.value === "achievements" && <AchievementsStreak />}
                {tab.value === "reminders"    && <SelfCareReminders />}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </motion.section>
  );
}

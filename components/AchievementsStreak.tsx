import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Flame, Award, Trophy, Star, Target, Sparkles, Calendar, Heart } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  progress: number;
  total: number;
  unlocked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const achievements: Achievement[] = [
  {
    id: "first-mood",
    name: "First Step",
    description: "Track your mood for the first time",
    icon: Heart,
    progress: 1,
    total: 1,
    unlocked: true,
    rarity: "common",
  },
  {
    id: "week-streak",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: Flame,
    progress: 5,
    total: 7,
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "journal-10",
    name: "Thoughtful Writer",
    description: "Create 10 journal entries",
    icon: Sparkles,
    progress: 10,
    total: 10,
    unlocked: true,
    rarity: "rare",
  },
  {
    id: "meditation-master",
    name: "Meditation Master",
    description: "Complete 20 meditation sessions",
    icon: Star,
    progress: 12,
    total: 20,
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "gratitude-50",
    name: "Grateful Heart",
    description: "List 50 things you're grateful for",
    icon: Heart,
    progress: 32,
    total: 50,
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "month-streak",
    name: "Consistency Champion",
    description: "Maintain a 30-day streak",
    icon: Trophy,
    progress: 5,
    total: 30,
    unlocked: false,
    rarity: "legendary",
  },
  {
    id: "wellness-100",
    name: "Wellness Warrior",
    description: "Complete 100 wellness activities",
    icon: Target,
    progress: 67,
    total: 100,
    unlocked: false,
    rarity: "legendary",
  },
  {
    id: "early-bird",
    name: "Early Bird",
    description: "Check in before 8 AM, 5 times",
    icon: Calendar,
    progress: 3,
    total: 5,
    unlocked: false,
    rarity: "common",
  },
];

const rarityColors = {
  common: "bg-slate-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-amber-500",
};

const rarityGradients = {
  common: "from-slate-500/20 to-slate-500/5",
  rare: "from-blue-500/20 to-blue-500/5",
  epic: "from-purple-500/20 to-purple-500/5",
  legendary: "from-amber-500/20 to-amber-500/5",
};

export function AchievementsStreak() {
  const [currentStreak] = useState(5);
  const [longestStreak] = useState(12);
  const [totalDays] = useState(45);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalAchievements = achievements.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Achievements & Streaks
        </CardTitle>
        <CardDescription>
          Celebrate your progress and build healthy habits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Streak Stats */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-lg border bg-gradient-to-br from-orange-500/20 to-orange-500/5 p-4 text-center"
          >
            <Flame className="mx-auto mb-2 h-8 w-8 text-orange-500" />
            <p className="text-2xl" style={{ fontWeight: 600 }}>
              {currentStreak}
            </p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-lg border bg-gradient-to-br from-primary/20 to-primary/5 p-4 text-center"
          >
            <Award className="mx-auto mb-2 h-8 w-8 text-primary" />
            <p className="text-2xl" style={{ fontWeight: 600 }}>
              {longestStreak}
            </p>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded-lg border bg-gradient-to-br from-secondary/20 to-secondary/5 p-4 text-center"
          >
            <Calendar className="mx-auto mb-2 h-8 w-8 text-secondary-foreground" />
            <p className="text-2xl" style={{ fontWeight: 600 }}>
              {totalDays}
            </p>
            <p className="text-xs text-muted-foreground">Total Days</p>
          </motion.div>
        </div>

        {/* Achievement Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4>Achievement Progress</h4>
            <Badge variant="secondary">
              {unlockedCount}/{totalAchievements}
            </Badge>
          </div>
          <Progress value={(unlockedCount / totalAchievements) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {Math.round((unlockedCount / totalAchievements) * 100)}% Complete
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="space-y-3">
          <h4>Your Achievements</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className={`rounded-lg border p-4 transition-all ${
                  achievement.unlocked
                    ? `bg-gradient-to-br ${rarityGradients[achievement.rarity]}`
                    : "bg-muted/30 opacity-60"
                }`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`rounded-lg p-2 ${
                        achievement.unlocked
                          ? rarityColors[achievement.rarity]
                          : "bg-muted"
                      }`}
                    >
                      <achievement.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm" style={{ fontWeight: 600 }}>
                        {achievement.name}
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-1 text-xs capitalize"
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <Star className="h-5 w-5 text-amber-500" fill="currentColor" />
                  )}
                </div>

                <p className="mb-3 text-xs text-muted-foreground">
                  {achievement.description}
                </p>

                {!achievement.unlocked && (
                  <div className="space-y-1">
                    <Progress
                      value={(achievement.progress / achievement.total) * 100}
                      className="h-1.5"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {achievement.progress}/{achievement.total}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Motivation */}
        <div className="rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 p-4 text-center">
          <Sparkles className="mx-auto mb-2 h-6 w-6 text-primary" />
          <p className="text-sm">
            Keep going! You're building amazing habits. 🌟
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Complete daily activities to unlock more achievements
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

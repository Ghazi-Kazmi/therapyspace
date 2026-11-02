import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Bell, Plus, Trash2, Clock, Coffee, Moon, Sun, Droplets, Heart } from "lucide-react";
import { toast } from "sonner";
import { reminderAPI } from "../src/services/api";

interface Reminder {
  id: number;
  title: string;
  time: string;
  icon: any;
  enabled: boolean;
  frequency: "daily" | "weekdays" | "weekends";
}

const iconMap: Record<string, any> = {
  Bell,
  Coffee,
  Moon,
  Sun,
  Droplets,
  Heart,
};

const presetReminders = [
  { title: "Morning Affirmation", time: "08:00", icon: "Sun", frequency: "daily" as const },
  { title: "Hydration Check", time: "10:00", icon: "Droplets", frequency: "daily" as const },
  { title: "Lunch Break", time: "12:30", icon: "Coffee", frequency: "weekdays" as const },
  { title: "Breathing Exercise", time: "15:00", icon: "Heart", frequency: "daily" as const },
  { title: "Evening Reflection", time: "20:00", icon: "Moon", frequency: "daily" as const },
];

export function SelfCareReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    time: "09:00",
    frequency: "daily" as const,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const data = await reminderAPI.getAll();
      if (data.length === 0) {
        // Initialize with preset reminders
        const initialReminders = await Promise.all(
          presetReminders.map(async (preset, index) => {
            const reminder = await reminderAPI.create({
              ...preset,
              enabled: index < 2,
            });
            return {
              id: reminder.id,
              ...preset,
              icon: iconMap[preset.icon] || Bell,
              enabled: reminder.enabled,
            };
          })
        );
        setReminders(initialReminders);
      } else {
        const formatted = data.map((r: any) => ({
          id: r.id,
          title: r.title,
          time: r.time,
          icon: iconMap[r.icon] || Bell,
          enabled: r.enabled,
          frequency: r.frequency,
        }));
        setReminders(formatted);
      }
    } catch (error) {
      console.error('Failed to load reminders:', error);
    }
  };

  const toggleReminder = async (id: number) => {
    try {
      const updated = await reminderAPI.toggle(id);
      setReminders(
        reminders.map((reminder) =>
          reminder.id === id
            ? { ...reminder, enabled: updated.enabled }
            : reminder
        )
      );
      toast.success(
        updated.enabled
          ? `Reminder enabled: ${updated.title}`
          : `Reminder disabled: ${updated.title}`
      );
    } catch (error) {
      console.error('Failed to toggle reminder:', error);
      toast.error("Failed to update reminder");
    }
  };

  const deleteReminder = async (id: number) => {
    try {
      await reminderAPI.delete(id);
      setReminders(reminders.filter((reminder) => reminder.id !== id));
      toast.success("Reminder deleted");
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      toast.error("Failed to delete reminder");
    }
  };

  const addReminder = async () => {
    if (!newReminder.title.trim()) {
      toast.error("Please enter a reminder title");
      return;
    }

    setLoading(true);
    try {
      const reminder = await reminderAPI.create({
        title: newReminder.title,
        time: newReminder.time,
        icon: "Bell",
        enabled: true,
        frequency: newReminder.frequency,
      });

      setReminders([
        ...reminders,
        {
          id: reminder.id,
          title: reminder.title,
          time: reminder.time,
          icon: Bell,
          enabled: reminder.enabled,
          frequency: reminder.frequency,
        },
      ]);
      setNewReminder({ title: "", time: "09:00", frequency: "daily" });
      setShowAddForm(false);
      toast.success("Reminder added successfully");
    } catch (error) {
      console.error('Failed to add reminder:', error);
      toast.error("Failed to add reminder");
    } finally {
      setLoading(false);
    }
  };

  const getNextReminderTime = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const enabledReminders = reminders.filter((r) => r.enabled);
    const upcoming = enabledReminders
      .filter((r) => r.time > currentTime)
      .sort((a, b) => a.time.localeCompare(b.time));

    return upcoming[0] || null;
  };

  const nextReminder = getNextReminderTime();
  const enabledCount = reminders.filter((r) => r.enabled).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Self-Care Reminders
            </CardTitle>
            <CardDescription>
              Set gentle nudges to prioritize your well-being
            </CardDescription>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            {enabledCount} active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Next Reminder */}
        {nextReminder && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 p-4"
          >
            <div className="flex items-center gap-3">
              <nextReminder.icon className="h-6 w-6 text-primary" />
              <div className="flex-1">
                <p className="text-sm" style={{ fontWeight: 600 }}>
                  Next: {nextReminder.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  at {nextReminder.time}
                </p>
              </div>
              <Bell className="h-5 w-5 animate-pulse text-primary" />
            </div>
          </motion.div>
        )}

        {/* Reminders List */}
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`rounded-lg border p-4 transition-all ${
                reminder.enabled ? "bg-card" : "bg-muted/30 opacity-70"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-lg p-2 ${
                    reminder.enabled ? "bg-primary/20" : "bg-muted"
                  }`}
                >
                  <reminder.icon
                    className={`h-5 w-5 ${
                      reminder.enabled ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>

                <div className="flex-1">
                  <p className="text-sm" style={{ fontWeight: 600 }}>
                    {reminder.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {reminder.time}
                    </p>
                    <Badge variant="outline" className="text-xs capitalize">
                      {reminder.frequency}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={reminder.enabled}
                    onCheckedChange={() => toggleReminder(reminder.id)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteReminder(reminder.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add New Reminder */}
        {!showAddForm ? (
          <Button
            variant="outline"
            onClick={() => setShowAddForm(true)}
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Custom Reminder
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 rounded-lg border p-4"
          >
            <h4>New Reminder</h4>
            
            <div className="space-y-2">
              <Label htmlFor="reminder-title">Title</Label>
              <Input
                id="reminder-title"
                placeholder="e.g., Take a walk"
                value={newReminder.title}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reminder-time">Time</Label>
                <Input
                  id="reminder-time"
                  type="time"
                  value={newReminder.time}
                  onChange={(e) =>
                    setNewReminder({ ...newReminder, time: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder-frequency">Frequency</Label>
                <Select
                  value={newReminder.frequency}
                  onValueChange={(value: any) =>
                    setNewReminder({ ...newReminder, frequency: value })
                  }
                >
                  <SelectTrigger id="reminder-frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekdays">Weekdays</SelectItem>
                    <SelectItem value="weekends">Weekends</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addReminder} className="flex-1" disabled={loading}>
                {loading ? "Adding..." : "Add Reminder"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Info */}
        <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
          💡 Tip: Browser notifications will remind you even when you're not on this page.
          Make sure to allow notifications!
        </div>
      </CardContent>
    </Card>
  );
}

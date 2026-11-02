import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Calendar, Award, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

// Mock data - in a real app, this would come from actual mood tracking
const generateMoodData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day, index) => ({
    day,
    mood: Math.floor(Math.random() * 3) + 3, // 3-5 range
    activities: Math.floor(Math.random() * 5) + 1,
  }));
};

const moodDistribution = [
  { name: "Great", value: 30, color: "#4a9d8f" },
  { name: "Good", value: 35, color: "#7ec4b8" },
  { name: "Neutral", value: 20, color: "#b4d4e1" },
  { name: "Sad", value: 10, color: "#9fc9e8" },
  { name: "Very Sad", value: 5, color: "#d4e4f7" },
];

const activityImpact = [
  { activity: "Meditation", positiveImpact: 85 },
  { activity: "Exercise", positiveImpact: 78 },
  { activity: "Journaling", positiveImpact: 72 },
  { activity: "Socializing", positiveImpact: 68 },
  { activity: "Sleep", positiveImpact: 90 },
];

export function ProgressAnalytics() {
  const [weeklyData] = useState(generateMoodData());

  const exportData = () => {
    const dataStr = JSON.stringify({ weeklyData, moodDistribution, activityImpact }, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `therapy-space-data-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Progress Analytics
            </CardTitle>
            <CardDescription>
              Visualize your mental wellness journey over time
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={exportData} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Mood Trends */}
          <TabsContent value="trends" className="space-y-4">
            <div>
              <h4 className="mb-4">Weekly Mood Trend</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis domain={[0, 5]} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="var(--primary)" 
                    strokeWidth={3}
                    name="Mood Level"
                    dot={{ fill: 'var(--primary)', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4 text-center">
                <Calendar className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-2xl" style={{ fontWeight: 600 }}>7</p>
                <p className="text-xs text-muted-foreground">Days Tracked</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <TrendingUp className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-2xl" style={{ fontWeight: 600 }}>+15%</p>
                <p className="text-xs text-muted-foreground">Mood Improved</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <Award className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-2xl" style={{ fontWeight: 600 }}>4.2</p>
                <p className="text-xs text-muted-foreground">Avg Mood</p>
              </div>
            </div>
          </TabsContent>

          {/* Mood Distribution */}
          <TabsContent value="distribution" className="space-y-4">
            <div>
              <h4 className="mb-4">Mood Distribution (Last 30 Days)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moodDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {moodDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {moodDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-4 w-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <Badge variant="secondary">{item.value}%</Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Activity Impact */}
          <TabsContent value="insights" className="space-y-4">
            <div>
              <h4 className="mb-4">Activity Impact on Mood</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityImpact} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="activity" type="category" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="positiveImpact" fill="var(--primary)" name="Positive Impact %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="mb-3">Key Insights</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Your mood tends to improve after meditation sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Consistent journaling correlates with better mood stability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>You've maintained a 7-day streak - keep it up!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Weekend moods are 20% higher on average</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { BarChart3, TrendingUp, Users, Vote } from "lucide-react";
import { cn } from "@/lib/utils";

interface PollStatsProps {
  totalPolls: number;
  totalVotes: number;
  activePolls: number;
  averageParticipation: number;
  className?: string;
}

export function PollStats({ 
  totalPolls, 
  totalVotes, 
  activePolls, 
  averageParticipation,
  className 
}: PollStatsProps) {
  const stats = [
    {
      title: "Total Polls",
      value: totalPolls,
      icon: BarChart3,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Votes",
      value: totalVotes,
      icon: Vote,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Active Polls",
      value: activePolls,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Avg. Participation",
      value: `${averageParticipation.toFixed(1)}%`,
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={cn("p-2 rounded-lg", stat.bgColor)}>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

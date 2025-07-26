import { useState, useEffect } from "react";
import { Timer, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveTimerProps {
  initialTimeRemaining: number; // in seconds
  onTimeUp?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LiveTimer({ initialTimeRemaining, onTimeUp, className, size = "md" }: LiveTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining);

  useEffect(() => {
    setTimeRemaining(initialTimeRemaining);
  }, [initialTimeRemaining]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          onTimeUp?.();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 10) return "text-destructive";
    if (timeRemaining <= 30) return "text-orange-500";
    return "text-primary";
  };

  const getTimerSize = () => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "lg":
        return "text-xl font-bold";
      default:
        return "text-base font-semibold";
    }
  };

  if (timeRemaining <= 0) {
    return (
      <div className={cn("flex items-center gap-2 text-red-500", getTimerSize(), className)}>
        <Clock className="h-4 w-4" />
        <span>Time's Up!</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-2 transition-colors duration-300",
      getTimeColor(),
      getTimerSize(),
      className
    )}>
      <Timer className={cn(
        "animate-pulse",
        size === "lg" ? "h-5 w-5" : size === "sm" ? "h-3 w-3" : "h-4 w-4"
      )} />
      <span className="tabular-nums font-mono">{formatTime(timeRemaining)}</span>
    </div>
  );
}

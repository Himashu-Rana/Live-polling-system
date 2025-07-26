import { Button } from "./button";
import { Plus, BarChart3, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface HeaderProps {
  onCreatePoll: () => void;
  onShowStats: () => void;
  activeView: "polls" | "create" | "stats";
  className?: string;
}

export function Header({ onCreatePoll, onShowStats, activeView, className }: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className={cn("border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50", className)}>
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-vote-option1 to-vote-option2 p-2.5 rounded-2xl shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-vote-option1 via-vote-option2 to-vote-option3 bg-clip-text text-transparent">
                  PollVault
                </h1>
                <p className="text-xs text-muted-foreground font-medium">Real-time polling platform</p>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <Button
              variant={activeView === "stats" ? "default" : "ghost"}
              size="sm"
              onClick={onShowStats}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>

            <Button
              variant={activeView === "create" ? "default" : "ghost"}
              size="sm"
              onClick={onCreatePoll}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Poll
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
            
            <div className="md:hidden flex gap-1">
              <Button
                variant={activeView === "create" ? "default" : "ghost"}
                size="icon"
                onClick={onCreatePoll}
              >
                <Plus className="h-4 w-4" />
              </Button>
              
              <Button
                variant={activeView === "stats" ? "default" : "ghost"}
                size="icon"
                onClick={onShowStats}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

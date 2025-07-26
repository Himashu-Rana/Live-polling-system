import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Users, ArrowLeft, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentNameEntryProps {
  onNameSubmit: (name: string) => void;
  onGoBack: () => void;
  isNameTaken?: boolean;
  className?: string;
}

export function StudentNameEntry({ onNameSubmit, onGoBack, isNameTaken, className }: StudentNameEntryProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Note: Auto-join logic is handled in the main LivePollingApp component
  // to avoid duplicate join attempts

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      onNameSubmit(name.trim());
    } catch (error) {
      console.error('Failed to join:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = name.trim().length >= 2;

  return (
    <div className={cn("min-h-screen bg-background flex items-center justify-center p-4", className)}>
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          onClick={onGoBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>{ Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Users, ArrowLeft, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentNameEntryProps {
  onNameSubmit: (name: string) => void;
  onGoBack: () => void;
  isNameTaken?: boolean;
  className?: string;
}

export function StudentNameEntry({ onNameSubmit, onGoBack, isNameTaken, className }: StudentNameEntryProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Note: Auto-join logic is handled in the main LivePollingApp component
  // to avoid duplicate join attempts

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      onNameSubmit(name.trim());
    } catch (error) {
      console.error('Failed to join:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = name.trim().length >= 2;

  return (
    <div className={cn("min-h-screen bg-background flex items-center justify-center p-4", className)}>
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          onClick={onGoBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to role selection
        </Button>

        {/* Main Card */}
        <Card className="shadow-xl border-border/40 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="bg-gradient-to-br from-vote-option2 to-vote-option3 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">Join as Student</CardTitle>
            <p className="text-muted-foreground">
              Enter your name to participate in live polls
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="student-name" className="text-sm font-medium">
                  Your Name
                </Label>
                <Input
                  id="student-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(
                    "text-lg py-3",
                    isNameTaken && "border-destructive focus-visible:ring-destructive"
                  )}
                  maxLength={50}
                  disabled={isSubmitting}
                  autoFocus
                />
                
                {isNameTaken && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>This name is already taken. Please choose another name.</span>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Your name will be visible to other participants
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-vote-option2 to-vote-option3 hover:from-vote-option3 hover:to-vote-option1 text-white border-0 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? "Joining..." : "Join Session"}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground">
                    By joining, you'll be able to:
                  </p>
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>• Answer live polls</span>
                    <span>• View real-time results</span>
                    <span>• Participate in discussions</span>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="mt-6 text-center text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg">
          <p className="mb-2 font-medium">Privacy Notice</p>
          <p>
            Your name will be stored locally in your browser and shared with the teacher and other participants. 
            You can change it anytime by refreshing and re-entering.
          </p>
        </div>
      </div>
    </div>
  );
}

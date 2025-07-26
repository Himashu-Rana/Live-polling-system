import { useState } from "react";
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

export { StudentNameEntry };

function StudentNameEntry({ onNameSubmit, onGoBack, isNameTaken, className }: StudentNameEntryProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      onNameSubmit(name.trim());
    } catch (error) {
      console.error("Failed to join:", error);
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
          className="mb-6 bg-blue-400 hover:bg-blue-500 text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to role selection
        </Button>

        <Card className="shadow border-border/40 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="bg-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-md">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">Join as Student</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your name to join the classroom session
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
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(
                    "transition-all duration-200",
                    isNameTaken && "border-destructive focus-visible:ring-destructive"
                  )}
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                
                {isNameTaken && (
                  <div className="flex items-start gap-2 text-destructive text-sm mt-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>This name is already taken. Please choose another name.</p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-2">
                  Your name will be visible to the teacher and other students
                </p>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-blue-400 hover:bg-blue-500 text-white"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? "Joining..." : "Join Session"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

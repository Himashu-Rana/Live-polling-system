import { useState } from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Plus, X, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatePollFormProps {
  onCreatePoll: (pollData: {
    question: string;
    options: string[];
    duration?: number; // hours
  }) => void;
  className?: string;
}

export function CreatePollForm({ onCreatePoll, className }: CreatePollFormProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState<number | undefined>(24);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    const validOptions = options.filter(option => option.trim());
    if (validOptions.length < 2) return;

    setIsSubmitting(true);
    
    try {
      await onCreatePoll({
        question: question.trim(),
        options: validOptions,
        duration,
      });
      
      // Reset form
      setQuestion("");
      setOptions(["", ""]);
      setDuration(24);
    } catch (error) {
      console.error("Failed to create poll:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = question.trim() && options.filter(opt => opt.trim()).length >= 2;

  return (
    <Card className={cn("w-full max-w-2xl shadow-xl border-border/40 bg-card/80 backdrop-blur-sm", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Create New Poll</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question" className="text-sm font-medium">
              Poll Question
            </Label>
            <Textarea
              id="question"
              placeholder="What would you like to ask?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={200}
            />
            <div className="text-xs text-muted-foreground text-right">
              {question.length}/200
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Options</Label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    maxLength={100}
                  />
                </div>
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {options.length < 6 && (
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="w-full mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Poll Duration (hours)
            </Label>
            <div className="flex gap-2">
              {[1, 6, 12, 24, 48, 168].map((hours) => (
                <Button
                  key={hours}
                  type="button"
                  variant={duration === hours ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDuration(hours)}
                  className="flex-1"
                >
                  {hours < 24 ? `${hours}h` : `${hours / 24}d`}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Input
                id="duration"
                type="number"
                min="1"
                max="8760"
                value={duration || ""}
                onChange={(e) => setDuration(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Custom hours"
                className="w-32"
              />
              <span className="text-sm text-muted-foreground">hours</span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-vote-option1 to-vote-option2 hover:from-vote-option2 hover:to-vote-option3 text-white border-0 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Poll"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

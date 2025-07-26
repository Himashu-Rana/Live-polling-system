import { useState } from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Progress } from "./progress";
import { Users, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  color: string;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  hasVoted: boolean;
  selectedOption?: string;
  createdAt: Date;
  endsAt?: Date;
  createdBy: string;
}

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
  className?: string;
}

export function PollCard({ poll, onVote, className }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    poll.selectedOption || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (optionId: string) => {
    if (poll.hasVoted || isSubmitting) return;
    
    setIsSubmitting(true);
    setSelectedOption(optionId);
    
    try {
      await onVote(poll.id, optionId);
    } catch (error) {
      setSelectedOption(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPercentage = (votes: number) => {
    return poll.totalVotes > 0 ? (votes / poll.totalVotes) * 100 : 0;
  };

  const isExpired = poll.endsAt && new Date() > poll.endsAt;
  const canVote = !poll.hasVoted && !isExpired;

  return (
    <Card className={cn("w-full max-w-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-border/40 bg-card/80 backdrop-blur-sm", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-semibold leading-tight">
            {poll.question}
          </CardTitle>
          {poll.hasVoted && (
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{poll.totalVotes} vote{poll.totalVotes !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>
              {isExpired ? 'Ended' : 'Active'} • by {poll.createdBy}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {poll.options.map((option, index) => {
          const percentage = getPercentage(option.votes);
          const isSelected = selectedOption === option.id;
          const showResults = poll.hasVoted || isExpired;
          
          return (
            <div key={option.id} className="space-y-2">
              <Button
                className={cn(
                  "w-full justify-start p-5 h-auto relative overflow-hidden transition-all duration-200 rounded-md border-2",
                  isSelected ? "bg-primary text-white border-primary" : "border-muted bg-card",
                  canVote && "hover:shadow-md",
                  showResults && "cursor-default"
                )}
                onClick={() => canVote && handleVote(option.id)}
                disabled={!canVote || isSubmitting}
              >
                {/* No background highlight to match Figma design */}
                
                <div className="flex items-center justify-between w-full relative z-10">
                  <span className="font-medium">{option.text}</span>
                  {showResults && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold">{Math.round(percentage)}%</span>
                      <span className="text-muted-foreground">
                        ({option.votes})
                      </span>
                    </div>
                  )}
                </div>
              </Button>
              
              {showResults && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all duration-500",
                      isSelected ? "bg-primary" : "bg-primary/70"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
        
        {isExpired && (
          <div className="text-center text-sm text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
            This poll has ended
          </div>
        )}
      </CardContent>
    </Card>
  );
}

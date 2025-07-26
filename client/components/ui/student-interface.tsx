import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { ScrollArea } from "./scroll-area";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  BarChart3,
  MessageCircle,
  ArrowLeft,
  Timer,
  Loader,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { socketService } from "@/lib/socket";
import { Input } from "./input";
import { LiveTimer } from "./live-timer";

interface Poll {
  id: string;
  question: string;
  options: string[];
  isActive: boolean;
  maxTime: number;
  createdAt: Date;
  endTime?: Date;
}

interface PollResults {
  poll: Poll;
  results: Array<{
    option: string;
    count: number;
    percentage: number;
    students: string[];
  }>;
  totalStudents: number;
  answeredCount: number;
  timeRemaining: number;
}

interface StudentInterfaceProps {
  studentName: string;
  onGoBack: () => void;
  className?: string;
}

export function StudentInterface({ studentName, onGoBack, className }: StudentInterfaceProps) {
  const [studentId, setStudentId] = useState<string>("");
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [pollResults, setPollResults] = useState<PollResults | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherOnline, setTeacherOnline] = useState(false);
  const [isKicked, setIsKicked] = useState(false);
  
  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Get or create student ID from localStorage
    let storedStudentId = localStorage.getItem('student_id');
    if (!storedStudentId) {
      storedStudentId = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('student_id', storedStudentId);
    }
    localStorage.setItem('student_name', studentName);
    setStudentId(storedStudentId);

    // Join as student
    socketService.joinAsStudent(studentName, storedStudentId);

    // Set up event listeners
    socketService.onStudentJoined((data) => {
      setCurrentPoll(data.currentPoll);
      setPollResults(data.results);
      setChatMessages(data.chatMessages || []);
      setStudentId(data.studentId);
    });

    socketService.onNewPoll((poll) => {
      setCurrentPoll(poll);
      setHasAnswered(false);
      setSelectedAnswer("");
      setPollResults(null);
    });

    socketService.onPollResultsUpdated((results) => {
      setPollResults(results);
    });

    socketService.onPollEnded((results) => {
      setPollResults(results);
      setCurrentPoll(prev => prev ? { ...prev, isActive: false } : null);
    });

    socketService.onAnswerSubmitted((data) => {
      setIsSubmitting(false);
      if (data.success) {
        setHasAnswered(true);
      } else {
        setSelectedAnswer("");
        console.error('Failed to submit answer:', data.error);
      }
    });

    socketService.onNameTaken(() => {
      alert('Name is already taken. Please choose another name.');
      onGoBack();
    });

    socketService.onKickedOut(() => {
      setIsKicked(true);
      localStorage.removeItem('student_id');
      localStorage.removeItem('student_name');
    });

    socketService.onTeacherStatus((data) => {
      setTeacherOnline(data.online);
    });

    socketService.onNewChatMessage((message) => {
      setChatMessages(prev => [...prev, message]);
    });

    socketService.onError((error) => {
      console.error('Socket error:', error);
      setIsSubmitting(false);
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, [studentName, onGoBack]);

  const handleSubmitAnswer = (answer: string) => {
    if (hasAnswered || !currentPoll?.isActive || isSubmitting) return;
    
    setIsSubmitting(true);
    setSelectedAnswer(answer);
    socketService.submitAnswer(studentId, answer);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    socketService.sendChatMessage(newMessage.trim(), studentName, false);
    setNewMessage("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // If kicked out
  if (isKicked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <XCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-bold mb-2">You've been removed</h2>
            <p className="text-muted-foreground mb-6">
              The teacher has removed you from this session.
            </p>
            <Button onClick={onGoBack} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background p-4", className)}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <div className="flex items-center gap-4">
            <Button
              className="!bg-blue-400 hover:!bg-black !text-white"
              onClick={onGoBack}
              style={{color: 'white'}}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-white">Exit</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Student View</h1>
              <p className="text-muted-foreground">Welcome, {studentName}!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={teacherOnline ? "default" : "secondary"} className="flex items-center gap-1">
              <div className={cn(
                "w-2 h-2 rounded-full",
                teacherOnline ? "bg-green-500" : "bg-gray-500"
              )} />
              Teacher {teacherOnline ? "Online" : "Offline"}
            </Badge>
            <Button
              variant={showChat ? 'default' : 'outline'}
              onClick={() => setShowChat(!showChat)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {!currentPoll ? (
            // Waiting for poll
            <Card className="text-center py-12">
              <CardContent>
                <div className="space-y-4">
                  <Loader className="h-12 w-12 mx-auto animate-spin text-muted-foreground" />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Waiting for Poll</h2>
                    <p className="text-muted-foreground">
                      The teacher hasn't started a poll yet. Please wait...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Active poll or results
            <>
              {/* Poll Question */}
              <Card className="shadow-xl border-border/40 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      {currentPoll.isActive ? "Current Poll" : "Poll Results"}
                    </CardTitle>
                    {pollResults && currentPoll.isActive && (
                      <LiveTimer
                        initialTimeRemaining={pollResults.timeRemaining}
                        size="sm"
                        className="bg-secondary/50 px-3 py-1 rounded-full"
                      />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">{currentPoll.question}</h2>

                    {pollResults && (
                      <div className="mb-4 space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {pollResults.answeredCount} of {pollResults.totalStudents} students answered
                        </p>

                        {/* Prominent timer for active polls */}
                        {currentPoll.isActive && !hasAnswered && (
                          <div className="text-center p-4 bg-muted/50 rounded-lg border">
                            <p className="text-sm text-muted-foreground mb-2">Time Remaining:</p>
                            <LiveTimer
                              initialTimeRemaining={pollResults.timeRemaining}
                              size="lg"
                              className="justify-center"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Answer Options */}
                  {currentPoll.isActive && !hasAnswered ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Choose your answer:</p>
                      {currentPoll.options.map((option, index) => (
                        <div
                          key={index}
                          className={cn(
                            "relative w-full cursor-pointer overflow-hidden border rounded-md px-3 py-6 h-auto text-left transition-all duration-200 flex items-center",
                            "hover:shadow-md",
                            selectedAnswer === option ? "bg-blue-400 text-white border-blue-500" : "border-slate-200 hover:border-blue-300",
                            isSubmitting && selectedAnswer === option && "opacity-50"
                          )}
                          onClick={() => !isSubmitting && handleSubmitAnswer(option)}
                        >
                          <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "flex items-center justify-center w-6 h-6 rounded-full font-medium text-sm",
                                selectedAnswer === option ? "bg-white text-blue-500" : "bg-blue-400 text-white"
                              )}>
                                {index + 1}
                              </div>
                              <span className="font-medium">{option}</span>
                            </div>
                            {isSubmitting && selectedAnswer === option && (
                              <Loader className="h-4 w-4 animate-spin" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : hasAnswered ? (
                    <div className="text-center py-6">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <h3 className="text-lg font-semibold mb-2">Answer Submitted!</h3>
                      <p className="text-muted-foreground">
                        You selected: <span className="font-medium">{selectedAnswer}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        View the results below as more students answer.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                      <h3 className="text-lg font-semibold mb-2">Poll Ended</h3>
                      <p className="text-muted-foreground">
                        This poll has ended. View the final results below.
                      </p>
                    </div>
                  )}

                  {/* Results */}
                  {pollResults && (hasAnswered || !currentPoll.isActive) && (
                    <div className="space-y-4">
                      <div className="border-t pt-4">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Live Results
                        </h3>
                        
                        <div className="space-y-3">
                          {pollResults.results.map((result, index) => (
                            <div key={result.option} className="space-y-2">
                              <div className={cn(
                                "relative w-full overflow-hidden border rounded-md justify-start px-3 py-6 h-auto text-left flex items-center",
                                selectedAnswer === result.option ? "bg-blue-50 border-blue-400" : "border-slate-200"
                              )}>
                                <div className="absolute inset-0 bg-blue-400" style={{ width: `${result.percentage}%`, opacity: 0.2 }} />
                                <div className="flex justify-between items-center w-full z-10 relative">
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-400 text-white font-medium text-sm">
                                      {index + 1}
                                    </div>
                                    <span className="font-medium">{result.option}</span>
                                  </div>
                                  <span className="font-bold text-sm text-blue-600">
                                    {result.percentage}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="fixed right-4 bottom-4 w-80 h-96 bg-background border rounded-lg shadow-xl">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Chat</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
              >
                ×
              </Button>
            </div>
          </div>
          
          <ScrollArea className="h-64 p-4">
            {chatMessages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No messages yet</p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{msg.from}</span>
                    {msg.isTeacher && <Badge variant="secondary" className="text-xs">Teacher</Badge>}
                  </div>
                  <p className="text-sm bg-muted p-2 rounded">{msg.message}</p>
                </div>
              ))
            )}
          </ScrollArea>
          
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
                maxLength={200}
              />
              <Button type="submit" size="sm">Send</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

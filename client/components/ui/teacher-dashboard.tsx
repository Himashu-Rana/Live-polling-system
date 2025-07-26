import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Label } from "./label";
import { Badge } from "./badge";
import { ScrollArea } from "./scroll-area";
import {
  Users,
  Plus,
  Clock,
  BarChart3,
  UserX,
  Play,
  Square,
  History,
  MessageCircle,
  ArrowLeft,
  Timer,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { socketService } from "@/lib/socket";
import { LiveTimer } from "./live-timer";

interface Student {
  id: string;
  name: string;
  hasAnswered: boolean;
  joinedAt: Date;
}

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

interface TeacherDashboardProps {
  onGoBack: () => void;
  className?: string;
}

export function TeacherDashboard({ onGoBack, className }: TeacherDashboardProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [pollResults, setPollResults] = useState<PollResults | null>(null);
  const [canCreatePoll, setCanCreatePoll] = useState(true);
  const [pollHistory, setPollHistory] = useState<Poll[]>([]);
  
  // Create Poll Form State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [maxTime, setMaxTime] = useState(60);
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);

  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // View state
  const [activeView, setActiveView] = useState<'dashboard' | 'history'>('dashboard');

  useEffect(() => {
    console.log('Teacher dashboard mounted, connecting socket...');

    // Ensure socket is connected
    const socket = socketService.connect();

    console.log('Socket connected, joining as teacher...');
    socketService.joinAsTeacher();

    // Set up event listeners
    socketService.onTeacherJoined((data) => {
      console.log('Teacher joined successfully:', data);
      setStudents(data.students || []);
      setCurrentPoll(data.currentPoll);
      setPollResults(data.results);
      setCanCreatePoll(data.canCreatePoll);
      setPollHistory(data.pollHistory || []);
      setChatMessages(data.chatMessages || []);
    });

    socketService.onStudentListUpdated((data) => {
      console.log('Student list updated:', data.students);
      setStudents(data.students);
    });

    socketService.onPollCreated((data) => {
      setCurrentPoll(data.poll);
      setCanCreatePoll(data.canCreatePoll);
      setShowCreateForm(false);
      resetCreateForm();
    });

    socketService.onPollResultsUpdated((results) => {
      setPollResults(results);
    });

    socketService.onPollEnded((results) => {
      setPollResults(results);
      setCanCreatePoll(true);
    });

    socketService.onPollStatusUpdated((data) => {
      setCanCreatePoll(data.canCreatePoll);
    });

    socketService.onPollHistory((history) => {
      setPollHistory(history);
    });

    socketService.onNewChatMessage((message) => {
      setChatMessages(prev => [...prev, message]);
    });

    socketService.onError((error) => {
      console.error('Socket error:', error);
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, []);

  const resetCreateForm = () => {
    setPollQuestion("");
    setPollOptions(["", ""]);
    setMaxTime(60);
    setIsCreatingPoll(false);
  };

  const addOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pollQuestion.trim()) return;
    
    const validOptions = pollOptions.filter(option => option.trim());
    if (validOptions.length < 2) return;

    setIsCreatingPoll(true);
    
    try {
      socketService.createPoll(pollQuestion.trim(), validOptions, maxTime);
    } catch (error) {
      console.error('Failed to create poll:', error);
    } finally {
      setIsCreatingPoll(false);
    }
  };

  const handleEndPoll = () => {
    socketService.endPoll();
  };

  const handleKickStudent = (studentId: string) => {
    if (confirm('Are you sure you want to kick this student?')) {
      socketService.kickStudent(studentId);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    socketService.sendChatMessage(newMessage.trim(), 'Teacher', true);
    setNewMessage("");
  };

  const loadPollHistory = () => {
    socketService.getPollHistory();
    setActiveView('history');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderCreatePollForm = () => (
    <Card className="shadow-xl border-border/40 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Poll
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleCreatePoll} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question" className="text-sm font-medium">
              Poll Question
            </Label>
            <Textarea
              id="question"
              placeholder="What would you like to ask your students?"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={200}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Options</Label>
            {pollOptions.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  maxLength={100}
                />
                {pollOptions.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {pollOptions.length < 6 && (
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTime" className="text-sm font-medium flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Time Limit (seconds)
            </Label>
            <div className="flex gap-2">
              {[30, 60, 120, 300].map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={maxTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMaxTime(time)}
                  className="flex-1"
                >
                  {time < 60 ? `${time}s` : `${time / 60}m`}
                </Button>
              ))}
            </div>
            <Input
              id="maxTime"
              type="number"
              min="10"
              max="1800"
              value={maxTime}
              onChange={(e) => setMaxTime(parseInt(e.target.value) || 60)}
              className="w-32"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateForm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={!pollQuestion.trim() || pollOptions.filter(o => o.trim()).length < 2 || isCreatingPoll}
            >
              {isCreatingPoll ? "Creating..." : "Create Poll"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderCurrentPoll = () => {
    if (!currentPoll) return null;

    return (
      <Card className="shadow-xl border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Current Poll
            </CardTitle>
            <div className="flex items-center gap-2">
              {pollResults && (
                <LiveTimer
                  initialTimeRemaining={pollResults.timeRemaining}
                  size="sm"
                  className="bg-secondary/50 px-3 py-1 rounded-full"
                />
              )}
              {currentPoll.isActive && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleEndPoll}
                >
                  <Square className="h-4 w-4 mr-2" />
                  End Poll
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">{currentPoll.question}</h3>
            {pollResults && (
              <p className="text-sm text-muted-foreground">
                {pollResults.answeredCount} of {pollResults.totalStudents} students answered
              </p>
            )}
          </div>

          {pollResults && (
            <div className="space-y-3">
              {pollResults.results.map((result, index) => (
                <div key={result.option} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{result.option}</span>
                    <span className="text-sm text-muted-foreground">
                      {result.percentage}% ({result.count})
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-vote-option1 to-vote-option2 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${result.percentage}%` }}
                    />
                  </div>
                  {result.students.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {result.students.map((studentName, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {studentName}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderStudentList = () => (
    <Card className="shadow-xl border-border/40 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Students ({students.length})
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-64">
          {students.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No students joined yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-background/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      student.hasAnswered ? "bg-green-500" : "bg-yellow-500"
                    )} />
                    <span className="font-medium">{student.name}</span>
                    {student.hasAnswered && currentPoll?.isActive && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleKickStudent(student.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <div className={cn("min-h-screen bg-background p-4", className)}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={onGoBack}
              className="!bg-blue-400 hover:!bg-blue-500 !text-white"
              style={{color: 'white'}}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-white">Exit</span>
            </Button>
            <h1 className="text-2xl font-bold text-primary">Teacher Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={activeView === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveView('dashboard')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeView === 'history' ? 'default' : 'outline'}
              onClick={loadPollHistory}
            >
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button
              variant={showChat ? 'default' : 'outline'}
              onClick={() => setShowChat(!showChat)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>

        {activeView === 'dashboard' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Poll Button */}
              {!showCreateForm && canCreatePoll && (
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full h-14 text-base bg-primary hover:bg-primary/90 font-medium"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Poll
                </Button>
              )}

              {!canCreatePoll && !showCreateForm && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-600">
                    <AlertCircle className="h-5 w-5" />
                    <span>Cannot create new poll while current poll is active</span>
                  </div>
                </div>
              )}

              {/* Create Poll Form */}
              {showCreateForm && renderCreatePollForm()}

              {/* Current Poll */}
              {currentPoll && renderCurrentPoll()}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {renderStudentList()}
            </div>
          </div>
        )}

        {activeView === 'history' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Poll History</h2>
            {pollHistory.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No polls created yet</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pollHistory.map((poll) => (
                  <Card key={poll.id} className="shadow-md">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{poll.question}</h3>
                          <p className="text-sm text-muted-foreground">
                            Created: {new Date(poll.createdAt).toLocaleString()}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {poll.options.map((option, idx) => (
                              <Badge key={idx} variant="outline">{option}</Badge>
                            ))}
                          </div>
                        </div>
                        <Badge variant={poll.isActive ? 'default' : 'secondary'}>
                          {poll.isActive ? 'Active' : 'Completed'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
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
            {chatMessages.map((msg) => (
              <div key={msg.id} className="mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{msg.from}</span>
                  {msg.isTeacher && <Badge variant="secondary" className="text-xs">Teacher</Badge>}
                </div>
                <p className="text-sm">{msg.message}</p>
              </div>
            ))}
          </ScrollArea>
          
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" size="sm">Send</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

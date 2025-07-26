import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { PollCard, Poll } from "@/components/ui/poll-card";
import { CreatePollForm } from "@/components/ui/create-poll-form";
import { PollStats } from "@/components/ui/poll-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Sparkles, Clock, TrendingUp, BarChart3, Users } from "lucide-react";

export default function Index() {
  const [activeView, setActiveView] = useState<"polls" | "create" | "stats">("polls");
  const [polls, setPolls] = useState<Poll[]>([]);

  // Initialize with sample polls
  useEffect(() => {
    const samplePolls: Poll[] = [
      {
        id: "1",
        question: "What's your favorite programming language for web development?",
        options: [
          { id: "1a", text: "JavaScript/TypeScript", votes: 45, color: "hsl(217.2 91.2% 59.8%)" },
          { id: "1b", text: "Python", votes: 32, color: "hsl(262.1 83.3% 57.8%)" },
          { id: "1c", text: "Go", votes: 18, color: "hsl(346.8 77.2% 49.8%)" },
          { id: "1d", text: "Rust", votes: 25, color: "hsl(32.1 94.6% 43.7%)" },
        ],
        totalVotes: 120,
        hasVoted: true,
        selectedOption: "1a",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdBy: "Alex Chen",
      },
      {
        id: "2",
        question: "Which design system do you prefer for React applications?",
        options: [
          { id: "2a", text: "Tailwind CSS + Radix UI", votes: 67, color: "hsl(217.2 91.2% 59.8%)" },
          { id: "2b", text: "Material-UI (MUI)", votes: 43, color: "hsl(262.1 83.3% 57.8%)" },
          { id: "2c", text: "Ant Design", votes: 29, color: "hsl(346.8 77.2% 49.8%)" },
          { id: "2d", text: "Chakra UI", votes: 21, color: "hsl(32.1 94.6% 43.7%)" },
        ],
        totalVotes: 160,
        hasVoted: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        endsAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        createdBy: "Sarah Kim",
      },
      {
        id: "3",
        question: "What's the most important factor when choosing a new tech stack?",
        options: [
          { id: "3a", text: "Performance", votes: 38, color: "hsl(217.2 91.2% 59.8%)" },
          { id: "3b", text: "Developer Experience", votes: 52, color: "hsl(262.1 83.3% 57.8%)" },
          { id: "3c", text: "Community Support", votes: 31, color: "hsl(346.8 77.2% 49.8%)" },
          { id: "3d", text: "Documentation Quality", votes: 24, color: "hsl(32.1 94.6% 43.7%)" },
        ],
        totalVotes: 145,
        hasVoted: false,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdBy: "Mike Johnson",
      }
    ];
    setPolls(samplePolls);
  }, []);

  const handleCreatePoll = async (pollData: {
    question: string;
    options: string[];
    duration?: number;
  }) => {
    const newPoll: Poll = {
      id: Date.now().toString(),
      question: pollData.question,
      options: pollData.options.map((text, index) => ({
        id: `${Date.now()}_${index}`,
        text,
        votes: 0,
        color: [
          "hsl(217.2 91.2% 59.8%)",
          "hsl(262.1 83.3% 57.8%)",
          "hsl(346.8 77.2% 49.8%)",
          "hsl(32.1 94.6% 43.7%)",
          "hsl(142.1 76.2% 36.3%)",
          "hsl(47.9 95.8% 53.1%)",
        ][index % 6],
      })),
      totalVotes: 0,
      hasVoted: false,
      createdAt: new Date(),
      endsAt: pollData.duration ? new Date(Date.now() + pollData.duration * 60 * 60 * 1000) : undefined,
      createdBy: "You",
    };

    setPolls([newPoll, ...polls]);
    setActiveView("polls");
  };

  const handleVote = async (pollId: string, optionId: string) => {
    setPolls(currentPolls =>
      currentPolls.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            hasVoted: true,
            selectedOption: optionId,
            totalVotes: poll.totalVotes + 1,
            options: poll.options.map(option => ({
              ...option,
              votes: option.id === optionId ? option.votes + 1 : option.votes,
            })),
          };
        }
        return poll;
      })
    );
  };

  const activePolls = polls.filter(poll => !poll.endsAt || new Date() < poll.endsAt).length;
  const totalVotes = polls.reduce((sum, poll) => sum + poll.totalVotes, 0);
  const averageParticipation = polls.length > 0 ? (totalVotes / polls.length / 100) * 100 : 0;

  const renderHeroSection = () => (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="placeholder.svg"
          alt="Poll system design"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-background/90" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-vote-option1 via-vote-option2 to-vote-option3 bg-clip-text text-transparent">
              Create Powerful Polls
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Gather insights, make decisions, and engage your community with our intuitive polling platform. 
            Real-time results, beautiful visualizations, and seamless user experience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-vote-option1 to-vote-option2 hover:from-vote-option2 hover:to-vote-option3 text-white border-0 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setActiveView("create")}
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Poll
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-6 text-lg font-semibold hover:bg-vote-option1/10 border-vote-option1/20"
              onClick={() => setActiveView("stats")}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              View Dashboard
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-background/60 backdrop-blur border-vote-option1/20">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-br from-vote-option1/20 to-vote-option2/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-vote-option1" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{polls.length}</h3>
                <p className="text-muted-foreground">Active Polls</p>
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur border-vote-option2/20">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-br from-vote-option2/20 to-vote-option3/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-vote-option2" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{totalVotes}</h3>
                <p className="text-muted-foreground">Total Votes</p>
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur border-vote-option3/20">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-br from-vote-option3/20 to-vote-option4/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-vote-option3" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{averageParticipation.toFixed(1)}%</h3>
                <p className="text-muted-foreground">Engagement</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );

  const renderPollsView = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      {renderHeroSection()}

      {/* Polls Section */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {polls.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-vote-option1/20 to-vote-option2/20 rounded-full p-8 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-vote-option1" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No polls yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first poll to start gathering opinions and insights from your community.
            </p>
            <Button onClick={() => setActiveView("create")} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Poll
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Recent Polls</h2>
                <p className="text-muted-foreground">
                  {polls.length} poll{polls.length !== 1 ? 's' : ''} • {activePolls} active
                </p>
              </div>
              <Button 
                onClick={() => setActiveView("create")}
                className="bg-gradient-to-r from-vote-option1 to-vote-option2 hover:from-vote-option2 hover:to-vote-option3"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Poll
              </Button>
            </div>

            <div className="grid gap-6">
              {polls.map((poll) => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  onVote={handleVote}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderCreateView = () => (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Create New Poll</h2>
          <p className="text-muted-foreground">
            Gather opinions and insights from your community
          </p>
        </div>
        <div className="flex justify-center">
          <CreatePollForm onCreatePoll={handleCreatePoll} />
        </div>
      </div>
    </div>
  );

  const renderStatsView = () => (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Analytics and insights for your polls
          </p>
        </div>
        
        <PollStats
          totalPolls={polls.length}
          totalVotes={totalVotes}
          activePolls={activePolls}
          averageParticipation={averageParticipation}
        />

        {polls.length > 0 && (
          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            {polls.slice(0, 3).map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                onVote={handleVote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onCreatePoll={() => setActiveView("create")}
        onShowStats={() => setActiveView("stats")}
        activeView={activeView}
      />
      
      <main className="flex-1">
        {activeView === "polls" && renderPollsView()}
        {activeView === "create" && renderCreateView()}
        {activeView === "stats" && renderStatsView()}
      </main>
      
      <Footer />
    </div>
  );
}

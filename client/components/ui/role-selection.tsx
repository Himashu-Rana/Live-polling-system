import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { GraduationCap, Users, BookOpen, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSelectionProps {
  onSelectRole: (role: 'teacher' | 'student') => void;
  className?: string;
}

export function RoleSelection({ onSelectRole, className }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | null>(null);

  const handleRoleSelect = (role: 'teacher' | 'student') => {
    setSelectedRole(role);
    setTimeout(() => {
      onSelectRole(role);
    }, 300);
  };

  return (
    <div className={cn("min-h-screen bg-background flex items-center justify-center p-4", className)}>
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-primary p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-md">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-primary">
              Live Polling System
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time interactive polling for classrooms and presentations. Choose your role to get started.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Teacher Card */}
          <Card 
            className={cn(
              "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg border",
              selectedRole === 'teacher' 
                ? "border-primary bg-primary/5 shadow-md" 
                : "border-border hover:border-primary/50"
            )}
            onClick={() => handleRoleSelect('teacher')}
          >
            <div className="absolute inset-0 bg-vote-hover opacity-0 hover:opacity-100 transition-opacity duration-300" />
            
            <CardHeader className="relative z-10 text-center pb-4">
              <div className="bg-primary p-6 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-md">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold mb-2">Teacher</CardTitle>
              <p className="text-muted-foreground">
                Create and manage live polls for your students
              </p>
            </CardHeader>

            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="bg-vote-option1/20 p-2 rounded-lg">
                    <UserCheck className="h-4 w-4 text-vote-option1" />
                  </div>
                  <span>Create new polls with custom questions</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <div className="bg-vote-option2/20 p-2 rounded-lg">
                    <Users className="h-4 w-4 text-vote-option2" />
                  </div>
                  <span>Manage students and view live results</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <div className="bg-vote-option3/20 p-2 rounded-lg">
                    <BookOpen className="h-4 w-4 text-vote-option3" />
                  </div>
                  <span>Configure poll timing and settings</span>
                </div>
              </div>

              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-white border-0 py-5 text-base font-medium shadow-md hover:shadow-lg transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelect('teacher');
                }}
              >
                Continue as Teacher
              </Button>
            </CardContent>
          </Card>

          {/* Student Card */}
          <Card 
            className={cn(
              "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg border",
              selectedRole === 'student' 
                ? "border-primary bg-primary/5 shadow-md" 
                : "border-border hover:border-primary/50"
            )}
            onClick={() => handleRoleSelect('student')}
          >
            <div className="absolute inset-0 bg-vote-hover opacity-0 hover:opacity-100 transition-opacity duration-300" />
            
            <CardHeader className="relative z-10 text-center pb-4">
              <div className="bg-primary p-6 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-md">
                <Users className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold mb-2">Student</CardTitle>
              <p className="text-muted-foreground">
                Join live polls and see real-time results
              </p>
            </CardHeader>

            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="bg-vote-option2/20 p-2 rounded-lg">
                    <UserCheck className="h-4 w-4 text-vote-option2" />
                  </div>
                  <span>Enter your name to join the session</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <div className="bg-vote-option3/20 p-2 rounded-lg">
                    <Users className="h-4 w-4 text-vote-option3" />
                  </div>
                  <span>Answer questions in real-time</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <div className="bg-vote-option1/20 p-2 rounded-lg">
                    <BookOpen className="h-4 w-4 text-vote-option1" />
                  </div>
                  <span>View live results and participate</span>
                </div>
              </div>

              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-white border-0 py-5 text-base font-medium shadow-md hover:shadow-lg transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelect('student');
                }}
              >
                Continue as Student
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Choose your role to start participating in live polls</p>
        </div>
      </div>
    </div>
  );
}

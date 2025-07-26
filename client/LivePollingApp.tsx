import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleSelection } from "./components/ui/role-selection";
import { StudentNameEntry } from "./components/ui/student-name-entry";
import { TeacherDashboard } from "./components/ui/teacher-dashboard";
import { StudentInterface } from "./components/ui/student-interface";
import { socketService } from "./lib/socket";

type AppState = 'role-selection' | 'student-name-entry' | 'teacher-dashboard' | 'student-interface';

export default function LivePollingApp() {
  const [appState, setAppState] = useState<AppState>('role-selection');
  const [studentName, setStudentName] = useState('');
  const [isNameTaken, setIsNameTaken] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    console.log('LivePollingApp component mounted');

    // For debugging: clear localStorage if there are connection issues
    // Remove this in production if auto-reconnect is desired
    const clearStorageOnStart = false; // Set to true for debugging
    if (clearStorageOnStart) {
      localStorage.removeItem('student_name');
      localStorage.removeItem('student_id');
      console.log('Cleared localStorage for debugging');
    }

    // Check if user was previously a student
    const existingStudentName = localStorage.getItem('student_name');
    const existingStudentId = localStorage.getItem('student_id');

    if (existingStudentName && existingStudentId) {
      console.log('Found existing student session:', existingStudentName);
      setStudentName(existingStudentName);
      setAppState('student-interface');
    }

    return () => {
      // Cleanup socket connection when app unmounts
      socketService.disconnect();
    };
  }, []);

  const handleRoleSelect = (role: 'teacher' | 'student') => {
    console.log('Role selected:', role);
    if (role === 'teacher') {
      setAppState('teacher-dashboard');
    } else {
      setAppState('student-name-entry');
    }
  };

  const handleStudentNameSubmit = (name: string) => {
    // Prevent multiple simultaneous join attempts
    if (isJoining) {
      console.log('Join already in progress, ignoring duplicate request');
      return;
    }

    console.log('Student name submitted:', name);
    setIsJoining(true);
    setStudentName(name);
    setIsNameTaken(false);

    // Clear any existing student data to avoid conflicts
    localStorage.removeItem('student_id');
    localStorage.removeItem('student_name');

    // Connect socket (don't disconnect/reconnect as that might cause issues)
    const socket = socketService.connect();

    // Clear any existing listeners to avoid duplicates
    socket.off('name_taken');
    socket.off('student_joined');
    socket.off('error');

    // Listen for name taken event
    socket.on('name_taken', () => {
      console.log('Name taken event received');
      setIsNameTaken(true);
      setIsJoining(false);
    });

    // Listen for successful join
    socket.on('student_joined', (data) => {
      console.log('Student joined successfully:', data);
      // Store the new student data
      localStorage.setItem('student_id', data.studentId);
      localStorage.setItem('student_name', name);
      setAppState('student-interface');
      setIsNameTaken(false);
      setIsJoining(false);
    });

    // Listen for connection errors
    socket.on('error', (error) => {
      console.error('Socket error during join:', error);
      alert('Connection error: ' + error);
      setIsJoining(false);
    });

    // Join as student with ONLY the name, no studentId
    console.log('Attempting to join as new student with name:', name);
    socketService.joinAsStudent(name); // No second parameter
  };

  const handleGoBackToRoleSelection = () => {
    console.log('Going back to role selection');
    // Clear student data and disconnect
    localStorage.removeItem('student_name');
    localStorage.removeItem('student_id');
    socketService.disconnect();
    setAppState('role-selection');
    setStudentName('');
    setIsNameTaken(false);
  };

  const renderCurrentView = () => {
    try {
      switch (appState) {
        case 'role-selection':
          return <RoleSelection onSelectRole={handleRoleSelect} />;
        
        case 'student-name-entry':
          return (
            <StudentNameEntry
              onNameSubmit={handleStudentNameSubmit}
              onGoBack={handleGoBackToRoleSelection}
              isNameTaken={isNameTaken}
            />
          );
        
        case 'teacher-dashboard':
          return <TeacherDashboard onGoBack={handleGoBackToRoleSelection} />;
        
        case 'student-interface':
          return (
            <StudentInterface
              studentName={studentName}
              onGoBack={handleGoBackToRoleSelection}
            />
          );
        
        default:
          return <RoleSelection onSelectRole={handleRoleSelect} />;
      }
    } catch (error) {
      console.error('App rendering error:', error);
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">Please refresh the page to try again.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={renderCurrentView()} />
      </Routes>
    </BrowserRouter>
  );
}

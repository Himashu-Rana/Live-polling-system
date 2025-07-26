import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export interface Student {
  id: string;
  name: string;
  socketId: string;
  hasAnswered: boolean;
  answer?: string;
  joinedAt: Date;
}

export interface Poll {
  id: string;
  question: string;
  options: string[];
  createdAt: Date;
  endTime?: Date;
  maxTime: number; // in seconds
  isActive: boolean;
  results: { [option: string]: string[] }; // option -> student IDs
  totalResponses: number;
}

export interface ChatMessage {
  id: string;
  from: string;
  message: string;
  timestamp: Date;
  isTeacher: boolean;
}

class PollManager {
  private students: Map<string, Student> = new Map();
  private currentPoll: Poll | null = null;
  private pollHistory: Poll[] = [];
  private chatMessages: ChatMessage[] = [];
  private teacherSocketId: string | null = null;
  private messageCounter: number = 0;

  setTeacher(socketId: string) {
    this.teacherSocketId = socketId;
  }

  removeTeacher() {
    this.teacherSocketId = null;
  }

  getTeacher() {
    return this.teacherSocketId;
  }

  addStudent(student: Student) {
    this.students.set(student.id, student);
    
    // If there's an active poll and student hasn't answered, mark as not answered
    if (this.currentPoll && this.currentPoll.isActive) {
      this.students.get(student.id)!.hasAnswered = false;
    }
  }

  removeStudent(studentId: string) {
    this.students.delete(studentId);
  }

  getStudent(studentId: string) {
    return this.students.get(studentId);
  }

  getStudents() {
    return Array.from(this.students.values());
  }

  isStudentNameTaken(name: string, excludeId?: string) {
    return Array.from(this.students.values()).some(
      student => student.name.toLowerCase() === name.toLowerCase() && student.id !== excludeId
    );
  }

  createPoll(question: string, options: string[], maxTime: number = 60): Poll {
    // End current poll if exists
    if (this.currentPoll) {
      this.endCurrentPoll();
    }

    const poll: Poll = {
      id: Date.now().toString(),
      question,
      options,
      createdAt: new Date(),
      maxTime,
      isActive: true,
      results: {},
      totalResponses: 0,
    };

    // Initialize results
    options.forEach(option => {
      poll.results[option] = [];
    });

    // Set end time
    poll.endTime = new Date(Date.now() + maxTime * 1000);

    this.currentPoll = poll;

    // Reset all students' answer status
    this.students.forEach(student => {
      student.hasAnswered = false;
      student.answer = undefined;
    });

    return poll;
  }

  submitAnswer(studentId: string, answer: string): boolean {
    if (!this.currentPoll || !this.currentPoll.isActive) {
      return false;
    }

    const student = this.students.get(studentId);
    if (!student || student.hasAnswered) {
      return false;
    }

    // Check if poll has expired
    if (this.currentPoll.endTime && new Date() > this.currentPoll.endTime) {
      this.endCurrentPoll();
      return false;
    }

    // Check if answer is valid
    if (!this.currentPoll.options.includes(answer)) {
      return false;
    }

    // Record the answer
    student.hasAnswered = true;
    student.answer = answer;
    this.currentPoll.results[answer].push(studentId);
    this.currentPoll.totalResponses++;

    // NOTE: Poll should only end when timer expires, not when all students answer
    // This allows late-joining students to still participate

    return true;
  }

  getCurrentPoll() {
    return this.currentPoll;
  }

  endCurrentPoll() {
    if (this.currentPoll) {
      this.currentPoll.isActive = false;
      this.pollHistory.push({ ...this.currentPoll });
    }
  }

  canCreateNewPoll(): boolean {
    if (!this.currentPoll) return true;
    
    // Can create if no active poll or all students have answered
    return !this.currentPoll.isActive || 
           this.currentPoll.totalResponses >= this.students.size;
  }

  getPollHistory() {
    return this.pollHistory;
  }

  addChatMessage(from: string, message: string, isTeacher: boolean = false) {
    this.messageCounter++;
    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}_${this.messageCounter}`,
      from,
      message,
      timestamp: new Date(),
      isTeacher,
    };
    
    this.chatMessages.push(chatMessage);
    
    // Keep only last 100 messages
    if (this.chatMessages.length > 100) {
      this.chatMessages = this.chatMessages.slice(-100);
    }
    
    return chatMessage;
  }

  getChatMessages() {
    return this.chatMessages;
  }

  getRealTimeResults() {
    if (!this.currentPoll) return null;

    const results = Object.keys(this.currentPoll.results).map(option => ({
      option,
      count: this.currentPoll!.results[option].length,
      percentage: this.currentPoll!.totalResponses > 0 
        ? Math.round((this.currentPoll!.results[option].length / this.currentPoll!.totalResponses) * 100)
        : 0,
      students: this.currentPoll!.results[option].map(studentId => 
        this.students.get(studentId)?.name || 'Unknown'
      ),
    }));

    return {
      poll: this.currentPoll,
      results,
      totalStudents: this.students.size,
      answeredCount: this.currentPoll.totalResponses,
      timeRemaining: this.currentPoll.endTime 
        ? Math.max(0, Math.floor((this.currentPoll.endTime.getTime() - Date.now()) / 1000))
        : 0,
    };
  }
}

export function setupSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const pollManager = new PollManager();

  // Timer to check for poll expiration
  setInterval(() => {
    const currentPoll = pollManager.getCurrentPoll();
    if (currentPoll && currentPoll.isActive && currentPoll.endTime) {
      if (new Date() > currentPoll.endTime) {
        pollManager.endCurrentPoll();
        io.emit('poll_ended', pollManager.getRealTimeResults());
      }
    }
  }, 1000);

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Teacher joins
    socket.on('join_as_teacher', () => {
      console.log('Teacher joining:', socket.id);
      pollManager.setTeacher(socket.id);
      socket.join('teachers');

      const teacherData = {
        students: pollManager.getStudents(),
        currentPoll: pollManager.getCurrentPoll(),
        results: pollManager.getRealTimeResults(),
        canCreatePoll: pollManager.canCreateNewPoll(),
        pollHistory: pollManager.getPollHistory(),
        chatMessages: pollManager.getChatMessages(),
      };

      console.log('Sending teacher_joined event with students:', teacherData.students);
      socket.emit('teacher_joined', teacherData);

      socket.broadcast.emit('teacher_status', { online: true });
    });

    // Student joins
    socket.on('join_as_student', (data: { name: string, studentId?: string }) => {
      const { name, studentId } = data;

      console.log('Student attempting to join:', { name, studentId, socketId: socket.id });
      console.log('Current students:', pollManager.getStudents().map(s => ({ id: s.id, name: s.name, socketId: s.socketId })));

      // Always use socket.id as the student ID for simplicity and avoid conflicts
      const newStudentId = socket.id;

      // Check if name is taken by other students (excluding this socket)
      if (pollManager.isStudentNameTaken(name, newStudentId)) {
        console.log('Name is taken by another student');
        socket.emit('name_taken');
        return;
      }

      // Remove any existing student with this socket ID first
      const existingStudent = pollManager.getStudents().find(s => s.socketId === socket.id);
      if (existingStudent) {
        console.log('Removing existing student with same socket:', existingStudent);
        pollManager.removeStudent(existingStudent.id);
      }

      const student: Student = {
        id: newStudentId,
        name,
        socketId: socket.id,
        hasAnswered: false,
        joinedAt: new Date(),
      };

      pollManager.addStudent(student);
      socket.join('students');

      console.log('Student successfully added:', student);
      console.log('Updated students list:', pollManager.getStudents().map(s => ({ id: s.id, name: s.name })));

      socket.emit('student_joined', {
        studentId: newStudentId,
        currentPoll: pollManager.getCurrentPoll(),
        results: pollManager.getRealTimeResults(),
        chatMessages: pollManager.getChatMessages(),
      });

      // Notify teacher of new student
      console.log('Notifying teachers of new student');
      socket.to('teachers').emit('student_list_updated', {
        students: pollManager.getStudents(),
      });
    });

    // Teacher creates poll
    socket.on('create_poll', (data: { question: string, options: string[], maxTime?: number }) => {
      if (pollManager.getTeacher() !== socket.id) {
        socket.emit('error', 'Only teacher can create polls');
        return;
      }

      if (!pollManager.canCreateNewPoll()) {
        socket.emit('error', 'Cannot create poll while current poll is active');
        return;
      }

      const poll = pollManager.createPoll(data.question, data.options, data.maxTime || 60);
      
      // Notify everyone about new poll
      io.emit('new_poll', poll);
      
      // Update teacher with current status
      socket.emit('poll_created', {
        poll,
        canCreatePoll: pollManager.canCreateNewPoll(),
      });
    });

    // Student submits answer
    socket.on('submit_answer', (data: { studentId: string, answer: string }) => {
      const success = pollManager.submitAnswer(data.studentId, data.answer);
      
      if (success) {
        const results = pollManager.getRealTimeResults();
        
        // Send results to everyone
        io.emit('poll_results_updated', results);
        
        socket.emit('answer_submitted', { success: true });
      } else {
        socket.emit('answer_submitted', { success: false, error: 'Could not submit answer' });
      }
    });

    // Teacher ends poll manually
    socket.on('end_poll', () => {
      if (pollManager.getTeacher() !== socket.id) {
        socket.emit('error', 'Only teacher can end polls');
        return;
      }

      pollManager.endCurrentPoll();
      io.emit('poll_ended', pollManager.getRealTimeResults());
      
      socket.emit('poll_status_updated', {
        canCreatePoll: pollManager.canCreateNewPoll(),
      });
    });

    // Teacher kicks student
    socket.on('kick_student', (data: { studentId: string }) => {
      if (pollManager.getTeacher() !== socket.id) {
        socket.emit('error', 'Only teacher can kick students');
        return;
      }

      const student = pollManager.getStudent(data.studentId);
      if (student) {
        pollManager.removeStudent(data.studentId);
        
        // Notify kicked student
        io.to(student.socketId).emit('kicked_out');
        
        // Update teacher's student list
        socket.emit('student_list_updated', {
          students: pollManager.getStudents(),
        });
      }
    });

    // Chat message
    socket.on('send_chat_message', (data: { message: string, from: string, isTeacher?: boolean }) => {
      const chatMessage = pollManager.addChatMessage(data.from, data.message, data.isTeacher || false);
      io.emit('new_chat_message', chatMessage);
    });

    // Get poll history (teacher only)
    socket.on('get_poll_history', () => {
      if (pollManager.getTeacher() !== socket.id) {
        socket.emit('error', 'Only teacher can view poll history');
        return;
      }

      socket.emit('poll_history', pollManager.getPollHistory());
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Check if teacher disconnected
      if (pollManager.getTeacher() === socket.id) {
        pollManager.removeTeacher();
        socket.broadcast.emit('teacher_status', { online: false });
      }

      // Check if student disconnected
      const students = pollManager.getStudents();
      const disconnectedStudent = students.find(s => s.socketId === socket.id);
      
      if (disconnectedStudent) {
        pollManager.removeStudent(disconnectedStudent.id);
        socket.to('teachers').emit('student_list_updated', {
          students: pollManager.getStudents(),
        });
      }
    });
  });

  return io;
}

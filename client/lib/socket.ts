import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private url: string;

  constructor() {
    // In this hosted environment, we should use the same origin
    // The Vite proxy will handle routing to the correct backend
    this.url = window.location.origin;
  }

  connect() {
    if (!this.socket) {
      console.log('Connecting to Socket.io server at:', this.url);
      this.socket = io(this.url, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
      });

      this.socket.on('connect', () => {
        console.log('Socket.io connected successfully');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket.io connection error:', error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket.io disconnected:', reason);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }

  // Teacher methods
  joinAsTeacher() {
    this.getSocket().emit('join_as_teacher');
  }

  createPoll(question: string, options: string[], maxTime: number = 60) {
    this.getSocket().emit('create_poll', { question, options, maxTime });
  }

  endPoll() {
    this.getSocket().emit('end_poll');
  }

  kickStudent(studentId: string) {
    this.getSocket().emit('kick_student', { studentId });
  }

  getPollHistory() {
    this.getSocket().emit('get_poll_history');
  }

  // Student methods
  joinAsStudent(name: string, studentId?: string) {
    // Only send studentId if explicitly provided, otherwise let server handle it
    const payload = studentId ? { name, studentId } : { name };
    this.getSocket().emit('join_as_student', payload);
  }

  submitAnswer(studentId: string, answer: string) {
    this.getSocket().emit('submit_answer', { studentId, answer });
  }

  // Chat methods
  sendChatMessage(message: string, from: string, isTeacher: boolean = false) {
    this.getSocket().emit('send_chat_message', { message, from, isTeacher });
  }

  // Event listeners
  onTeacherJoined(callback: (data: any) => void) {
    this.getSocket().on('teacher_joined', callback);
  }

  onStudentJoined(callback: (data: any) => void) {
    this.getSocket().on('student_joined', callback);
  }

  onNewPoll(callback: (poll: any) => void) {
    this.getSocket().on('new_poll', callback);
  }

  onPollResultsUpdated(callback: (results: any) => void) {
    this.getSocket().on('poll_results_updated', callback);
  }

  onPollEnded(callback: (results: any) => void) {
    this.getSocket().on('poll_ended', callback);
  }

  onStudentListUpdated(callback: (data: any) => void) {
    this.getSocket().on('student_list_updated', callback);
  }

  onAnswerSubmitted(callback: (data: any) => void) {
    this.getSocket().on('answer_submitted', callback);
  }

  onNameTaken(callback: () => void) {
    this.getSocket().on('name_taken', callback);
  }

  onKickedOut(callback: () => void) {
    this.getSocket().on('kicked_out', callback);
  }

  onTeacherStatus(callback: (data: any) => void) {
    this.getSocket().on('teacher_status', callback);
  }

  onNewChatMessage(callback: (message: any) => void) {
    this.getSocket().on('new_chat_message', callback);
  }

  onPollCreated(callback: (data: any) => void) {
    this.getSocket().on('poll_created', callback);
  }

  onPollStatusUpdated(callback: (data: any) => void) {
    this.getSocket().on('poll_status_updated', callback);
  }

  onPollHistory(callback: (history: any) => void) {
    this.getSocket().on('poll_history', callback);
  }

  onError(callback: (error: string) => void) {
    this.getSocket().on('error', callback);
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export const socketService = new SocketService();

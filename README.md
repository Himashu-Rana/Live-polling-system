# 🗳️ Live Polling System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8+-red.svg)](https://socket.io/)

A real-time interactive polling system with teacher and student interfaces, built with React and Socket.io. Perfect for classrooms, meetings, and interactive presentations.

## ✨ Features

### 👨‍🏫 Teacher Interface
- ✅ Create new polls with customizable questions and options
- ⏱️ Set time limits for polls (30s, 60s, 120s, 300s)
- 📊 View live polling results in real-time
- 🚫 Kick students from the session
- 💬 Chat with students
- 📈 View history of past polls and results

### 👨‍🎓 Student Interface
- 🔐 Join sessions with unique names
- 📝 Answer polls within the time limit
- 📊 View live results after answering
- 💬 Chat with the teacher and other students
- 💾 Session persistence across page refreshes

## 🛠️ Tech Stack

### Frontend
- **React** - Modern UI framework
- **TailwindCSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **TypeScript** - Type-safe development

### Backend
- **Express.js** - Web application framework
- **Socket.io** - WebSocket implementation
- **Node.js** - JavaScript runtime

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)

### 💻 Installation

1. **Clone the repository**
```bash
git clone https://github.com/Himashu-Rana/Live-polling-system.git
cd Live-polling-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

5. **Start the production server**
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🚀 Deployment

This project is set up for deployment on Netlify with server-side functionality via Netlify Functions.

### Deploying to Netlify
1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/spa`
3. Deploy

## 🏗️ Architecture

The application uses a client-server architecture with WebSockets:
- **Frontend** React components communicate with the backend via Socket.io
- **Backend** manages poll state, student sessions, and results
- **Real-time updates** ensure all users see the latest data instantly

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Himanshu Rana** - [GitHub](https://github.com/Himashu-Rana)

---

⭐ If you found this project helpful, please give it a star!

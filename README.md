# Live Polling System

A real-time interactive polling system with teacher and student interfaces, built with React and Socket.io.

## Features

### Teacher Interface
- Create new polls with customizable questions and options
- Set time limits for polls (30s, 60s, 120s, 300s)
- View live polling results in real-time
- Kick students from the session
- Chat with students
- View history of past polls and results

### Student Interface
- Join sessions with unique names
- Answer polls within the time limit
- View live results after answering
- Chat with the teacher and other students
- Session persistence across page refreshes

## Tech Stack

### Frontend
- React
- TailwindCSS
- Socket.io Client

### Backend
- Express.js
- Socket.io
- Node.js

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/live-polling-system.git
cd live-polling-system
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

5. Start the production server
```bash
npm start
```

## Deployment

This project is set up for deployment on Netlify with server-side functionality via Netlify Functions.

### Deploying to Netlify
1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/spa`
3. Deploy

## Architecture

The application uses a client-server architecture with WebSockets:
- Frontend React components communicate with the backend via Socket.io
- Backend manages poll state, student sessions, and results
- Real-time updates ensure all users see the latest data

## License

This project is licensed under the MIT License - see the LICENSE file for details.

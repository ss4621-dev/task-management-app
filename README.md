# Task Management System 🚀

A feature-rich Task Management System designed for small teams to efficiently create, assign, track, and manage tasks. Built with modern web technologies and scalable architecture.

![Tech Stack](https://img.shields.io/badge/Next.js-14.2.3-blue)
![NestJS](https://img.shields.io/badge/NestJS-10.0.0-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.0-blue)

## Features ✨

### Core Features
- **Secure User Authentication**  
  JWT-based registration/login with bcrypt password hashing.
- **Task Management**  
  Full CRUD operations for tasks with title, description, due date, priority, and status.
- **Team Collaboration**  
  Assign tasks to team members with email/in-app notifications.
- **Interactive Dashboard**  
  View assigned tasks, created tasks, overdue tasks, and priority insights.
- **Search & Filter**  
  Search by title/description; filter by status, priority, or due date.

### Advanced Features (Optional)
- 🔐 Role-Based Access Control (Admin/Manager/User)
- 🔔 Real-Time Notifications via WebSocket
- ♻️ Recurring Tasks (daily/weekly/monthly)
- 📜 Audit Logging & Action Tracking
- 📊 Analytics Dashboard with Completion Metrics
- ⚡ Progressive Web App (Offline Support)

## Technical Stack 💻

| Component       | Technology               |
|-----------------|--------------------------|
| **Frontend**    | Next.js 14 (TypeScript)  |
| **Backend**     | NestJS 10 (Node.js 20)   |
| **Database**    | PostgreSQL 16            |
| **Auth**        | JWT & bcrypt             |
| **Real-Time**   | Socket.io (Optional)     |

## Installation 🛠️

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/task-management-system.git
   cd task-management-system
2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure PostgreSQL credentials in .env
   npm run start:dev
Frontend Setup

bash

cd frontend
npm install
cp .env.example .env.local
# Set API base URL in .env.local
npm run dev
Configuration ⚙️
Backend Environment (.env)


DATABASE_URL="postgresql://user:password@localhost:5432/taskdb"
JWT_SECRET="your_jwt_secret"
PORT=3001
Frontend Environment (.env.local)


NEXT_PUBLIC_API_URL="http://localhost:3001/api"
API Endpoints 📡
Method	Endpoint	Description
POST	/api/auth/register	User registration
POST	/api/auth/login	User login
GET	/api/tasks	List all tasks (with filters)
POST	/api/tasks	Create new task
PUT	/api/tasks/:id	Update task
View full API documentation

Advanced Setup (Optional) 🔧
WebSocket Notifications


cd backend
npm install socket.io
# Enable socket.io in src/app.gateway.ts
Enable PWA


cd frontend
npm install next-pwa
# Configure next.config.js
License 📄
MIT License - See LICENSE for details.



This README provides clear technical documentation while showcasing both implemented and aspirational features. It uses shields.io badges for visual appeal and follows best practices for open-source projects.



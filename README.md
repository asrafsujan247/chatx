# ChatX - Real-Time Messaging Application

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://chatx-plqv5.sevalla.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Overview

**ChatX** is a modern, full-stack real-time messaging application built with cutting-edge web technologies. It delivers instant communication with a sleek, responsive interface optimized for all devices. The application features secure authentication, real-time message delivery via WebSockets, and a polished user experience with smooth animations and intuitive navigation.

**[🌐 Live Demo](https://chatx-plqv5.sevalla.app/)**

## ✨ Core Features

- **Private Contacts System**: Add users by email to create your personal contact list
- **Real-Time Messaging**: Instant bi-directional communication powered by Socket.io
- **Fully Responsive Design**: Seamless experience across mobile, tablet, and desktop devices
- **Smart Routing**: URL-based navigation with proper browser history management
- **Mobile-Optimized Navigation**: Fixed back-button behavior to prevent accidental app closures
- **Secure Authentication**: JWT-based user authentication and authorization
- **Modern UI/UX**: Clean interface with glassmorphism effects, dynamic gradients, and micro-animations
- **Online Status Indicators**: Real-time user presence tracking
- **Optimized Performance**: Fast load times and smooth interactions

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Real-Time Client**: [Socket.io-client](https://socket.io/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Real-Time Engine**: [Socket.io](https://socket.io/)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing, CORS protection

### Deployment
- **Hosting**: Sevalla (Full-stack deployment)
- **Environment**: Production-ready with environment variable management

## 🏗️ System Architecture

```
┌─────────────┐         HTTPS/WSS          ┌─────────────┐
│   Client    │ ◄─────────────────────────► │   Server    │
│  (React)    │                             │  (Node.js)  │
│             │   REST API + Socket.io      │             │
└─────────────┘                             └──────┬──────┘
                                                   │
                                                   ▼
                                            ┌─────────────┐
                                            │  MongoDB    │
                                            │  Database   │
                                            └─────────────┘
```

### Real-Time Event Flow
1. User sends message via React component
2. Frontend emits Socket.io event to server
3. Server validates and stores message in MongoDB
4. Server broadcasts message to connected clients
5. Recipients receive instant updates via Socket.io listeners

## 📂 Project Folder Structure

```
ChatX-APP/
├── chatx-frontend/              # React frontend application
│   ├── src/
│   │   ├── component/           # Reusable UI components
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── ChatsList.jsx
│   │   │   ├── ContactList.jsx
│   │   │   ├── ChatContainer.jsx
│   │   │   └── ...
│   │   ├── pages/               # Route-level pages
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   └── ChatPage.jsx
│   │   ├── store/               # Zustand state stores
│   │   │   ├── useAuthStore.js
│   │   │   └── useChatStore.js
│   │   ├── lib/                 # Utilities and configurations
│   │   │   └── axios.js
│   │   ├── hooks/               # Custom React hooks
│   │   ├── App.jsx              # Main app with routing
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── public/                  # Static assets
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── chatx-backend/               # Node.js backend server
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   ├── models/              # MongoDB schemas
│   │   ├── routes/              # API routes
│   │   ├── middleware/          # Auth & validation middleware
│   │   ├── lib/                 # Utilities (socket, db config)
│   │   └── index.js             # Server entry point
│   ├── .env                     # Environment variables
│   └── package.json
│
└── README.md                    # This file
```

## 🧭 Routing & Navigation

ChatX implements a robust routing system using **React Router v7**:

- **`/`** - Main chat interface (protected route)
- **`/chat/:id`** - Direct link to specific conversation (protected route)
- **`/login`** - User authentication page
- **`/signup`** - New user registration page

## 📱 Responsiveness

The entire application has been engineered to be **100% responsive** across all device sizes:

- **Desktop (1024px+)**: Full sidebar with chat list + main chat view side-by-side
- **Tablet (768px - 1023px)**: Adaptive layout with collapsible sidebar
- **Mobile (< 768px)**: Single-view navigation that switches between chat list and active conversation

All components, including `ChatPage`, `Login`, `SignUp`, `ChatHeader`, `ChatsList`, and `ContactList`, have been optimized with responsive breakpoints and flexible layouts.


## 📞 Contact

For inquiries, feedback, or collaboration opportunities:

- **Email**: asraf.sujan247@gmail.com
- **GitHub**: [@asrafsujan247](https://github.com/asrafsujan247)
- **Live Demo**: [https://chatx-plqv5.sevalla.app/](https://chatx-plqv5.sevalla.app/)


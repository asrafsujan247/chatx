# ChatX - Real-Time Messaging Application

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://chatx-plqv5.sevalla.app/)

## 🚀 Overview

**ChatX** is a modern, full-stack real-time messaging application built with cutting-edge web technologies. It delivers instant communication with a sleek, responsive interface optimized for all devices. The application features secure authentication, real-time message delivery via WebSockets, friend request system, and a polished user experience with smooth animations and intuitive navigation.

**[🌐 Live Demo](https://chatx-plqv5.sevalla.app/)**

## ✨ Core Features

### Communication & Social

- **Private Contacts**: Add users by email to create your personal contact list
- **Friend Request System**: Send and receive friend requests with real-time notifications
- **Real-Time Messaging**: Instant bi-directional communication powered by Socket.io
- **Live Notifications**: Real-time friend request and message notifications with badge counts
- **Online Status Indicators**: Real-time user presence tracking

### User Interface

- **Modern Settings Dropdown**: Animated settings menu with smooth transitions
  - Friend Requests management with notification badges
  - Add Friend functionality
  - Sound Toggle with visual switch indicator
  - Quick Logout option
- **Sound System**: Interactive sound effects with toggle control
  - Click/toggle sound effects for better user feedback
  - Notification sounds for friend requests and messages
  - User-controlled sound preferences (persisted in local storage)
- **Fully Responsive Design**: Seamless experience across mobile, tablet, and desktop devices
- **Modern UI/UX**: Clean interface with glassmorphism effects, dynamic gradients, and micro-animations
- **Smart Routing**: URL-based navigation with proper browser history management
- **Mobile-Optimized Navigation**: Fixed back-button behavior to prevent accidental app closures

### Security & Performance

- **Secure Authentication**: JWT-based user authentication and authorization
- **Optimized Performance**: Fast load times and smooth interactions
- **Real-Time Updates**: Instant badge and UI updates without page refresh

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
│   │   │   ├── SettingsMenu.jsx      # Settings dropdown
│   │   │   ├── FriendRequests.jsx    # Friend request management
│   │   │   ├── AddContact.jsx        # Add friend modal
│   │   │   └── ...
│   │   ├── pages/               # Route-level pages
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   └── ChatPage.jsx
│   │   ├── store/               # Zustand state stores
│   │   │   ├── useAuthStore.js  # Auth & Socket.io management
│   │   │   └── useChatStore.js  # Chat & friend request state
│   │   ├── lib/                 # Utilities and configurations
│   │   │   └── axios.js
│   │   ├── hooks/               # Custom React hooks
│   │   ├── App.jsx              # Main app with routing
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── public/                  # Static assets
│   │   └── sounds/              # Sound effects
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── chatx-backend/               # Node.js backend server
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   │   ├── user.controller.js    # Friend request logic
│   │   │   └── message.controller.js # Message handling
│   │   ├── models/              # MongoDB schemas
│   │   │   ├── User.js
│   │   │   ├── Message.js
│   │   │   └── FriendRequest.js      # Friend request schema
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

All components, including `ChatPage`, `Login`, `SignUp`, `ChatHeader`, `ChatsList`, `ContactList`, `SettingsMenu`, and modals have been optimized with responsive breakpoints, touch-friendly interactions, and flexible layouts.

### Mobile-Friendly Features

- Touch-optimized buttons and interactive elements
- Responsive modals and dropdowns
- Adaptive text sizing and spacing
- Smooth animations on all devices
- Outside-click detection for modals and dropdowns

## 🔔 Notification System

ChatX features a comprehensive real-time notification system:

### Friend Request Notifications

- **Instant Alerts**: Receive real-time notifications when someone sends you a friend request
- **Visual Badges**: Red notification badges on the settings menu
- **Sound Effects**: Audio notification when requests arrive (respects user sound preference)
- **Auto-Update**: Badge counts update automatically without page refresh

### Message Notifications

- **Real-Time Delivery**: Instant notification when new messages arrive
- **Smart Notifications**: No notification spam if you're already viewing the chat
- **Sound Alerts**: Audio notification for new messages (respects user sound preference)

### Sound System

- **Toggle Control**: Easy on/off switch in settings menu
- **Click Feedback**: Satisfying click sound when toggling settings
- **Persistent Preference**: Sound settings saved to local storage

## � Friend Request System

ChatX uses a **friend request approval system** to ensure user privacy and control:

### How It Works

1. **Search by Email**: Use the settings menu to add friends by email
2. **Send Request**: Click "Send Request" to send a friend request
3. **Receive Notifications**: Get real-time notifications for incoming requests
4. **Accept/Reject**: Manage requests from the Friend Requests panel
5. **Start Chatting**: Only accepted friends can message each other

### Privacy Model

- Users are **not publicly visible** to everyone
- You can only see and chat with accepted friends
- Other users cannot message you unless you've accepted their friend request
- This ensures a private, controlled messaging experience

## �📞 Contact

For inquiries, feedback, or collaboration opportunities:

- **Email**: asraf.sujan247@gmail.com
- **GitHub**: [@asrafsujan247](https://github.com/asrafsujan247)
- **Live Demo**: [https://chatx-plqv5.sevalla.app/](https://chatx-plqv5.sevalla.app/)

---

**Built with ❤️ using React, Node.js, and Socket.io**

# Counseling-Website

A demo website to help people who need psychological counseling. This project provides a full-stack web application for users to book appointments, chat with counselors, and access mental health resources.

## Table of Contents

- [Counseling-Website](#counseling-website)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Project Structure](#project-structure)
  - [Contributing](#contributing)
  - [License](#license)

---

## Features

- User authentication (signup/login)
- Role-based dashboards (User, Counselor, Admin)
- Book and manage counseling appointments
- Real-time chat between users and counselors (Socket.IO)
- Emergency hotline page
- Admin panel for user and appointment management

## Tech Stack

- **Frontend:** React, TypeScript, Material-UI (MUI), React Router, Axios, Socket.IO Client
- **Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose), Socket.IO, JWT Authentication
- **Other:** Docker (optional), dotenv for environment variables

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud instance)

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000).

### Backend

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in your MongoDB URI, JWT secret, etc.
3. Build and start the server:
   ```bash
   npm run build
   npm start
   ```
   The backend will run at [http://localhost:5000](http://localhost:5000) by default.

## Project Structure

```
Counseling-Website/
├── backend/         # Express + TypeScript backend (API, Socket.IO, MongoDB)
│   ├── src/
│   │   ├── routes/          # API route definitions (auth, user, chat, appointment, hotline)
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Mongoose models
│   │   ├── middleware/      # Auth, error handling, etc.
│   │   └── server.ts        # Entry point
├── frontend/        # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/           # Main pages (Dashboard, Chat, Appointment, Hotline, etc.)
│   │   ├── contexts/        # React context providers (Auth, etc.)
│   │   └── App.tsx          # Main app and routing
├── README.md
└── LICENSE
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

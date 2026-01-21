# AuthSphere

A full-stack authentication and task management system with real-time features.

## Features

- 🔐 User Authentication (Sign up, Sign in, Email verification)
- 👥 User Management
- ✅ Task Management
- 📊 Attendance Tracking
- 🔄 Real-time Updates (Socket.io)
- 📧 Email Notifications
- 🎨 Modern UI with Dark/Light Mode

## Tech Stack

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Nodemailer for emails
- Socket.io for real-time updates

### Frontend
- React 19
- Vite
- Tailwind CSS
- Axios
- Socket.io Client

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB account
- Gmail account (for email service)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/authsphere.git
cd authsphere
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Configure environment variables
- Copy `backend/.env.example` to `backend/.env`
- Update the values with your credentials

5. Run the application

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## Deployment

### Backend Deployment (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect your repository to hosting platform
3. Add environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Connect repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-url.com`
5. Deploy

## Environment Variables

### Backend (.env)
- `PORT` - Server port
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `NODE_ENV` - Environment mode
- `EMAIL_SERVICE` - Email service provider
- `EMAIL_USER` - Email address
- `EMAIL_PASSWORD` - Email app password
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend
- `VITE_API_URL` - Backend API URL

## License

MIT

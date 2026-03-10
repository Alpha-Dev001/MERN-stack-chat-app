# QuickChat - Real-time Chat Application

A full-stack chat application built with the MERN stack (MongoDB, Express, React, Node.js) featuring real-time messaging, user authentication, and image sharing.

## Features

- ✅ **User Authentication** - Signup, login, and profile management
- ✅ **Real-time Messaging** - Instant messaging with Socket.io
- ✅ **Online Status** - See who's online in real-time
- ✅ **Image Sharing** - Send and receive images with Cloudinary integration
- ✅ **Responsive Design** - Works seamlessly on desktop and mobile
- ✅ **Message History** - Persistent message storage
- ✅ **Search Users** - Find users quickly with search functionality
- ✅ **Profile Management** - Update profile information and avatar

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication tokens
- **Cloudinary** - Image storage and processing
- **bcryptjs** - Password hashing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Socket.io-client** - Real-time client
- **React Hot Toast** - Notification system

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Chat-app
```

### 2. Install dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

### 3. Environment Setup

#### Backend Environment Variables
Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/chat_app_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

#### Frontend Environment Variables
The `.env` file in the `client` directory is already configured:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Database Setup

#### Option 1: Local MongoDB
Make sure MongoDB is running on your machine:
```bash
# Start MongoDB service (varies by OS)
mongod
```

#### Option 2: MongoDB Atlas
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGO_URI` in your backend `.env` file

### 5. Cloudinary Setup (for image uploads)
1. Create a free account at [Cloudinary](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Update the environment variables in your backend `.env` file

## Running the Application

### Method 1: Run Both Servers Separately

#### Start Backend Server
```bash
cd server
npm run server
```
The backend will run on `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd client
npm run dev
```
The frontend will run on `http://localhost:5173`

### Method 2: Run Both Concurrently (Recommended)

From the root directory, run both servers concurrently:
```bash
# Terminal 1 - Backend
cd server && npm run server

# Terminal 2 - Frontend  
cd client && npm run dev
```

## Usage

1. **Open the Application**
   - Navigate to `http://localhost:5173` in your browser

2. **Create an Account**
   - Click "Create Account" on the login page
   - Fill in your details (name, email, password, bio)
   - Submit the form

3. **Login**
   - Use your email and password to login
   - You'll be redirected to the chat interface

4. **Start Chatting**
   - Select a user from the sidebar to start chatting
   - Type messages and press Enter or click send
   - Share images using the gallery icon
   - See online status indicators for active users

5. **Manage Profile**
   - Click the menu icon and select "Edit Profile"
   - Update your name, bio, and profile picture
   - Changes are saved automatically

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/check` - Verify authentication status
- `POST /api/auth/update-profile` - Update user profile

### Messages
- `GET /api/messages/users` - Get all users for sidebar
- `GET /api/messages/:id` - Get messages with a specific user
- `POST /api/messages/send/:id` - Send a message to a user
- `PUT /api/messages/mark/:id` - Mark message as seen

## Project Structure

```
Chat-app/
├── server/
│   ├── controllers/          # Route controllers
│   ├── lib/                  # Utility functions
│   ├── middleware/           # Custom middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── server.js            # Server entry point
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   ├── lib/             # Utility functions
│   │   ├── pages/           # Page components
│   │   └── main.jsx         # App entry point
│   ├── public/              # Static assets
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Common Issues & Solutions

### MongoDB Connection Issues
- Ensure MongoDB is running on the specified port
- Check your MONGO_URI environment variable
- Verify network connectivity if using MongoDB Atlas

### Socket Connection Issues
- Make sure both frontend and backend are running
- Check CORS configuration in the backend
- Verify the API_URL in frontend environment variables

### Image Upload Issues
- Verify Cloudinary credentials are correct
- Check image file size limits
- Ensure proper image format (PNG, JPEG)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the common issues section above
2. Review the code comments for additional context
3. Create an issue in the repository with detailed information

---

**Happy Chatting! 🚀**

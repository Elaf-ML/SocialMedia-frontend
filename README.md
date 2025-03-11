# Reddit Clone - MERN Stack

## Overview
This project is a simplified version of Reddit, built using the MERN stack (MongoDB, Express.js, React, Node.js) with TypeScript. It focuses on user authentication, post and comment management, and voting features.

## Features
- User authentication with JWT
- CRUD operations for posts and comments
- User profile management
- Voting system for posts and comments
- Responsive design

## Technologies Used
- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - TypeScript
  - JWT (JSON Web Tokens)

- **Frontend:**
  - React
  - TypeScript
  - CSS for styling

## Project Structure
```
reddit-clone
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── middleware
│   │   ├── utils
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── services
│   │   ├── context
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── styles
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- TypeScript

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd reddit-clone
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend application:
   ```
   cd frontend
   npm start
   ```

### API Endpoints
- **Authentication:**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login a user
  - `POST /api/auth/logout` - Logout a user

- **Posts:**
  - `GET /api/posts` - Get all posts
  - `POST /api/posts` - Create a new post
  - `PUT /api/posts/:id` - Update a post
  - `DELETE /api/posts/:id` - Delete a post

- **Comments:**
  - `GET /api/posts/:postId/comments` - Get comments for a post
  - `POST /api/posts/:postId/comments` - Create a new comment
  - `DELETE /api/comments/:id` - Delete a comment

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License
This project is licensed under the MIT License.
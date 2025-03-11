# Reddit Clone - Backend

This is the backend for the Reddit Clone application, built using Node.js, Express.js, and MongoDB. The backend handles user authentication, post management, and comment management, providing a RESTful API for the frontend application.

## Features

- User authentication with JWT
- CRUD operations for posts and comments
- User registration and login
- Middleware for protecting routes
- MongoDB for data storage

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:

   git clone <repository-url>

2. Navigate to the backend directory:

   cd reddit-clone/backend

3. Install the dependencies:

   npm install

### Configuration

1. Create a `.env` file in the `backend` directory and add your MongoDB connection string:

   ```
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```

### Running the Application

1. Start the server:

   npm run dev

   The server will run on `http://localhost:5000`.

### API Endpoints

- **Authentication**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login a user
  - `POST /api/auth/logout` - Logout a user

- **Posts**
  - `GET /api/posts` - Get all posts
  - `POST /api/posts` - Create a new post (authenticated users only)
  - `PUT /api/posts/:id` - Update a post (authenticated users only)
  - `DELETE /api/posts/:id` - Delete a post (authenticated users only)

- **Comments**
  - `GET /api/posts/:postId/comments` - Get comments for a specific post
  - `POST /api/posts/:postId/comments` - Create a new comment (authenticated users only)
  - `DELETE /api/comments/:id` - Delete a comment (authenticated users only)

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- Inspired by Reddit and other social media platforms.
- Thanks to the open-source community for their contributions and resources.
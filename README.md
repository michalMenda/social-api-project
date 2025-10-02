# REST API Project with React, Node.js,  MySQL

## Overview
This project implements a complete REST API system connecting a React client, Node.js server with Express, and MySQL database. The system enables management of users, tasks, posts, and comments.

## Architecture
The project follows a three-tier architecture:
- **Presentation Layer**: React (client-side)
- **Logic Layer**: Node.js with Express (server-side)
- **Data Layer**: MySQL (database)

# Environment Setup

### .env File
Create an .env file in the server/config directory with the following parameters:

## Database connection details
```
DB_HOST=localhost     # Database server address
DB_USER=root          # Database username
DB_PASSWORD=password  # Database password
DB_NAME=project_db    # Database name
```
## Server settings
PORT=3001             # Server port
NODE_ENV=development  # Runtime environment

## Security settings (optional)
JWT_SECRET=your_jwt_secret_key  # JWT encryption key

## API Routes
The server provides the following API routes:

### Users
- `GET /api/users` - Get list of users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update existing user
- `DELETE /api/users/:id` - Delete user

### Tasks
- `GET /api/todos` - Get list of tasks
- `GET /api/todos/:id` - Get task by ID
- Additional routes for task management

### Posts and Comments
- `GET /api/posts` - Get list of posts
- `GET /api/posts/:id` - Get post by ID
- `GET /api/posts/:id/comments` - Get comments for a post
- Additional routes for post and comment management

### Authentication
- `POST /api/login` - User login

## Installation and Running

### Prerequisites
Node.js
MySQL Server

### Database Setup
cd database
node initialize.js

## Security
The project uses JWT for user authentication  
Passwords are encrypted in the database  
The .env file is not uploaded to the code repository  
Permission checks are performed on the server side  

## Technologies
Client-side: React, React Router, Fetch API  
Server-side: Node.js, Express, JWT  
Database: MySQL  
Development tools: npm, nodemon, dotenv  

# Vid-Tube Backend

A robust backend system for a video sharing platform, built with Node.js and Express.js.

## Features

- **User Management**
  - User registration and authentication
  - User profile management
  - Dashboard functionality

- **Video Management**
  - Video upload and streaming
  - Video metadata management
  - Cloudinary integration for media storage

- **Social Features**
  - Comments system
  - Like/Unlike functionality
  - Playlist creation and management
  - User subscriptions
  - Tweet functionality

- **Additional Features**
  - Health check endpoints
  - About section
  - Middleware for request handling and authentication
  - File upload using Multer

## Project Structure

```
src/
├── controllers/      # Business logic for all routes
├── db/              # Database configuration
├── middlewares/     # Custom middleware functions
├── models/          # Database models
├── routes/          # API route definitions
└── utils/          # Utility functions and helpers
```

## Prerequisites

- Node.js
- MongoDB
- Cloudinary account for media storage

## Installation

1. Clone the repository:
```bash
git clone https://github.com/vikasyadav01234/VIDTUBE.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add the following variables:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
```

4. Start the server:
```bash
npm start
```

## API Endpoints

### User Routes
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/update` - Update user profile

### Video Routes
- `POST /api/videos/upload` - Upload a new video
- `GET /api/videos` - Get all videos
- `GET /api/videos/:videoId` - Get video details
- `PATCH /api/videos/:videoId` - Update video details
- `DELETE /api/videos/:videoId` - Delete a video

### Social Interaction Routes
- Comments, Likes, Playlists, Subscriptions, and Tweets endpoints available

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- Multer for file uploads
- Cloudinary for media storage

## Error Handling

The application uses a custom error handling middleware with standardized API responses.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
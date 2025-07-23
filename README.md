# E-commerce Website

A full-stack e-commerce website built with Next.js and Express.js.

## Features

- User authentication
- Product catalog
- Shopping cart functionality
- Order management
- Admin dashboard
- Newsletter subscription
- Responsive design

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TailwindCSS
- Framer Motion
- Axios
- React Hot Toast

### Backend
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt
- Multer
- Express Validator

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Create a `.env` file in the backend directory with your environment variables:
   ```
   PORT=3001
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd frontend
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
web-eecoo/
├── backend/
│   ├── middleware/     # Authentication and validation middleware
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── scripts/       # Database scripts
│   └── server.js      # Express server setup
└── frontend/
    ├── app/           # Next.js app directory
    ├── components/    # React components
    ├── contexts/      # React contexts
    └── public/        # Static files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 
# Quick Start Guide

## Prerequisites

- Node.js >= 18
- npm or yarn

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kavinsaravan/ReturnHelper.git
   cd ReturnHelper
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```
   This will automatically install both frontend and backend dependencies.

3. **Set up environment variables (optional)**
   ```bash
   npm run setup:env
   ```
   This creates `.env` files from the examples. The app works out of the box with default settings.

## Running the Application

**Start the development server:**
```bash
npm run dev
```

This will start:
- **Frontend** at http://localhost:3000
- **Backend API** at http://localhost:5000

## Available Scripts

- `npm run dev` - Run both frontend and backend in development mode
- `npm run web` - Run only the web frontend
- `npm run backend` - Run only the backend API
- `npm run build:web` - Build the web app for production
- `npm test` - Run tests
- `npm run setup:env` - Copy .env.example files to .env

## Notes

- The app runs without MongoDB by default (uses in-memory storage)
- For production use, configure MongoDB in `backend/.env`
- See `SETUP.md` for detailed configuration options
- See `README.md` for full documentation

## Troubleshooting

**Port already in use:**
If you see `EADDRINUSE` error, another process is using the port. Kill it:
```bash
# For port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# For port 5000 (backend)
lsof -ti:5000 | xargs kill -9
```

Then run `npm run dev` again.

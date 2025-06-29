# Personalized Content Dashboard

A user-friendly dashboard that brings you personalized news, movies, and social media content in one place. Built with React, TypeScript, Node.js, and PostgreSQL, it lets you save favorites, organize your feed with drag-and-drop, and enjoy a slick, mobile-friendly interface.

## 🌟 Features

- **Personalized Feed**: Curated news, movies, and social posts tailored to you.
- **Easy Sign-Up**: Secure email verification to get started.
- **Drag-and-Drop**: Reorder content your way.
- **Search & Filter**: Find what you love with smooth search and category filters.
- **Favorites**: Save articles, movies, or posts to revisit anytime.
- **Dark Mode**: Toggle between light and dark themes.
- **Responsive**: Works seamlessly on desktop and mobile.

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Redux Toolkit, Framer Motion
- **Backend**: Node.js, Express, PostgreSQL, JWT, Nodemailer
- **Database**: PostgreSQL (local or Neon for cloud deployment)

## 📋 Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+ for local) or Neon account
- npm
- Git
- Gmail account (for email verification)

## 🚀 Get Started

### 1. Clone the Project
```bash
git clone https://github.com/suryavignesh1304/Content_Dashboard
cd content-dashboard
```

### 2. Install Dependencies
```bash
# Install server and client dependencies
npm run install:all
```

### 3. Set Up the Database

#### Option 1: Local PostgreSQL
- Install PostgreSQL:
  - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/).
  - **macOS**: `brew install postgresql && brew services start postgresql`
  - **Ubuntu**: `sudo apt update && sudo apt install postgresql postgresql-contrib`
- Create the database:
  ```bash
  psql -U postgres -c "CREATE DATABASE content_dashboard;"
  ```
- Set up schema and sample data:
  ```bash
  psql -U postgres -d content_dashboard -f database/content_dashboard_setup.sql
  ```

#### Option 2: Neon (Cloud)
- Sign up at [Neon](https://neon.tech/) and create a database named `neondb`.
- Run the schema:
  ```bash
  "C:\Program Files\PostgreSQL\16\bin\psql.exe" -d "postgresql://neondb_owner:npg_jps8tWgcYL3f@ep-snowy-hill-a8pwtecv-pooler.eastus2.azure.neon.tech/neondb?sslmode=require" -f database/content_dashboard_setup.sql
  ```

### 4. Configure Environment

#### Server
Copy the `.env.example` file:
```bash
cd server
copy .env.example .env
```

Edit `server/.env`:
```plaintext
# Local Database
DB_HOST_LOCAL=localhost
DB_PORT_LOCAL=5432
DB_NAME_LOCAL=content_dashboard
DB_USER_LOCAL=postgres
DB_PASSWORD_LOCAL=admin

# Neon Database
DB_HOST=ep-snowy-hill-a8pwtecv-pooler.eastus2.azure.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=npg_jps8tWgcYL3f
DB_SSLMODE=require

# JWT Secret
JWT_SECRET=8c9f7e2b1a4d6f3c9e8a2b7d4f1c6e9a8b3d2f7c4e1a9b8d3f2c7e4a1b9d8f3

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# API Keys
NEWS_API_KEY=your-news-api-key
#TMDB_API_KEY=your-tmdb-api-key

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```
- Replace `your-email@gmail.com` and `your-app-specific-password` with your Gmail credentials (get an app-specific password from [Google Account → Security → App passwords](https://myaccount.google.com/security)).
- For `NEWS_API_KEY`, sign up at [NewsAPI.org](https://newsapi.org/).
- For `TMDB_API_KEY`, sign up at [The Movie Database](https://www.themoviedb.org/). Comment out for local testing to use mock data (avoids TMDB network issues).
- Set `NODE_ENV=production` for Neon deployment.

#### Client
Edit `client/.env`:
```plaintext
VITE_API_BASE_URL=http://localhost:5000/api
```

### 5. Start the App
```bash
# Start both server and client
npm run dev
```
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

Or start separately:
```bash
# Server
npm run dev:server
# Client
npm run dev:client
```

### 6. Test the App
- **Sign Up**: Go to http://localhost:3000, enter your email, and verify via the link sent to your inbox.
- **Explore**: Search, filter, and drag content to customize your feed.
- **Test Endpoints**:
  ```bash
  # Health check
  curl http://localhost:5000/api/health
  # Login (use demo@example.com, password123 from seed data)
  curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email": "demo@example.com", "password": "password123"}'
  # Movies (mock data)
  curl -H "Authorization: Bearer <token>" "http://localhost:5000/api/movies?type=popular"
  ```

## 🌍 Deploy to Neon
1. Set `NODE_ENV=production` in `server/.env`.
2. Ensure Neon database is set up (step 3, option 2).
3. Deploy the server to Render, Heroku, or AWS, setting `.env` variables in the platform.
4. For real movie data, uncomment `TMDB_API_KEY` and resolve network issues (e.g., use a VPN if ISP blocks TMDB).
5. Update `CLIENT_URL` to your deployed frontend URL.

## 🆘 Troubleshooting
- **TMDB Error (ECONNRESET)**: Use a VPN or comment out `TMDB_API_KEY` for mock data. Test the key: `curl "https://api.themoviedb.org/3/movie/popular?api_key=your-tmdb-api-key"`.
- **Email Not Sending**: Verify Gmail app-specific password and 2FA. Test with:
  ```javascript
  // test-email.js
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'your-email@gmail.com', pass: 'your-app-specific-password' } });
  transporter.sendMail({ from: 'your-email@gmail.com', to: 'test@example.com', subject: 'Test', text: 'Test email' }, (err, info) => console.log(err || info));
  ```
- **Database Issues**: Check `.env` credentials and ensure the database exists.

## 🤝 Contributing
Fork, create a feature branch, commit changes, and open a pull request.

## 📝 License
MIT License.

**Built with ❤️ for content lovers!**
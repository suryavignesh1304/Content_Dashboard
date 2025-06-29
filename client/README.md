# Personalized Content Dashboard

A comprehensive, production-ready content dashboard built with React, TypeScript, Node.js, and PostgreSQL. This application provides users with a personalized feed of news, movies, and social content with advanced features like drag-and-drop organization, real-time updates, and email verification.

## 🚀 Features

### Core Functionality
- **Personalized Content Feed**: Aggregated content from multiple APIs (News, Movies, Social Media)
- **User Authentication**: Email verification with password setup via email
- **Interactive Dashboard**: Drag-and-drop content organization
- **Advanced Search**: Debounced search across all content types
- **Favorites System**: Save and organize favorite content
- **Real-time Updates**: Live content refreshing
- **Responsive Design**: Mobile-first, works on all devices

### Advanced Features
- **Dark Mode**: Complete dark/light theme switching
- **Infinite Scrolling**: Efficient content loading
- **Content Filtering**: Category-based filtering and preferences
- **User Preferences**: Customizable content categories and settings
- **Smooth Animations**: Framer Motion powered interactions
- **State Management**: Redux Toolkit with RTK Query
- **TypeScript**: Full type safety throughout the application

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Redux Toolkit** for state management
- **RTK Query** for API calls and caching
- **React Router** for navigation
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **React Beautiful DnD** for drag-and-drop
- **React Hook Form** for form handling

### Backend
- **Node.js** with Express
- **PostgreSQL** for database
- **JWT** for authentication
- **Nodemailer** for email verification
- **bcryptjs** for password hashing
- **Helmet** for security
- **CORS** for cross-origin requests

### Testing & Development
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **ESLint** for code linting
- **TypeScript** for type checking

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd personalized-content-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Install PostgreSQL
```bash
# On macOS with Homebrew
brew install postgresql
brew services start postgresql

# On Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# On Windows
# Download and install from https://www.postgresql.org/download/windows/
```

#### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE content_dashboard;

# Create user (optional)
CREATE USER dashboard_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE content_dashboard TO dashboard_user;

# Exit PostgreSQL
\q
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=content_dashboard
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Email Configuration (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# API Keys (optional - for full functionality)
NEWS_API_KEY=your-news-api-key
TMDB_API_KEY=your-tmdb-api-key

# Server Configuration
PORT=5000
```

#### Getting API Keys (Optional)

1. **News API**: Get free API key from [NewsAPI.org](https://newsapi.org/)
2. **TMDB API**: Get free API key from [The Movie Database](https://www.themoviedb.org/settings/api)

#### Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings → Security → App passwords
3. Generate an app password for "Mail"
4. Use this password in the `EMAIL_PASSWORD` field

### 5. Start the Application

#### Development Mode

```bash
# Start the backend server
npm run server

# In a new terminal, start the frontend
npm run dev
```

#### Production Mode

```bash
# Build the frontend
npm run build

# Start the server (serves both API and static files)
npm run server
```

## 🔧 Available Scripts

### Development
```bash
npm run dev          # Start Vite development server
npm run server       # Start Node.js backend server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing
```bash
npm run test         # Run unit tests with Vitest
npm run test:ui      # Run tests with UI
npm run test:e2e     # Run E2E tests with Playwright
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 📱 Usage Guide

### 1. User Registration
1. Visit the application at `http://localhost:3000`
2. Click "Create Account"
3. Enter your email address
4. Check your email for verification link
5. Click the link to set your password
6. Sign in with your credentials

### 2. Dashboard Features
- **Feed**: View personalized content from multiple sources
- **Trending**: See what's popular across all categories
- **Favorites**: Access your saved content
- **Settings**: Customize preferences and appearance

### 3. Content Interaction
- **Search**: Use the search bar to find specific content
- **Favorite**: Click the heart icon to save content
- **Drag & Drop**: Reorder content cards by dragging
- **Filters**: Use category filters to refine content

### 4. Customization
- **Dark Mode**: Toggle in the header or settings
- **Preferences**: Set favorite categories and hashtags
- **Content Density**: Choose compact, comfortable, or spacious layouts

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── content/        # Content-related components
│   ├── layout/         # Layout components (Header, Sidebar)
│   ├── settings/       # Settings components
│   └── ui/             # Generic UI components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── store/              # Redux store configuration
│   ├── api/            # RTK Query API definitions
│   └── slices/         # Redux slices
├── types/              # TypeScript type definitions
└── utils/              # Utility functions

server.js               # Express server with all backend logic
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test -- --coverage
```

## 🚀 Deployment

### Environment Variables for Production
Ensure all environment variables are set in your production environment.

### Database Migration
The application automatically creates necessary tables on startup.

### Build and Deploy
```bash
npm run build
npm run server
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Email Verification**: Required email verification for new accounts
- **CORS Protection**: Configured for secure cross-origin requests
- **Helmet**: Security headers for Express
- **Input Validation**: Form validation and sanitization
- **SQL Injection Protection**: Parameterized queries

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#8B5CF6)
- **Accent**: Green (#10B981)
- **Success**: Green variants
- **Warning**: Orange variants
- **Error**: Red variants
- **Neutral**: Gray scale

### Typography
- **Headings**: 120% line height, max 3 font weights
- **Body**: 150% line height for readability
- **Consistent**: 8px spacing system throughout

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Email Not Sending**
   - Check Gmail app password setup
   - Verify email credentials in `.env`
   - Ensure 2FA is enabled on Gmail

3. **API Keys Not Working**
   - Verify API keys are correct
   - Check API rate limits
   - Ensure APIs are accessible

4. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes on the port

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check the troubleshooting section above

## 🎯 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] Social sharing features
- [ ] Content recommendation AI
- [ ] Mobile app with React Native
- [ ] Offline support with PWA
- [ ] Advanced content filtering
- [ ] User-generated content
- [ ] Integration with more APIs

---

**Built with ❤️ using React, TypeScript, Node.js, and PostgreSQL**
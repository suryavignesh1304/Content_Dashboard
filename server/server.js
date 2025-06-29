import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 5000;

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'content_dashboard',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Database connection test
const testDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('Please ensure PostgreSQL is running and database exists');
  }
};

// Send verification email
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - Content Dashboard',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3B82F6; margin: 0;">Content Dashboard</h1>
          <p style="color: #666; margin: 5px 0;">Your Personalized Content Hub</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h2 style="color: white; margin: 0 0 15px 0;">Welcome to Content Dashboard!</h2>
          <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">
            Thank you for signing up. Please verify your email address and set up your password to complete your registration.
          </p>
        </div>

        <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #1f2937; margin: 0 0 15px 0;">What's Next?</h3>
          <ol style="color: #4b5563; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Click the verification button below</li>
            <li style="margin-bottom: 8px;">Set up your secure password</li>
            <li style="margin-bottom: 8px;">Customize your content preferences</li>
            <li>Start exploring personalized content!</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
            Verify Email & Set Password
          </a>
        </div>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
          <p style="color: #92400e; margin: 0; font-size: 14px;">
            <strong>Security Note:</strong> This verification link will expire in 24 hours for your security.
          </p>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
            If the button doesn't work, copy and paste this URL into your browser:
          </p>
          <p style="color: #3b82f6; font-size: 14px; word-break: break-all; margin: 0;">
            ${verificationUrl}
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            © 2024 Content Dashboard. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    server: 'Content Dashboard API',
    version: '1.0.0'
  });
});

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Generate verification token
    const verificationToken = uuidv4();

    // Create user without password
    const result = await pool.query(
      'INSERT INTO users (email, verification_token) VALUES ($1, $2) RETURNING id, email',
      [email, verificationToken]
    );

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Delete the user if email fails
      await pool.query('DELETE FROM users WHERE id = $1', [result.rows[0].id]);
      return res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
    }

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify and set your password.',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Email Verification and Password Setup
app.post('/api/auth/verify-email', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Find user by verification token
    const user = await pool.query(
      'SELECT * FROM users WHERE verification_token = $1 AND is_verified = FALSE',
      [token]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update user
    await pool.query(
      'UPDATE users SET password_hash = $1, is_verified = TRUE, verification_token = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [passwordHash, user.rows[0].id]
    );

    res.json({ message: 'Email verified and password set successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userData = user.rows[0];

    if (!userData.is_verified) {
      return res.status(401).json({ error: 'Please verify your email first' });
    }

    if (!userData.password_hash) {
      return res.status(401).json({ error: 'Please complete your registration by setting a password' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, userData.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: userData.id, email: userData.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: userData.id,
        email: userData.email,
        preferences: userData.preferences
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get User Profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, email, preferences, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.rows[0]);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update User Preferences
app.put('/api/user/preferences', authenticateToken, async (req, res) => {
  try {
    const { preferences } = req.body;

    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({ error: 'Valid preferences object is required' });
    }

    await pool.query(
      'UPDATE users SET preferences = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [JSON.stringify(preferences), req.user.userId]
    );

    res.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add to Favorites
app.post('/api/user/favorites', authenticateToken, async (req, res) => {
  try {
    const { contentId, contentType, contentData } = req.body;

    if (!contentId || !contentType || !contentData) {
      return res.status(400).json({ error: 'Content ID, type, and data are required' });
    }

    // Check if already favorited
    const existing = await pool.query(
      'SELECT id FROM user_favorites WHERE user_id = $1 AND content_id = $2',
      [req.user.userId, contentId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Content already in favorites' });
    }

    await pool.query(
      'INSERT INTO user_favorites (user_id, content_id, content_type, content_data) VALUES ($1, $2, $3, $4)',
      [req.user.userId, contentId, contentType, JSON.stringify(contentData)]
    );

    res.json({ message: 'Added to favorites successfully' });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get User Favorites
app.get('/api/user/favorites', authenticateToken, async (req, res) => {
  try {
    const favorites = await pool.query(
      'SELECT * FROM user_favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );

    res.json(favorites.rows);
  } catch (error) {
    console.error('Favorites fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove from Favorites
app.delete('/api/user/favorites/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM user_favorites WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites successfully' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Content Order
app.put('/api/user/content-order', authenticateToken, async (req, res) => {
  try {
    const { contentOrder } = req.body;

    if (!Array.isArray(contentOrder)) {
      return res.status(400).json({ error: 'Content order must be an array' });
    }

    await pool.query(
      `INSERT INTO user_content_order (user_id, content_order, updated_at) 
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id) DO UPDATE SET
       content_order = $2, updated_at = CURRENT_TIMESTAMP`,
      [req.user.userId, JSON.stringify(contentOrder)]
    );

    res.json({ message: 'Content order updated successfully' });
  } catch (error) {
    console.error('Content order update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Content Order
app.get('/api/user/content-order', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT content_order FROM user_content_order WHERE user_id = $1',
      [req.user.userId]
    );

    const contentOrder = result.rows.length > 0 ? result.rows[0].content_order : [];
    res.json({ contentOrder });
  } catch (error) {
    console.error('Content order fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// External API Proxy Routes (to avoid CORS issues)

// News API Proxy
app.get('/api/news', authenticateToken, async (req, res) => {
  try {
    const { category = 'general', page = 1, q } = req.query;
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      // Return mock data if no API key
      const mockNews = {
        status: 'ok',
        totalResults: 100,
        articles: Array.from({ length: 20 }, (_, i) => ({
          source: { id: null, name: 'Mock News' },
          author: `Author ${i + 1}`,
          title: `${q ? `${q} - ` : ''}Breaking News Story ${i + 1} - ${category}`,
          description: `This is a mock news article about ${category}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
          url: `https://example.com/news/${i + 1}`,
          urlToImage: `https://picsum.photos/400/300?random=${page * 20 + i}`,
          publishedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
          content: 'Mock content for testing purposes.'
        }))
      };
      return res.json(mockNews);
    }

    let url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}&pageSize=20&apiKey=${apiKey}`;
    
    if (q) {
      url = `https://newsapi.org/v2/everything?q=${q}&page=${page}&pageSize=20&sortBy=publishedAt&apiKey=${apiKey}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    
    res.json(data);
  } catch (error) {
    console.error('News API error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Movie API Proxy (TMDB)
app.get('/api/movies', authenticateToken, async (req, res) => {
  try {
    const { type = 'popular', page = 1, query } = req.query;
    const apiKey = process.env.TMDB_API_KEY;
    
    if (!apiKey) {
      // Return mock data if no API key
      const mockMovies = {
        page: parseInt(page),
        results: Array.from({ length: 20 }, (_, i) => ({
          id: page * 20 + i,
          title: `${query ? `${query} - ` : ''}Movie Title ${i + 1}`,
          overview: `This is a mock movie description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
          poster_path: `/mock-poster-${i + 1}.jpg`,
          backdrop_path: `/mock-backdrop-${i + 1}.jpg`,
          release_date: new Date(Date.now() - Math.random() * 86400000 * 365 * 5).toISOString().split('T')[0],
          vote_average: Math.round((Math.random() * 4 + 6) * 10) / 10,
          vote_count: Math.floor(Math.random() * 10000),
          popularity: Math.random() * 100,
          genre_ids: [28, 12, 16],
          adult: false,
          video: false,
          original_language: 'en'
        })),
        total_pages: 100,
        total_results: 2000
      };
      return res.json(mockMovies);
    }

    let url = `https://api.themoviedb.org/3/movie/${type}?api_key=${apiKey}&page=${page}`;
    
    if (query) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${page}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    
    res.json(data);
  } catch (error) {
    console.error('Movies API error:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Mock Social Media API
app.get('/api/social', authenticateToken, async (req, res) => {
  try {
    const { hashtag = 'technology', page = 1 } = req.query;
    
    // Mock social media data
    const mockPosts = Array.from({ length: 20 }, (_, i) => ({
      id: `post_${page}_${i}`,
      username: `user${Math.floor(Math.random() * 1000)}`,
      content: `Amazing post about #${hashtag}! This is post ${i + 1} on page ${page}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. #trending #viral`,
      hashtags: [hashtag, 'trending', 'viral'],
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 50),
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      image: Math.random() > 0.5 ? `https://picsum.photos/400/300?random=${page * 20 + i}` : null,
      verified: Math.random() > 0.7
    }));

    res.json({
      posts: mockPosts,
      hasMore: page < 10
    });
  } catch (error) {
    console.error('Social API error:', error);
    res.status(500).json({ error: 'Failed to fetch social posts' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  await testDatabaseConnection();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Database: ${process.env.DB_NAME || 'content_dashboard'}`);
    console.log(`🌐 API endpoints: http://localhost:${PORT}/api`);
    console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
    console.log(`📧 Email configured: ${process.env.EMAIL_USER ? '✅' : '❌'}`);
    console.log(`🔑 API Keys: News=${process.env.NEWS_API_KEY ? '✅' : '❌'}, TMDB=${process.env.TMDB_API_KEY ? '✅' : '❌'}`);
  });
};

startServer().catch(console.error);
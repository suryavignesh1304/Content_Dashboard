/*
  # Content Dashboard Database Setup
  
  This file combines the schema and seed data for the Content Dashboard application.
  It creates the necessary tables and populates them with sample data for testing and development.
  
  ## Usage:
  1. Create a database in PostgreSQL:
     createdb -U postgres content_dashboard
  2. Run this file against your PostgreSQL database:
     psql -U postgres -d content_dashboard -f content_dashboard_setup.sql
*/

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS user_content_order CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_favorites table
CREATE TABLE user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content_id VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    content_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_content_order table
CREATE TABLE user_content_order (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    content_order JSONB DEFAULT '[]',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_sessions table (optional - for session management)
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_token ON users(verification_token);
CREATE INDEX idx_users_reset_token ON users(reset_token);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_content_type ON user_favorites(content_type);
CREATE INDEX idx_user_content_order_user_id ON user_content_order(user_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_content_order_updated_at 
    BEFORE UPDATE ON user_content_order 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Clear existing data before seeding
TRUNCATE user_sessions, user_content_order, user_favorites, users RESTART IDENTITY CASCADE;

-- Insert sample users (passwords are hashed version of 'password123')
INSERT INTO users (email, password_hash, is_verified, preferences) VALUES 
(
    'demo@example.com', 
    '$2a$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQ', 
    true, 
    '{
        "newsCategory": "technology",
        "socialHashtag": "tech",
        "notifications": true,
        "language": "en",
        "autoRefresh": true,
        "contentDensity": "comfortable"
    }'::jsonb
),
(
    'user@test.com', 
    '$2a$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQ', 
    true, 
    '{
        "newsCategory": "sports",
        "socialHashtag": "sports",
        "notifications": false,
        "language": "en",
        "autoRefresh": false,
        "contentDensity": "compact"
    }'::jsonb
);

-- Insert sample favorites
INSERT INTO user_favorites (user_id, content_id, content_type, content_data) VALUES 
(
    1, 
    'news-sample-1', 
    'news', 
    '{
        "title": "Sample News Article",
        "description": "This is a sample news article for testing",
        "image": "https://picsum.photos/400/300?random=1",
        "url": "https://example.com/news/1",
        "author": "John Doe",
        "publishedAt": "2024-01-15T10:00:00Z",
        "category": "technology"
    }'::jsonb
),
(
    1, 
    'movie-sample-1', 
    'movie', 
    '{
        "title": "Sample Movie",
        "description": "This is a sample movie for testing",
        "image": "https://picsum.photos/400/600?random=2",
        "publishedAt": "2024-01-01T00:00:00Z",
        "category": "entertainment",
        "vote_average": 8.5
    }'::jsonb
);

-- Insert sample content order
INSERT INTO user_content_order (user_id, content_order) VALUES 
(1, '["news-sample-1", "movie-sample-1"]'::jsonb),
(2, '[]'::jsonb);
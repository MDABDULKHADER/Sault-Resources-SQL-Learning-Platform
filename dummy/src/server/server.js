
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'sault_resources',
  port: parseInt(process.env.DB_PORT || '3307'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database
async function initDb() {
  try {
    const connection = await pool.getConnection();
    
    // Create users table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        progress INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create completed_topics table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS completed_topics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        topic_id VARCHAR(50) NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY user_topic (user_id, topic_id)
      )
    `);
    
    // Create quiz_scores table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS quiz_scores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        topic_id VARCHAR(50) NOT NULL,
        score INT NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create certificates table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        certificate_type VARCHAR(100) DEFAULT 'SQL Completion Certificate',
        certificate_code VARCHAR(50) UNIQUE NOT NULL,
        issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY user_certificate (user_id, certificate_type)
      )
    `);
    
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    
    // Get user without password
    const [user] = await pool.query(
      'SELECT id, name, email, progress FROM users WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(user[0]);
  } catch (error) {
    console.error('Registration error:', error);
    
    // Check for duplicate email
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Progress routes
app.get('/api/progress/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get completed topics
    const [completedTopics] = await pool.query(
      'SELECT topic_id FROM completed_topics WHERE user_id = ?',
      [userId]
    );
    
    // Get quiz scores
    const [quizScores] = await pool.query(
      'SELECT topic_id, score FROM quiz_scores WHERE user_id = ?',
      [userId]
    );
    
    // Format quiz scores as a map
    const scores = {};
    quizScores.forEach(item => {
      scores[item.topic_id] = item.score;
    });
    
    res.status(200).json({
      completedTopics: completedTopics.map(item => item.topic_id),
      quizScores: scores
    });
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/progress/mark-completed', async (req, res) => {
  try {
    const { userId, topicId } = req.body;
    
    await pool.query(
      'INSERT IGNORE INTO completed_topics (user_id, topic_id) VALUES (?, ?)',
      [userId, topicId]
    );
    
    res.status(200).json({ message: 'Topic marked as completed' });
  } catch (error) {
    console.error('Error marking topic as completed:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate certificate code
function generateCertificateCode() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `CERT-${timestamp}-${random}`.toUpperCase();
}

// Helper function to check and award certificate
async function checkAndAwardCertificate(userId) {
  try {
    // Check if user has completed all 5 topics
    const [completedTopics] = await pool.query(
      'SELECT COUNT(*) as count FROM completed_topics WHERE user_id = ?',
      [userId]
    );
    
    if (completedTopics[0].count >= 5) {
      // Check if certificate already exists
      const [existingCert] = await pool.query(
        'SELECT id FROM certificates WHERE user_id = ? AND certificate_type = ?',
        [userId, 'SQL Completion Certificate']
      );
      
      if (existingCert.length === 0) {
        // Award certificate
        const certificateCode = generateCertificateCode();
        await pool.query(
          'INSERT INTO certificates (user_id, certificate_type, certificate_code) VALUES (?, ?, ?)',
          [userId, 'SQL Completion Certificate', certificateCode]
        );
        
        return { awarded: true, certificateCode };
      }
    }
    
    return { awarded: false };
  } catch (error) {
    console.error('Error checking/awarding certificate:', error);
    return { awarded: false };
  }
}

app.post('/api/quiz/save-score', async (req, res) => {
  try {
    const { userId, topicId, score } = req.body;
    
    // Insert or update quiz score
    await pool.query(
      'INSERT INTO quiz_scores (user_id, topic_id, score) VALUES (?, ?, ?) ' +
      'ON DUPLICATE KEY UPDATE score = ?, completed_at = CURRENT_TIMESTAMP',
      [userId, topicId, score, score]
    );
    
    // Mark topic as completed
    await pool.query(
      'INSERT IGNORE INTO completed_topics (user_id, topic_id) VALUES (?, ?)',
      [userId, topicId]
    );
    
    // Calculate and update user progress
    const [completedTopics] = await pool.query(
      'SELECT COUNT(*) as count FROM completed_topics WHERE user_id = ?',
      [userId]
    );
    
    // Assuming 5 total topics as in the existing code
    const totalTopics = 5;
    const progress = Math.round((completedTopics[0].count / totalTopics) * 100);
    
    await pool.query(
      'UPDATE users SET progress = ? WHERE id = ?',
      [progress, userId]
    );
    
    // Check and award certificate if all topics completed
    const certificateResult = await checkAndAwardCertificate(userId);
    
    res.status(200).json({ 
      message: 'Quiz score saved',
      certificateAwarded: certificateResult.awarded,
      certificateCode: certificateResult.certificateCode
    });
  } catch (error) {
    console.error('Error saving quiz score:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Certificate routes
app.get('/api/certificates/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const [certificates] = await pool.query(
      'SELECT * FROM certificates WHERE user_id = ? ORDER BY issued_at DESC',
      [userId]
    );
    
    res.status(200).json(certificates);
  } catch (error) {
    console.error('Error getting certificates:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/certificate/verify/:certificateCode', async (req, res) => {
  try {
    const { certificateCode } = req.params;
    
    const [certificate] = await pool.query(`
      SELECT c.*, u.name as user_name, u.email as user_email 
      FROM certificates c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.certificate_code = ?
    `, [certificateCode]);
    
    if (certificate.length === 0) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.status(200).json(certificate[0]);
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize database and start server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

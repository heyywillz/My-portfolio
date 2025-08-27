const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
}

// Routes

// Get all projects (for displaying on website)
app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM projects ORDER BY featured DESC, created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, message: 'Error fetching projects' });
  }
});

// Get featured projects only
app.get('/api/projects/featured', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM projects WHERE featured = TRUE ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    res.status(500).json({ success: false, message: 'Error fetching featured projects' });
  }
});

// Add new project (for admin use)
app.post('/api/projects', async (req, res) => {
  const { title, description, image_url, github_url, live_demo_url, technologies, featured } = req.body;
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO projects (title, description, image_url, github_url, live_demo_url, technologies, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, image_url, github_url, live_demo_url, JSON.stringify(technologies), featured || false]
    );
    
    res.json({ 
      success: true, 
      message: 'Project added successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ success: false, message: 'Error adding project' });
  }
});

// Get all testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM testimonials ORDER BY featured DESC, created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ success: false, message: 'Error fetching testimonials' });
  }
});

// Get featured testimonials only
app.get('/api/testimonials/featured', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM testimonials WHERE featured = TRUE ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching featured testimonials:', error);
    res.status(500).json({ success: false, message: 'Error fetching featured testimonials' });
  }
});

// Add new testimonial (for admin use)
app.post('/api/testimonials', async (req, res) => {
  const { client_name, client_position, client_company, testimonial_text, client_image_url, rating, featured } = req.body;
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO testimonials (client_name, client_position, client_company, testimonial_text, client_image_url, rating, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [client_name, client_position, client_company, testimonial_text, client_image_url, rating, featured || false]
    );
    
    res.json({ 
      success: true, 
      message: 'Testimonial added successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error adding testimonial:', error);
    res.status(500).json({ success: false, message: 'Error adding testimonial' });
  }
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
  const { full_name, email, subject, message } = req.body;
  
  // Basic validation
  if (!full_name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'Full name, email, and message are required' 
    });
  }
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO contacts (full_name, email, subject, message) VALUES (?, ?, ?, ?)',
      [full_name, email, subject || '', message]
    );
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully! I will get back to you within 24 hours.',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ success: false, message: 'Error sending message. Please try again.' });
  }
});

// Get all contact submissions (for admin use)
app.get('/api/contacts', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM contacts ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ success: false, message: 'Error fetching contacts' });
  }
});

// Update contact status (for admin use)
app.patch('/api/contacts/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!['new', 'read', 'replied'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  
  try {
    await pool.execute(
      'UPDATE contacts SET status = ? WHERE id = ?',
      [status, id]
    );
    
    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
});

// Serve frontend files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});


// Start server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await testConnection();
});

module.exports = app;

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT2 || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool for practice database
const practicePool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.PRACTICE_DB_NAME || 'new_sql_practice',
  port: parseInt(process.env.DB_PORT || '3307'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize practice database with dummy data
async function initPracticeDb() {
  try {
    const connection = await practicePool.getConnection();
    
    // Create practice database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS new_sql_practice`);
    await connection.query(`USE new_sql_practice`);
    
    // Create employees table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        department VARCHAR(50) NOT NULL,
        salary DECIMAL(10,2) NOT NULL,
        hire_date DATE NOT NULL,
        manager_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create departments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        budget DECIMAL(12,2) NOT NULL,
        location VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        price DECIMAL(8,2) NOT NULL,
        stock_quantity INT NOT NULL,
        supplier_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(100) NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        order_date DATE NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert sample data into employees
    await connection.query(`
      INSERT IGNORE INTO employees (id, name, email, department, salary, hire_date, manager_id) VALUES
      (1, 'John Doe', 'john@company.com', 'Engineering', 75000.00, '2022-01-15', NULL),
      (2, 'Jane Smith', 'jane@company.com', 'Marketing', 65000.00, '2022-02-20', NULL),
      (3, 'Mike Johnson', 'mike@company.com', 'Engineering', 80000.00, '2021-11-10', 1),
      (4, 'Sarah Wilson', 'sarah@company.com', 'HR', 60000.00, '2023-03-05', NULL),
      (5, 'Tom Brown', 'tom@company.com', 'Sales', 55000.00, '2022-08-12', 2),
      (6, 'Lisa Davis', 'lisa@company.com', 'Engineering', 72000.00, '2023-01-18', 1),
      (7, 'Chris Miller', 'chris@company.com', 'Marketing', 58000.00, '2022-12-03', 2),
      (8, 'Anna Garcia', 'anna@company.com', 'Finance', 68000.00, '2021-09-25', NULL)
    `);
    
    // Insert sample data into departments
    await connection.query(`
      INSERT IGNORE INTO departments (id, name, budget, location) VALUES
      (1, 'Engineering', 500000.00, 'Building A'),
      (2, 'Marketing', 200000.00, 'Building B'),
      (3, 'HR', 150000.00, 'Building C'),
      (4, 'Sales', 300000.00, 'Building B'),
      (5, 'Finance', 250000.00, 'Building C')
    `);
    
    // Insert sample data into products
    await connection.query(`
      INSERT IGNORE INTO products (id, name, category, price, stock_quantity, supplier_id) VALUES
      (1, 'Laptop Pro', 'Electronics', 1299.99, 50, 1),
      (2, 'Wireless Mouse', 'Electronics', 29.99, 200, 1),
      (3, 'Office Chair', 'Furniture', 199.99, 30, 2),
      (4, 'Desk Lamp', 'Furniture', 49.99, 75, 2),
      (5, 'Notebook Set', 'Office Supplies', 15.99, 100, 3),
      (6, 'Pen Pack', 'Office Supplies', 8.99, 150, 3),
      (7, 'Monitor 24inch', 'Electronics', 299.99, 25, 1),
      (8, 'Keyboard Mechanical', 'Electronics', 89.99, 40, 1)
    `);
    
    // Insert sample data into orders
    await connection.query(`
      INSERT IGNORE INTO orders (id, customer_name, product_id, quantity, order_date, total_amount, status) VALUES
      (1, 'Alice Johnson', 1, 2, '2024-01-15', 2599.98, 'completed'),
      (2, 'Bob Smith', 3, 1, '2024-01-20', 199.99, 'completed'),
      (3, 'Carol Davis', 2, 5, '2024-02-01', 149.95, 'shipped'),
      (4, 'David Wilson', 7, 1, '2024-02-05', 299.99, 'pending'),
      (5, 'Eva Brown', 5, 3, '2024-02-10', 47.97, 'completed'),
      (6, 'Frank Miller', 8, 2, '2024-02-12', 179.98, 'shipped'),
      (7, 'Grace Lee', 4, 4, '2024-02-15', 199.96, 'pending'),
      (8, 'Henry Garcia', 6, 10, '2024-02-18', 89.90, 'completed')
    `);
    
    connection.release();
    console.log('Practice database initialized successfully with dummy data');
  } catch (error) {
    console.error('Error initializing practice database:', error);
  }
}

// SQL Practice Routes
app.post('/api/practice/execute', async (req, res) => {
  try {
    const { query } = req.body;
    
    // Basic security check - only allow SELECT, SHOW, DESCRIBE queries for safety
    const allowedQueries = /^(SELECT|SHOW|DESCRIBE|EXPLAIN)\s+/i;
    
    if (!allowedQueries.test(query.trim())) {
      return res.status(400).json({ 
        error: 'Only SELECT, SHOW, DESCRIBE, and EXPLAIN queries are allowed in practice mode' 
      });
    }
    
    const connection = await practicePool.getConnection();
    const [results] = await connection.query(query);
    connection.release();
    
    res.status(200).json({
      success: true,
      results: results,
      rowCount: Array.isArray(results) ? results.length : 1
    });
    
  } catch (error) {
    console.error('SQL execution error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get database schema information
app.get('/api/practice/schema', async (req, res) => {
  try {
    const connection = await practicePool.getConnection();
    
    // Get all tables
    const [tables] = await connection.query('SHOW TABLES');
    
    const schema = {};
    
    // Get structure for each table
    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0];
      const [columns] = await connection.query(`DESCRIBE ${tableName}`);
      schema[tableName] = columns;
    }
    
    connection.release();
    
    res.status(200).json({
      success: true,
      schema: schema
    });
    
  } catch (error) {
    console.error('Schema fetch error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get sample queries for learning
app.get('/api/practice/sample-queries', (req, res) => {
  const sampleQueries = [
    {
      title: "Basic SELECT",
      query: "SELECT * FROM employees;",
      description: "Select all employees"
    },
    {
      title: "WHERE Clause",
      query: "SELECT name, salary FROM employees WHERE salary > 70000;",
      description: "Find employees with salary greater than 70000"
    },
    {
      title: "ORDER BY",
      query: "SELECT name, hire_date FROM employees ORDER BY hire_date DESC;",
      description: "List employees by hire date (newest first)"
    },
    {
      title: "GROUP BY with COUNT",
      query: "SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department;",
      description: "Count employees by department"
    },
    {
      title: "JOIN Tables",
      query: "SELECT o.customer_name, p.name, o.quantity FROM orders o JOIN products p ON o.product_id = p.id;",
      description: "Join orders with products"
    },
    {
      title: "Aggregate Functions",
      query: "SELECT AVG(salary) as avg_salary, MIN(salary) as min_salary, MAX(salary) as max_salary FROM employees;",
      description: "Calculate salary statistics"
    }
  ];
  
  res.status(200).json({
    success: true,
    queries: sampleQueries
  });
});

// Initialize database and start server
initPracticeDb().then(() => {
  app.listen(PORT, () => {
    console.log(`SQL Practice Server running on port ${PORT}`);
  });
});

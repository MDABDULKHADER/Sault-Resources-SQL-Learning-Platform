
-- Database Queries for SaultResources Application

-- ===========================================
-- SERVER.JS (Main Application Database)
-- Database: sault_resources
-- ===========================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  progress INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Completed Topics Table
CREATE TABLE IF NOT EXISTS completed_topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  topic_id VARCHAR(50) NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY user_topic (user_id, topic_id)
);

-- 3. Quiz Scores Table
CREATE TABLE IF NOT EXISTS quiz_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  topic_id VARCHAR(50) NOT NULL,
  score INT NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Certificates Table (NEW)
CREATE TABLE IF NOT EXISTS certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  certificate_type VARCHAR(100) DEFAULT 'SQL Completion Certificate',
  certificate_code VARCHAR(50) UNIQUE NOT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY user_certificate (user_id, certificate_type)
);

-- Sample data for testing
-- Insert sample user
INSERT INTO users (name, email, password, progress) VALUES 
('John Doe', 'john@example.com', '$2b$10$hashedpassword', 100);

-- Insert completed topics for certificate eligibility
INSERT INTO completed_topics (user_id, topic_id) VALUES 
(1, 'intro-to-sql'),
(1, 'basic-queries'),
(1, 'filtering-data'),
(1, 'joins'),
(1, 'aggregations');

-- Insert quiz scores
INSERT INTO quiz_scores (user_id, topic_id, score) VALUES 
(1, 'intro-to-sql', 95),
(1, 'basic-queries', 88),
(1, 'filtering-data', 92),
(1, 'joins', 85),
(1, 'aggregations', 90);

-- ===========================================
-- SERVER2.JS (SQL Practice Database)
-- Database: sql_practice
-- ===========================================

-- Switch to practice database
USE sql_practice;

-- 1. Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  department VARCHAR(50) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  hire_date DATE NOT NULL,
  manager_id INT,
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);

-- 2. Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  budget DECIMAL(12, 2) NOT NULL,
  location VARCHAR(100) NOT NULL
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  budget DECIMAL(10, 2) NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- 4. Employee Projects Table (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS employee_projects (
  employee_id INT,
  project_id INT,
  role VARCHAR(50) DEFAULT 'Developer',
  hours_worked DECIMAL(5, 2) DEFAULT 0,
  PRIMARY KEY (employee_id, project_id),
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Insert sample data for SQL practice

-- Insert departments
INSERT INTO departments (name, budget, location) VALUES 
('Engineering', 500000.00, 'New York'),
('Marketing', 200000.00, 'California'),
('Sales', 300000.00, 'Texas'),
('HR', 150000.00, 'New York'),
('Finance', 250000.00, 'Illinois');

-- Insert employees
INSERT INTO employees (first_name, last_name, email, department, salary, hire_date, manager_id) VALUES 
('John', 'Smith', 'john.smith@company.com', 'Engineering', 75000.00, '2020-01-15', NULL),
('Jane', 'Doe', 'jane.doe@company.com', 'Engineering', 85000.00, '2019-03-10', 1),
('Mike', 'Johnson', 'mike.johnson@company.com', 'Marketing', 60000.00, '2021-06-01', NULL),
('Sarah', 'Wilson', 'sarah.wilson@company.com', 'Sales', 65000.00, '2020-08-20', NULL),
('David', 'Brown', 'david.brown@company.com', 'Engineering', 70000.00, '2021-02-14', 1),
('Lisa', 'Davis', 'lisa.davis@company.com', 'HR', 55000.00, '2019-11-30', NULL),
('Tom', 'Miller', 'tom.miller@company.com', 'Finance', 68000.00, '2020-09-05', NULL),
('Amy', 'Taylor', 'amy.taylor@company.com', 'Marketing', 58000.00, '2021-04-12', 3),
('Chris', 'Anderson', 'chris.anderson@company.com', 'Sales', 62000.00, '2020-12-01', 4),
('Emma', 'Thomas', 'emma.thomas@company.com', 'Engineering', 80000.00, '2019-07-22', 1);

-- Insert projects
INSERT INTO projects (name, description, start_date, end_date, budget, department_id) VALUES 
('Website Redesign', 'Complete overhaul of company website', '2023-01-01', '2023-06-30', 75000.00, 1),
('Mobile App Development', 'New mobile application for customers', '2023-03-01', '2023-12-31', 120000.00, 1),
('Marketing Campaign Q2', 'Second quarter marketing initiatives', '2023-04-01', '2023-06-30', 45000.00, 2),
('Sales Training Program', 'Comprehensive sales team training', '2023-02-01', '2023-05-31', 30000.00, 3),
('HR System Upgrade', 'Modernize HR management system', '2023-01-15', '2023-08-15', 55000.00, 4);

-- Insert employee-project relationships
INSERT INTO employee_projects (employee_id, project_id, role, hours_worked) VALUES 
(1, 1, 'Project Manager', 120.5),
(2, 1, 'Senior Developer', 95.0),
(5, 1, 'Developer', 85.5),
(10, 1, 'Developer', 78.0),
(2, 2, 'Lead Developer', 140.0),
(5, 2, 'Developer', 130.0),
(10, 2, 'UI/UX Developer', 110.0),
(3, 3, 'Marketing Manager', 80.0),
(8, 3, 'Marketing Specialist', 75.0),
(4, 4, 'Sales Manager', 60.0),
(9, 4, 'Sales Trainer', 55.0),
(6, 5, 'Project Coordinator', 90.0);

-- Useful practice queries students can try:

-- Basic SELECT queries
-- SELECT * FROM employees;
-- SELECT first_name, last_name, salary FROM employees;
-- SELECT * FROM departments;

-- WHERE clause practice
-- SELECT * FROM employees WHERE department = 'Engineering';
-- SELECT * FROM employees WHERE salary > 70000;
-- SELECT * FROM employees WHERE hire_date > '2020-01-01';

-- JOIN practice
-- SELECT e.first_name, e.last_name, d.name as department_name 
-- FROM employees e JOIN departments d ON e.department = d.name;

-- Aggregate functions
-- SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department;
-- SELECT department, AVG(salary) as avg_salary FROM employees GROUP BY department;
-- SELECT MAX(salary), MIN(salary) FROM employees;

-- Complex queries
-- SELECT p.name, COUNT(ep.employee_id) as team_size 
-- FROM projects p LEFT JOIN employee_projects ep ON p.id = ep.project_id 
-- GROUP BY p.id, p.name;

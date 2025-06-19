
export const topicData = {
  'intro-to-sql': {
    id: 'intro-to-sql',
    title: 'Introduction to SQL',
    content: `
## What is SQL?

SQL (Structured Query Language) is a standard language used to communicate with relational database management systems. It allows you to store, retrieve, manipulate, and delete data from databases.

## Why Learn SQL?

- **Data is everywhere**: Most businesses and organizations store data in databases
- **Career opportunities**: SQL skills are in high demand
- **Data analysis**: SQL lets you extract insights from large datasets
- **Database management**: Create, modify, and optimize databases
- **Integration**: SQL interfaces with many programming languages

## Core Components of a Database

1. **Tables**: Collections of related data organized in rows and columns
2. **Columns**: Vertical categories of data (also called fields)
3. **Rows**: Individual records in a table
4. **Primary Keys**: Unique identifiers for each record
5. **Foreign Keys**: References to primary keys in other tables

## Basic Database Operations (CRUD)

- **C**reate: Add new data
- **R**ead: Retrieve existing data
- **U**pdate: Modify existing data
- **D**elete: Remove data

In the next lessons, we'll explore how to write SQL queries to perform these operations.
    `,
    quiz: [
      {
        id: 1,
        question: "What does SQL stand for?",
        options: [
          "Structured Query Language",
          "Simple Question Language", 
          "System Query Logic",
          "Sequential Query Language"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Which of the following is NOT a core component of a database?",
        options: [
          "Tables", 
          "Forms", 
          "Columns", 
          "Rows"
        ],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "What does the 'R' in CRUD stand for?",
        options: [
          "Relate", 
          "Record", 
          "Read", 
          "Resolve"
        ],
        correctAnswer: 2
      }
    ]
  },
  'basic-queries': {
    id: 'basic-queries',
    title: 'Basic SQL Queries',
    content: `
## SELECT Statement

The \`SELECT\` statement is used to retrieve data from one or more tables:

\`\`\`sql
SELECT column1, column2, ...
FROM table_name;
\`\`\`

To select all columns, use the asterisk:

\`\`\`sql
SELECT * FROM table_name;
\`\`\`

## Filtering with WHERE

The \`WHERE\` clause filters records based on a specified condition:

\`\`\`sql
SELECT column1, column2, ...
FROM table_name
WHERE condition;
\`\`\`

Example:

\`\`\`sql
SELECT first_name, last_name, email
FROM customers
WHERE country = 'USA';
\`\`\`

## Ordering Results

The \`ORDER BY\` clause sorts the result set:

\`\`\`sql
SELECT column1, column2, ...
FROM table_name
ORDER BY column1 [ASC|DESC];
\`\`\`

Example:

\`\`\`sql
SELECT product_name, price
FROM products
ORDER BY price DESC;
\`\`\`

## Limiting Results

To limit the number of rows returned:

\`\`\`sql
SELECT column1, column2, ...
FROM table_name
LIMIT number;
\`\`\`

Example:

\`\`\`sql
SELECT product_name, price
FROM products
ORDER BY price DESC
LIMIT 10;
\`\`\`

This would return the 10 most expensive products.
    `,
    quiz: [
      {
        id: 1,
        question: "Which SQL statement is used to retrieve data from a database?",
        options: [
          "GET", 
          "SELECT", 
          "FETCH", 
          "RETRIEVE"
        ],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "What does the asterisk (*) mean in a SELECT statement?",
        options: [
          "Multiply all values", 
          "Select only numeric columns", 
          "Select all columns", 
          "Execute the query faster"
        ],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "Which clause is used to filter records in SQL?",
        options: [
          "WHERE", 
          "FILTER", 
          "HAVING", 
          "CONDITION"
        ],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "How would you sort results in descending order?",
        options: [
          "SORT BY column DESC", 
          "ORDER column DESC", 
          "ORDER BY column DESC", 
          "GROUP BY column DESC"
        ],
        correctAnswer: 2
      }
    ]
  },
  'filtering-data': {
    id: 'filtering-data',
    title: 'Filtering Data with WHERE',
    content: `
## Advanced WHERE Conditions

The \`WHERE\` clause can use different operators:

- Equal: \`=\`
- Not Equal: \`<>\` or \`!=\`
- Greater Than: \`>\`
- Less Than: \`<\`
- Greater Than or Equal: \`>=\`
- Less Than or Equal: \`<=\`

## Combining Conditions

You can combine multiple conditions using logical operators:

- AND: Both conditions must be true
- OR: At least one condition must be true
- NOT: Negates a condition

Example:

\`\`\`sql
SELECT product_name, price, category
FROM products
WHERE (price > 100 AND category = 'Electronics') 
   OR (price > 200 AND category = 'Furniture');
\`\`\`

## Working with NULL Values

To check for NULL values, use \`IS NULL\` or \`IS NOT NULL\`:

\`\`\`sql
SELECT customer_id, name, phone
FROM customers
WHERE phone IS NULL;
\`\`\`

## Pattern Matching with LIKE

The \`LIKE\` operator performs pattern matching:

- \`%\` represents zero, one, or multiple characters
- \`_\` represents a single character

\`\`\`sql
SELECT first_name, last_name, email
FROM customers
WHERE email LIKE '%.com';
\`\`\`

This finds customers with email addresses ending in ".com".

\`\`\`sql
SELECT product_name
FROM products
WHERE product_name LIKE 'Apple%';
\`\`\`

This finds products with names starting with "Apple".
    `,
    quiz: [
      {
        id: 1,
        question: "Which operator checks for inequality in SQL?",
        options: [
          "!=", 
          "<>", 
          "Both A and B", 
          "NOT EQUALS"
        ],
        correctAnswer: 2
      },
      {
        id: 2,
        question: "How do you find records where a column contains NULL values?",
        options: [
          "WHERE column = NULL", 
          "WHERE column IS EMPTY", 
          "WHERE column IS NULL", 
          "WHERE NULL IN column"
        ],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "Which wildcard symbol in a LIKE pattern matches multiple characters?",
        options: [
          "*", 
          "%", 
          "_", 
          "?"
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "What would the pattern 'te_t' match?",
        options: [
          "test", 
          "text", 
          "Both A and B", 
          "Neither A nor B"
        ],
        correctAnswer: 2
      }
    ]
  },
  'joins': {
    id: 'joins',
    title: 'Joining Tables',
    content: `
## What are Joins?

Joins allow you to combine rows from two or more tables based on a related column. This is fundamental to the relational database model.

## Types of Joins

### INNER JOIN

Returns records that have matching values in both tables:

\`\`\`sql
SELECT orders.order_id, customers.customer_name
FROM orders
INNER JOIN customers ON orders.customer_id = customers.customer_id;
\`\`\`

### LEFT JOIN

Returns all records from the left table and matching records from the right table:

\`\`\`sql
SELECT customers.customer_name, orders.order_id
FROM customers
LEFT JOIN orders ON customers.customer_id = orders.customer_id;
\`\`\`

This returns all customers, even those without orders.

### RIGHT JOIN

Returns all records from the right table and matching records from the left table:

\`\`\`sql
SELECT orders.order_id, employees.employee_name
FROM orders
RIGHT JOIN employees ON orders.employee_id = employees.employee_id;
\`\`\`

### FULL JOIN

Returns all records when there's a match in either the left or right table:

\`\`\`sql
SELECT customers.customer_name, orders.order_id
FROM customers
FULL JOIN orders ON customers.customer_id = orders.customer_id;
\`\`\`

## Self Join

A self join is joining a table to itself:

\`\`\`sql
SELECT e1.employee_name AS employee, e2.employee_name AS manager
FROM employees e1
JOIN employees e2 ON e1.manager_id = e2.employee_id;
\`\`\`

This example shows each employee with their manager.
    `,
    quiz: [
      {
        id: 1,
        question: "Which join type returns only the records that have matching values in both tables?",
        options: [
          "OUTER JOIN", 
          "INNER JOIN", 
          "LEFT JOIN", 
          "RIGHT JOIN"
        ],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "If you want to return all customers whether they have placed orders or not, which join type should you use?",
        options: [
          "INNER JOIN", 
          "LEFT JOIN (with customers as the left table)", 
          "RIGHT JOIN (with orders as the left table)", 
          "FULL JOIN"
        ],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "What is a self join used for?",
        options: [
          "Joining a table to itself", 
          "Joining two identical tables", 
          "Joining tables with the same columns", 
          "Making a copy of a join"
        ],
        correctAnswer: 0
      }
    ]
  },
  'aggregations': {
    id: 'aggregations',
    title: 'Aggregation Functions',
    content: `
## Aggregation Functions

SQL provides several functions to perform calculations on data:

- \`COUNT()\`: Counts rows
- \`SUM()\`: Calculates the sum
- \`AVG()\`: Calculates the average
- \`MIN()\`: Finds the minimum value
- \`MAX()\`: Finds the maximum value

## Basic Aggregation

\`\`\`sql
SELECT COUNT(*) AS total_customers FROM customers;
SELECT SUM(amount) AS total_sales FROM orders;
SELECT AVG(price) AS average_price FROM products;
SELECT MIN(price) AS lowest_price FROM products;
SELECT MAX(price) AS highest_price FROM products;
\`\`\`

## GROUP BY

The \`GROUP BY\` clause groups rows with the same values:

\`\`\`sql
SELECT category, COUNT(*) AS product_count
FROM products
GROUP BY category;
\`\`\`

This returns the number of products in each category.

## HAVING

The \`HAVING\` clause filters groups based on a specified condition:

\`\`\`sql
SELECT category, AVG(price) AS avg_price
FROM products
GROUP BY category
HAVING AVG(price) > 100;
\`\`\`

This returns categories where the average product price is over 100.

## Combining Aggregations with Joins

\`\`\`sql
SELECT customers.customer_name, 
       COUNT(orders.order_id) AS order_count,
       SUM(orders.amount) AS total_spent
FROM customers
LEFT JOIN orders ON customers.customer_id = orders.customer_id
GROUP BY customers.customer_id, customers.customer_name;
\`\`\`

This shows each customer with their number of orders and total spending.
    `,
    quiz: [
      {
        id: 1,
        question: "Which function would you use to find the total number of orders?",
        options: [
          "SUM(orders)", 
          "COUNT(orders)", 
          "TOTAL(orders)", 
          "AGGREGATE(orders)"
        ],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "What does the AVG() function do?",
        options: [
          "Returns the most common value", 
          "Returns the middle value", 
          "Calculates the average value", 
          "Returns the total divided by the count"
        ],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "Which clause is used to filter groups in SQL?",
        options: [
          "WHERE", 
          "HAVING", 
          "GROUP FILTER", 
          "FILTER BY"
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "What is the difference between WHERE and HAVING?",
        options: [
          "WHERE filters rows before grouping, HAVING filters groups after grouping", 
          "WHERE is used with JOIN, HAVING is used with GROUP BY", 
          "WHERE is for numeric conditions, HAVING is for text conditions", 
          "They are interchangeable"
        ],
        correctAnswer: 0
      }
    ]
  }
};

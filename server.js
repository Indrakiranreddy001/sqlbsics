// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Configure CORS
app.use(cors());
app.use(bodyParser.json());

// MySQL database configuration
const dbConfig = {
    host: '127.0.0.1:3306',
    user: 'root',
    password: 'Root@1234',
    database: 'sample',
    connectionLimit: 10,
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

app.post('/execute', (req, res) => {
    const query = req.body.query;

    // Acquire a connection from the pool
    pool.getConnection((error, connection) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Error acquiring a database connection' });
            return;
        }

        // Execute the SQL query
        connection.query(query, (queryError, results) => {
            // Release the connection back to the pool
            connection.release();

            if (queryError) {
                console.error(queryError);
                res.status(500).json({ message: 'Error executing the query' });
            } else {
                // Send the query result back to the client
                res.json(results);
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

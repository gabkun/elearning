const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');


const router = express.Router();

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL user
  password: '', // Replace with your MySQL password
  database: 'fullstackdb',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});

router.use(bodyParser.json());
router.use(cors());

// CREATE ADMIN
router.post('/add', async (req, res) => {
    const {
      username,
      password,

    } = req.body;
  
  
  
    const sql =
      'INSERT INTO admin (username, password) VALUES (?, ?)';
  
    db.query(
      sql,
      [
        username,
        password, 
      ],
      (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          res
            .status(500)
            .json({ error: 'Internal Server Error - Failed to insert user' });
          return;
        }
        console.log('Admin user created successfully!');
    res.status(200).json({ message: 'Admin user created successfully!' });
  });
});
// LOGIN
router.post('/login', async (req, res) => {
    const sql =
      'SELECT * FROM admin WHERE `username` = ? AND `password` = ?';
  
    db.query(sql, [req.body.username, req.body.password], async (err, data) => {
      if (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (data.length > 0) {
          return res.json("Success");}
      else{
        return res.json("Failed");
      } 
    });
  });

module.exports = router;
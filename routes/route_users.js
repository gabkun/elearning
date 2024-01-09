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

// CREATE USERS
router.post('/add', async (req, res) => {
  const {
    username,
    password,
    firstname,
    lastname,
    middlename,
    email,
    yearLevel,
    idNumber,
    age,
  } = req.body;



  const sql =
    'INSERT INTO tbl (username, password, firstname, lastname, middlename, email, yearLevel, idNumber, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(
    sql,
    [
      username,
      password, // Use hashed password
      firstname,
      lastname,
      middlename,
      email,
      yearLevel,
      idNumber,
      age,
    ],
    (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        res
          .status(500)
          .json({ error: 'Internal Server Error - Failed to insert user' });
        return;
      }
      const userID = result.insertId;

      let sampleDashboardData;

      // Conditionally set dashboard data based on yearLevel
      switch (yearLevel.toLowerCase()) {
        case 'nursery':
          sampleDashboardData = {
            nurseryWidget1: 'Nursery specific data',
            nurseryWidget2: 20,
            nurseryWidget3: false,
          };
          break;

        case 'kindergarten':
          sampleDashboardData = {
            kinderWidget1: 'Kinder specific data',
            kinderWidget2: 30,
            kinderWidget3: true,
          };
          break;

        case 'preschool':
          sampleDashboardData = {
            preschoolWidget1: 'Preschool specific data',
            preschoolWidget2: 40,
            preschoolWidget3: true,
          };
          break;

        default:
          sampleDashboardData = {
            defaultWidget1: 'Default data',
            defaultWidget2: 10,
            defaultWidget3: false,
          };
      }

      const dashboardInsertSql =
        'INSERT INTO dashboards (userID, data) VALUES (?, ?)';

      db.query(
        dashboardInsertSql,
        [userID, JSON.stringify(sampleDashboardData)],
        (dashboardInsertErr, dashboardInsertResult) => {
          if (dashboardInsertErr) {
            console.error('Error inserting dashboard data:', dashboardInsertErr);
            res.status(500).json({ error: 'Internal Server Error - Failed to insert dashboard data' });
            return;
          }
          console.log('User and dashboard data inserted successfully!');
          res.json({ message: 'User and dashboard data inserted successfully!' });
        });
    }
  );
});

// LOGIN
router.post('/login', async (req, res) => {
  const sql =
    'SELECT * FROM tbl WHERE `username` = ? AND `password` = ?';

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

// RETRIEVE ALL USERS
router.get('/showusers', (req, res) => {
  const sql = 'SELECT id, username FROM tbl';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving users:', err);
      res
        .status(500)
        .json({ error: 'Internal Server Error - Failed to retrieve users' });
      return;
    }
    res.json(results);
  });
});

// UPDATE USER
router.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const email = req.body;

  const sql = 'UPDATE tbl SET email=? WHERE id=?';
  const values = [
    req.body.email
  ]

  db.query(sql, [...values, id], (err, result) => {
    if (err) {
      console.error('Error updating email:', err);
      return res.status(500).json({ error: 'Internal Server Error - Failed to update email' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ message: 'Email updated successfully!' });
  });
});

// DELETE USER
router.delete('/delete/:id', (req, res) => {
  const userId = req.params.id;

  const deleteUserSql = 'DELETE FROM tbl WHERE id=?';

  db.query(deleteUserSql, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: 'Internal Server Error - Failed to delete user' });
      return;
    }

    // Optionally, you may also want to delete associated dashboard data
    const deleteDashboardSql = 'DELETE FROM dashboards WHERE userID=?';

    db.query(deleteDashboardSql, [userId], (dashboardDeleteErr, dashboardDeleteResult) => {
      if (dashboardDeleteErr) {
        console.error('Error deleting dashboard data:', dashboardDeleteErr);
        res.status(500).json({ error: 'Internal Server Error - Failed to delete dashboard data' });
        return;
      }

      res.json({ message: 'User and associated dashboard data deleted successfully!' });
    });
  });
});

// RETRIEVE USER DETAILS
router.get('/userDetails', (req, res) => {
  // Fetch user details based on your implementation
  // Replace this with your actual query
  const userId = req.userId; // Assuming you have userId available in the request

  const sql = 'SELECT * FROM tbl WHERE id = ?';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error retrieving user details:', err);
      res.status(500).json({ error: 'Internal Server Error - Failed to retrieve user details' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const userDetails = results[0]; // Assuming you want to return details of the first user found
    res.json(userDetails);
  });
});
module.exports = router;
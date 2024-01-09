const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');



const router = express.Router();

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fullstackdb',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});


router.use(bodyParser.json());
router.use(cors());
// Express endpoint to get user-specific dashboard data
router.get('/:userID', (req, res) => {
  const userID = req.params.userID;
    const data = req.params.data;

  // Retrieve user's dashboard data from the database
  const sql = 'SELECT userID, data FROM dashboards';
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




module.exports = router;
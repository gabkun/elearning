const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const router = express.Router();

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fullstackdb',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('Connected to MySQL database');
});

const storage = multer.memoryStorage(); // Store the file in memory as a Buffer
const upload = multer({ storage });

router.use(bodyParser.json());
router.use(cors());

router.post('/addSubject', upload.single('assignments'), async (req, res) => {
    const { subjectID, title, description } = req.body;
    const assignments = req.file ? req.file.buffer : null;
  
    // Check if the 'assignments' column is nullable
    const sql = assignments
      ? 'INSERT INTO subjs (subjectID, title, description, assignments) VALUES (?, ?, ?, ?)'
      : 'INSERT INTO subjs (subjectID, title, description) VALUES (?, ?, ?)';
  
    const values = assignments
      ? [subjectID, title, description, assignments]
      : [subjectID, title, description];
  
    db.query(
      sql,
      values,
      (err, result) => {
        if (err) {
          console.error('Error inserting subject:', err);
          res.status(500).json({ error: 'Internal Server Error - Failed to insert subject' });
          return;
        }
        console.log('Subject inserted successfully!');
        res.json({ message: 'Subject inserted successfully!' });
      }
    );
  });
  router.get('/viewSubjects', async (req, res) => {
    const sql = 'SELECT * FROM subjs';
  
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching subjects:', err);
        res.status(500).json({ error: 'Internal Server Error - Failed to fetch subjects' });
        return;
      }
  
      const subjects = result.map((row) => ({
        subjectID: row.subjectID,
        title: row.title,
        description: row.description,
        // Add other fields as needed
      }));
  
      res.json({ subjects });
    });
  });
  router.delete('/removeSubject/:subjectID', async (req, res) => {
    const { subjectID } = req.params;
  
    const sql = 'DELETE FROM subjs WHERE subjectID = ?';
  
    db.query(sql, [subjectID], (err, result) => {
      if (err) {
        console.error('Error deleting subject:', err);
        res.status(500).json({ error: 'Internal Server Error - Failed to delete subject' });
        return;
      }
  
      if (result.affectedRows > 0) {
        res.json({ message: 'Subject deleted successfully!' });
      } else {
        res.status(404).json({ error: 'Subject not found' });
      }
    });
  });
module.exports = router;
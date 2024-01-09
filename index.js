const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Middleware setup
app.use(express.json()); // Parses incoming JSON requests
app.use(cors()); // Enables CORS for all routes
app.use(bodyParser.json()); // Parses incoming JSON requests

// Import and use the user router
const userRouter = require('./routes/route_users');
app.use('/users', userRouter);

const adminRouter = require('./routes/route_subject');
app.use('/admin', adminRouter);

const dashboardRouter = require('./routes/dashboard_api');
app.use('/dashboard', dashboardRouter);

const adRouter = require('./routes/route_admin');
app.use('/ad', adRouter);

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
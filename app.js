let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
require('dotenv').config();
const path = require('node:path');

const { ERROR } = require('./utils/httpStatusText');
let coursesRouter = require('./routes/courses.route');
let usersRouter = require('./routes/users.route');

const app = express();
const port = process.env.PORT || 3000;

const uri = process.env.MONGODB_URI;

mongoose.connect(uri).then(() => {
  console.log('mongodb server connected');
}).catch(err => {
  console.log('Error connecting to MongoDB', err);
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);

// Global middleware for handling invalid routes, i.e., routes that are not defined
app.all('*', (req, res) => {
  res.status(404).json({ status: ERROR, message: 'Resource not found ==> invalid route' });
});
// Global error handler middleware
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({ status: error.statusText || ERROR, message: error.message, code: error.statusCode });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/adminRoutes');
const registerRoutes = require('./routes/registerRoutes');
const loginRoutes = require('./routes/loginRoutes');
const userRoutes = require('./routes/userRoutes');
const commonRoutes = require('./routes/commonRoutes');
const physicianRoutes = require('./routes/physicianRoutes');
const staffRoutes = require('./routes/staffRoutes');

mongoose
  .connect(
    'mongodb+srv://maitexaSS:EPZh8v1m2U0thLE2@vproject.p2z0nmk.mongodb.net/Medicine_Management_System'
  )
  .then(() => {
    console.log('Database Connected');
  })
  .catch((error) => {
    console.log('Error:', error);
  });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', commonRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/physician', physicianRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/login', loginRoutes);

app.get('/', (req, res) => {
  res.send('hello world');
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log('Server started on', PORT);
});

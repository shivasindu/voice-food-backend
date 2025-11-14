require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const donationsRoute = require('./routes/donations');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Mongo connected'))
  .catch(err => console.error(err));

app.use('/api/donations', donationsRoute);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

const mongoose = require('mongoose');

require('dotenv').config();

// const MONGO_URL = 'mongodb://localhost:27017/nasa';
const MONGO_URL = process.env.DB_CONNECTION_STRING;

mongoose.connection
  .once('open', () => {
    console.log('MongoDB is Connected!');
  })
  .on('error', (err) => {
    console.error('MongoDB Connection Error', err);
  });

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.connection.close();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};

const mongoose = require('mongoose');

const MONGO_URL =
  'mongodb+srv://nasa-api:EGmDLsqsWV2Gim4A@nasa-cluster.oafsp.mongodb.net/nasa?retryWrites=true&w=majority';

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

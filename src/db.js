import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/Wetube_practice');

const db = mongoose.connection;

db.on('error', (error) => {
  console.log(`An error occurred in the DB ❌\n${error}`);
});
db.once('open', () => {
  console.log('DB connection success ✅');
});

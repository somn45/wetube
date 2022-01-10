import mongoose from 'mongoose';

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

db.on('error', (error) => {
  console.log(`An error occurred in the DB ❌\n${error}`);
});
db.once('open', () => {
  console.log('DB connection success ✅');
});

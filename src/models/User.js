import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String },
  isSocial: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  location: { type: String },
});

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model('users', userSchema);

export default User;

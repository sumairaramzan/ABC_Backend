const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // 👈 Add this line
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: String,
    resetTokenExpiry: Date,
  });
  

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);

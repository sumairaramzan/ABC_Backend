const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT
const generateToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// Signup
exports.signup = async (req, res) => {
  try {
    const { email, password,name } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "All fields required" });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    const user = await User.create({name, email, password });
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id,  name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ msg: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const resetToken = user.getResetToken();
    await user.save();

    // Normally send email with this link
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    res.json({ msg: "Reset link generated", resetUrl });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    user.password = req.body.password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

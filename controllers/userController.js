const User = require('../models/User'); // adjust path if needed

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndDelete(userId);
    res.json({ success: true, msg: "Account deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error." });
  }
};

module.exports = { deleteAccount };

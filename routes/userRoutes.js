const express = require('express');
const router = express.Router();
const { deleteAccount } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.delete('/delete', authMiddleware, deleteAccount);

module.exports = router;

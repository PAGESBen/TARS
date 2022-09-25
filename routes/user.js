const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.userSignup /*fonction signup*/);
router.post('/login', userCtrl.userLogin /*fonction login*/);

module.exports = router;
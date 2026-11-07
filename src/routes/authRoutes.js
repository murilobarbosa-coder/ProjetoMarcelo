const { Router } = require('express');
const AuthController = require('../controllers/AuthController');

const router = Router();

// POST /api/auth/register
router.post('/register', AuthController.register);

// POST /api/auth/login
router.post('/login', AuthController.login);

module.exports = router;
const express = require("express");
const router = express.Router();

router.get('/')

router.post('/login', login)
router.post('/register', register)
router.post('/verify-2fa', verify2FA)

module.exports = router;
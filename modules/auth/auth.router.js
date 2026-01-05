const express = require("express");
const { login, register, verify2FA } = require("./auth.controller");
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello World!");
})

router.post('/login', login)
router.post('/register', register)
router.post('/verify-2fa', verify2FA)

module.exports = router;
var router = require('express').Router();
router.use('/api', require('./api/UserController'));
module.exports = router;
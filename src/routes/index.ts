var router = require('express').Router();
router.use('/api', require('./api/UserController.ts'));
module.exports = router;
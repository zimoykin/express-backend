var router = require('express').Router();
router.use('/api/users', require('./api/UserController'));
router.use('/api/todos', require('./api/TodosController'));
module.exports = router;
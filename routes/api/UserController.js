const { v4: uuidv4 } = require('uuid');
var router = require('express').Router();

let users = {
    1: {
      id: uuidv4(),
      username: 'Dmitry Zimoykin',
    },
    2: {
      id: uuidv4(),
      username: 'Harley Davidson',
    },
  };

  router.get('/', (req, res, next) => {
    return res.json({users: users});
  })


  module.exports = router;